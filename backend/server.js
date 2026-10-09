const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const conexao = require("./config/database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

app.get("/", (req, res) => {
    res.json({
        mensagem: "API Agenda Pet funcionando!"
    });
});

app.get("/api/status", async (req, res) => {
    try {
        await conexao.execute("SELECT 1");

        res.json({
            servidor: "online",
            banco: "conectado"
        });
    } catch (erro) {
        console.error("Erro no banco:", erro);

        res.status(500).json({
            servidor: "online",
            banco: "erro",
            erro: erro.message
        });
    }
});

function validarNome(nome) {
    return (
        typeof nome === "string" &&
        /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]*$/.test(nome.trim())
    );
}

function validarCPF(cpf) {
    if (!cpf) {
        return false;
    }

    const cpfLimpo = String(cpf).replace(/\D/g, "");

    return cpfLimpo.length === 11;
}

function validarSenha(senha) {
    return typeof senha === "string" &&
        senha.length >= 8 &&
        /[A-Z]/.test(senha) &&
        /[a-z]/.test(senha) &&
        /\d/.test(senha) &&
        /[^A-Za-z0-9]/.test(senha);
}

function validarEmail(email) {
    return (
        typeof email === "string" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    );
}

function validarTelefone(telefone) {
    if (!telefone) {
        return false;
    }

    const numero = String(telefone).replace(/\D/g, "");

    return numero.length >= 10 && numero.length <= 11;
}

function validarCEP(cep) {
    if (!cep) {
        return true;
    }

    const numero = String(cep).replace(/\D/g, "");

    return numero.length === 8;
}

function validarId(id) {
    return /^\d+$/.test(String(id));
}

function validarData(data) {
    if (!data) {
        return false;
    }

    return /^\d{4}-\d{2}-\d{2}$/.test(String(data));
}

function validarHorario(horario) {
    if (!horario) {
        return false;
    }

    return /^\d{2}:\d{2}(:\d{2})?$/.test(String(horario));
}

/* ==================== TUTORES ==================== */

app.get("/api/tutores", async (req, res) => {
    try {
        const [tutores] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                foto,
                created_at,
                updated_at
            FROM tutores
            ORDER BY nome ASC
        `);

        res.json(tutores);
    } catch (erro) {
        console.error("Erro ao buscar tutores:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar tutores.",
            erro: erro.message
        });
    }
});

app.post("/api/tutores/login", async (req, res) => {
    try {
        const cpf = String(req.body.cpf || "").replace(/\D/g, "");
        const senha = req.body.senha;

        if (cpf.length !== 11 || typeof senha !== "string" || !senha) {
            return res.status(400).json({ mensagem: "Informe CPF e senha." });
        }

        const [tutores] = await conexao.execute(`
            SELECT id, nome, cpf, telefone, email, endereco, cep, foto, senha_hash
            FROM tutores
            WHERE cpf = ?
            LIMIT 1
        `, [cpf]);

        if (!tutores.length) {
            return res.status(401).json({ mensagem: "CPF ou senha incorretos." });
        }

        const tutor = tutores[0];

        if (!tutor.senha_hash) {
            return res.status(409).json({
                mensagem: "Este cadastro é antigo e ainda não possui senha. Para preservar seus dados, peça ao responsável pelo sistema para ativar o acesso."
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, tutor.senha_hash);

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "CPF ou senha incorretos." });
        }

        delete tutor.senha_hash;
        res.json({ mensagem: "Login realizado com sucesso.", tutor });
    } catch (erro) {
        console.error("Erro no login do tutor:", erro);
        res.status(500).json({ mensagem: "Não foi possível entrar agora." });
    }
});

app.get("/api/tutores/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do tutor inválido."
            });
        }

        const [tutores] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                foto,
                created_at,
                updated_at
            FROM tutores
            WHERE id = ?
        `, [id]);

        if (tutores.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        res.json(tutores[0]);
    } catch (erro) {
        console.error("Erro ao buscar tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar tutor.",
            erro: erro.message
        });
    }
});

