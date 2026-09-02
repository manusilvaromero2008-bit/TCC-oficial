const conexao = require("../config/conexao");

const listarUsuarios = (req, res) => {
    const sql = "SELECT * FROM usuarios";

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar usuários"
            });
        }

        res.json(resultados);
    });
};

const buscarUsuario = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM usuarios WHERE id = ?";

    conexao.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar usuário"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }

        res.json(resultados[0]);
    });
};

const criarUsuario = (req, res) => {
    const { nome, email, senha, telefone } = req.body;

    const sql = `
        INSERT INTO usuarios
        (nome, email, senha, telefone)
        VALUES (?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [nome, email, senha, telefone],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar usuário"
                });
            }

            res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso",
                id: resultado.insertId
            });
        }
    );
};

const excluirUsuario = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM usuarios WHERE id = ?";

    conexao.query(sql, [id], (erro) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao excluir usuário"
            });
        }

        res.json({
            mensagem: "Usuário excluído com sucesso"
        });
    });
};

module.exports = {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    excluirUsuario
};