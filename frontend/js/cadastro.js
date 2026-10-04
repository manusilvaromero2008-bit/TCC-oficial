const API_URL = "http://localhost:3000/api";

const params = new URLSearchParams(window.location.search);

let tutorId =
    params.get("tutor_id") ||
    sessionStorage.getItem("agendaPetTutorId") ||
    sessionStorage.getItem("tutor_id");

const returnUrl = params.get("returnUrl");

if (tutorId) {
    sessionStorage.setItem(
        "agendaPetTutorId",
        String(tutorId)
    );

    sessionStorage.setItem(
        "tutor_id",
        String(tutorId)
    );
}

const formCadastro =
    document.getElementById("formCadastro");

const petsContainer =
    document.getElementById("pets");

const btnAdicionarPet =
    document.getElementById("adicionarPet");

const btnProsseguir =
    document.getElementById("btnProsseguir");

const btnVoltarCadastro =
    document.getElementById("btnVoltarCadastro");

let contadorPets = 0;

function normalizarTexto(valor) {
    return String(valor || "").trim();
}

function escaparHTML(valor) {
    return String(valor || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatarCPF(valor) {
    valor = valor
        .replace(/\D/g, "")
        .slice(0, 11);

    if (valor.length > 9) {
        return valor.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
        );
    }

    if (valor.length > 6) {
        return valor.replace(
            /(\d{3})(\d{3})(\d{1,3})/,
            "$1.$2.$3"
        );
    }

    if (valor.length > 3) {
        return valor.replace(
            /(\d{3})(\d{1,3})/,
            "$1.$2"
        );
    }

    return valor;
}

function formatarTelefone(valor) {
    valor = valor
        .replace(/\D/g, "")
        .slice(0, 11);

    if (valor.length > 10) {
        return valor.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );
    }

    if (valor.length > 6) {
        return valor.replace(
            /(\d{2})(\d{4})(\d{1,4})/,
            "($1) $2-$3"
        );
    }

    if (valor.length > 2) {
        return valor.replace(
            /(\d{2})(\d{1,5})/,
            "($1) $2"
        );
    }

    return valor;
}

function formatarCEP(valor) {
    valor = valor
        .replace(/\D/g, "")
        .slice(0, 8);

    if (valor.length > 5) {
        return valor.replace(
            /(\d{5})(\d{1,3})/,
            "$1-$2"
        );
    }

    return valor;
}

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

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

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarTelefone(telefone) {
    const numero = telefone.replace(/\D/g, "");

    return (
        numero.length === 10 ||
        numero.length === 11
    );
}

function validarCEP(cep) {
    const numero = cep.replace(/\D/g, "");

    return numero.length === 8;
}