app.post("/api/tutores", async (req, res) => {
    try {
        const {
            nome,
            cpf,
            telefone,
            email,
            endereco,
            cep,
            foto,
            senha
        } = req.body;

        if (
            !nome ||
            !cpf ||
            !telefone ||
            !email ||
            !endereco
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        if (!validarSenha(senha)) {
            return res.status(400).json({
                mensagem: "A senha precisa ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
            });
        }

        if (!validarNome(nome)) {
            return res.status(400).json({
                mensagem: "Nome inválido."
            });
        }

        if (!validarCPF(cpf)) {
            return res.status(400).json({
                mensagem: "CPF inválido."
            });
        }

        if (!validarTelefone(telefone)) {
            return res.status(400).json({
                mensagem: "Telefone inválido."
            });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({
                mensagem: "E-mail inválido."
            });
        }

        if (!validarCEP(cep)) {
            return res.status(400).json({
                mensagem: "CEP inválido."
            });
        }

        if (
            foto !== undefined &&
            foto !== null &&
            foto !== "" &&
            typeof foto !== "string"
        ) {
            return res.status(400).json({
                mensagem: "Foto do tutor inválida."
            });
        }

        const cpfLimpo = String(cpf).replace(/\D/g, "");
        const telefoneLimpo = String(telefone).replace(/\D/g, "");

        const cepLimpo = cep
            ? String(cep).replace(/\D/g, "")
            : null;

        const [cpfExistente] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE cpf = ?
            LIMIT 1
        `, [cpfLimpo]);

        if (cpfExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este CPF já está cadastrado."
            });
        }

        const [emailExistente] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE email = ?
            LIMIT 1
        `, [email.trim()]);

        if (emailExistente.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 12);

        const [resultado] = await conexao.execute(`
            INSERT INTO tutores
            (
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                foto,
                senha_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            nome.trim(),
            cpfLimpo,
            telefoneLimpo,
            email.trim(),
            endereco.trim(),
            cepLimpo,
            foto || null,
            senhaHash
        ]);

        const [novoTutor] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                foto,
                created_at,
                updated_at
            FROM tutores
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json({
            mensagem: "Tutor cadastrado com sucesso.",
            id: resultado.insertId,
            tutor: novoTutor[0]
        });
    } catch (erro) {
        console.error("Erro ao cadastrar tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar tutor.",
            erro: erro.message
        });
    }
});

app.put("/api/tutores/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do tutor inválido."
            });
        }

        const [tutorExiste] = await conexao.execute(`
            SELECT *
            FROM tutores
            WHERE id = ?
        `, [id]);

        if (tutorExiste.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const tutorAtual = tutorExiste[0];

        const nome =
            req.body.nome !== undefined
                ? req.body.nome
                : tutorAtual.nome;

        const cpf =
            req.body.cpf !== undefined
                ? req.body.cpf
                : tutorAtual.cpf;

        const telefone =
            req.body.telefone !== undefined
                ? req.body.telefone
                : tutorAtual.telefone;

        const email =
            req.body.email !== undefined
                ? req.body.email
                : tutorAtual.email;

        const endereco =
            req.body.endereco !== undefined
                ? req.body.endereco
                : tutorAtual.endereco;

        const cep =
            req.body.cep !== undefined
                ? req.body.cep
                : tutorAtual.cep;

        const foto =
            req.body.foto !== undefined
                ? req.body.foto
                : tutorAtual.foto;

        if (
            !nome ||
            !cpf ||
            !telefone ||
            !email ||
            !endereco
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        if (!validarNome(nome)) {
            return res.status(400).json({
                mensagem: "Nome inválido."
            });
        }

        if (!validarCPF(cpf)) {
            return res.status(400).json({
                mensagem: "CPF inválido."
            });
        }

        if (!validarTelefone(telefone)) {
            return res.status(400).json({
                mensagem: "Telefone inválido."
            });
        }

        if (!validarEmail(email)) {
            return res.status(400).json({
                mensagem: "E-mail inválido."
            });
        }

        if (!validarCEP(cep)) {
            return res.status(400).json({
                mensagem: "CEP inválido."
            });
        }

        const cpfLimpo = String(cpf).replace(/\D/g, "");
        const telefoneLimpo = String(telefone).replace(/\D/g, "");

        const cepLimpo = cep
            ? String(cep).replace(/\D/g, "")
            : null;

        const [cpfDuplicado] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE cpf = ?
            AND id <> ?
            LIMIT 1
        `, [cpfLimpo, id]);

        if (cpfDuplicado.length > 0) {
            return res.status(409).json({
                mensagem: "Este CPF já pertence a outro tutor."
            });
        }

        const [emailDuplicado] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE email = ?
            AND id <> ?
            LIMIT 1
        `, [email.trim(), id]);

        if (emailDuplicado.length > 0) {
            return res.status(409).json({
                mensagem: "Este e-mail já pertence a outro tutor."
            });
        }

        await conexao.execute(`
            UPDATE tutores
            SET
                nome = ?,
                cpf = ?,
                telefone = ?,
                email = ?,
                endereco = ?,
                cep = ?,
                foto = ?
            WHERE id = ?
        `, [
            nome.trim(),
            cpfLimpo,
            telefoneLimpo,
            email.trim(),
            endereco.trim(),
            cepLimpo,
            foto || null,
            id
        ]);

        const [tutorAtualizado] = await conexao.execute(`
            SELECT
                id,
                nome,
                cpf,
                telefone,
                email,
                endereco,
                cep,
                foto,
                created_at,
                updated_at
            FROM tutores
            WHERE id = ?
        `, [id]);

        res.json({
            mensagem: "Tutor atualizado com sucesso.",
            tutor: tutorAtualizado[0]
        });
    } catch (erro) {
        console.error("Erro ao atualizar tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar tutor.",
            erro: erro.message
        });
    }
});

/* ==================== PETS ==================== */

app.get("/api/pets", async (req, res) => {
    try {
        const [pets] = await conexao.execute(`
            SELECT
                p.*,
                t.nome AS tutor_nome
            FROM pets p
            INNER JOIN tutores t
                ON t.id = p.tutor_id
            ORDER BY p.nome ASC
        `);

        res.json(pets);
    } catch (erro) {
        console.error("Erro ao buscar pets:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pets.",
            erro: erro.message
        });
    }
});

app.get("/api/tutores/:id/pets", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do tutor inválido."
            });
        }

        const [pets] = await conexao.execute(`
            SELECT
                id,
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                data_nascimento,
                sexo,
                peso,
                foto,
                tem_carteira_vacinacao,
                carteira_vacinacao,
                created_at,
                updated_at
            FROM pets
            WHERE tutor_id = ?
            ORDER BY nome ASC
        `, [id]);

        res.json(pets);
    } catch (erro) {
        console.error("Erro ao buscar pets do tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pets.",
            erro: erro.message
        });
    }
});

app.get("/api/pets/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do pet inválido."
            });
        }

        const [pets] = await conexao.execute(`
            SELECT
                p.*,
                t.nome AS tutor_nome
            FROM pets p
            INNER JOIN tutores t
                ON t.id = p.tutor_id
            WHERE p.id = ?
        `, [id]);

        if (pets.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado."
            });
        }

        res.json(pets[0]);
    } catch (erro) {
        console.error("Erro ao buscar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar pet.",
            erro: erro.message
        });
    }
});

app.post("/api/pets", async (req, res) => {
    try {
        const {
            tutor_id,
            nome,
            especie,
            raca,
            idade,
            data_nascimento,
            sexo,
            peso,
            foto,
            tem_carteira_vacinacao,
            carteira_vacinacao
        } = req.body;

        if (
            tutor_id === undefined ||
            tutor_id === null ||
            tutor_id === "" ||
            !nome ||
            !especie ||
            !raca ||
            idade === undefined ||
            idade === null ||
            idade === "" ||
            !sexo ||
            peso === undefined ||
            peso === null ||
            peso === ""
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios do pet."
            });
        }

        if (!validarId(tutor_id)) {
            return res.status(400).json({
                mensagem: "ID do tutor inválido."
            });
        }

        const [tutor] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE id = ?
        `, [tutor_id]);

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        if (sexo !== "Macho" && sexo !== "Fêmea") {
            return res.status(400).json({
                mensagem: "Sexo do pet inválido."
            });
        }

        if (data_nascimento && !validarData(data_nascimento)) {
            return res.status(400).json({
                mensagem: "Data de nascimento inválida."
            });
        }

        const possuiCarteira =
            tem_carteira_vacinacao === true ||
            tem_carteira_vacinacao === 1 ||
            tem_carteira_vacinacao === "true" ||
            tem_carteira_vacinacao === "1" ||
            tem_carteira_vacinacao === "sim" ||
            tem_carteira_vacinacao === "Sim";

        const carteiraFinal = possuiCarteira
            ? carteira_vacinacao || null
            : null;

        const dataNascimentoFinal =
            data_nascimento &&
            String(data_nascimento).trim() !== ""
                ? String(data_nascimento).trim()
                : null;

        const [resultado] = await conexao.execute(`
            INSERT INTO pets
            (
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                data_nascimento,
                sexo,
                peso,
                foto,
                tem_carteira_vacinacao,
                carteira_vacinacao
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            tutor_id,
            String(nome).trim(),
            String(especie).trim(),
            String(raca).trim(),
            String(idade).trim(),
            dataNascimentoFinal,
            sexo,
            String(peso).trim(),
            foto || null,
            possuiCarteira ? 1 : 0,
            carteiraFinal
        ]);

        const [novoPet] = await conexao.execute(`
            SELECT
                id,
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                data_nascimento,
                sexo,
                peso,
                foto,
                tem_carteira_vacinacao,
                carteira_vacinacao,
                created_at,
                updated_at
            FROM pets
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json({
            mensagem: "Pet cadastrado com sucesso.",
            id: resultado.insertId,
            pet: novoPet[0]
        });
    } catch (erro) {
        console.error("Erro ao cadastrar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar pet.",
            erro: erro.message
        });
    }
});

