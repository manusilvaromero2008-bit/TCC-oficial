const express = require("express");
const router = express.Router();

const {
    listarClinicas,
    buscarClinica,
    criarClinica,
    excluirClinica
} = require("../controllers/clinicaController");

router.get("/", listarClinicas);
router.get("/:id", buscarClinica);
router.post("/", criarClinica);
router.delete("/:id", excluirClinica);

module.exports = router;