async function validarCEPViaCEP(cep) {
    const numero = cep.replace(/\D/g, "");

    if (numero.length !== 8) {
        return true;
    }

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${numero}/json/`
        );

        if (!resposta.ok) {
            return false;
        }

        const dados = await resposta.json();

        return !dados.erro;
    } catch (erro) {
        console.error(
            "Erro ao consultar CEP:",
            erro
        );

        return true;
    }
}

function voltarParaOrigem() {
    if (returnUrl) {
        const origem = new URL(
            returnUrl,
            window.location.href
        );

        if (tutorId) {
            origem.searchParams.set(
                "tutor_id",
                String(tutorId)
            );
        }

        window.location.href = origem.href;
        return;
    }

    const home = new URL(
        "../pages/home.html",
        window.location.href
    );

    if (tutorId) {
        home.searchParams.set(
            "tutor_id",
            String(tutorId)
        );
    }

    window.location.href = home.href;
}

function adicionarPet(dados = {}) {
    contadorPets++;

    const pet = document.createElement("div");

    pet.className = "pet-card";

    pet.dataset.petId = dados.id || "";

    pet.innerHTML = `
        <div class="pet-header">

            <h3>
                <i class="fa-solid fa-paw"></i>
                Pet ${contadorPets}
            </h3>

            <button
                type="button"
                class="btn-remover-pet"
                title="Remover pet"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        <div class="grid">

            <div class="campo">

                <label>
                    Nome do pet *
                </label>

                <input
                    type="text"
                    class="nome-pet"
                    placeholder="Digite o nome do pet"
                    value="${escaparHTML(dados.nome || "")}"
                    required
                >

            </div>

            <div class="campo">

                <label>
                    Espécie *
                </label>

                <select
                    class="especie-pet"
                    required
                >

                    <option value="">
                        Selecione
                    </option>

                    <option
                        value="Cachorro"
                        ${dados.especie === "Cachorro" ? "selected" : ""}
                    >
                        Cachorro
                    </option>

                    <option
                        value="Gato"
                        ${dados.especie === "Gato" ? "selected" : ""}
                    >
                        Gato
                    </option>

                    <option
                        value="Outro"
                        ${dados.especie === "Outro" ? "selected" : ""}
                    >
                        Outro
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Raça *
                </label>

                <input
                    type="text"
                    class="raca-pet"
                    placeholder="Digite a raça"
                    value="${escaparHTML(dados.raca || "")}"
                    required
                >

            </div>

            <div class="campo">

                <label>
                    Idade *
                </label>

                <input
                    type="text"
                    class="idade-pet"
                    placeholder="Ex.: 2 anos ou 6 meses"
                    value="${escaparHTML(dados.idade ?? "")}"
                    required
                >

            </div>

            <div class="campo">

                <label>
                    Data de nascimento
                </label>

                <input
                    type="date"
                    class="data-nascimento-pet"
                    value="${
                        dados.data_nascimento
                            ? String(
                                dados.data_nascimento
                            ).slice(0, 10)
                            : ""
                    }"
                >

            </div>

            <div class="campo">

                <label>
                    Sexo *
                </label>

                <select
                    class="sexo-pet"
                    required
                >

                    <option value="">
                        Selecione
                    </option>

                    <option
                        value="Macho"
                        ${dados.sexo === "Macho" ? "selected" : ""}
                    >
                        Macho
                    </option>

                    <option
                        value="Fêmea"
                        ${dados.sexo === "Fêmea" ? "selected" : ""}
                    >
                        Fêmea
                    </option>

                </select>

            </div>

            <div class="campo">

                <label>
                    Peso (kg) *
                </label>

                <input
                    type="number"
                    class="peso-pet"
                    min="0"
                    step="0.1"
                    placeholder="Ex.: 5.2"
                    value="${dados.peso ?? ""}"
                    required
                >

            </div>

            <div class="campo">

                <label>
                    Possui carteira de vacinação?
                </label>

                <select class="carteira-pet">

                    <option
                        value="nao"
                        ${
                            !dados.tem_carteira_vacinacao
                                ? "selected"
                                : ""
                        }
                    >
                        Não
                    </option>

                    <option
                        value="sim"
                        ${
                            dados.tem_carteira_vacinacao
                                ? "selected"
                                : ""
                        }
                    >
                        Sim
                    </option>

                </select>

            </div>

            <div
                class="campo campo-arquivo-carteira"
                style="display: ${
                    dados.tem_carteira_vacinacao
                        ? "block"
                        : "none"
                };"
            >

                <label>
                    Carteira de vacinação
                </label>

                <input
                    type="file"
                    class="arquivo-carteira-pet"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                >

                <small>
                    Opcional. PDF, JPG, JPEG, PNG ou WEBP até 5 MB.
                </small>

            </div>

        </div>
    `;

    petsContainer.appendChild(pet);

    const btnRemover =
        pet.querySelector(
            ".btn-remover-pet"
        );

    btnRemover.addEventListener(
        "click",
        () => {
            pet.remove();
            atualizarNumeracaoPets();
        }
    );

    const selectCarteira =
        pet.querySelector(
            ".carteira-pet"
        );

    const campoArquivo =
        pet.querySelector(
            ".campo-arquivo-carteira"
        );

    const arquivo =
        pet.querySelector(
            ".arquivo-carteira-pet"
        );

    selectCarteira.addEventListener(
        "change",
        () => {
            if (
                selectCarteira.value ===
                "sim"
            ) {
                campoArquivo.style.display =
                    "block";
            } else {
                campoArquivo.style.display =
                    "none";

                arquivo.value = "";
            }
        }
    );

    arquivo.addEventListener(
        "change",
        () => {
            const arquivoSelecionado =
                arquivo.files[0];

            if (!arquivoSelecionado) {
                return;
            }

            const tamanhoMaximo =
                5 * 1024 * 1024;

            if (
                arquivoSelecionado.size >
                tamanhoMaximo
            ) {
                alert(
                    "O arquivo da carteira de vacinação deve ter no máximo 5 MB."
                );

                arquivo.value = "";
            }
        }
    );
}

function atualizarNumeracaoPets() {
    const pets =
        petsContainer.querySelectorAll(
            ".pet-card"
        );

    pets.forEach(
        (pet, index) => {
            const titulo =
                pet.querySelector(
                    ".pet-header h3"
                );

            if (titulo) {
                titulo.innerHTML = `
                    <i class="fa-solid fa-paw"></i>
                    Pet ${index + 1}
                `;
            }
        }
    );
}

async function arquivoParaBase64(arquivo) {
    if (!arquivo) {
        return null;
    }

    return new Promise(
        (resolve, reject) => {
            const leitor =
                new FileReader();

            leitor.onload = () => {
                resolve(
                    leitor.result
                );
            };

            leitor.onerror = () => {
                reject(
                    new Error(
                        "Não foi possível ler o arquivo."
                    )
                );
            };

            leitor.readAsDataURL(
                arquivo
            );
        }
    );
}

async function obterPets() {
    const cards =
        petsContainer.querySelectorAll(
            ".pet-card"
        );

    const pets = [];

    for (const card of cards) {
        const nome =
            normalizarTexto(
                card.querySelector(
                    ".nome-pet"
                )?.value
            );

        const especie =
            card.querySelector(
                ".especie-pet"
            )?.value || "";

        const raca =
            normalizarTexto(
                card.querySelector(
                    ".raca-pet"
                )?.value
            );

        const idade =
            normalizarTexto(
                card.querySelector(
                    ".idade-pet"
                )?.value
            );

        const dataNascimento =
            card.querySelector(
                ".data-nascimento-pet"
            )?.value || null;

        const sexo =
            card.querySelector(
                ".sexo-pet"
            )?.value || "";

        const peso =
            card.querySelector(
                ".peso-pet"
            )?.value || null;

        const possuiCarteira =
            card.querySelector(
                ".carteira-pet"
            )?.value === "sim";

        const arquivo =
            card.querySelector(
                ".arquivo-carteira-pet"
            )?.files?.[0] || null;

        let carteiraBase64 = null;

        if (
            possuiCarteira &&
            arquivo
        ) {
            carteiraBase64 =
                await arquivoParaBase64(
                    arquivo
                );
        }

        pets.push({
            id:
                card.dataset.petId ||
                null,

            nome,

            especie,

            raca,

            idade,

            data_nascimento:
                dataNascimento,

            sexo,

            peso:
                peso === ""
                    ? null
                    : Number(peso),

            tem_carteira_vacinacao:
                possuiCarteira,

            carteira_vacinacao:
                carteiraBase64
        });
    }

    return pets;
}

function validarPets(pets) {
    if (pets.length === 0) {
        alert(
            "Adicione pelo menos um pet."
        );

        return false;
    }

    const regexIdade =
        /^\d+(?:[.,]\d+)?\s+(meses?|anos?)$/i;

    for (const pet of pets) {
        if (!pet.nome) {
            alert(
                "Informe o nome de todos os pets."
            );

            return false;
        }

        if (!pet.especie) {
            alert(
                "Selecione a espécie de todos os pets."
            );

            return false;
        }

        if (!pet.raca) {
            alert(
                "Informe a raça de todos os pets."
            );

            return false;
        }

        if (
            !pet.idade ||
            !regexIdade.test(
                pet.idade
            )
        ) {
            alert(
                "Informe a idade corretamente, por exemplo: 6 meses ou 2 anos."
            );

            return false;
        }

        if (!pet.sexo) {
            alert(
                "Selecione o sexo de todos os pets."
            );

            return false;
        }

        if (
            pet.peso === null ||
            Number.isNaN(pet.peso) ||
            pet.peso <= 0
        ) {
            alert(
                "Informe um peso válido para todos os pets."
            );

            return false;
        }
    }

    return true;
}

async function cadastrarTutor(dados) {
    const url = tutorId
        ? `${API_URL}/tutores/${tutorId}`
        : `${API_URL}/tutores`;

    const metodo =
        tutorId
            ? "PUT"
            : "POST";

    const resposta =
        await fetch(
            url,
            {
                method: metodo,

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        dados
                    )
            }
        );

    let resultado = {};

    try {
        resultado =
            await resposta.json();
    } catch (erro) {
        resultado = {};
    }

    if (!resposta.ok) {
        const erro =
            new Error(
                resultado.mensagem ||
                resultado.message ||
                `Erro HTTP ${resposta.status}`
            );

        erro.status =
            resposta.status;

        throw erro;
    }

    return resultado;
}

async function cadastrarPet(pet) {
    const dados = {
        tutor_id:
            Number(tutorId),

        nome:
            pet.nome,

        especie:
            pet.especie,

        raca:
            pet.raca || null,

        idade:
            String(
                pet.idade
            ).trim(),

        data_nascimento:
            pet.data_nascimento ||
            null,

        sexo:
            pet.sexo,

        peso:
            pet.peso,

        tem_carteira_vacinacao:
            pet.tem_carteira_vacinacao,

        carteira_vacinacao:
            pet.carteira_vacinacao
    };

    const resposta =
        await fetch(
            `${API_URL}/pets`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        dados
                    )
            }
        );

    let resultado = {};

    try {
        resultado =
            await resposta.json();
    } catch (erro) {
        resultado = {};
    }

    if (!resposta.ok) {
        throw new Error(
            resultado.mensagem ||
            resultado.message ||
            `Erro HTTP ${resposta.status}`
        );
    }

    return resultado;
}

async function atualizarPet(pet) {
    const dados = {
        tutor_id:
            Number(tutorId),

        nome:
            pet.nome,

        especie:
            pet.especie,

        raca:
            pet.raca || null,

        idade:
            String(
                pet.idade
            ).trim(),

        data_nascimento:
            pet.data_nascimento ||
            null,

        sexo:
            pet.sexo,

        peso:
            pet.peso,

        tem_carteira_vacinacao:
            pet.tem_carteira_vacinacao,

        carteira_vacinacao:
            pet.carteira_vacinacao
    };

    const resposta =
        await fetch(
            `${API_URL}/pets/${pet.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        dados
                    )
            }
        );

    let resultado = {};

    try {
        resultado =
            await resposta.json();
    } catch (erro) {
        resultado = {};
    }

    if (!resposta.ok) {
        throw new Error(
            resultado.mensagem ||
            resultado.message ||
            `Erro HTTP ${resposta.status}`
        );
    }

    return resultado;
}