app.put("/api/pets/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do pet inválido."
            });
        }

        const [petExiste] = await conexao.execute(`
            SELECT *
            FROM pets
            WHERE id = ?
        `, [id]);

        if (petExiste.length === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado."
            });
        }

        const petAtual = petExiste[0];

        const nome =
            req.body.nome !== undefined
                ? req.body.nome
                : petAtual.nome;

        const especie =
            req.body.especie !== undefined
                ? req.body.especie
                : petAtual.especie;

        const raca =
            req.body.raca !== undefined
                ? req.body.raca
                : petAtual.raca;

        const idade =
            req.body.idade !== undefined
                ? req.body.idade
                : petAtual.idade;

        const data_nascimento =
            req.body.data_nascimento !== undefined
                ? req.body.data_nascimento
                : petAtual.data_nascimento;

        const sexo =
            req.body.sexo !== undefined
                ? req.body.sexo
                : petAtual.sexo;

        const peso =
            req.body.peso !== undefined
                ? req.body.peso
                : petAtual.peso;

        const foto =
            req.body.foto !== undefined
                ? req.body.foto
                : petAtual.foto;

        const tem_carteira_vacinacao =
            req.body.tem_carteira_vacinacao !== undefined
                ? req.body.tem_carteira_vacinacao
                : petAtual.tem_carteira_vacinacao;

        const carteira_vacinacao =
            req.body.carteira_vacinacao !== undefined
                ? req.body.carteira_vacinacao
                : petAtual.carteira_vacinacao;

        if (
            !nome ||
            !especie ||
            !raca ||
            idade === undefined ||
            idade === null ||
            idade === "" ||
            !sexo ||
            peso === undefined ||
            peso === null ||
            peso === ""
        ) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios do pet."
            });
        }

        if (sexo !== "Macho" && sexo !== "Fêmea") {
            return res.status(400).json({
                mensagem: "Sexo do pet inválido."
            });
        }

        if (
            data_nascimento &&
            !validarData(data_nascimento)
        ) {
            return res.status(400).json({
                mensagem: "Data de nascimento inválida."
            });
        }

        const possuiCarteira =
            tem_carteira_vacinacao === true ||
            tem_carteira_vacinacao === 1 ||
            tem_carteira_vacinacao === "true" ||
            tem_carteira_vacinacao === "1" ||
            tem_carteira_vacinacao === "sim" ||
            tem_carteira_vacinacao === "Sim";

        const carteiraFinal = possuiCarteira
            ? carteira_vacinacao || null
            : null;

        const dataNascimentoFinal =
            data_nascimento &&
            String(data_nascimento).trim() !== ""
                ? String(data_nascimento).trim()
                : null;

        await conexao.execute(`
            UPDATE pets
            SET
                nome = ?,
                especie = ?,
                raca = ?,
                idade = ?,
                data_nascimento = ?,
                sexo = ?,
                peso = ?,
                foto = ?,
                tem_carteira_vacinacao = ?,
                carteira_vacinacao = ?
            WHERE id = ?
        `, [
            String(nome).trim(),
            String(especie).trim(),
            String(raca).trim(),
            String(idade).trim(),
            dataNascimentoFinal,
            sexo,
            String(peso).trim(),
            foto || null,
            possuiCarteira ? 1 : 0,
            carteiraFinal,
            id
        ]);

        const [petAtualizado] = await conexao.execute(`
            SELECT
                id,
                tutor_id,
                nome,
                especie,
                raca,
                idade,
                data_nascimento,
                sexo,
                peso,
                foto,
                tem_carteira_vacinacao,
                carteira_vacinacao,
                created_at,
                updated_at
            FROM pets
            WHERE id = ?
        `, [id]);

        res.json({
            mensagem: "Pet atualizado com sucesso.",
            pet: petAtualizado[0]
        });
    } catch (erro) {
        console.error("Erro ao atualizar pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao atualizar pet.",
            erro: erro.message
        });
    }
});

