const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conexao = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend do Agenda Pet funcionando!"
    });
});

function limparCPF(valor) {
    return String(valor || "").replace(/\D/g, "");
}

function validarCPF(valor) {
    const cpf = limparCPF(valor);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    return resto === Number(cpf[10]);
}

function formatarCPF(valor) {
    const cpf = limparCPF(valor);

    if (cpf.length !== 11) {
        return cpf;
    }

    return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
}

function validarEmail(valor) {
    const email = String(valor || "").trim();

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(valor) {
    const telefone = String(valor || "").replace(/\D/g, "");

    return telefone.length === 10 || telefone.length === 11;
}

function formatarTelefone(valor) {
    const telefone = String(valor || "").replace(/\D/g, "");

    if (telefone.length === 11) {
        return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
    }

    if (telefone.length === 10) {
        return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 6)}-${telefone.slice(6)}`;
    }

    return telefone;
}

function validarNome(valor) {
    const nome = String(valor || "").trim();

    if (nome.length < 3 || nome.length > 100) {
        return false;
    }

    return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]*$/.test(nome);
}

function validarEndereco(valor) {
    const endereco = String(valor || "").trim();

    return endereco.length >= 3 && endereco.length <= 255;
}

function formatarCEP(valor) {
    const cep = String(valor || "").replace(/\D/g, "");

    if (cep.length !== 8) {
        return cep;
    }

    return `${cep.slice(0, 5)}-${cep.slice(5)}`;
}

async function validarCEP(valor) {
    const cep = String(valor || "").replace(/\D/g, "");

    if (!cep) {
        return {
            valido: true,
            cep: null
        };
    }

    if (cep.length !== 8) {
        return {
            valido: false,
            mensagem: "O CEP deve possuir 8 números."
        };
    }

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            return {
                valido: false,
                indisponivel: true,
                mensagem: "Não foi possível consultar o CEP."
            };
        }

        const dados = await resposta.json();

        if (dados.erro) {
            return {
                valido: false,
                mensagem: "O CEP informado não existe."
            };
        }

        return {
            valido: true,
            cep: formatarCEP(cep),
            dados
        };
    } catch (erro) {
        console.error("Erro ao consultar ViaCEP:", erro);

        return {
            valido: false,
            indisponivel: true,
            mensagem: "Não foi possível verificar o CEP."
        };
    }
}

function validarDadosTutor({
    nome,
    cpf,
    telefone,
    email,
    endereco
}) {
    if (!nome || !validarNome(nome)) {
        return "Digite um nome válido.";
    }

    if (!cpf || !validarCPF(cpf)) {
        return "Digite um CPF válido.";
    }

    if (!telefone || !validarTelefone(telefone)) {
        return "Digite um telefone válido.";
    }

    if (!email || !validarEmail(email)) {
        return "Digite um e-mail válido.";
    }

    if (String(email).trim().length > 100) {
        return "O e-mail deve possuir no máximo 100 caracteres.";
    }

    if (!endereco || !validarEndereco(endereco)) {
        return "Digite um endereço válido.";
    }

    return null;
}


/* =========================================================
   TUTORES
========================================================= */

app.get("/api/tutores", async (req, res) => {
    try {
        const [tutores] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                created_at
            FROM tutores
            ORDER BY id DESC
        `);

        res.json(tutores);
    } catch (erro) {
        console.error("Erro ao buscar tutores:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar tutores."
        });
    }
});


