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
    try {
        const { id } = req.params;

        const {
            nome,
            cpf,
            telefone,
            email,
            endereco,
            cep
        } = req.body;

        const [tutorExistente] = await conexao.query(
            "SELECT id FROM tutores WHERE id = ?",
            [id]
        );

        if (tutorExistente.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

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
            AND id <> ?
        `, [cpfLimpo, id]);

        if (cpfExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este CPF já está cadastrado para outro tutor."
            });
        }

        const [emailExistente] = await conexao.query(`
            SELECT id
            FROM tutores
            WHERE LOWER(email) = ?
            AND id <> ?
        `, [emailNormalizado, id]);

        if (emailExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado para outro tutor."
            });
        }

        const [resultado] = await conexao.query(`
            UPDATE tutores
            SET
                nome = ?,
                cpf = ?,
                telefone = ?,
                email = ?,
                endereco = ?,
                cep = ?
            WHERE id = ?
        `, [
            nomeNormalizado,
            cpfFormatado,
            telefoneFormatado,
            emailNormalizado,
            enderecoNormalizado,
            cepFinal,
            id
        ]);

        res.json({
            mensagem: "Dados do tutor atualizados com sucesso.",
            alterado: resultado.affectedRows > 0
        });
    } catch (erro) {
        console.error("Erro ao atualizar tutor:", erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                mensagem: "CPF ou e-mail já cadastrado para outro tutor."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao atualizar os dados do tutor.",
            erro: erro.message
        });
    }
});

app.get("/api/tutores/:id/pets", async (req, res) => {
    try {
        const { id } = req.params;

        const [pets] = await conexao.query(`
            SELECT
                id,
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                sexo,
                peso,
                created_at,
                updated_at
            FROM pets
            WHERE tutor_id = ?
            ORDER BY id
        `, [id]);

        res.json(pets);
    } catch (erro) {
        console.error("Erro ao buscar pets:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pets.",
            erro: erro.message
        });
    }
});

function validarPet({
    nome,
    especie,
    raca,
    idade,
    sexo,
    peso
}) {
    const nomePet = String(nome || "").trim();
    const racaPet = String(raca || "").trim();
    const idadePet = String(idade || "").trim();
    const pesoPet = String(peso || "").trim();

    if (!nomePet || nomePet.length < 2) {
        return "Digite um nome válido para o pet.";
    }

    if (nomePet.length > 100) {
        return "O nome do pet deve possuir no máximo 100 caracteres.";
    }

    const especiesPermitidas = [
        "Cão",
        "Gato",
        "Ave",
        "Roedor",
        "Outro"
    ];

    if (!especie || !especiesPermitidas.includes(especie)) {
        return "Selecione uma espécie válida.";
    }

    if (racaPet.length > 100) {
        return "A raça deve possuir no máximo 100 caracteres.";
    }

    if (idadePet.length > 30) {
        return "A idade deve possuir no máximo 30 caracteres.";
    }

    const sexosPermitidos = [
        "Macho",
        "Fêmea"
    ];

    if (sexo && !sexosPermitidos.includes(sexo)) {
        return "Selecione um sexo válido.";
    }

    if (pesoPet) {
        const pesoNumerico = Number(
            pesoPet
                .replace(",", ".")
                .replace(/[^\d.]/g, "")
        );

        if (!Number.isFinite(pesoNumerico) || pesoNumerico <= 0) {
            return "Digite um peso válido.";
        }

        if (pesoPet.length > 30) {
            return "O peso deve possuir no máximo 30 caracteres.";
        }
    }

    return null;
}

app.post("/api/pets", async (req, res) => {
    try {
        const {
            tutor_id,
            nome,
            especie,
            raca,
            idade,
            sexo,
            peso
        } = req.body;

        if (!tutor_id) {
            return res.status(400).json({
                mensagem: "Tutor é obrigatório."
            });
        }

        const [tutor] = await conexao.query(
            "SELECT id FROM tutores WHERE id = ?",
            [tutor_id]
        );

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const erroValidacao = validarPet({
            nome,
            especie,
            raca,
            idade,
            sexo,
            peso
        });

        if (erroValidacao) {
            return res.status(400).json({
                mensagem: erroValidacao
            });
        }

        const [resultado] = await conexao.query(`
            INSERT INTO pets
            (
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                sexo,
                peso
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            tutor_id,
            String(nome).trim(),
            especie,
            raca ? String(raca).trim() : null,
            idade ? String(idade).trim() : null,
            sexo || null,
            peso ? String(peso).trim() : null
        ]);

        res.status(201).json({
            mensagem: "Pet cadastrado com sucesso.",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao cadastrar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar pet.",
            erro: erro.message
        });
    }
});