app.delete("/api/pets/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do pet inválido."
            });
        }

        const [resultado] = await conexao.execute(`
            DELETE FROM pets
            WHERE id = ?
        `, [id]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Pet não encontrado."
            });
        }

        res.json({
            mensagem: "Pet excluído com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao excluir pet:", erro);

        res.status(500).json({
            mensagem: "Erro ao excluir pet.",
            erro: erro.message
        });
    }
});

/* ==================== CLÍNICAS ==================== */

app.get("/api/clinicas", async (req, res) => {
    try {
        const [clinicas] = await conexao.execute(`
            SELECT *
            FROM clinicas
            ORDER BY nome ASC
        `);

        res.json(clinicas);
    } catch (erro) {
        console.error("Erro ao buscar clínicas:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar clínicas.",
            erro: erro.message
        });
    }
});

app.get("/api/clinicas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID da clínica inválido."
            });
        }

        const [clinicas] = await conexao.execute(`
            SELECT *
            FROM clinicas
            WHERE id = ?
        `, [id]);

        if (clinicas.length === 0) {
            return res.status(404).json({
                mensagem: "Clínica não encontrada."
            });
        }

        res.json(clinicas[0]);
    } catch (erro) {
        console.error("Erro ao buscar clínica:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar clínica.",
            erro: erro.message
        });
    }
});

/* ==================== VETERINÁRIOS ==================== */

app.get("/api/clinicas/:id/veterinarios", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID da clínica inválido."
            });
        }

        const [veterinarios] = await conexao.execute(`
            SELECT
                id,
                clinica_id,
                nome,
                especialidade,
                telefone,
                email,
                disponivel
            FROM veterinarios
            WHERE clinica_id = ?
            ORDER BY nome ASC
        `, [id]);

        res.json(veterinarios);
    } catch (erro) {
        console.error("Erro ao buscar veterinários:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar veterinários.",
            erro: erro.message
        });
    }
});

/* ==================== SERVIÇOS ==================== */

app.get("/api/clinicas/:id/servicos", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID da clínica inválido."
            });
        }

        const [servicos] = await conexao.execute(`
            SELECT
                s.id,
                s.clinica_id,
                s.veterinario_id,
                s.nome,
                s.tipo,
                s.descricao,
                s.preco,
                s.duracao_minutos,
                s.ativo,
                v.nome AS veterinario_nome
            FROM servicos s
            LEFT JOIN veterinarios v
                ON v.id = s.veterinario_id
            WHERE s.clinica_id = ?
            AND s.ativo = TRUE
            ORDER BY s.nome ASC
        `, [id]);

        res.json(servicos);
    } catch (erro) {
        console.error("Erro ao buscar serviços:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar serviços.",
            erro: erro.message
        });
    }
});

/* ==================== AGENDAMENTOS ==================== */

app.get("/api/tutores/:id/agendamentos", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do tutor inválido."
            });
        }

        const [agendamentos] = await conexao.execute(`
            SELECT
                a.id,
                a.tutor_id,
                a.pet_id,
                a.clinica_id,
                a.veterinario_id,
                a.servico_id,
                a.data_agendamento,
                a.horario,
                a.status,
                a.observacoes,
                c.nome AS clinica,
                p.nome AS pet,
                s.nome AS servico,
                v.nome AS veterinario
            FROM agendamentos a
            INNER JOIN clinicas c
                ON c.id = a.clinica_id
            INNER JOIN pets p
                ON p.id = a.pet_id
            INNER JOIN servicos s
                ON s.id = a.servico_id
            LEFT JOIN veterinarios v
                ON v.id = a.veterinario_id
            WHERE a.tutor_id = ?
            ORDER BY
                a.data_agendamento ASC,
                a.horario ASC
        `, [id]);

        res.json(agendamentos);
    } catch (erro) {
        console.error("Erro ao buscar agendamentos do tutor:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar agendamentos.",
            erro: erro.message
        });
    }
});