app.get("/api/tutores/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "ID do tutor inválido."
        });
    }

    try {
        const [tutores] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                created_at
            FROM tutores
            WHERE id = ?
        `, [id]);

        if (tutores.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        res.json(tutores[0]);
    } catch (erro) {
        console.error("Erro ao buscar tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar tutor."
        });
    }
});


app.post("/api/tutores", async (req, res) => {
    try {
        const {
            nome,
            cpf,
            telefone,
            email,
            endereco,
            cep
        } = req.body;

        const erroValidacao = validarDadosTutor({
            nome,
            cpf,
            telefone,
            email,
            endereco
        });

        if (erroValidacao) {
            return res.status(400).json({
                mensagem: erroValidacao
            });
        }

        const resultadoCEP = await validarCEP(cep);

        if (!resultadoCEP.valido) {
            return res.status(
                resultadoCEP.indisponivel ? 503 : 400
            ).json({
                mensagem: resultadoCEP.mensagem
            });
        }

        const cpfLimpo = limparCPF(cpf);
        const cpfFormatado = formatarCPF(cpf);
        const telefoneFormatado = formatarTelefone(telefone);
        const emailNormalizado = String(email).trim().toLowerCase();
        const nomeNormalizado = String(nome).trim();
        const enderecoNormalizado = String(endereco).trim();
        const cepFinal = resultadoCEP.cep;

        const [cpfExistente] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?
        `, [cpfLimpo]);

        if (cpfExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este CPF já está cadastrado."
            });
        }

        const [emailExistente] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE LOWER(email) = ?
        `, [emailNormalizado]);

        if (emailExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const [resultado] = await conexao.execute(`
            INSERT INTO tutores
            (
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            nomeNormalizado,
            cpfFormatado,
            telefoneFormatado,
            emailNormalizado,
            enderecoNormalizado,
            cepFinal
        ]);

        res.status(201).json({
            mensagem: "Tutor cadastrado com sucesso.",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao cadastrar tutor:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "CPF ou e-mail já cadastrado."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar tutor.",
            erro: erro.message
        });
    }
});


app.put("/api/tutores/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: "ID do tutor inválido."
        });
    }

    try {
        const {
            nome,
            cpf,
            telefone,
            email,
            endereco,
            cep,
            senha
        } = req.body;

        const erroValidacao = validarDadosTutor({
            nome,
            cpf,
            telefone,
            email,
            endereco
        });

        if (erroValidacao) {
            return res.status(400).json({
                mensagem: erroValidacao
            });
        }

        const resultadoCEP = await validarCEP(cep);

        if (!resultadoCEP.valido) {
            return res.status(
                resultadoCEP.indisponivel ? 503 : 400
            ).json({
                mensagem: resultadoCEP.mensagem
            });
        }

        const cpfFormatado = formatarCPF(cpf);
        const telefoneFormatado = formatarTelefone(telefone);
        const emailNormalizado = String(email).trim().toLowerCase();
        const nomeNormalizado = String(nome).trim();
        const enderecoNormalizado = String(endereco).trim();
        const cepFinal = resultadoCEP.cep;

        const [cpfExistente] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?
            AND id <> ?
        `, [
            limparCPF(cpf),
            id
        ]);

        if (cpfExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este CPF já está cadastrado."
            });
        }

        const [emailExistente] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE LOWER(email) = ?
            AND id <> ?
        `, [
            emailNormalizado,
            id
        ]);

        if (emailExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const [resultado] = await conexao.execute(`
            UPDATE tutores
            SET
                nome = ?,
                cpf = ?,
                telefone = ?,
                email = ?,
                endereco = ?,
                cep = ?,
                senha = ?
            WHERE id = ?
        `, [
            nomeNormalizado,
            cpfFormatado,
            telefoneFormatado,
            emailNormalizado,
            enderecoNormalizado,
            cepFinal,
            senha || null,
            id
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [tutores] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                created_at
            FROM tutores
            WHERE id = ?
        `, [id]);

        res.json(tutores[0]);
    } catch (erro) {
        console.error("Erro ao atualizar tutor:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "CPF ou e-mail já cadastrado."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar tutor.",
            erro: erro.message
        });
    }
});


/* =========================================================
   PETS
========================================================= */

app.get("/api/tutores/:id/pets", async (req, res) => {
    const tutorId = Number(req.params.id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem: "ID do tutor inválido."
        });
    }

    try {
        const [pets] = await conexao.execute(`
            SELECT
                id,
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                sexo,
                peso,
                data_nascimento,
                observacoes,
                created_at,
                updated_at
            FROM pets
            WHERE tutor_id = ?
            ORDER BY id DESC
        `, [tutorId]);

        res.json(pets);
    } catch (erro) {
        console.error("Erro ao buscar pets:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pets."
        });
    }
});


app.get("/api/pets/:id", async (req, res) => {
    const petId = Number(req.params.id);

    if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({
            mensagem: "ID do pet inválido."
        });
    }

    try {
        const [pets] = await conexao.execute(`
            SELECT *
            FROM pets
            WHERE id = ?
        `, [petId]);

        if (pets.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado."
            });
        }

        res.json(pets[0]);
    } catch (erro) {
        console.error("Erro ao buscar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pet."
        });
    }
});


app.post("/api/pets", async (req, res) => {
    const {
        tutor_id,
        nome,
        especie,
        raca,
        idade,
        sexo,
        peso,
        data_nascimento,
        observacoes
    } = req.body;

    const tutorId = Number(tutor_id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem: "Tutor inválido."
        });
    }

    if (!nome || !especie) {
        return res.status(400).json({
            mensagem: "Nome e espécie do pet são obrigatórios."
        });
    }

    try {
        const [tutor] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE id = ?
        `, [tutorId]);

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [resultado] = await conexao.execute(`
            INSERT INTO pets
            (
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                sexo,
                peso,
                data_nascimento,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            tutorId,
            String(nome).trim(),
            especie,
            raca || null,
            idade || null,
            sexo || null,
            peso || null,
            data_nascimento || null,
            observacoes || null
        ]);

        const [pets] = await conexao.execute(`
            SELECT *
            FROM pets
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json(pets[0]);
    } catch (erro) {
        console.error("Erro ao cadastrar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar pet.",
            erro: erro.message
        });
    }
});