app.put("/api/pets/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            tutor_id,
            nome,
            especie,
            raca,
            idade,
            sexo,
            peso
        } = req.body;

        if (!tutor_id) {
            return res.status(400).json({
                mensagem: "Tutor é obrigatório."
            });
        }

        const [petExistente] = await conexao.query(`
            SELECT
                id,
                tutor_id
            FROM pets
            WHERE id = ?
        `, [id]);

        if (petExistente.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado."
            });
        }

        if (
            Number(petExistente[0].tutor_id) !==
            Number(tutor_id)
        ) {
            return res.status(403).json({
                mensagem: "Este pet não pertence ao tutor informado."
            });
        }

        const erroValidacao = validarPet({
            nome,
            especie,
            raca,
            idade,
            sexo,
            peso
        });

        if (erroValidacao) {
            return res.status(400).json({
                mensagem: erroValidacao
            });
        }

        const [resultado] = await conexao.query(`
            UPDATE pets
            SET
                nome = ?,
                especie = ?,
                raca = ?,
                idade = ?,
                sexo = ?,
                peso = ?
            WHERE id = ?
            AND tutor_id = ?
        `, [
            String(nome).trim(),
            especie,
            raca ? String(raca).trim() : null,
            idade ? String(idade).trim() : null,
            sexo || null,
            peso ? String(peso).trim() : null,
            id,
            tutor_id
        ]);

        res.json({
            mensagem: "Pet atualizado com sucesso.",
            alterado: resultado.affectedRows > 0
        });
    } catch (erro) {
        console.error("Erro ao atualizar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar pet.",
            erro: erro.message
        });
    }
});

