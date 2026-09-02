const db = require("../config/database");

const Agendamento = {
    criar: (agendamento, callback) => {
        const sql = `
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
        `;

        const valores = [
            agendamento.tutor_id,
            agendamento.pet_id,
            agendamento.clinica_id,
            agendamento.veterinario_id || null,
            agendamento.servico_id,
            agendamento.data_agendamento,
            agendamento.horario,
            agendamento.observacoes || null
        ];

        db.query(sql, valores, callback);
    },

    buscarPorId: (id, callback) => {
        const sql = `
            SELECT
                a.*,
                t.nome AS tutor_nome,
                p.nome AS pet_nome,
                c.nome AS clinica_nome,
                v.nome AS veterinario_nome,
                s.nome AS servico_nome,
                s.preco
            FROM agendamentos a
            INNER JOIN tutores t
                ON a.tutor_id = t.id
            INNER JOIN pets p
                ON a.pet_id = p.id
            INNER JOIN clinicas c
                ON a.clinica_id = c.id
            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
            INNER JOIN servicos s
                ON a.servico_id = s.id
            WHERE a.id = ?
        `;

        db.query(sql, [id], callback);
    },

    buscarPorTutor: (tutorId, callback) => {
        const sql = `
            SELECT
                a.*,
                p.nome AS pet_nome,
                c.nome AS clinica_nome,
                v.nome AS veterinario_nome,
                s.nome AS servico_nome,
                s.preco
            FROM agendamentos a
            INNER JOIN pets p
                ON a.pet_id = p.id
            INNER JOIN clinicas c
                ON a.clinica_id = c.id
            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
            INNER JOIN servicos s
                ON a.servico_id = s.id
            WHERE a.tutor_id = ?
            ORDER BY a.data_agendamento, a.horario
        `;

        db.query(sql, [tutorId], callback);
    },

    listar: (callback) => {
        const sql = `
            SELECT
                a.*,
                t.nome AS tutor_nome,
                p.nome AS pet_nome,
                c.nome AS clinica_nome,
                v.nome AS veterinario_nome,
                s.nome AS servico_nome,
                s.preco
            FROM agendamentos a
            INNER JOIN tutores t
                ON a.tutor_id = t.id
            INNER JOIN pets p
                ON a.pet_id = p.id
            INNER JOIN clinicas c
                ON a.clinica_id = c.id
            LEFT JOIN veterinarios v
                ON a.veterinario_id = v.id
            INNER JOIN servicos s
                ON a.servico_id = s.id
            ORDER BY a.data_agendamento, a.horario
        `;

        db.query(sql, callback);
    },

    atualizarStatus: (id, status, callback) => {
        const sql = `
            UPDATE agendamentos
            SET status = ?
            WHERE id = ?
        `;

        db.query(sql, [status, id], callback);
    },

    cancelar: (id, callback) => {
        const sql = `
            UPDATE agendamentos
            SET status = 'Cancelado'
            WHERE id = ?
        `;

        db.query(sql, [id], callback);
    }
};

module.exports = Agendamento;