app.put("/api/pets/:id", async (req, res) => {
    const petId = Number(req.params.id);

    if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({
            mensagem: "ID do pet inválido."
        });
    }

    const {
        tutor_id,
        nome,
        especie,
        raca,
        idade,
        sexo,
        peso,
        data_nascimento,
        observacoes
    } = req.body;

    const tutorId = Number(tutor_id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem: "Tutor inválido."
        });
    }

    if (!nome || !especie) {
        return res.status(400).json({
            mensagem: "Nome e espécie do pet são obrigatórios."
        });
    }

    try {
        const [pet] = await conexao.execute(`
            SELECT id
            FROM pets
            WHERE id = ?
            AND tutor_id = ?
        `, [
            petId,
            tutorId
        ]);

        if (pet.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado para este tutor."
            });
        }

        await conexao.execute(`
            UPDATE pets
            SET
                nome = ?,
                especie = ?,
                raca = ?,
                idade = ?,
                sexo = ?,
                peso = ?,
                data_nascimento = ?,
                observacoes = ?
            WHERE id = ?
            AND tutor_id = ?
        `, [
            String(nome).trim(),
            especie,
            raca || null,
            idade || null,
            sexo || null,
            peso || null,
            data_nascimento || null,
            observacoes || null,
            petId,
            tutorId
        ]);

        const [pets] = await conexao.execute(`
            SELECT *
            FROM pets
            WHERE id = ?
        `, [petId]);

        res.json(pets[0]);
    } catch (erro) {
        console.error("Erro ao atualizar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar pet.",
            erro: erro.message
        });
    }
});


/* =========================================================
   CLÍNICAS
========================================================= */

app.get("/api/clinicas", async (req, res) => {
    try {
        const [clinicas] = await conexao.execute(`
            SELECT *
            FROM clinicas
            ORDER BY nome
        `);

        res.json(clinicas);
    } catch (erro) {
        console.error("Erro ao buscar clínicas:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar clínicas."
        });
    }
});


app.get("/api/clinicas/:id", async (req, res) => {
    const clinicaId = Number(req.params.id);

    if (!Number.isInteger(clinicaId) || clinicaId <= 0) {
        return res.status(400).json({
            mensagem: "ID da clínica inválido."
        });
    }

    try {
        const [clinicas] = await conexao.execute(`
            SELECT *
            FROM clinicas
            WHERE id = ?
        `, [clinicaId]);

        if (clinicas.length === 0) {
            return res.status(404).json({
                mensagem: "Clínica não encontrada."
            });
        }

        res.json(clinicas[0]);
    } catch (erro) {
        console.error("Erro ao buscar clínica:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar clínica."
        });
    }
});


/* =========================================================
   VETERINÁRIOS
========================================================= */

