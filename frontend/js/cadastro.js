const API_URL = "http://localhost:3000/api";

const formCadastro = document.getElementById("formCadastro");
const petsContainer = document.getElementById("pets");
const btnAdicionarPet = document.getElementById("adicionarPet");
const btnProsseguir = document.getElementById("btnProsseguir");

const nomeTutor = document.getElementById("nomeTutor");
const cpfTutor = document.getElementById("cpfTutor");
const telefoneTutor = document.getElementById("telefoneTutor");
const emailTutor = document.getElementById("emailTutor");
const enderecoTutor = document.getElementById("enderecoTutor");
const cepTutor = document.getElementById("cep");

let contadorPets = 0;
let tutorId = null;
let cepValidado = "";

const parametros = new URLSearchParams(window.location.search);
const tutorIdParametro = parametros.get("tutor_id");

if (tutorIdParametro) {
    const idNumerico = Number(tutorIdParametro);

    if (Number.isInteger(idNumerico) && idNumerico > 0) {
        tutorId = idNumerico;
    }
}

function formatarCPF(valor) {
    const numeros = String(valor || "")
        .replace(/\D/g, "")
        .slice(0, 11);

    if (numeros.length <= 3) {
        return numeros;
    }

    if (numeros.length <= 6) {
        return numeros.replace(/(\d{3})(\d+)/, "$1.$2");
    }

    if (numeros.length <= 9) {
        return numeros.replace(
            /(\d{3})(\d{3})(\d+)/,
            "$1.$2.$3"
        );
    }

    return numeros.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
    );
}

function formatarTelefone(valor) {
    const numeros = String(valor || "")
        .replace(/\D/g, "")
        .slice(0, 11);

    if (numeros.length <= 2) {
        return numeros;
    }

    if (numeros.length <= 6) {
        return numeros.replace(
            /(\d{2})(\d+)/,
            "($1) $2"
        );
    }

    if (numeros.length <= 10) {
        return numeros.replace(
            /(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );
    }

    return numeros.replace(
        /(\d{2})(\d{5})(\d{4})/,
        "($1) $2-$3"
    );
}

function formatarCEP(valor) {
    const numeros = String(valor || "")
        .replace(/\D/g, "")
        .slice(0, 8);

    if (numeros.length <= 5) {
        return numeros;
    }

    return numeros.replace(
        /(\d{5})(\d{1,3})/,
        "$1-$2"
    );
}

cpfTutor.addEventListener("input", () => {
    cpfTutor.value = formatarCPF(cpfTutor.value);
    cpfTutor.setCustomValidity("");
});

telefoneTutor.addEventListener("input", () => {
    telefoneTutor.value = formatarTelefone(
        telefoneTutor.value
    );
    telefoneTutor.setCustomValidity("");
});

cepTutor.addEventListener("input", () => {
    cepTutor.value = formatarCEP(cepTutor.value);
    cepTutor.setCustomValidity("");
    cepValidado = "";
});

nomeTutor.addEventListener("input", () => {
    nomeTutor.setCustomValidity("");
});

emailTutor.addEventListener("input", () => {
    emailTutor.setCustomValidity("");
});

enderecoTutor.addEventListener("input", () => {
    enderecoTutor.setCustomValidity("");
});

function validarCPF(valor) {
    const cpf = String(valor || "").replace(/\D/g, "");

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    if (resto !== Number(cpf[9])) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10) {
        resto = 0;
    }

    return resto === Number(cpf[10]);
}
function validarNome(valor) {
    const nome = String(valor || "").trim();

    if (nome.length < 3 || nome.length > 100) {
        return false;
    }

    return /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s'-]*$/.test(nome);
}

function validarTelefone(valor) {
    const telefone = String(valor || "").replace(/\D/g, "");

    if (
        telefone.length !== 10 &&
        telefone.length !== 11
    ) {
        return false;
    }

    const ddd = Number(
        telefone.substring(0, 2)
    );

    if (ddd < 11 || ddd > 99) {
        return false;
    }

    if (/^(\d)\1+$/.test(telefone)) {
        return false;
    }

    if (
        telefone.length === 11 &&
        telefone[2] !== "9"
    ) {
        return false;
    }

    const numero = telefone.substring(2);

    if (/^(\d)\1+$/.test(numero)) {
        return false;
    }

    return true;
}

