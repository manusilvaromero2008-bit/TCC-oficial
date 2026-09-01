const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conexao = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend do Agenda Pet funcionando!"
    });
});

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

        if (!nome || !telefone || !email) {
            return res.status(400).json({
                mensagem: "Nome, telefone e e-mail são obrigatórios."
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
            nome,
            cpf || null,
            telefone,
            email,
            endereco || null,
            cep || null
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

        if (!nome || !telefone || !email) {
            return res.status(400).json({
                mensagem: "Nome, telefone e e-mail são obrigatórios."
            });
        }

        const [tutorExistente] = await conexao.query(
            "SELECT id FROM tutores WHERE id = ?",
            [id]
        );

        if (tutorExistente.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
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
            nome,
            cpf || null,
            telefone,
            email,
            endereco || null,
            cep || null,
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
                sexo,
                data_nascimento,
                observacoes,
                created_at
            FROM pets
            WHERE tutor_id = ?
            ORDER BY nome
        `, [id]);

        res.json(pets);

    } catch (erro) {
        console.error("Erro ao buscar pets:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pets."
        });
    }
});

app.post("/api/pets", async (req, res) => {
    try {
        const {
            tutor_id,
            nome,
            especie,
            raca,
            sexo,
            data_nascimento,
            observacoes
        } = req.body;

        if (!tutor_id || !nome || !especie) {
            return res.status(400).json({
                mensagem: "Tutor, nome e espécie são obrigatórios."
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

        const [resultado] = await conexao.query(`
            INSERT INTO pets
            (
                tutor_id,
                nome,
                especie,
                raca,
                sexo,
                data_nascimento,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            tutor_id,
            nome,
            especie,
            raca || null,
            sexo || null,
            data_nascimento || null,
            observacoes || null
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
            sexo,
            data_nascimento,
            observacoes
        } = req.body;

        if (!tutor_id || !nome || !especie) {
            return res.status(400).json({
                mensagem: "Tutor, nome e espécie são obrigatórios."
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

        const [resultado] = await conexao.query(`
            UPDATE pets
            SET
                nome = ?,
                especie = ?,
                raca = ?,
                sexo = ?,
                data_nascimento = ?,
                observacoes = ?
            WHERE id = ?
            AND tutor_id = ?
        `, [
            nome,
            especie,
            raca || null,
            sexo || null,
            data_nascimento || null,
            observacoes || null,
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
        conexaoAgendamento =
            await conexao.getConnection();

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

        const [tutor] =
            await conexaoAgendamento.query(
                "SELECT id FROM tutores WHERE id = ?",
                [tutor_id]
            );

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [pet] =
            await conexaoAgendamento.query(`
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

        const [clinica] =
            await conexaoAgendamento.query(`
                SELECT id
                FROM clinicas
                WHERE id = ?
            `, [clinica_id]);

        if (clinica.length === 0) {
            return res.status(400).json({
                mensagem: "Clínica não encontrada."
            });
        }

        const [servicos] =
            await conexaoAgendamento.query(`
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

            const [veterinarios] =
                await conexaoAgendamento.query(`
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
                    mensagem:
                        "Veterinário inválido ou indisponível."
                });
            }
        }

        const [conflito] =
            await conexaoAgendamento.query(`
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
                mensagem:
                    "Este horário já está ocupado."
            });
        }

        const [resultado] =
            await conexaoAgendamento.query(`
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
            mensagem:
                "Agendamento realizado com sucesso.",
            id: resultado.insertId
        });

    } catch (erro) {

        console.error(
            "Erro ao realizar agendamento:",
            erro
        );

        res.status(500).json({
            mensagem:
                "Erro ao realizar agendamento.",
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

        const [agendamentos] =
            await conexao.query(`
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
            mensagem:
                "Erro ao buscar agendamentos."
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