app.get("/api/clinicas/:id/veterinarios", async (req, res) => {
    const clinicaId = Number(req.params.id);

    if (!Number.isInteger(clinicaId) || clinicaId <= 0) {
        return res.status(400).json({
            mensagem: "ID da clínica inválido."
        });
    }

    try {
        const [veterinarios] = await conexao.execute(`
            SELECT
                id,
                clinica_id,
                nome,
                especialidade,
                telefone,
                email,
                disponivel,
                created_at,
                updated_at
            FROM veterinarios
            WHERE clinica_id = ?
            ORDER BY nome
        `, [clinicaId]);

        res.json(veterinarios);
    } catch (erro) {
        console.error("Erro ao buscar veterinários:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar veterinários."
        });
    }
});


/* =========================================================
   SERVIÇOS
========================================================= */

app.get("/api/clinicas/:id/servicos", async (req, res) => {
    const clinicaId = Number(req.params.id);

    if (!Number.isInteger(clinicaId) || clinicaId <= 0) {
        return res.status(400).json({
            mensagem: "ID da clínica inválido."
        });
    }

    try {
        const [servicos] = await conexao.execute(`
            SELECT
                s.id,
                s.clinica_id,
                s.veterinario_id,
                s.nome,
                s.tipo,
                s.descricao,
                s.preco,
                s.duracao_minutos,
                s.ativo,
                s.created_at,
                s.updated_at,
                v.nome AS veterinario_nome,
                v.especialidade AS veterinario_especialidade
            FROM servicos s
            LEFT JOIN veterinarios v
                ON s.veterinario_id = v.id
            WHERE s.clinica_id = ?
            AND s.ativo = 1
            ORDER BY s.nome
        `, [clinicaId]);

        res.json(servicos);
    } catch (erro) {
        console.error("Erro ao buscar serviços:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar serviços."
        });
    }
});


/* =========================================================
   AGENDAMENTOS
========================================================= */

app.get("/api/agendamentos", async (req, res) => {
    try {
        const [agendamentos] = await conexao.execute(`
            SELECT
                a.id,
                a.tutor_id,
                a.pet_id,
                a.clinica_id,
                a.veterinario_id,
                a.servico_id,
                a.data_agendamento,
                a.horario,
                a.status,
                a.observacoes,
                a.created_at,
                a.updated_at,

                t.nome AS tutor,
                t.telefone AS tutor_telefone,

                p.nome AS pet,

                c.nome AS clinica,

                v.nome AS veterinario,

                s.nome AS servico,
                s.tipo AS servico_tipo,
                s.preco AS servico_preco

            FROM agendamentos a

            INNER JOIN tutores t
                ON a.tutor_id = t.id

            INNER JOIN pets p
                ON a.pet_id = p.id

            INNER JOIN clinicas c
                ON a.clinica_id = c.id

            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id

            INNER JOIN servicos s
                ON a.servico_id = s.id

            ORDER BY
                a.data_agendamento DESC,
                a.horario DESC,
                a.id DESC
        `);

        res.json(agendamentos);
    } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar agendamentos."
        });
    }
});


app.get("/api/agendamentos/:id", async (req, res) => {
    const agendamentoId = Number(req.params.id);

    if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
        return res.status(400).json({
            mensagem: "ID do agendamento inválido."
        });
    }

    try {
        const [agendamentos] = await conexao.execute(`
            SELECT
                a.id,
                a.tutor_id,
                a.pet_id,
                a.clinica_id,
                a.veterinario_id,
                a.servico_id,
                a.data_agendamento,
                a.horario,
                a.status,
                a.observacoes,

                t.nome AS tutor,
                t.telefone AS tutor_telefone,

                p.nome AS pet,

                c.nome AS clinica,

                v.nome AS veterinario,

                s.nome AS servico,
                s.tipo AS servico_tipo,
                s.preco AS servico_preco

            FROM agendamentos a

            INNER JOIN tutores t
                ON a.tutor_id = t.id

            INNER JOIN pets p
                ON a.pet_id = p.id

            INNER JOIN clinicas c
                ON a.clinica_id = c.id

            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id

            INNER JOIN servicos s
                ON a.servico_id = s.id

            WHERE a.id = ?
        `, [agendamentoId]);

        if (agendamentos.length === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        const agendamento = agendamentos[0];

        const [transportes] = await conexao.execute(`
            SELECT
                id,
                agendamento_id,
                endereco_coleta,
                data_coleta,
                horario_coleta,
                observacoes,
                status
            FROM transportes
            WHERE agendamento_id = ?
            LIMIT 1
        `, [agendamentoId]);

        agendamento.transporte =
            transportes.length > 0
                ? transportes[0]
                : null;

        res.json(agendamento);
    } catch (erro) {
        console.error("Erro ao buscar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar agendamento.",
            erro: erro.message
        });
    }
});