async function carregarTutor() {
    if (!tutorId) {
        adicionarPet();
        return;
    }

    try {
        const respostaTutor =
            await fetch(
                `${API_URL}/tutores/${tutorId}`
            );

        if (!respostaTutor.ok) {
            throw new Error(
                "Não foi possível carregar o tutor."
            );
        }

        const dadosTutor =
            await respostaTutor.json();

        const tutor =
            dadosTutor.tutor ||
            dadosTutor;

        tutorId =
            tutor.id ||
            tutorId;

        sessionStorage.setItem(
            "agendaPetTutorId",
            String(tutorId)
        );

        sessionStorage.setItem(
            "tutor_id",
            String(tutorId)
        );

        const campoNome =
            document.getElementById(
                "nomeTutor"
            );

        const campoCpf =
            document.getElementById(
                "cpfTutor"
            );

        const campoTelefone =
            document.getElementById(
                "telefoneTutor"
            );

        const campoEmail =
            document.getElementById(
                "emailTutor"
            );

        const campoEndereco =
            document.getElementById(
                "enderecoTutor"
            );

        const campoCep =
            document.getElementById(
                "cep"
            );

        if (campoNome) {
            campoNome.value =
                tutor.nome || "";
        }

        if (campoCpf) {
            campoCpf.value =
                tutor.cpf || "";
        }

        if (campoTelefone) {
            campoTelefone.value =
                tutor.telefone || "";
        }

        if (campoEmail) {
            campoEmail.value =
                tutor.email || "";
        }

        if (campoEndereco) {
            campoEndereco.value =
                tutor.endereco || "";
        }

        if (campoCep) {
            campoCep.value =
                tutor.cep || "";
        }

        const respostaPets =
            await fetch(
                `${API_URL}/tutores/${tutorId}/pets`
            );

        if (!respostaPets.ok) {
            throw new Error(
                "Não foi possível carregar os pets."
            );
        }

        const pets =
            await respostaPets.json();

        petsContainer.innerHTML = "";

        contadorPets = 0;

        if (
            Array.isArray(pets) &&
            pets.length > 0
        ) {
            pets.forEach(
                (pet) => {
                    adicionarPet(pet);
                }
            );
        } else {
            adicionarPet();
        }

    } catch (erro) {
        console.error(
            "Erro ao carregar cadastro:",
            erro
        );

        alert(
            "Não foi possível carregar os dados do cadastro."
        );
    }
}