app.get("/api/clinicas", async (req, res) => {
    try {
        const [clinicas] = await conexao.query(`
            SELECT
                id,
                nome,
                regiao,
                endereco,
                telefone,
                horario_atendimento,
                atendimento_24h,
                descricao,
                imagem
            FROM clinicas
            ORDER BY id
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
    try {
        const { id } = req.params;

        const [clinicas] = await conexao.query(`
            SELECT
                id,
                nome,
                regiao,
                endereco,
                telefone,
                horario_atendimento,
                atendimento_24h,
                descricao,
                imagem
            FROM clinicas
            WHERE id = ?
        `, [id]);

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
    try {
        const { id } = req.params;

        const [veterinarios] = await conexao.query(`
            SELECT
                id,
                nome,
                especialidade,
                telefone,
                email,
                disponivel
            FROM veterinarios
            WHERE clinica_id = ?
            ORDER BY nome
        `, [id]);

        res.json(veterinarios);
    } catch (erro) {
        console.error("Erro ao buscar veterinários:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar veterinários."
        });
    }
});

app.get("/api/clinicas/:id/servicos", async (req, res) => {
    try {
        const { id } = req.params;

        const [servicos] = await conexao.query(`
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
                v.nome AS veterinario_nome,
                v.especialidade AS veterinario_especialidade
            FROM servicos s
            LEFT JOIN veterinarios v
                ON s.veterinario_id = v.id
            WHERE s.clinica_id = ?
            AND s.ativo = TRUE
            ORDER BY s.tipo, s.nome
        `, [id]);

        res.json(servicos);
    } catch (erro) {
        console.error("Erro ao buscar serviços:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar serviços."
        });
    }
});

app.post("/api/agendamentos", async (req, res) => {
    let conexaoAgendamento;

    try {
        conexaoAgendamento = await conexao.getConnection();

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

        if (
            !tutor_id ||
            !pet_id ||
            !clinica_id ||
            !servico_id ||
            !data_agendamento ||
            !horario
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        const [tutor] = await conexaoAgendamento.query(
            "SELECT id FROM tutores WHERE id = ?",
            [tutor_id]
        );

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [pet] = await conexaoAgendamento.query(`
            SELECT id
            FROM pets
            WHERE id = ?
            AND tutor_id = ?
        `, [
            pet_id,
            tutor_id
        ]);

        if (pet.length === 0) {
            return res.status(400).json({
                mensagem: "Pet inválido para este tutor."
            });
        }

        const [clinica] = await conexaoAgendamento.query(`
            SELECT id
            FROM clinicas
            WHERE id = ?
        `, [clinica_id]);

        if (clinica.length === 0) {
            return res.status(400).json({
                mensagem: "Clínica não encontrada."
            });
        }

        const [servicos] = await conexaoAgendamento.query(`
            SELECT
                id,
                clinica_id,
                veterinario_id
            FROM servicos
            WHERE id = ?
            AND clinica_id = ?
            AND ativo = TRUE
        `, [
            servico_id,
            clinica_id
        ]);

        if (servicos.length === 0) {
            return res.status(400).json({
                mensagem: "Serviço inválido para esta clínica."
            });
        }

        const veterinarioFinal =
            veterinario_id ||
            servicos[0].veterinario_id ||
            null;

        if (veterinarioFinal) {
            const [veterinarios] = await conexaoAgendamento.query(`
                SELECT id
                FROM veterinarios
                WHERE id = ?
                AND clinica_id = ?
                AND disponivel = TRUE
            `, [
                veterinarioFinal,
                clinica_id
            ]);

            if (veterinarios.length === 0) {
                return res.status(400).json({
                    mensagem: "Veterinário inválido ou indisponível."
                });
            }
        }

        const [conflito] = await conexaoAgendamento.query(`
            SELECT id
            FROM agendamentos
            WHERE clinica_id = ?
            AND data_agendamento = ?
            AND horario = ?
            AND status IN ('Agendado', 'Confirmado')
        `, [
            clinica_id,
            data_agendamento,
            horario
        ]);

        if (conflito.length > 0) {
            return res.status(409).json({
                mensagem: "Este horário já está ocupado."
            });
        }

        const [resultado] = await conexaoAgendamento.query(`
            INSERT INTO agendamentos
            (
                tutor_id,
                pet_id,
                clinica_id,
                veterinario_id,
                servico_id,
                data_agendamento,
                horario,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            tutor_id,
            pet_id,
            clinica_id,
            veterinarioFinal,
            servico_id,
            data_agendamento,
            horario,
            observacoes || null
        ]);

        res.status(201).json({
            mensagem: "Agendamento realizado com sucesso.",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error(
            "Erro ao realizar agendamento:",
            erro
        );

        res.status(500).json({
            mensagem: "Erro ao realizar agendamento.",
            erro: erro.message
        });
    } finally {
        if (conexaoAgendamento) {
            conexaoAgendamento.release();
        }
    }
});

app.get("/api/tutores/:id/agendamentos", async (req, res) => {
    try {
        const { id } = req.params;

        const [agendamentos] = await conexao.query(`
            SELECT
                a.id,
                a.data_agendamento,
                a.horario,
                a.status,
                a.observacoes,
                c.id AS clinica_id,
                c.nome AS clinica,
                c.endereco,
                p.id AS pet_id,
                p.nome AS pet,
                s.id AS servico_id,
                s.nome AS servico,
                s.tipo AS tipo_servico,
                v.id AS veterinario_id,
                v.nome AS veterinario
            FROM agendamentos a
            INNER JOIN clinicas c
                ON a.clinica_id = c.id
            INNER JOIN pets p
                ON a.pet_id = p.id
            INNER JOIN servicos s
                ON a.servico_id = s.id
            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
            WHERE a.tutor_id = ?
            ORDER BY
                a.data_agendamento DESC,
                a.horario DESC
        `, [id]);

        res.json(agendamentos);
    } catch (erro) {
        console.error(
            "Erro ao buscar agendamentos:",
            erro
        );

        res.status(500).json({
            mensagem: "Erro ao buscar agendamentos."
        });
    }
});

app.get("/api/agendamentos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [agendamentos] = await conexao.query(`
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
                c.nome AS clinica,
                c.endereco AS endereco_clinica,
                p.nome AS pet,
                p.especie,
                p.raca,
                s.nome AS servico,
                s.tipo AS tipo_servico,
                s.preco,
                s.duracao_minutos,
                v.nome AS veterinario,
                v.especialidade
            FROM agendamentos a
            INNER JOIN clinicas c
                ON a.clinica_id = c.id
            INNER JOIN pets p
                ON a.pet_id = p.id
            INNER JOIN servicos s
                ON a.servico_id = s.id
            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
            WHERE a.id = ?
        `, [id]);

        if (agendamentos.length === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        res.json(agendamentos[0]);
    } catch (erro) {
        console.error(
            "Erro ao buscar agendamento:",
            erro
        );

        res.status(500).json({
            mensagem: "Erro ao buscar agendamento."
        });
    }
});

app.delete("/api/agendamentos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexao.query(`
            UPDATE agendamentos
            SET status = 'Cancelado'
            WHERE id = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        res.json({
            mensagem: "Agendamento cancelado com sucesso."
        });
    } catch (erro) {
        console.error(
            "Erro ao cancelar agendamento:",
            erro
        );

        res.status(500).json({
            mensagem: "Erro ao cancelar agendamento."
        });
    }
});

