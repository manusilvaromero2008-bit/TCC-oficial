const conexao = require("../config/conexao");

const listarAgendamentos = (req, res) => {
    const sql = "SELECT * FROM agendamentos";

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar agendamentos"
            });
        }

        res.json(resultados);
    });
};

const buscarAgendamento = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM agendamentos WHERE id = ?";

    conexao.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar agendamento"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado"
            });
        }

        res.json(resultados[0]);
    });
};

const criarAgendamento = (req, res) => {
    const { pet_id, servico_id, data, horario } = req.body;

    const sql = `
        INSERT INTO agendamentos
        (pet_id, servico_id, data, horario)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [pet_id, servico_id, data, horario],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao criar agendamento"
                });
            }

            res.status(201).json({
                mensagem: "Agendamento criado com sucesso",
                id: resultado.insertId
            });
        }
    );
};

const excluirAgendamento = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM agendamentos WHERE id = ?";

    conexao.query(sql, [id], (erro) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao excluir agendamento"
            });
        }

        res.json({
            mensagem: "Agendamento excluído com sucesso"
        });
    });
};

module.exports = {
    listarAgendamentos,
    buscarAgendamento,
    criarAgendamento,
    excluirAgendamento
};