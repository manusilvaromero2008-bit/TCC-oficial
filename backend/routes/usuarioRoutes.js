const express = require("express");
const router = express.Router();

const {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    excluirUsuario
} = require("../controllers/usuarioController");

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuario);
router.post("/", criarUsuario);
router.delete("/:id", excluirUsuario);

module.exports = router;