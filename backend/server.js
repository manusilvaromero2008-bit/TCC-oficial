const express = require("express");
const cors = require("cors");
require("dotenv").config();

const conexao = require("./config/database");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        mensagem: "Backend do Agenda Pet funcionando!"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    try {
        await conexao.query("SELECT 1");
        console.log("Banco de dados conectado com sucesso!");
    } catch (erro) {
        console.error("Erro ao conectar ao banco de dados:");
        console.error(erro.message);
    }
});