app.get("/api/agendamentos/disponibilidade", async (req, res) => {
    try {
        const {
            clinica_id,
            data
        } = req.query;

        if (!clinica_id || !data) {
            return res.status(400).json({
                mensagem: "Clínica e data são obrigatórios."
            });
        }

        if (!validarId(clinica_id)) {
            return res.status(400).json({
                mensagem: "ID da clínica inválido."
            });
        }

        if (!validarData(data)) {
            return res.status(400).json({
                mensagem: "Data inválida."
            });
        }

        const [agendamentos] = await conexao.execute(`
            SELECT
                id,
                clinica_id,
                data_agendamento,
                horario,
                status
            FROM agendamentos
            WHERE clinica_id = ?
            AND data_agendamento = ?
            AND status IN ('Agendado', 'Confirmado')
            ORDER BY horario ASC
        `, [
            clinica_id,
            data
        ]);

        res.json({
            data,
            horarios_ocupados: agendamentos
        });
    } catch (erro) {
        console.error("Erro ao verificar disponibilidade:", erro);

        res.status(500).json({
            mensagem: "Erro ao verificar disponibilidade.",
            erro: erro.message
        });
    }
});

app.get("/api/agendamentos", async (req, res) => {
    try {
        const {
            tutor_id,
            clinica_id,
            data
        } = req.query;

        let sql = `
            SELECT
                a.id,
                a.tutor_id,
                a.pet_id,
                a.clinica_id,
                a.veterinario_id,
                a.servico_id,
                a.data_agendamento,
                a.horario,
                a.status,
                a.observacoes,
                t.nome AS tutor,
                p.nome AS pet,
                c.nome AS clinica,
                v.nome AS veterinario,
                s.nome AS servico
            FROM agendamentos a
            INNER JOIN tutores t
                ON t.id = a.tutor_id
            INNER JOIN pets p
                ON p.id = a.pet_id
            INNER JOIN clinicas c
                ON c.id = a.clinica_id
            LEFT JOIN veterinarios v
                ON v.id = a.veterinario_id
            INNER JOIN servicos s
                ON s.id = a.servico_id
        `;

        const filtros = [];
        const valores = [];

        if (tutor_id) {
            filtros.push("a.tutor_id = ?");
            valores.push(tutor_id);
        }

        if (clinica_id) {
            filtros.push("a.clinica_id = ?");
            valores.push(clinica_id);
        }

        if (data) {
            filtros.push("a.data_agendamento = ?");
            valores.push(data);
        }

        if (filtros.length > 0) {
            sql += " WHERE " + filtros.join(" AND ");
        }

        sql += `
            ORDER BY
                a.data_agendamento ASC,
                a.horario ASC
        `;

        const [agendamentos] = await conexao.execute(
            sql,
            valores
        );

        res.json(agendamentos);
    } catch (erro) {
        console.error("Erro ao buscar agendamentos:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar agendamentos.",
            erro: erro.message
        });
    }
});

app.get("/api/agendamentos/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do agendamento inválido."
            });
        }

        const [agendamentos] = await conexao.execute(`
            SELECT
                a.id,
                a.tutor_id,
                a.pet_id,
                a.clinica_id,
                a.veterinario_id,
                a.servico_id,
                a.data_agendamento,
                a.horario,
                a.status,
                a.observacoes,
                a.created_at,
                a.updated_at,
                t.nome AS tutor,
                p.nome AS pet,
                c.nome AS clinica,
                v.nome AS veterinario,
                s.nome AS servico,
                tr.id AS transporte_id,
                tr.endereco_coleta AS transporte_endereco,
                tr.data_coleta AS transporte_data,
                tr.horario_coleta AS transporte_horario,
                tr.status AS transporte_status
            FROM agendamentos a
            INNER JOIN tutores t
                ON t.id = a.tutor_id
            INNER JOIN pets p
                ON p.id = a.pet_id
            INNER JOIN clinicas c
                ON c.id = a.clinica_id
            LEFT JOIN veterinarios v
                ON v.id = a.veterinario_id
            INNER JOIN servicos s
                ON s.id = a.servico_id
            LEFT JOIN transportes tr
                ON tr.agendamento_id = a.id
            WHERE a.id = ?
        `, [id]);

        if (agendamentos.length === 0) {
            return res.status(404).json({
                mensagem: "Agendamento não encontrado."
            });
        }

        const agendamento = agendamentos[0];

        agendamento.transporte_solicitado =
            agendamento.transporte_id !== null;

        res.json(agendamento);
    } catch (erro) {
        console.error("Erro ao buscar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar agendamento.",
            erro: erro.message
        });
    }
});

