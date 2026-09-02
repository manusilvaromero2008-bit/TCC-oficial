const express = require("express");
const router = express.Router();

const {
    listarPets,
    buscarPet,
    criarPet,
    excluirPet
} = require("../controllers/petsController");

router.get("/", listarPets);
router.get("/:id", buscarPet);
router.post("/", criarPet);
router.delete("/:id", excluirPet);

module.exports = router;