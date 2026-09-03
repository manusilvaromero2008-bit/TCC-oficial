const express = require("express");
const router = express.Router();

const {
    listarUsuarios,
    buscarUsuario,
    criarUsuario,
    excluirUsuario,
    listarPetsDoTutor
} = require("../controllers/tutoresController");

router.get("/", listarUsuarios);

// Buscar os pets de um tutor
// Deve ficar antes de /:id
router.get("/:id/pets", listarPetsDoTutor);

// Buscar um tutor pelo ID
router.get("/:id", buscarUsuario);

// Cadastrar tutor
router.post("/", criarUsuario);

// Excluir tutor
router.delete("/:id", excluirUsuario);

module.exports = router;