app.post("/api/agendamentos", async (req, res) => {
    try {
        const {
            tutor_id,
            pet_id,
            clinica_id,
            veterinario_id,
            servico_id,
            data_agendamento,
            horario,
            observacoes
        } = req.body;

        if (
            !tutor_id ||
            !pet_id ||
            !clinica_id ||
            !servico_id ||
            !data_agendamento ||
            !horario
        ) {
            return res.status(400).json({
                mensagem:
                    "Tutor, pet, clínica, serviço, data e horário são obrigatórios."
            });
        }

        if (
            !validarId(tutor_id) ||
            !validarId(pet_id) ||
            !validarId(clinica_id) ||
            !validarId(servico_id)
        ) {
            return res.status(400).json({
                mensagem: "Um dos IDs informados é inválido."
            });
        }

        if (
            veterinario_id !== null &&
            veterinario_id !== undefined &&
            veterinario_id !== "" &&
            !validarId(veterinario_id)
        ) {
            return res.status(400).json({
                mensagem: "ID do veterinário inválido."
            });
        }

        if (!validarData(data_agendamento)) {
            return res.status(400).json({
                mensagem: "Data do agendamento inválida."
            });
        }

        if (!validarHorario(horario)) {
            return res.status(400).json({
                mensagem: "Horário do agendamento inválido."
            });
        }

        const horarioBanco =
            String(horario).length === 5
                ? `${horario}:00`
                : horario;

        const [tutor] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE id = ?
        `, [tutor_id]);

        if (tutor.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado."
            });
        }

        const [pet] = await conexao.execute(`
            SELECT id
            FROM pets
            WHERE id = ?
            AND tutor_id = ?
        `, [
            pet_id,
            tutor_id
        ]);

        if (pet.length === 0) {
            return res.status(404).json({
                mensagem:
                    "Pet não encontrado ou não pertence a este tutor."
            });
        }

        const [clinica] = await conexao.execute(`
            SELECT id
            FROM clinicas
            WHERE id = ?
        `, [clinica_id]);

        if (clinica.length === 0) {
            return res.status(404).json({
                mensagem: "Clínica não encontrada."
            });
        }

        const [servico] = await conexao.execute(`
            SELECT
                id,
                clinica_id,
                veterinario_id,
                ativo
            FROM servicos
            WHERE id = ?
        `, [servico_id]);

        if (servico.length === 0) {
            return res.status(404).json({
                mensagem: "Serviço não encontrado."
            });
        }

        if (
            Number(servico[0].clinica_id) !==
            Number(clinica_id)
        ) {
            return res.status(400).json({
                mensagem:
                    "O serviço selecionado não pertence a esta clínica."
            });
        }

        if (!servico[0].ativo) {
            return res.status(400).json({
                mensagem:
                    "Este serviço não está disponível."
            });
        }

        let veterinarioFinal =
            veterinario_id || null;

        if (
            veterinarioFinal === null &&
            servico[0].veterinario_id
        ) {
            veterinarioFinal =
                servico[0].veterinario_id;
        }

        if (veterinarioFinal !== null) {
            const [veterinario] =
                await conexao.execute(`
                    SELECT
                        id,
                        clinica_id,
                        disponivel
                    FROM veterinarios
                    WHERE id = ?
                `, [veterinarioFinal]);

            if (veterinario.length === 0) {
                return res.status(404).json({
                    mensagem:
                        "Veterinário não encontrado."
                });
            }

            if (
                Number(veterinario[0].clinica_id) !==
                Number(clinica_id)
            ) {
                return res.status(400).json({
                    mensagem:
                        "O veterinário não pertence a esta clínica."
                });
            }

            if (!veterinario[0].disponivel) {
                return res.status(400).json({
                    mensagem:
                        "Este veterinário não está disponível."
                });
            }
        }

        const [horarioExistente] =
            await conexao.execute(`
                SELECT id
                FROM agendamentos
                WHERE clinica_id = ?
                AND data_agendamento = ?
                AND horario = ?
                AND status IN ('Agendado', 'Confirmado')
                LIMIT 1
            `, [
                clinica_id,
                data_agendamento,
                horarioBanco
            ]);

        if (horarioExistente.length > 0) {
            return res.status(409).json({
                mensagem:
                    "Este horário já está ocupado."
            });
        }

        const [resultado] =
            await conexao.execute(`
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
            `, [
                tutor_id,
                pet_id,
                clinica_id,
                veterinarioFinal,
                servico_id,
                data_agendamento,
                horarioBanco,
                observacoes || null
            ]);

        const [agendamento] =
            await conexao.execute(`
                SELECT
                    a.id,
                    a.tutor_id,
                    a.pet_id,
                    a.clinica_id,
                    a.veterinario_id,
                    a.servico_id,
                    a.data_agendamento,
                    a.horario,
                    a.status,
                    a.observacoes,
                    t.nome AS tutor,
                    p.nome AS pet,
                    c.nome AS clinica,
                    v.nome AS veterinario,
                    s.nome AS servico
                FROM agendamentos a
                INNER JOIN tutores t
                    ON t.id = a.tutor_id
                INNER JOIN pets p
                    ON p.id = a.pet_id
                INNER JOIN clinicas c
                    ON c.id = a.clinica_id
                LEFT JOIN veterinarios v
                    ON v.id = a.veterinario_id
                INNER JOIN servicos s
                    ON s.id = a.servico_id
                WHERE a.id = ?
            `, [resultado.insertId]);

        res.status(201).json({
            mensagem:
                "Agendamento realizado com sucesso.",
            id: resultado.insertId,
            agendamento: agendamento[0]
        });
    } catch (erro) {
        console.error("Erro ao criar agendamento:", erro);

        res.status(500).json({
            mensagem: "Erro ao criar agendamento.",
            erro: erro.message
        });
    }
});

app.put("/api/agendamentos/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const statusPermitidos = [
            "Agendado",
            "Confirmado",
            "Cancelado",
            "Concluído"
        ];

        if (!validarId(id)) {
            return res.status(400).json({
                mensagem: "ID do agendamento inválido."
            });
        }

        if (!statusPermitidos.includes(status)) {
            return res.status(400).json({
                mensagem: "Status inválido."
            });
        }

        const [resultado] =
            await conexao.execute(`
                UPDATE agendamentos
                SET status = ?
                WHERE id = ?
            `, [
                status,
                id
            ]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensagem:
                    "Agendamento não encontrado."
            });
        }

        res.json({
            mensagem:
                "Status atualizado com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao alterar status:", erro);

        res.status(500).json({
            mensagem:
                "Erro ao alterar status.",
            erro: erro.message
        });
    }
});

/* ==================== TRANSPORTE ==================== */

app.get(
    "/api/agendamentos/:id/transporte",
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!validarId(id)) {
                return res.status(400).json({
                    mensagem:
                        "ID do agendamento inválido."
                });
            }

            const [transportes] =
                await conexao.execute(`
                    SELECT *
                    FROM transportes
                    WHERE agendamento_id = ?
                `, [id]);

            if (transportes.length === 0) {
                return res.status(404).json({
                    mensagem:
                        "Transporte não encontrado."
                });
            }

            res.json(transportes[0]);
        } catch (erro) {
            console.error("Erro ao buscar transporte:", erro);

            res.status(500).json({
                mensagem:
                    "Erro ao buscar transporte.",
                erro: erro.message
            });
        }
    }
);

app.post(
    "/api/agendamentos/:id/transporte",
    async (req, res) => {
        try {
            const { id } = req.params;

            const {
                endereco_coleta,
                data_coleta,
                horario_coleta
            } = req.body;

            if (!validarId(id)) {
                return res.status(400).json({
                    mensagem:
                        "ID do agendamento inválido."
                });
            }

            if (
                !endereco_coleta ||
                !data_coleta ||
                !horario_coleta
            ) {
                return res.status(400).json({
                    mensagem:
                        "Endereço, data e horário da coleta são obrigatórios."
                });
            }

            if (!validarData(data_coleta)) {
                return res.status(400).json({
                    mensagem:
                        "Data da coleta inválida."
                });
            }

            if (!validarHorario(horario_coleta)) {
                return res.status(400).json({
                    mensagem:
                        "Horário da coleta inválido."
                });
            }

            const horarioBanco =
                String(horario_coleta).length === 5
                    ? `${horario_coleta}:00`
                    : horario_coleta;

            const [agendamento] =
                await conexao.execute(`
                    SELECT id
                    FROM agendamentos
                    WHERE id = ?
                `, [id]);

            if (agendamento.length === 0) {
                return res.status(404).json({
                    mensagem:
                        "Agendamento não encontrado."
                });
            }

            const [existente] =
                await conexao.execute(`
                    SELECT id
                    FROM transportes
                    WHERE agendamento_id = ?
                `, [id]);

            if (existente.length > 0) {
                await conexao.execute(`
                    UPDATE transportes
                    SET
                        endereco_coleta = ?,
                        data_coleta = ?,
                        horario_coleta = ?
                    WHERE agendamento_id = ?
                `, [
                    endereco_coleta.trim(),
                    data_coleta,
                    horarioBanco,
                    id
                ]);
            } else {
                await conexao.execute(`
                    INSERT INTO transportes
                    (
                        agendamento_id,
                        endereco_coleta,
                        data_coleta,
                        horario_coleta
                    )
                    VALUES (?, ?, ?, ?)
                `, [
                    id,
                    endereco_coleta.trim(),
                    data_coleta,
                    horarioBanco
                ]);
            }

            const [transporte] =
                await conexao.execute(`
                    SELECT *
                    FROM transportes
                    WHERE agendamento_id = ?
                `, [id]);

            res.status(201).json({
                mensagem:
                    "Transporte solicitado com sucesso.",
                transporte: transporte[0]
            });
        } catch (erro) {
            console.error("Erro ao solicitar transporte:", erro);

            res.status(500).json({
                mensagem:
                    "Erro ao solicitar transporte.",
                erro: erro.message
            });
        }
    }
);

/* ==================== SOS ANIMAIS ==================== */


/* ==================== SOS ANIMAIS ==================== */

async function buscarAnimais(req, res) {
    try {
        const [animais] = await conexao.execute(`
            SELECT *
            FROM animais_perdidos
            ORDER BY id DESC
        `);

        res.json(animais);
    } catch (erro) {
        console.error("Erro ao buscar animais:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar animais."
        });
    }
}

app.get("/api/animais", buscarAnimais);
app.get("/api/animais-perdidos", buscarAnimais);

async function cadastrarAnimal(req, res) {
    try {
        const {
            tutor_id,
            nome,
            especie,
            raca,
            cor,
            data_perdido,
            data,
            bairro,
            local_perdido,
            local,
            descricao,
            contato,
            foto,
            status
        } = req.body;

        if (!validarId(tutor_id)) {
            return res.status(400).json({
                mensagem: "Não foi possível identificar o tutor."
            });
        }

        const tutorId = Number(tutor_id);
        const nomeFinal = typeof nome === "string" ? nome.trim() : "";
        const statusFinal = status === "encontrado" ? "encontrado" : "perdido";
        const especieFinal = String(especie || "").trim().toLowerCase();
        const dataFinal = data_perdido || data;
        const bairroFinal = String(bairro || "").trim();
        const localFinal = String(local_perdido || local || "").trim();
        const contatoFinal = String(contato || "").trim();

        if (status !== "perdido" && status !== "encontrado") {
            return res.status(400).json({
                mensagem: "Selecione uma situação válida para o animal."
            });
        }

        if (statusFinal === "perdido" && !nomeFinal) {
            return res.status(400).json({
                mensagem: "O nome é obrigatório para um animal perdido."
            });
        }

        if (!["cachorro", "gato", "outro"].includes(especieFinal)) {
            return res.status(400).json({
                mensagem: "Selecione uma espécie válida."
            });
        }

        if (!dataFinal || !validarData(dataFinal)) {
            return res.status(400).json({
                mensagem: "Informe uma data válida."
            });
        }

        if (!bairroFinal || !localFinal || !contatoFinal) {
            return res.status(400).json({
                mensagem: "Preencha o bairro, o local e o telefone para contato."
            });
        }

        if (
            foto !== undefined &&
            foto !== null &&
            foto !== "" &&
            (typeof foto !== "string" || foto.length > 7 * 1024 * 1024)
        ) {
            return res.status(400).json({
                mensagem: "A foto é inválida ou muito grande."
            });
        }

        const [tutores] = await conexao.execute(`
            SELECT id
            FROM tutores
            WHERE id = ?
        `, [tutorId]);

        if (tutores.length === 0) {
            return res.status(404).json({
                mensagem: "Tutor não encontrado. Entre novamente no sistema."
            });
        }

        const [resultado] = await conexao.execute(`
            INSERT INTO animais_perdidos
            (
                tutor_id,
                nome,
                especie,
                raca,
                cor,
                data_perdido,
                bairro,
                local_perdido,
                descricao,
                contato,
                foto,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            tutorId,
            nomeFinal || null,
            especieFinal,
            String(raca || "").trim() || null,
            String(cor || "").trim() || null,
            dataFinal,
            bairroFinal,
            localFinal,
            String(descricao || "").trim() || null,
            contatoFinal,
            foto || null,
            statusFinal
        ]);

        const [animais] = await conexao.execute(`
            SELECT *
            FROM animais_perdidos
            WHERE id = ?
        `, [resultado.insertId]);

        res.status(201).json({
            mensagem: "Animal cadastrado com sucesso.",
            id: resultado.insertId,
            animal: animais[0]
        });
    } catch (erro) {
        console.error("Erro ao cadastrar animal:", erro);

        res.status(500).json({
            mensagem: "Erro ao cadastrar animal. Verifique os dados e a estrutura da tabela."
        });
    }
}

