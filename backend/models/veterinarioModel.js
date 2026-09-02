const db = require("../config/database");

const Veterinario = {
    listar: (callback) => {
        const sql = `
            SELECT *
            FROM veterinarios
            ORDER BY nome
        `;

        db.query(sql, callback);
    },

    buscarPorId: (id, callback) => {
        const sql = `
            SELECT *
            FROM veterinarios
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    buscarPorClinica: (clinicaId, callback) => {
        const sql = `
            SELECT *
            FROM veterinarios
            WHERE clinica_id = ?
            AND disponivel = TRUE
            ORDER BY nome
        `;

        db.query(sql, [clinicaId], callback);
    }
};

module.exports = Veterinario;