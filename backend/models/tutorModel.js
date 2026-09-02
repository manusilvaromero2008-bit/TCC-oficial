const db = require("../config/database");

const Tutor = {
    criar: (tutor, callback) => {
        const sql = `
            INSERT INTO tutores
            (nome, cpf, telefone, email, endereco, cep)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            tutor.nome,
            tutor.cpf,
            tutor.telefone,
            tutor.email,
            tutor.endereco,
            tutor.cep
        ];

        db.query(sql, valores, callback);
    },

    buscarPorId: (id, callback) => {
        const sql = `
            SELECT *
            FROM tutores
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    buscarPorEmail: (email, callback) => {
        const sql = `
            SELECT *
            FROM tutores
            WHERE email = ?
        `;

        db.query(sql, [email], callback);
    },

    listar: (callback) => {
        const sql = `
            SELECT *
            FROM tutores
            ORDER BY nome
        `;

        db.query(sql, callback);
    },

    atualizar: (id, tutor, callback) => {
        const sql = `
            UPDATE tutores
            SET nome = ?,
                cpf = ?,
                telefone = ?,
                email = ?,
                endereco = ?,
                cep = ?
            WHERE id = ?
        `;

        const valores = [
            tutor.nome,
            tutor.cpf,
            tutor.telefone,
            tutor.email,
            tutor.endereco,
            tutor.cep,
            id
        ];

        db.query(sql, valores, callback);
    },

    excluir: (id, callback) => {
        const sql = `
            DELETE FROM tutores
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Tutor;