app.post("/api/animais", cadastrarAnimal);
app.post("/api/animais-perdidos", cadastrarAnimal);

app.put("/api/animais/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { tutor_id, status } = req.body;

        if (!validarId(id) || !validarId(tutor_id)) {
            return res.status(400).json({
                mensagem: "ID do anúncio ou do tutor inválido."
            });
        }

        if (!["perdido", "encontrado"].includes(status)) {
            return res.status(400).json({
                mensagem: "Status inválido."
            });
        }

        const [animais] = await conexao.execute(`
            SELECT id, tutor_id, status
            FROM animais_perdidos
            WHERE id = ?
            LIMIT 1
        `, [id]);

        if (animais.length === 0) {
            return res.status(404).json({
                mensagem: "Anúncio não encontrado."
            });
        }

        if (
            animais[0].tutor_id === null ||
            Number(animais[0].tutor_id) !== Number(tutor_id)
        ) {
            return res.status(403).json({
                mensagem: "Somente o responsável pela publicação pode alterar o status."
            });
        }

        await conexao.execute(`
            UPDATE animais_perdidos
            SET status = ?
            WHERE id = ?
        `, [status, id]);

        res.json({
            mensagem: "Status atualizado com sucesso.",
            status
        });
    } catch (erro) {
        console.error("Erro ao alterar status do animal:", erro);

        res.status(500).json({
            mensagem: "Não foi possível alterar o status do anúncio."
        });
    }
});

