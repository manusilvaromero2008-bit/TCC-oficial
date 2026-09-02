const db = require("../config/database");

const Pet = {
    criar: (pet, callback) => {
        const sql = `
            INSERT INTO pets
            (tutor_id, nome, especie, raca, idade, sexo, peso)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        const valores = [
            pet.tutor_id,
            pet.nome,
            pet.especie,
            pet.raca,
            pet.idade,
            pet.sexo,
            pet.peso
        ];

        db.query(sql, valores, callback);
    },

    buscarPorId: (id, callback) => {
        const sql = `
            SELECT *
            FROM pets
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    },

    buscarPorTutor: (tutorId, callback) => {
        const sql = `
            SELECT *
            FROM pets
            WHERE tutor_id = ?
            ORDER BY nome
        `;

        db.query(sql, [tutorId], callback);
    },

    listar: (callback) => {
        const sql = `
            SELECT *
            FROM pets
            ORDER BY nome
        `;

        db.query(sql, callback);
    },

    atualizar: (id, pet, callback) => {
        const sql = `
            UPDATE pets
            SET nome = ?,
                especie = ?,
                raca = ?,
                idade = ?,
                sexo = ?,
                peso = ?
            WHERE id = ?
        `;

        const valores = [
            pet.nome,
            pet.especie,
            pet.raca,
            pet.idade,
            pet.sexo,
            pet.peso,
            id
        ];

        db.query(sql, valores, callback);
    },

    excluir: (id, callback) => {
        const sql = `
            DELETE FROM pets
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Pet;