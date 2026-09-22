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

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
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
        if (typeof fetch !== "function") {
            return {
                valido: false,
                indisponivel: true,
                mensagem: "Não foi possível consultar o serviço de CEP."
            };
        }

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
            mensagem: "Não foi possível verificar o CEP. Verifique a conexão com a internet."
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

app.get("/api/tutores", async (req, res) => {
    try {
        const [tutores] = await conexao.query(`
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
    try {
        const { id } = req.params;

        const [tutores] = await conexao.query(`
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
        const emailNormalizado = email.trim().toLowerCase();
        const nomeNormalizado = nome.trim();
        const enderecoNormalizado = endereco.trim();
        const cepFinal = resultadoCEP.cep;

        const [cpfExistente] = await conexao.query(`
            SELECT id
            FROM tutores
            WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?
        `, [cpfLimpo]);

        if (cpfExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este CPF já está cadastrado."
            });
        }

        const [emailExistente] = await conexao.query(`
            SELECT id
            FROM tutores
            WHERE LOWER(email) = ?
        `, [emailNormalizado]);

        if (emailExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const [resultado] = await conexao.query(`
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
        const dadosValidados = await validarDadosTutor(req.body, id);

        const {
            nome,
            cpf,
            telefone,
            email,
            endereco,
            cep,
            senha
        } = dadosValidados;

        const [resultado] = await conexao.execute(
            `UPDATE tutores
             SET nome = ?,
                 cpf = ?,
                 telefone = ?,
                 email = ?,
                 endereco = ?,
                 cep = ?,
                 senha = ?
             WHERE id = ?`,
            [
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                senha,
                id
            ]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [tutores] = await conexao.execute(
            `SELECT id, nome, cpf, telefone, email, endereco, cep, created_at
             FROM tutores
             WHERE id = ?`,
            [id]
        );

        res.json(tutores[0]);

    } catch (erro) {
        console.error("Erro ao atualizar tutor:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "CPF ou e-mail já cadastrado."
            });
        }

        res.status(500).json({
            mensagem: erro.message || "Erro ao atualizar tutor."
        });
    }
});


app.get("/api/tutores/:id/pets", async (req, res) => {
    const tutorId = Number(req.params.id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem: "ID do tutor inválido."
        });
    }

    try {
        const [pets] = await conexao.execute(
            `SELECT *
             FROM pets
             WHERE tutor_id = ?
             ORDER BY id DESC`,
            [tutorId]
        );

        res.json(pets);

    } catch (erro) {
        console.error("Erro ao buscar pets:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pets."
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
        const [tutor] = await conexao.execute(
            `SELECT id
             FROM tutores
             WHERE id = ?`,
            [tutorId]
        );

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [resultado] = await conexao.execute(
            `INSERT INTO pets
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                tutorId,
                nome.trim(),
                especie,
                raca || null,
                idade || null,
                sexo || null,
                peso || null,
                data_nascimento || null,
                observacoes || null
            ]
        );

        const [pets] = await conexao.execute(
            `SELECT *
             FROM pets
             WHERE id = ?`,
            [resultado.insertId]
        );

        res.status(201).json(pets[0]);

    } catch (erro) {
        console.error("Erro ao cadastrar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar pet."
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
        const [pet] = await conexao.execute(
            `SELECT id
             FROM pets
             WHERE id = ? AND tutor_id = ?`,
            [petId, tutorId]
        );

        if (pet.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado para este tutor."
            });
        }

        await conexao.execute(
            `UPDATE pets
             SET nome = ?,
                 especie = ?,
                 raca = ?,
                 idade = ?,
                 sexo = ?,
                 peso = ?,
                 data_nascimento = ?,
                 observacoes = ?
             WHERE id = ? AND tutor_id = ?`,
            [
                nome.trim(),
                especie,
                raca || null,
                idade || null,
                sexo || null,
                peso || null,
                data_nascimento || null,
                observacoes || null,
                petId,
                tutorId
            ]
        );

        const [pets] = await conexao.execute(
            `SELECT *
             FROM pets
             WHERE id = ?`,
            [petId]
        );

        res.json(pets[0]);

    } catch (erro) {
        console.error("Erro ao atualizar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar pet."
        });
    }
});


