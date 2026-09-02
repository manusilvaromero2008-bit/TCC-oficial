const conexao = require("../config/conexao");

const listarServicos = (req, res) => {
    const sql = "SELECT * FROM servicos";

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar serviços"
            });
        }

        res.json(resultados);
    });
};

const buscarServico = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM servicos WHERE id = ?";

    conexao.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar serviço"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Serviço não encontrado"
            });
        }

        res.json(resultados[0]);
    });
};

const criarServico = (req, res) => {
    const { nome, descricao, preco } = req.body;

    const sql = `
        INSERT INTO servicos
        (nome, descricao, preco)
        VALUES (?, ?, ?)
    `;

    conexao.query(
        sql,
        [nome, descricao, preco],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar serviço"
                });
            }

            res.status(201).json({
                mensagem: "Serviço cadastrado com sucesso",
                id: resultado.insertId
            });
        }
    );
};

const excluirServico = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM servicos WHERE id = ?";

    conexao.query(sql, [id], (erro) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao excluir serviço"
            });
        }

        res.json({
            mensagem: "Serviço excluído com sucesso"
        });
    });
};

module.exports = {
    listarServicos,
    buscarServico,
    criarServico,
    excluirServico
};