app.post("/api/agendamentos", async (req, res) => {
    const {
        tutor_id,
        pet_id,
        clinica_id,
        veterinario_id,
        servico_id,
        data_agendamento,
        horario,
        observacoes
    } = req.body;

    const tutorId = Number(tutor_id);
    const petId = Number(pet_id);
    const clinicaId = Number(clinica_id);
    const servicoId = Number(servico_id);

    const veterinarioId =
        veterinario_id === null ||
        veterinario_id === undefined ||
        veterinario_id === ""
            ? null
            : Number(veterinario_id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem: "Tutor inválido."
        });
    }

    if (!Number.isInteger(petId) || petId <= 0) {
        return res.status(400).json({
            mensagem: "Pet inválido."
        });
    }

    if (!Number.isInteger(clinicaId) || clinicaId <= 0) {
        return res.status(400).json({
            mensagem: "Clínica inválida."
        });
    }

    if (!Number.isInteger(servicoId) || servicoId <= 0) {
        return res.status(400).json({
            mensagem: "Serviço inválido."
        });
    }

    if (
        veterinarioId !== null &&
        (!Number.isInteger(veterinarioId) || veterinarioId <= 0)
    ) {
        return res.status(400).json({
            mensagem: "Veterinário inválido."
        });
    }

    if (!data_agendamento || !horario) {
        return res.status(400).json({
            mensagem: "Data e horário são obrigatórios."
        });
    }

    try {
        const [tutor] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE id = ?
        `, [tutorId]);

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [pet] = await conexao.execute(`
            SELECT id
            FROM pets
            WHERE id = ?
            AND tutor_id = ?
        `, [
            petId,
            tutorId
        ]);

        if (pet.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado para este tutor."
            });
        }

        const [clinica] = await conexao.execute(`
            SELECT id
            FROM clinicas
            WHERE id = ?
        `, [clinicaId]);

        if (clinica.length === 0) {
            return res.status(404).json({
                mensagem: "Clínica não encontrada."
            });
        }

        const [servico] = await conexao.execute(`
            SELECT
                id,
                clinica_id,
                veterinario_id
            FROM servicos
            WHERE id = ?
            AND clinica_id = ?
            AND ativo = 1
        `, [
            servicoId,
            clinicaId
        ]);

        if (servico.length === 0) {
            return res.status(404).json({
                mensagem: "Serviço não encontrado para esta clínica."
            });
        }

        let veterinarioFinal = veterinarioId;

        if (
            veterinarioFinal !== null &&
            servico[0].veterinario_id !== null &&
            Number(servico[0].veterinario_id) !== veterinarioFinal
        ) {
            return res.status(400).json({
                mensagem: "O veterinário informado não corresponde ao serviço selecionado."
            });
        }

        if (veterinarioFinal === null) {
            veterinarioFinal = servico[0].veterinario_id || null;
        }

        if (veterinarioFinal !== null) {
            const [veterinario] = await conexao.execute(`
                SELECT id
                FROM veterinarios
                WHERE id = ?
                AND clinica_id = ?
            `, [
                veterinarioFinal,
                clinicaId
            ]);

            if (veterinario.length === 0) {
                return res.status(404).json({
                    mensagem: "Veterinário não encontrado para esta clínica."
                });
            }
        }

        const [horarioExistente] = await conexao.execute(`
            SELECT id
            FROM agendamentos
            WHERE clinica_id = ?
            AND data_agendamento = ?
            AND horario = ?
            AND status IN ('Agendado', 'Confirmado')
        `, [
            clinicaId,
            data_agendamento,
            horario
        ]);

        if (horarioExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este horário já está ocupado."
            });
        }

        const [resultado] = await conexao.execute(`
            INSERT INTO agendamentos
            (
                tutor_id,
                pet_id,
                clinica_id,
                veterinario_id,
                servico_id,
                data_agendamento,
                horario,
                status,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, 'Agendado', ?)
        `, [
            tutorId,
            petId,
            clinicaId,
            veterinarioFinal,
            servicoId,
            data_agendamento,
            horario,
            observacoes || null
        ]);

        res.status(201).json({
            mensagem: "Agendamento realizado com sucesso.",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao realizar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao realizar agendamento.",
            erro: erro.message
        });
    }
});


app.put("/api/agendamentos/:id/status", async (req, res) => {
    const agendamentoId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
        return res.status(400).json({
            mensagem: "ID do agendamento inválido."
        });
    }

    const statusPermitidos = [
        "Agendado",
        "Confirmado",
        "Cancelado",
        "Concluído"
    ];

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            mensagem: "Status de agendamento inválido."
        });
    }

    try {
        const [resultado] = await conexao.execute(`
            UPDATE agendamentos
            SET status = ?
            WHERE id = ?
        `, [
            status,
            agendamentoId
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        res.json({
            mensagem: "Status atualizado com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao atualizar status:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar status.",
            erro: erro.message
        });
    }
});


app.delete("/api/agendamentos/:id", async (req, res) => {
    const agendamentoId = Number(req.params.id);

    if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
        return res.status(400).json({
            mensagem: "ID do agendamento inválido."
        });
    }

    try {
        const [resultado] = await conexao.execute(`
            DELETE FROM agendamentos
            WHERE id = ?
        `, [agendamentoId]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        res.json({
            mensagem: "Agendamento removido com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao remover agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao remover agendamento.",
            erro: erro.message
        });
    }
});


/* =========================================================
   TRANSPORTES
========================================================= */

app.get("/api/transportes/:agendamentoId", async (req, res) => {
    const agendamentoId = Number(req.params.agendamentoId);

    if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
        return res.status(400).json({
            mensagem: "ID do agendamento inválido."
        });
    }

    try {
        const [transportes] = await conexao.execute(`
            SELECT *
            FROM transportes
            WHERE agendamento_id = ?
        `, [agendamentoId]);

        if (transportes.length === 0) {
            return res.status(404).json({
                mensagem: "Transporte não encontrado."
            });
        }

        res.json(transportes[0]);
    } catch (erro) {
        console.error("Erro ao buscar transporte:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar transporte."
        });
    }
});


app.post("/api/transportes", async (req, res) => {
    const {
        agendamento_id,
        endereco_coleta,
        data_coleta,
        horario_coleta,
        observacoes
    } = req.body;

    const agendamentoId = Number(agendamento_id);

    if (!Number.isInteger(agendamentoId) || agendamentoId <= 0) {
        return res.status(400).json({
            mensagem: "Agendamento inválido."
        });
    }

    if (
        !endereco_coleta ||
        !data_coleta ||
        !horario_coleta
    ) {
        return res.status(400).json({
            mensagem: "Endereço, data e horário da coleta são obrigatórios."
        });
    }

    try {
        const [agendamento] = await conexao.execute(`
            SELECT id
            FROM agendamentos
            WHERE id = ?
        `, [agendamentoId]);

        if (agendamento.length === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        const [existente] = await conexao.execute(`
            SELECT id
            FROM transportes
            WHERE agendamento_id = ?
        `, [agendamentoId]);

        if (existente.length > 0) {
            return res.status(409).json({
                mensagem: "Já existe um transporte para este agendamento."
            });
        }

        const [resultado] = await conexao.execute(`
            INSERT INTO transportes
            (
                agendamento_id,
                endereco_coleta,
                data_coleta,
                horario_coleta,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?)
        `, [
            agendamentoId,
            endereco_coleta,
            data_coleta,
            horario_coleta,
            observacoes || null
        ]);

        const [transportes] = await conexao.execute(`
            SELECT *
            FROM transportes
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json(transportes[0]);
    } catch (erro) {
        console.error("Erro ao cadastrar transporte:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar transporte.",
            erro: erro.message
        });
    }
});