app.get("/api/clinicas", async (req, res) => {
    try {
        const [clinicas] = await conexao.execute(
            `SELECT *
             FROM clinicas
             ORDER BY nome`
        );

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
        const [clinicas] = await conexao.execute(
            `SELECT *
             FROM clinicas
             WHERE id = ?`,
            [clinicaId]
        );

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


app.get("/api/clinicas/:id/veterinarios", async (req, res) => {
    const clinicaId = Number(req.params.id);

    if (!Number.isInteger(clinicaId) || clinicaId <= 0) {
        return res.status(400).json({
            mensagem: "ID da clínica inválido."
        });
    }

    try {
        const [veterinarios] = await conexao.execute(
            `SELECT *
             FROM veterinarios
             WHERE clinica_id = ?
             ORDER BY nome`,
            [clinicaId]
        );

        res.json(veterinarios);

    } catch (erro) {
        console.error("Erro ao buscar veterinários:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar veterinários."
        });
    }
});


app.get("/api/clinicas/:id/servicos", async (req, res) => {
    const clinicaId = Number(req.params.id);

    if (!Number.isInteger(clinicaId) || clinicaId <= 0) {
        return res.status(400).json({
            mensagem: "ID da clínica inválido."
        });
    }

    try {
        const [servicos] = await conexao.execute(
            `SELECT *
             FROM servicos
             WHERE clinica_id = ?
             ORDER BY nome`,
            [clinicaId]
        );

        res.json(servicos);

    } catch (erro) {
        console.error("Erro ao buscar serviços:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar serviços."
        });
    }
});


app.get("/api/animais", async (req, res) => {
    try {
        const [animais] = await conexao.execute(
            `SELECT *
             FROM animais_perdidos
             ORDER BY id DESC`
        );

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
            mensagem: "Tutor inválido. Não foi possível identificar quem cadastrou o anúncio."
        });
    }

    if (!especie || !data || !bairro || !local || !contato || !status) {
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
        const [tutor] = await conexao.execute(
            `SELECT id
             FROM tutores
             WHERE id = ?`,
            [tutorId]
        );

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [resultado] = await conexao.execute(
            `INSERT INTO animais_perdidos
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
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
            ]
        );

        const [animais] = await conexao.execute(
            `SELECT *
             FROM animais_perdidos
             WHERE id = ?`,
            [resultado.insertId]
        );

        res.status(201).json(animais[0]);

    } catch (erro) {
        console.error("Erro ao cadastrar animal perdido:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar animal."
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
        const [resultado] = await conexao.execute(
            `DELETE FROM animais_perdidos
             WHERE id = ?`,
            [animalId]
        );

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
app.post("/api/agendamentos", async (req, res) => {
    const {
        tutor_id,
        pet_id,
        clinica_id,
        veterinario_id,
        servico_id,
        data_agendamento,
        horario,
        observacoes,
        solicitar_transporte,
        transporte,
        endereco_coleta,
        data_coleta,
        horario_coleta,
        observacoes_transporte
    } = req.body;

    const tutorId = Number(tutor_id);
    const petId = Number(pet_id);
    const clinicaId = Number(clinica_id);
    const servicoId = Number(servico_id);
    const veterinarioId =
        veterinario_id !== undefined &&
        veterinario_id !== null &&
        veterinario_id !== ""
            ? Number(veterinario_id)
            : null;

    if (
        !Number.isInteger(tutorId) ||
        !Number.isInteger(petId) ||
        !Number.isInteger(clinicaId) ||
        !Number.isInteger(servicoId) ||
        !data_agendamento ||
        !horario
    ) {
        return res.status(400).json({
            mensagem: "Preencha todos os dados obrigatórios do agendamento."
        });
    }

    const transporteSolicitado =
        solicitar_transporte === true ||
        solicitar_transporte === 1 ||
        solicitar_transporte === "1" ||
        solicitar_transporte === "true" ||
        transporte === true ||
        transporte === 1 ||
        transporte === "1" ||
        transporte === "true";

    if (transporteSolicitado) {
        if (!endereco_coleta || !data_coleta || !horario_coleta) {
            return res.status(400).json({
                mensagem:
                    "Informe endereço, data e horário da coleta para solicitar o transporte."
            });
        }
    }

    let conexaoTransacao;

    try {
        const [tutor] = await conexao.execute(
            `SELECT id
             FROM tutores
             WHERE id = ?`,
            [tutorId]
        );

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [pet] = await conexao.execute(
            `SELECT id
             FROM pets
             WHERE id = ? AND tutor_id = ?`,
            [petId, tutorId]
        );

        if (pet.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado para este tutor."
            });
        }

        const [clinica] = await conexao.execute(
            `SELECT id
             FROM clinicas
             WHERE id = ?`,
            [clinicaId]
        );

        if (clinica.length === 0) {
            return res.status(404).json({
                mensagem: "Clínica não encontrada."
            });
        }

        const [servico] = await conexao.execute(
            `SELECT id
             FROM servicos
             WHERE id = ?
             AND clinica_id = ?
             AND ativo = 1`,
            [servicoId, clinicaId]
        );

        if (servico.length === 0) {
            return res.status(404).json({
                mensagem: "Serviço não encontrado ou indisponível."
            });
        }

        if (veterinarioId !== null) {
            if (!Number.isInteger(veterinarioId)) {
                return res.status(400).json({
                    mensagem: "Veterinário inválido."
                });
            }

            const [veterinario] = await conexao.execute(
                `SELECT id
                 FROM veterinarios
                 WHERE id = ?
                 AND clinica_id = ?`,
                [veterinarioId, clinicaId]
            );

            if (veterinario.length === 0) {
                return res.status(404).json({
                    mensagem: "Veterinário não encontrado nesta clínica."
                });
            }
        }

        const [conflitos] = await conexao.execute(
            `SELECT id
             FROM agendamentos
             WHERE clinica_id = ?
             AND data_agendamento = ?
             AND horario = ?
             AND status IN ('Agendado', 'Confirmado')`,
            [
                clinicaId,
                data_agendamento,
                horario
            ]
        );

        if (conflitos.length > 0) {
            return res.status(409).json({
                mensagem:
                    "Já existe um agendamento para esta clínica neste dia e horário."
            });
        }

        conexaoTransacao = await conexao.getConnection();

        await conexaoTransacao.beginTransaction();

        const [resultado] = await conexaoTransacao.execute(
            `INSERT INTO agendamentos
            (
                tutor_id,
                pet_id,
                clinica_id,
                veterinario_id,
                servico_id,
                data_agendamento,
                horario,
                observacoes,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Agendado')`,
            [
                tutorId,
                petId,
                clinicaId,
                veterinarioId,
                servicoId,
                data_agendamento,
                horario,
                observacoes || null
            ]
        );

        const agendamentoId = resultado.insertId;

        if (transporteSolicitado) {
            await conexaoTransacao.execute(
                `INSERT INTO transportes
                (
                    agendamento_id,
                    endereco_coleta,
                    data_coleta,
                    horario_coleta,
                    observacoes,
                    status
                )
                VALUES (?, ?, ?, ?, ?, 'Solicitado')`,
                [
                    agendamentoId,
                    endereco_coleta,
                    data_coleta,
                    horario_coleta,
                    observacoes_transporte || null
                ]
            );
        }

        await conexaoTransacao.commit();

        res.status(201).json({
            mensagem: "Agendamento realizado com sucesso.",
            id: agendamentoId
        });

    } catch (erro) {
        if (conexaoTransacao) {
            try {
                await conexaoTransacao.rollback();
            } catch (erroRollback) {
                console.error("Erro ao desfazer transação:", erroRollback);
            }
        }

        console.error("Erro ao realizar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao realizar agendamento."
        });

    } finally {
        if (conexaoTransacao) {
            conexaoTransacao.release();
        }
    }
});


