const express = require("express");
const router = express.Router();

const {
    listarServicos,
    buscarServico,
    criarServico,
    excluirServico
} = require("../controllers/servicosController");

router.get("/", listarServicos);
router.get("/:id", buscarServico);
router.post("/", criarServico);
router.delete("/:id", excluirServico);

module.exports = router;