const conexao = require("../config/conexao");

const listarPets = (req, res) => {
    const sql = "SELECT * FROM pets";

    conexao.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar pets"
            });
        }

        res.json(resultados);
    });
};

const buscarPet = (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM pets WHERE id = ?";

    conexao.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao buscar pet"
            });
        }

        if (resultados.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado"
            });
        }

        res.json(resultados[0]);
    });
};

const criarPet = (req, res) => {
    const { nome, especie, raca, idade, usuario_id } = req.body;

    const sql = `
        INSERT INTO pets
        (nome, especie, raca, idade, usuario_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    conexao.query(
        sql,
        [nome, especie, raca, idade, usuario_id],
        (erro, resultado) => {
            if (erro) {
                return res.status(500).json({
                    erro: "Erro ao cadastrar pet"
                });
            }

            res.status(201).json({
                mensagem: "Pet cadastrado com sucesso",
                id: resultado.insertId
            });
        }
    );
};

const excluirPet = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM pets WHERE id = ?";

    conexao.query(sql, [id], (erro) => {
        if (erro) {
            return res.status(500).json({
                erro: "Erro ao excluir pet"
            });
        }

        res.json({
            mensagem: "Pet excluído com sucesso"
        });
    });
};

module.exports = {
    listarPets,
    buscarPet,
    criarPet,
    excluirPet
};