if (btnAdicionarPet) {
    btnAdicionarPet.addEventListener(
        "click",
        () => {
            adicionarPet();
        }
    );
}

if (btnVoltarCadastro) {
    btnVoltarCadastro.addEventListener(
        "click",
        (event) => {
            event.preventDefault();
            voltarParaOrigem();
        }
    );
}

const cpfInput =
    document.getElementById(
        "cpfTutor"
    );

if (cpfInput) {
    cpfInput.addEventListener(
        "input",
        () => {
            cpfInput.value =
                formatarCPF(
                    cpfInput.value
                );
        }
    );
}

const telefoneInput =
    document.getElementById(
        "telefoneTutor"
    );

if (telefoneInput) {
    telefoneInput.addEventListener(
        "input",
        () => {
            telefoneInput.value =
                formatarTelefone(
                    telefoneInput.value
                );
        }
    );
}

const cepInput =
    document.getElementById(
        "cep"
    );

if (cepInput) {
    cepInput.addEventListener(
        "input",
        () => {
            cepInput.value =
                formatarCEP(
                    cepInput.value
                );
        }
    );
}

if (formCadastro) {
    formCadastro.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            if (btnProsseguir) {
                btnProsseguir.disabled =
                    true;
            }

            try {
                const nome =
                    normalizarTexto(
                        document.getElementById(
                            "nomeTutor"
                        ).value
                    );

                const cpf =
                    normalizarTexto(
                        document.getElementById(
                            "cpfTutor"
                        ).value
                    );

                const telefone =
                    normalizarTexto(
                        document.getElementById(
                            "telefoneTutor"
                        ).value
                    );

                const email =
                    normalizarTexto(
                        document.getElementById(
                            "emailTutor"
                        ).value
                    );

                const endereco =
                    normalizarTexto(
                        document.getElementById(
                            "enderecoTutor"
                        ).value
                    );

                const cep =
                    normalizarTexto(
                        document.getElementById(
                            "cep"
                        ).value
                    );

                if (!nome) {
                    alert(
                        "Informe seu nome completo."
                    );

                    return;
                }

                if (!validarCPF(cpf)) {
                    alert(
                        "Informe um CPF válido."
                    );

                    return;
                }

                if (!validarTelefone(telefone)) {
                    alert(
                        "Informe um telefone válido."
                    );

                    return;
                }

                if (!validarEmail(email)) {
                    alert(
                        "Informe um e-mail válido."
                    );

                    return;
                }

                if (!endereco) {
                    alert(
                        "Informe seu endereço."
                    );

                    return;
                }

                if (
                    cep &&
                    !validarCEP(cep)
                ) {
                    alert(
                        "Informe um CEP válido."
                    );

                    return;
                }

                if (cep) {
                    const cepValido =
                        await validarCEPViaCEP(
                            cep
                        );

                    if (!cepValido) {
                        alert(
                            "O CEP informado não foi encontrado."
                        );

                        return;
                    }
                }

                const pets =
                    await obterPets();

                if (
                    !validarPets(
                        pets
                    )
                ) {
                    return;
                }

                const dadosTutor = {
                    nome,
                    cpf,
                    telefone,
                    email,
                    endereco,
                    cep:
                        cep || null
                };

                const resultadoTutor =
                    await cadastrarTutor(
                        dadosTutor
                    );

                if (!tutorId) {
                    tutorId =
                        resultadoTutor.id ||
                        resultadoTutor.tutor_id ||
                        resultadoTutor.tutorId ||
                        resultadoTutor.insertId ||
                        resultadoTutor.tutor?.id;
                }

                if (!tutorId) {
                    throw new Error(
                        "O servidor não retornou o ID do tutor."
                    );
                }

                tutorId =
                    Number(tutorId);

                sessionStorage.setItem(
                    "agendaPetTutorId",
                    String(tutorId)
                );

                sessionStorage.setItem(
                    "tutor_id",
                    String(tutorId)
                );

                for (const pet of pets) {
                    if (pet.id) {
                        await atualizarPet(
                            pet
                        );
                    } else {
                        await cadastrarPet(
                            pet
                        );
                    }
                }

                alert(
                    "Cadastro realizado com sucesso!"
                );

                if (returnUrl) {
                    const origem =
                        new URL(
                            returnUrl,
                            window.location.href
                        );

                    origem.searchParams.set(
                        "tutor_id",
                        String(tutorId)
                    );

                    origem.searchParams.delete(
                        "returnUrl"
                    );

                    window.location.href =
                        origem.href;

                } else {
                    window.location.href =
                        `perfil.html?tutor_id=${encodeURIComponent(
                            tutorId
                        )}`;
                }

            } catch (erro) {
                console.error(
                    "Erro ao salvar cadastro:",
                    erro
                );

                if (
                    erro.status === 409
                ) {
                    alert(
                        erro.message ||
                        "Já existe um cadastro com esses dados."
                    );
                } else {
                    alert(
                        erro.message ||
                        "Não foi possível salvar o cadastro."
                    );
                }

            } finally {
                if (btnProsseguir) {
                    btnProsseguir.disabled =
                        false;
                }
            }
        }
    );
}

if (tutorId) {
    carregarTutor();
} else {
    adicionarPet();
}