const db = require("../config/database");

const Transporte = {
    criar: (transporte, callback) => {
        const sql = `
            INSERT INTO transportes
            (
                agendamento_id,
                endereco_coleta,
                data_coleta,
                horario_coleta,
                observacoes
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        const valores = [
            transporte.agendamento_id,
            transporte.endereco_coleta,
            transporte.data_coleta,
            transporte.horario_coleta,
            transporte.observacoes || null
        ];

        db.query(sql, valores, callback);
    },

    buscarPorAgendamento: (agendamentoId, callback) => {
        const sql = `
            SELECT *
            FROM transportes
            WHERE agendamento_id = ?
        `;

        db.query(sql, [agendamentoId], callback);
    },

    atualizarStatus: (id, status, callback) => {
        const sql = `
            UPDATE transportes
            SET status = ?
            WHERE id = ?
        `;

        db.query(sql, [status, id], callback);
    },

    cancelar: (id, callback) => {
        const sql = `
            UPDATE transportes
            SET status = 'Cancelado'
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Transporte;