function validarEmail(valor) {
    const email = String(valor || "")
        .trim()
        .toLowerCase();

    if (email.length < 6 || email.length > 100) {
        return false;
    }

    if (/\s/.test(email)) {
        return false;
    }

    const partes = email.split("@");

    if (partes.length !== 2) {
        return false;
    }

    const usuario = partes[0];
    const dominio = partes[1];

    if (!usuario || !dominio) {
        return false;
    }

    if (
        usuario.length < 2 ||
        dominio.length < 4
    ) {
        return false;
    }

    if (
        usuario.startsWith(".") ||
        usuario.endsWith(".")
    ) {
        return false;
    }

    if (
        usuario.includes("..") ||
        dominio.includes("..")
    ) {
        return false;
    }

    if (
        !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(
            usuario
        )
    ) {
        return false;
    }

    if (
        !/^[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
            dominio
        )
    ) {
        return false;
    }

    if (
        dominio.startsWith(".") ||
        dominio.endsWith(".")
    ) {
        return false;
    }

    return true;
}

function validarEndereco(valor) {
    const endereco = String(valor || "")
        .trim()
        .replace(/\s+/g, " ");

    if (
        endereco.length < 8 ||
        endereco.length > 255
    ) {
        return false;
    }

    if (!/[A-Za-zÀ-ÿ]/.test(endereco)) {
        return false;
    }

    const partes = endereco.split(",");

    if (partes.length < 2) {
        return false;
    }

    const logradouro = partes[0].trim();

    if (logradouro.length < 3) {
        return false;
    }

    const possuiNumero =
        /\b\d+[A-Za-z]?\b/.test(endereco);

    if (!possuiNumero) {
        return false;
    }

    return true;
}

async function consultarCEP() {
    const cep = cepTutor.value.replace(/\D/g, "");

    if (cep.length === 0) {
        cepTutor.setCustomValidity("");
        cepValidado = "";
        return true;
    }

    if (cep.length !== 8) {
        cepTutor.setCustomValidity(
            "Digite um CEP com 8 números."
        );
        cepValidado = "";
        return false;
    }

    if (cep === cepValidado) {
        cepTutor.setCustomValidity("");
        return true;
    }

    try {
        cepTutor.setCustomValidity(
            "Consultando CEP..."
        );

        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            cepTutor.setCustomValidity(
                "Não foi possível consultar esse CEP."
            );
            cepValidado = "";
            return false;
        }

        const dados = await resposta.json();

        if (dados.erro) {
            cepTutor.setCustomValidity(
                "Esse CEP não existe."
            );
            cepValidado = "";
            return false;
        }

        cepValidado = cep;
        cepTutor.setCustomValidity("");

        return true;

    } catch (erro) {
        console.error(
            "Erro ao consultar CEP:",
            erro
        );

        cepTutor.setCustomValidity(
            "Não foi possível verificar o CEP. Verifique sua conexão."
        );

        cepValidado = "";

        return false;
    }
}

cepTutor.addEventListener(
    "blur",
    async () => {
        if (cepTutor.value.trim() !== "") {
            const valido = await consultarCEP();

            if (!valido) {
                cepTutor.reportValidity();
            }
        }
    }
);