app.put("/api/transportes/:id/status", async (req, res) => {
    const transporteId = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(transporteId) || transporteId <= 0) {
        return res.status(400).json({
            mensagem: "ID do transporte inválido."
        });
    }

    const statusPermitidos = [
        "Solicitado",
        "Confirmado",
        "Em andamento",
        "Concluído",
        "Cancelado"
    ];

    if (!statusPermitidos.includes(status)) {
        return res.status(400).json({
            mensagem: "Status de transporte inválido."
        });
    }

    try {
        const [resultado] = await conexao.execute(`
            UPDATE transportes
            SET status = ?
            WHERE id = ?
        `, [
            status,
            transporteId
        ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Transporte não encontrado."
            });
        }

        res.json({
            mensagem: "Status do transporte atualizado com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao atualizar transporte:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar transporte.",
            erro: erro.message
        });
    }
});


/* =========================================================
   ANIMAIS PERDIDOS / ENCONTRADOS
========================================================= */

app.get("/api/animais", async (req, res) => {
    try {
        const [animais] = await conexao.execute(`
            SELECT
                a.*,
                t.nome AS tutor_nome
            FROM animais_perdidos a
            LEFT JOIN tutores t
                ON a.tutor_id = t.id
            ORDER BY a.id DESC
        `);

        res.json(animais);
    } catch (erro) {
        console.error("Erro ao buscar animais perdidos:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar animais."
        });
    }
});