app.get("/api/tutores/:id/agendamentos", async (req, res) => {
    const tutorId = Number(req.params.id);

    if (!Number.isInteger(tutorId) || tutorId <= 0) {
        return res.status(400).json({
            mensagem: "ID do tutor inválido."
        });
    }

    try {
        const [agendamentos] = await conexao.execute(
            `SELECT
                a.id,
                a.tutor_id,
                a.pet_id,
                a.clinica_id,
                a.veterinario_id,
                a.servico_id,
                a.data_agendamento,
                a.horario,
                a.observacoes,
                a.status,
                p.nome AS nome_pet,
                c.nome AS nome_clinica,
                c.endereco AS endereco_clinica,
                v.nome AS nome_veterinario,
                s.nome AS nome_servico
             FROM agendamentos a
             INNER JOIN pets p
                ON a.pet_id = p.id
             INNER JOIN clinicas c
                ON a.clinica_id = c.id
             LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
             INNER JOIN servicos s
                ON a.servico_id = s.id
             WHERE a.tutor_id = ?
             ORDER BY a.data_agendamento DESC, a.horario DESC`,
            [tutorId]
        );

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
        const [agendamentos] = await conexao.execute(
            `SELECT
                a.*,
                p.nome AS nome_pet,
                p.especie AS especie_pet,
                p.raca AS raca_pet,
                c.nome AS nome_clinica,
                c.endereco AS endereco_clinica,
                c.telefone AS telefone_clinica,
                v.nome AS nome_veterinario,
                s.nome AS nome_servico,
                s.preco AS preco_servico
             FROM agendamentos a
             INNER JOIN pets p
                ON a.pet_id = p.id
             INNER JOIN clinicas c
                ON a.clinica_id = c.id
             LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
             INNER JOIN servicos s
                ON a.servico_id = s.id
             WHERE a.id = ?`,
            [agendamentoId]
        );

        if (agendamentos.length === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        res.json(agendamentos[0]);

    } catch (erro) {
        console.error("Erro ao buscar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar agendamento."
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
        const [resultado] = await conexao.execute(
            `UPDATE agendamentos
             SET status = 'Cancelado'
             WHERE id = ?`,
            [agendamentoId]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        res.json({
            mensagem: "Agendamento cancelado com sucesso."
        });

    } catch (erro) {
        console.error("Erro ao cancelar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao cancelar agendamento."
        });
    }
});


app.get("/api/status", async (req, res) => {
    try {
        await conexao.execute("SELECT 1");

        res.json({
            servidor: "online",
            banco: "conectado"
        });

    } catch (erro) {
        console.error("Erro ao verificar banco:", erro);

        res.status(500).json({
            servidor: "online",
            banco: "desconectado"
        });
    }
});


const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(`Servidor do Agenda Pet rodando em http://localhost:${PORTA}`);
});