function adicionarEventosCampo(campo) {
    campo.addEventListener(
        "input",
        () => {
            campo.setCustomValidity("");
        }
    );

    campo.addEventListener(
        "change",
        () => {
            campo.setCustomValidity("");
        }
    );
}
function criarPet(dados = null) {
    contadorPets++;

    const pet = document.createElement("div");

    pet.className = "pet";

    pet.innerHTML = `
        <h3>Pet ${contadorPets}</h3>

        <div class="grid">

            <div class="campo">
                <label>Nome do Pet *</label>
                <input
                    type="text"
                    class="nomePet"
                    placeholder="Nome do pet"
                    maxlength="100"
                    required>
            </div>

            <div class="campo">
                <label>Espécie *</label>
                <select
                    class="especiePet"
                    required>
                    <option value="">
                        Selecione
                    </option>
                    <option value="Cão">
                        Cão
                    </option>
                    <option value="Gato">
                        Gato
                    </option>
                    <option value="Ave">
                        Ave
                    </option>
                    <option value="Roedor">
                        Roedor
                    </option>
                    <option value="Outro">
                        Outro
                    </option>
                </select>
            </div>

            <div class="campo">
                <label>Raça *</label>
                <input
                    type="text"
                    class="racaPet"
                    placeholder="Raça do pet"
                    maxlength="100"
                    required>
            </div>

            <div class="campo">
                <label>Idade *</label>
                <input
                    type="text"
                    class="idadePet"
                    placeholder="Ex: 2 anos"
                    maxlength="30"
                    required>
            </div>

            <div class="campo">
                <label>Sexo *</label>
                <select
                    class="sexoPet"
                    required>
                    <option value="">
                        Selecione
                    </option>
                    <option value="Macho">
                        Macho
                    </option>
                    <option value="Fêmea">
                        Fêmea
                    </option>
                </select>
            </div>

            <div class="campo">
                <label>Peso *</label>
                <input
                    type="text"
                    class="pesoPet"
                    placeholder="Ex: 5 kg"
                    maxlength="30"
                    required>
            </div>

        </div>
    `;

    petsContainer.appendChild(pet);

    const campos = pet.querySelectorAll(
        "input, select"
    );

    campos.forEach(campo => {
        adicionarEventosCampo(campo);
    });

    if (dados) {
        pet.querySelector(
            ".nomePet"
        ).value = dados.nome || "";

        pet.querySelector(
            ".especiePet"
        ).value = dados.especie || "";

        pet.querySelector(
            ".racaPet"
        ).value = dados.raca || "";

        pet.querySelector(
            ".idadePet"
        ).value = dados.idade || "";

        pet.querySelector(
            ".sexoPet"
        ).value = dados.sexo || "";

        pet.querySelector(
            ".pesoPet"
        ).value = dados.peso || "";

        if (dados.id) {
            pet.dataset.id = dados.id;
        }
    }
}

btnAdicionarPet.addEventListener(
    "click",
    () => {
        criarPet();
    }
);

function obterDadosTutor() {
    return {
        nome: nomeTutor.value.trim(),
        cpf: cpfTutor.value.trim(),
        telefone: telefoneTutor.value.trim(),
        email: emailTutor.value.trim(),
        endereco: enderecoTutor.value.trim(),
        cep: cepTutor.value.trim()
    };
}

function obterPets() {
    const pets = [];

    document.querySelectorAll(".pet").forEach(
        pet => {
            pets.push({
                id: pet.dataset.id || null,
                nome: pet.querySelector(
                    ".nomePet"
                ).value.trim(),
                especie: pet.querySelector(
                    ".especiePet"
                ).value,
                raca: pet.querySelector(
                    ".racaPet"
                ).value.trim(),
                idade: pet.querySelector(
                    ".idadePet"
                ).value.trim(),
                sexo: pet.querySelector(
                    ".sexoPet"
                ).value,
                peso: pet.querySelector(
                    ".pesoPet"
                ).value.trim()
            });
        }
    );

    return pets;
}

function validarDadosTutor() {
    if (!nomeTutor.value.trim()) {
        nomeTutor.setCustomValidity(
            "Digite seu nome completo."
        );
        nomeTutor.reportValidity();
        return false;
    }

    if (!validarNome(nomeTutor.value)) {
        nomeTutor.setCustomValidity(
            "Digite um nome válido."
        );
        nomeTutor.reportValidity();
        return false;
    }

    nomeTutor.setCustomValidity("");

    if (!validarCPF(cpfTutor.value)) {
        cpfTutor.setCustomValidity(
            "Digite um CPF válido."
        );
        cpfTutor.reportValidity();
        return false;
    }

    cpfTutor.setCustomValidity("");

    if (!validarTelefone(telefoneTutor.value)) {
        telefoneTutor.setCustomValidity(
            "Digite um telefone válido com DDD."
        );
        telefoneTutor.reportValidity();
        return false;
    }

    telefoneTutor.setCustomValidity("");

    if (!validarEmail(emailTutor.value)) {
        emailTutor.setCustomValidity(
            "Digite um e-mail válido, como nome@gmail.com."
        );
        emailTutor.reportValidity();
        return false;
    }

    emailTutor.setCustomValidity("");

    if (!validarEndereco(enderecoTutor.value)) {
        enderecoTutor.setCustomValidity(
            "Digite um endereço completo, por exemplo: Rua das Flores, 123, Centro."
        );
        enderecoTutor.reportValidity();
        return false;
    }

    enderecoTutor.setCustomValidity("");

    return true;
}