app.post("/api/animais", async (req, res) => {
    const {
        tutor_id,
        nome,
        especie,
        raca,
        cor,
        data,
        bairro,
        local,
        descricao,
        contato,
        foto,
        status
    } = req.body;

    const tutorId = Number(tutor_id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem:
                "Tutor inválido. Não foi possível identificar quem cadastrou o anúncio."
        });
    }

    if (
        !especie ||
        !data ||
        !bairro ||
        !local ||
        !contato ||
        !status
    ) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos obrigatórios."
        });
    }

    if (!["perdido", "encontrado"].includes(status)) {
        return res.status(400).json({
            mensagem: "Situação do animal inválida."
        });
    }

    try {
        const [tutor] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE id = ?
        `, [tutorId]);

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [resultado] = await conexao.execute(`
            INSERT INTO animais_perdidos
            (
                tutor_id,
                nome,
                especie,
                raca,
                cor,
                data_perdido,
                bairro,
                local_perdido,
                descricao,
                contato,
                foto,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            tutorId,
            nome || null,
            especie,
            raca || null,
            cor || null,
            data,
            bairro,
            local,
            descricao || null,
            contato,
            foto || null,
            status
        ]);

        const [animais] = await conexao.execute(`
            SELECT *
            FROM animais_perdidos
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json(animais[0]);
    } catch (erro) {
        console.error("Erro ao cadastrar animal perdido:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar animal.",
            erro: erro.message
        });
    }
});


app.delete("/api/animais/:id", async (req, res) => {
    const animalId = Number(req.params.id);

    if (!Number.isInteger(animalId) || animalId <= 0) {
        return res.status(400).json({
            mensagem: "ID do animal inválido."
        });
    }

    try {
        const [resultado] = await conexao.execute(`
            DELETE FROM animais_perdidos
            WHERE id = ?
        `, [animalId]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Anúncio não encontrado."
            });
        }

        res.json({
            mensagem: "Anúncio removido com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao remover animal:", erro);

        res.status(500).json({
            mensagem: "Erro ao remover anúncio."
        });
    }
});


/* =========================================================
   STATUS DA API
========================================================= */

app.get("/api/status", async (req, res) => {
    try {
        await conexao.execute("SELECT 1");

        res.json({
            servidor: "online",
            banco: "conectado",
            mensagem: "API do Agenda Pet funcionando corretamente."
        });
    } catch (erro) {
        console.error("Erro no status:", erro);

        res.status(500).json({
            servidor: "online",
            banco: "erro",
            mensagem: "Servidor funcionando, mas não foi possível conectar ao banco."
        });
    }
});


/* =========================================================
   ERROS
========================================================= */

app.use((req, res) => {
    res.status(404).json({
        mensagem: "Rota não encontrada."
    });
});


const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor Agenda Pet rodando em http://localhost:${PORTA}`);
});