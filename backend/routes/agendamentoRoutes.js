const express = require("express");
const router = express.Router();

const {
    listarAgendamentos,
    buscarAgendamento,
    criarAgendamento,
    excluirAgendamento
} = require("../controllers/agendamentosController");

router.get("/", listarAgendamentos);
router.get("/:id", buscarAgendamento);
router.post("/", criarAgendamento);
router.delete("/:id", excluirAgendamento);

module.exports = router;