function validarPets(pets) {
    if (pets.length === 0) {
        alert("Adicione pelo menos um pet.");
        return false;
    }

    const elementosPet =
        document.querySelectorAll(".pet");

    for (let i = 0; i < pets.length; i++) {
        const dados = pets[i];
        const elemento = elementosPet[i];

        const campoNome =
            elemento.querySelector(".nomePet");

        const campoEspecie =
            elemento.querySelector(".especiePet");

        const campoRaca =
            elemento.querySelector(".racaPet");

        const campoIdade =
            elemento.querySelector(".idadePet");

        const campoSexo =
            elemento.querySelector(".sexoPet");

        const campoPeso =
            elemento.querySelector(".pesoPet");

        if (dados.nome.length < 2) {
            campoNome.setCustomValidity(
                "Digite o nome do pet."
            );
            campoNome.reportValidity();
            return false;
        }

        campoNome.setCustomValidity("");

        if (!dados.especie) {
            campoEspecie.setCustomValidity(
                "Selecione a espécie."
            );
            campoEspecie.reportValidity();
            return false;
        }

        campoEspecie.setCustomValidity("");

        if (dados.raca.length < 2) {
            campoRaca.setCustomValidity(
                "Digite a raça do pet."
            );
            campoRaca.reportValidity();
            return false;
        }

        campoRaca.setCustomValidity("");

        if (
            !/^\d{1,2}(?:\s+(?:anos?|meses?))?$/i.test(
                dados.idade
            )
        ) {
            campoIdade.setCustomValidity(
                "Digite a idade, por exemplo: 2 anos ou 6 meses."
            );
            campoIdade.reportValidity();
            return false;
        }

        campoIdade.setCustomValidity("");

        if (!dados.sexo) {
            campoSexo.setCustomValidity(
                "Selecione o sexo."
            );
            campoSexo.reportValidity();
            return false;
        }

        campoSexo.setCustomValidity("");

        const peso = dados.peso
            .replace(",", ".")
            .replace(/[^\d.]/g, "");

        if (!peso || Number(peso) <= 0) {
            campoPeso.setCustomValidity(
                "Digite um peso válido."
            );
            campoPeso.reportValidity();
            return false;
        }

        campoPeso.setCustomValidity("");
    }

    return true;
}
async function cadastrarTutor(dados) {
    const resposta = await fetch(
        `${API_URL}/tutores`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.erro ||
            resultado.message ||
            "Não foi possível cadastrar o tutor."
        );
    }

    return resultado;
}

async function atualizarTutor(dados) {
    const resposta = await fetch(
        `${API_URL}/tutores/${tutorId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.erro ||
            resultado.message ||
            "Não foi possível atualizar o tutor."
        );
    }

    return resultado;
}

async function cadastrarPet(pet) {
    const resposta = await fetch(
        `${API_URL}/pets`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tutor_id: Number(tutorId),
                nome: pet.nome,
                especie: pet.especie,
                raca: pet.raca,
                idade: pet.idade,
                sexo: pet.sexo,
                peso: pet.peso
            })
        }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.erro ||
            resultado.message ||
            "Não foi possível cadastrar o pet."
        );
    }

    return resultado;
}

async function atualizarPet(pet) {
    const resposta = await fetch(
        `${API_URL}/pets/${pet.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tutor_id: Number(tutorId),
                nome: pet.nome,
                especie: pet.especie,
                raca: pet.raca,
                idade: pet.idade,
                sexo: pet.sexo,
                peso: pet.peso
            })
        }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(
            resultado.erro ||
            resultado.message ||
            "Não foi possível atualizar o pet."
        );
    }

    return resultado;
}

