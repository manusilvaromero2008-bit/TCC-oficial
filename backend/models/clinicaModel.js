const db = require("../config/database");

const Clinica = {
    listar: (callback) => {
        const sql = `
            SELECT *
            FROM clinicas
            ORDER BY nome
        `;

        db.query(sql, callback);
    },

    buscarPorId: (id, callback) => {
        const sql = `
            SELECT *
            FROM clinicas
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    buscarPorRegiao: (regiao, callback) => {
        const sql = `
            SELECT *
            FROM clinicas
            WHERE regiao = ?
            ORDER BY nome
        `;

        db.query(sql, [regiao], callback);
    }
};

module.exports = Clinica;