async function excluirAnimal(req, res) {
    try {
        const { id } = req.params;
        const tutorId = req.query.tutor_id;

        if (!validarId(id) || !validarId(tutorId)) {
            return res.status(400).json({
                mensagem: "ID do anúncio ou do tutor inválido."
            });
        }

        const [animais] = await conexao.execute(`
            SELECT id, tutor_id
            FROM animais_perdidos
            WHERE id = ?
            LIMIT 1
        `, [id]);

        if (animais.length === 0) {
            return res.status(404).json({
                mensagem: "Anúncio não encontrado."
            });
        }

        if (
            animais[0].tutor_id === null ||
            Number(animais[0].tutor_id) !== Number(tutorId)
        ) {
            return res.status(403).json({
                mensagem: "Somente o responsável pela publicação pode remover o anúncio."
            });
        }

        await conexao.execute(`
            DELETE FROM animais_perdidos
            WHERE id = ?
        `, [id]);

        res.json({
            mensagem: "Anúncio removido com sucesso."
        });
    } catch (erro) {
        console.error("Erro ao remover animal:", erro);

        res.status(500).json({
            mensagem: "Não foi possível remover o anúncio."
        });
    }
}

app.delete("/api/animais/:id", excluirAnimal);
app.delete("/api/animais-perdidos/:id", excluirAnimal);


/* ==================== ERROS ==================== */

app.use((req, res) => {
    res.status(404).json({
        mensagem: "Rota não encontrada."
    });
});

app.use((erro, req, res, next) => {
    console.error("Erro interno:", erro);

    res.status(500).json({
        mensagem: "Erro interno do servidor.",
        erro: erro.message
    });
});

app.listen(PORT, () => {
    console.log(
        `Servidor Agenda Pet rodando em http://localhost:${PORT}`
    );
});