app.get("/api/animais", async (req, res) => {
    try {
        const [animais] = await conexao.query(`
            SELECT
                id,
                tutor_id,
                nome,
                especie,
                raca,
                cor,
                DATE_FORMAT(data_perdido, '%Y-%m-%d') AS data_perdido,
                bairro,
                local_perdido,
                descricao,
                contato,
                foto,
                status,
                created_at
            FROM animais_perdidos
            ORDER BY id DESC
        `);

        res.json(animais);
    } catch (erro) {
        console.error("Erro ao buscar animais:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar animais.",
            erro: erro.message
        });
    }
});

app.post("/api/animais", async (req, res) => {
    try {
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

        if (
            !nome ||
            !especie ||
            !data ||
            !bairro ||
            !local ||
            !contato
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        const especiesPermitidas = [
            "cachorro",
            "gato",
            "ave",
            "roedor",
            "outro"
        ];

        if (!especiesPermitidas.includes(
            String(especie).trim().toLowerCase()
        )) {
            return res.status(400).json({
                mensagem: "Selecione uma espécie válida."
            });
        }

        const statusFinal =
            status === "encontrado"
                ? "encontrado"
                : "perdido";

        const [resultado] = await conexao.query(`
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
            tutor_id || null,
            String(nome).trim(),
            String(especie).trim().toLowerCase(),
            raca ? String(raca).trim() : null,
            cor ? String(cor).trim() : null,
            data,
            String(bairro).trim(),
            String(local).trim(),
            descricao ? String(descricao).trim() : null,
            String(contato).trim(),
            foto || null,
            statusFinal
        ]);

        res.status(201).json({
            mensagem: "Animal cadastrado com sucesso.",
            id: resultado.insertId
        });
    } catch (erro) {
        console.error("Erro ao cadastrar animal:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar animal.",
            erro: erro.message
        });
    }
});

app.delete("/api/animais/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const [resultado] = await conexao.query(`
            DELETE FROM animais_perdidos
            WHERE id = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Animal não encontrado."
            });
        }

        res.json({
            mensagem: "Anúncio removido com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao remover animal:", erro);

        res.status(500).json({
            mensagem: "Erro ao remover anúncio.",
            erro: erro.message
        });
    }
});

app.get("/api/status", async (req, res) => {
    try {
        await conexao.query("SELECT 1");

        res.json({
            status: "ok",
            banco: "conectado"
        });
    } catch (erro) {
        console.error(
            "Erro na conexão com o banco:",
            erro
        );

        res.status(500).json({
            status: "erro",
            banco: "desconectado"
        });
    }
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log(
        `Servidor do Agenda Pet rodando em http://localhost:${PORTA}`
    );
});