async function verificarTutorExistente() {
    if (!tutorId) {
        return false;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/tutores/${tutorId}`
        );

        if (!resposta.ok) {
            tutorId = null;
            return false;
        }

        return true;

    } catch (erro) {
        console.error(
            "Erro ao verificar tutor:",
            erro
        );

        tutorId = null;
        return false;
    }
}

async function carregarTutor() {
    if (!tutorId) {
        criarPet();
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/tutores/${tutorId}`
        );

        if (!resposta.ok) {
            tutorId = null;
            criarPet();
            return;
        }

        const tutor = await resposta.json();

        nomeTutor.value = tutor.nome || "";

        cpfTutor.value = formatarCPF(
            tutor.cpf || ""
        );

        telefoneTutor.value =
            formatarTelefone(
                tutor.telefone || ""
            );

        emailTutor.value =
            tutor.email || "";

        enderecoTutor.value =
            tutor.endereco || "";

        cepTutor.value =
            formatarCEP(tutor.cep || "");

        cepValidado =
            tutor.cep
                ? String(tutor.cep)
                    .replace(/\D/g, "")
                : "";

        await carregarPets();

    } catch (erro) {
        console.error(
            "Erro ao carregar tutor:",
            erro
        );

        tutorId = null;

        petsContainer.innerHTML = "";

        contadorPets = 0;

        criarPet();
    }
}

async function carregarPets() {
    if (!tutorId) {
        criarPet();
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/tutores/${tutorId}/pets`
        );

        if (!resposta.ok) {
            throw new Error(
                "Não foi possível carregar os pets."
            );
        }

        const pets = await resposta.json();

        petsContainer.innerHTML = "";

        contadorPets = 0;

        if (
            !Array.isArray(pets) ||
            pets.length === 0
        ) {
            criarPet();
            return;
        }

        pets.forEach(pet => {
            criarPet(pet);
        });

    } catch (erro) {
        console.error(
            "Erro ao carregar pets:",
            erro
        );

        petsContainer.innerHTML = "";

        contadorPets = 0;

        criarPet();
    }
}
formCadastro.addEventListener(
    "submit",
    async (evento) => {
        evento.preventDefault();

        const cepValido = await consultarCEP();

        if (!cepValido) {
            cepTutor.reportValidity();
            return;
        }

        if (!validarDadosTutor()) {
            return;
        }

        if (!formCadastro.checkValidity()) {
            formCadastro.reportValidity();
            return;
        }

        const pets = obterPets();

        if (!validarPets(pets)) {
            return;
        }

        const textoOriginal =
            btnProsseguir.innerHTML;

        btnProsseguir.disabled = true;

        btnProsseguir.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            Salvando...
        `;

        try {
            const dadosTutor =
                obterDadosTutor();

            const tutorExiste =
                await verificarTutorExistente();

            if (!tutorExiste) {
                const resultadoTutor =
                    await cadastrarTutor(
                        dadosTutor
                    );

                tutorId =
                    resultadoTutor.id ||
                    resultadoTutor.tutor_id ||
                    resultadoTutor.tutorId ||
                    resultadoTutor.insertId;

                if (!tutorId) {
                    throw new Error(
                        "O cadastro foi realizado, mas o ID do tutor não foi retornado pelo servidor."
                    );
                }
            } else {
                await atualizarTutor(
                    dadosTutor
                );
            }

            for (const pet of pets) {
                if (pet.id) {
                    await atualizarPet(pet);
                } else {
                    await cadastrarPet(pet);
                }
            }

            localStorage.setItem(
                "tutor_id",
                String(tutorId)
            );

            alert(
                "Cadastro realizado com sucesso!"
            );

            window.location.href =
                `perfil.html?tutor_id=${tutorId}`;

        } catch (erro) {
            console.error(
                "Erro ao salvar cadastro:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível salvar o cadastro. Tente novamente."
            );

        } finally {
            btnProsseguir.disabled = false;

            btnProsseguir.innerHTML =
                textoOriginal;
        }
    }
);

carregarTutor();