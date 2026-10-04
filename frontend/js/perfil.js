document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/api";

    const btnVoltar = document.getElementById("btnVoltar");
    const btnCadastrar = document.getElementById("btnCadastrar");

    const areaCadastro = document.getElementById("areaCadastro");
    const areaPerfil = document.getElementById("areaPerfil");

    const fotoPerfil = document.getElementById("fotoPerfil");
    const btnAlterarFoto = document.getElementById("btnAlterarFoto");
    const btnRemoverFoto = document.getElementById("btnRemoverFoto");
    const inputFotoPerfil = document.getElementById("inputFotoPerfil");

    const nomeTutor = document.getElementById("nomeTutor");
    const cpfTutor = document.getElementById("cpfTutor");
    const telefoneTutor = document.getElementById("telefoneTutor");
    const emailTutor = document.getElementById("emailTutor");
    const enderecoTutor = document.getElementById("enderecoTutor");
    const cepTutor = document.getElementById("cepTutor");

    const formulario = document.getElementById("formulario");
    const btnEditarPerfil = document.getElementById("btnEditarPerfil");
    const btnCancelarEdicao = document.getElementById("btnCancelarEdicao");

    const inputNome = document.getElementById("nome");
    const inputCpf = document.getElementById("cpf");
    const inputTelefone = document.getElementById("telefone");
    const inputEmail = document.getElementById("email");
    const inputEndereco = document.getElementById("endereco");
    const inputCep = document.getElementById("cep");

    const listaPets = document.getElementById("lista-pets");
    const adicionarPet = document.getElementById("adicionarPet");

    const modalPet = document.getElementById("modalPet");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const btnCancelarPet = document.getElementById("btnCancelarPet");
    const formPet = document.getElementById("formPet");
    const tituloModalPet = document.getElementById("tituloModalPet");

    const fotoPet = document.getElementById("fotoPet");
    const previewFotoPet = document.getElementById("previewFotoPet");

    const nomePet = document.getElementById("nomePet");
    const especiePet = document.getElementById("especiePet");
    const racaPet = document.getElementById("racaPet");
    const idadePet = document.getElementById("idadePet");
    const unidadeIdadePet = document.getElementById("unidadeIdadePet");
    const dataNascimentoPet = document.getElementById("dataNascimentoPet");
    const sexoPet = document.getElementById("sexoPet");
    const pesoPet = document.getElementById("pesoPet");

    const carteiraPet = document.getElementById("carteiraPet");
    const campoArquivoCarteira = document.getElementById("campoArquivoCarteira");
    const carteiraArquivoPet = document.getElementById("carteiraArquivoPet");
    const nomeCarteiraArquivo = document.getElementById("nomeCarteiraArquivo");
    const btnVisualizarCarteiraPet = document.getElementById("btnVisualizarCarteiraPet");

    const mensagem = document.getElementById("mensagem");

    let tutorId = null;
    let petEditando = null;
    let petsAtuais = [];

    let fotoTutorBase64 = null;
    let fotoPetBase64 = null;
    let carteiraBase64 = null;

    const parametros = new URLSearchParams(window.location.search);

    tutorId =
        parametros.get("tutor_id") ||
        parametros.get("id") ||
        sessionStorage.getItem("agendaPetTutorId");

    if (tutorId) {

        tutorId = String(tutorId);

        sessionStorage.setItem(
            "agendaPetTutorId",
            tutorId
        );

        carregarTutor();

    } else {

        mostrarAreaCadastro();

    }

    function mostrarMensagem(texto) {

        mensagem.textContent = texto;
        mensagem.classList.add("mostrar");

        setTimeout(() => {
            mensagem.classList.remove("mostrar");
        }, 3000);

    }

    function mostrarAreaCadastro() {

        areaCadastro.style.display = "flex";
        areaPerfil.style.display = "none";

    }

    function mostrarAreaPerfil() {

        areaCadastro.style.display = "none";
        areaPerfil.style.display = "block";

    }

    function escaparHTML(valor) {

        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

    function formatarCPF(valor) {

        if (!valor) {
            return "-";
        }

        const numeros = String(valor).replace(/\D/g, "");

        if (numeros.length !== 11) {
            return valor;
        }

        return numeros.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
        );

    }

    function formatarTelefone(valor) {

        if (!valor) {
            return "-";
        }

        const numeros = String(valor).replace(/\D/g, "");

        if (numeros.length === 11) {

            return numeros.replace(
                /(\d{2})(\d{5})(\d{4})/,
                "($1) $2-$3"
            );

        }

        if (numeros.length === 10) {

            return numeros.replace(
                /(\d{2})(\d{4})(\d{4})/,
                "($1) $2-$3"
            );

        }

        return valor;

    }

    function formatarCEP(valor) {

        if (!valor) {
            return "-";
        }

        const numeros = String(valor).replace(/\D/g, "");

        if (numeros.length === 8) {

            return numeros.replace(
                /(\d{5})(\d{3})/,
                "$1-$2"
            );

        }

        return valor;

    }

    function formatarData(data) {

        if (!data) {
            return "-";
        }

        const parte = String(data).split("T")[0];
        const partes = parte.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }

    function possuiCarteira(pet) {

        return (
            pet.tem_carteira_vacinacao === true ||
            pet.tem_carteira_vacinacao === 1 ||
            pet.tem_carteira_vacinacao === "1" ||
            pet.tem_carteira_vacinacao === "true" ||
            pet.tem_carteira_vacinacao === "sim" ||
            Boolean(pet.carteira_vacinacao)
        );

    }

    async function carregarTutor() {

        try {

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}`
            );

            if (!resposta.ok) {

                sessionStorage.removeItem(
                    "agendaPetTutorId"
                );

                mostrarAreaCadastro();

                return;

            }

            const dados = await resposta.json();
            const tutor = dados.tutor || dados;

            if (!tutor || !tutor.id) {

                sessionStorage.removeItem(
                    "agendaPetTutorId"
                );

                mostrarAreaCadastro();

                return;

            }

            tutorId = String(tutor.id);

            sessionStorage.setItem(
                "agendaPetTutorId",
                tutorId
            );

            mostrarAreaPerfil();

            nomeTutor.textContent =
                tutor.nome || "Tutor";

            cpfTutor.textContent =
                formatarCPF(tutor.cpf);

            telefoneTutor.textContent =
                formatarTelefone(tutor.telefone);

            emailTutor.textContent =
                tutor.email || "-";

            enderecoTutor.textContent =
                tutor.endereco || "-";

            cepTutor.textContent =
                formatarCEP(tutor.cep);

            inputNome.value =
                tutor.nome || "";

            inputCpf.value =
                tutor.cpf || "";

            inputTelefone.value =
                tutor.telefone || "";

            inputEmail.value =
                tutor.email || "";

            inputEndereco.value =
                tutor.endereco || "";

            inputCep.value =
                tutor.cep || "";

            fotoTutorBase64 =
                tutor.foto || null;

            fotoPerfil.src =
                tutor.foto ||
                "../img/perfil-padrao.png";

            await carregarPets();

        } catch (erro) {

            console.error(erro);

            mostrarAreaCadastro();

        }

    }

    async function carregarPets() {

        try {

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}/pets`
            );

            if (!resposta.ok) {

                listaPets.innerHTML = `
                    <div class="sem-pets">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        Não foi possível carregar os pets.
                    </div>
                `;

                return;

            }

            const dados = await resposta.json();

            petsAtuais = Array.isArray(dados)
                ? dados
                : (dados.pets || []);

            mostrarPets(petsAtuais);

        } catch (erro) {

            console.error(erro);

            listaPets.innerHTML = `
                <div class="sem-pets">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Não foi possível carregar os pets.
                </div>
            `;

        }

    }

    function mostrarPets(pets) {

        petsAtuais = pets;

        if (!pets.length) {

            listaPets.innerHTML = `
                <div class="sem-pets">
                    <i class="fa-solid fa-paw"></i>
                    Você ainda não possui pets cadastrados.
                </div>
            `;

            return;

        }

        listaPets.innerHTML = pets.map(pet => {

            const foto =
                pet.foto ||
                "../img/pata.png";

            const carteiraPossui =
                possuiCarteira(pet);

            const idade =
                pet.idade || "-";

            const nascimento =
                pet.data_nascimento
                    ? formatarData(pet.data_nascimento)
                    : "-";

            const peso =
                pet.peso !== null &&
                pet.peso !== undefined &&
                pet.peso !== ""
                    ? `${pet.peso} kg`
                    : "-";

            return `
                <div class="pet-card">

                    <div class="pet-topo">

                        <img
                            class="foto-pet-card"
                            src="${escaparHTML(foto)}"
                            alt="Foto de ${escaparHTML(pet.nome)}"
                        >

                        <div>

                            <h4>
                                <i class="fa-solid fa-paw"></i>
                                ${escaparHTML(pet.nome)}
                            </h4>

                            <p>
                                ${escaparHTML(pet.especie || "-")}
                            </p>

                        </div>

                    </div>

                    <div class="pet-dados">

                        <div class="pet-dado">
                            <span>
                                <i class="fa-solid fa-dog"></i>
                                Raça
                            </span>

                            <strong>
                                ${escaparHTML(pet.raca || "-")}
                            </strong>
                        </div>

                        <div class="pet-dado">
                            <span>
                                <i class="fa-solid fa-calendar"></i>
                                Idade
                            </span>

                            <strong>
                                ${escaparHTML(idade)}
                            </strong>
                        </div>

                        <div class="pet-dado">
                            <span>
                                <i class="fa-solid fa-calendar-days"></i>
                                Nascimento
                            </span>

                            <strong>
                                ${escaparHTML(nascimento)}
                            </strong>
                        </div>

                        <div class="pet-dado">
                            <span>
                                <i class="fa-solid fa-venus-mars"></i>
                                Sexo
                            </span>

                            <strong>
                                ${escaparHTML(pet.sexo || "-")}
                            </strong>
                        </div>

                        <div class="pet-dado">
                            <span>
                                <i class="fa-solid fa-weight-scale"></i>
                                Peso
                            </span>

                            <strong>
                                ${escaparHTML(peso)}
                            </strong>
                        </div>

                    </div>

                    <div class="status-carteira-container">

                        <span class="status-carteira ${carteiraPossui ? "possui" : "nao-possui"}">

                            <i class="fa-solid ${carteiraPossui ? "fa-circle-check" : "fa-circle-xmark"}"></i>

                            ${carteiraPossui
                                ? "Possui carteira"
                                : "Não possui carteira"}

                        </span>

                    </div>

                    <div class="acoes-pet">

                        ${
                            pet.carteira_vacinacao
                                ? `
                                    <button
                                        type="button"
                                        class="secundario"
                                        onclick="visualizarCarteira(${Number(pet.id)})">

                                        <i class="fa-solid fa-file-medical"></i>
                                        Visualizar carteira

                                    </button>
                                `
                                : ""
                        }

                        <button
                            type="button"
                            onclick="abrirEdicaoPet(${Number(pet.id)})">

                            <i class="fa-solid fa-pen"></i>
                            Editar pet

                        </button>

                    </div>

                </div>
            `;

        }).join("");

    }

    function abrirModalPet() {

        modalPet.classList.add("mostrar");
        document.body.style.overflow = "hidden";

    }

    function fecharModalPet() {

        modalPet.classList.remove("mostrar");
        document.body.style.overflow = "";

        formPet.reset();

        petEditando = null;

        fotoPetBase64 = null;
        carteiraBase64 = null;

        tituloModalPet.innerHTML =
            '<i class="fa-solid fa-paw"></i> Adicionar pet';

        previewFotoPet.src = "";
        previewFotoPet.classList.remove("mostrar");

        campoArquivoCarteira.style.display =
            "none";

        nomeCarteiraArquivo.textContent =
            "";

        btnVisualizarCarteiraPet.style.display =
            "none";

        fotoPet.value = "";
        carteiraArquivoPet.value = "";

    }

    adicionarPet.addEventListener(
        "click",
        () => {

            fecharModalPet();
            abrirModalPet();

        }
    );

    btnFecharModal.addEventListener(
        "click",
        fecharModalPet
    );

    btnCancelarPet.addEventListener(
        "click",
        fecharModalPet
    );

    modalPet.addEventListener(
        "click",
        evento => {

            if (evento.target === modalPet) {
                fecharModalPet();
            }

        }
    );

    btnEditarPerfil.addEventListener(
        "click",
        () => {

            document.getElementById(
                "perfil-resumo"
            ).style.display = "none";

            formulario.style.display =
                "grid";

            btnEditarPerfil.style.display =
                "none";

        }
    );

    btnCancelarEdicao.addEventListener(
        "click",
        () => {

            formulario.style.display =
                "none";

            document.getElementById(
                "perfil-resumo"
            ).style.display = "grid";

            btnEditarPerfil.style.display =
                "inline-block";

        }
    );

    formulario.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();

            try {

                const resposta = await fetch(
                    `${API_URL}/tutores/${tutorId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            nome:
                                inputNome.value.trim(),

                            cpf:
                                inputCpf.value.trim(),

                            telefone:
                                inputTelefone.value.trim(),

                            email:
                                inputEmail.value.trim(),

                            endereco:
                                inputEndereco.value.trim(),

                            cep:
                                inputCep.value.trim(),

                            foto:
                                fotoTutorBase64

                        })
                    }
                );

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        dados.message ||
                        "Erro ao atualizar perfil."
                    );

                }

                mostrarMensagem(
                    "Perfil atualizado com sucesso!"
                );

                formulario.style.display =
                    "none";

                document.getElementById(
                    "perfil-resumo"
                ).style.display = "grid";

                btnEditarPerfil.style.display =
                    "inline-block";

                await carregarTutor();

            } catch (erro) {

                console.error(erro);

                mostrarMensagem(
                    erro.message ||
                    "Erro ao atualizar perfil."
                );

            }

        }
    );

    btnAlterarFoto.addEventListener(
        "click",
        () => {

            inputFotoPerfil.click();

        }
    );

    inputFotoPerfil.addEventListener(
        "change",
        evento => {

            const arquivo =
                evento.target.files[0];

            if (!arquivo) {
                return;
            }

            if (!arquivo.type.startsWith("image/")) {

                mostrarMensagem(
                    "Escolha uma imagem válida."
                );

                inputFotoPerfil.value = "";

                return;

            }

            if (arquivo.size > 5 * 1024 * 1024) {

                mostrarMensagem(
                    "A imagem deve ter no máximo 5 MB."
                );

                inputFotoPerfil.value = "";

                return;

            }

            const leitor =
                new FileReader();

            leitor.onload = async () => {

                fotoTutorBase64 =
                    leitor.result;

                fotoPerfil.src =
                    fotoTutorBase64;

                try {

                    const resposta =
                        await fetch(
                            `${API_URL}/tutores/${tutorId}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    nome:
                                        inputNome.value.trim(),

                                    cpf:
                                        inputCpf.value.trim(),

                                    telefone:
                                        inputTelefone.value.trim(),

                                    email:
                                        inputEmail.value.trim(),

                                    endereco:
                                        inputEndereco.value.trim(),

                                    cep:
                                        inputCep.value.trim(),

                                    foto:
                                        fotoTutorBase64

                                })
                            }
                        );

                    const dados =
                        await resposta.json();

                    if (!resposta.ok) {

                        throw new Error(
                            dados.mensagem ||
                            "Erro ao salvar foto."
                        );

                    }

                    mostrarMensagem(
                        "Foto atualizada!"
                    );

                } catch (erro) {

                    console.error(erro);

                    mostrarMensagem(
                        "Não foi possível salvar a foto."
                    );

                }

            };

            leitor.readAsDataURL(arquivo);

        }
    );

    btnRemoverFoto.addEventListener(
        "click",
        async () => {

            try {

                const resposta =
                    await fetch(
                        `${API_URL}/tutores/${tutorId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                nome:
                                    inputNome.value.trim(),

                                cpf:
                                    inputCpf.value.trim(),

                                telefone:
                                    inputTelefone.value.trim(),

                                email:
                                    inputEmail.value.trim(),

                                endereco:
                                    inputEndereco.value.trim(),

                                cep:
                                    inputCep.value.trim(),

                                foto: null

                            })
                        }
                    );

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        "Erro ao remover foto."
                    );

                }

                fotoTutorBase64 = null;

                fotoPerfil.src =
                    "../img/perfil-padrao.png";

                inputFotoPerfil.value = "";

                mostrarMensagem(
                    "Foto removida!"
                );

            } catch (erro) {

                console.error(erro);

                mostrarMensagem(
                    "Não foi possível remover a foto."
                );

            }

        }
    );

    fotoPet.addEventListener(
        "change",
        evento => {

            const arquivo =
                evento.target.files[0];

            if (!arquivo) {
                return;
            }

            if (!arquivo.type.startsWith("image/")) {

                mostrarMensagem(
                    "Escolha uma imagem válida."
                );

                fotoPet.value = "";

                return;

            }

            if (arquivo.size > 5 * 1024 * 1024) {

                mostrarMensagem(
                    "A foto do pet deve ter no máximo 5 MB."
                );

                fotoPet.value = "";

                return;

            }

            const leitor =
                new FileReader();

            leitor.onload = () => {

                fotoPetBase64 =
                    leitor.result;

                previewFotoPet.src =
                    fotoPetBase64;

                previewFotoPet.classList.add(
                    "mostrar"
                );

            };

            leitor.readAsDataURL(arquivo);

        }
    );

    carteiraPet.addEventListener(
        "change",
        () => {

            if (carteiraPet.value === "sim") {

                campoArquivoCarteira.style.display =
                    "flex";

            } else {

                campoArquivoCarteira.style.display =
                    "none";

                carteiraArquivoPet.value =
                    "";

                carteiraBase64 =
                    null;

                nomeCarteiraArquivo.textContent =
                    "";

                btnVisualizarCarteiraPet.style.display =
                    "none";

            }

        }
    );

    carteiraArquivoPet.addEventListener(
        "change",
        evento => {

            const arquivo =
                evento.target.files[0];

            if (!arquivo) {
                return;
            }

            const tiposPermitidos = [
                "image/png",
                "image/jpeg",
                "image/webp",
                "application/pdf"
            ];

            if (!tiposPermitidos.includes(arquivo.type)) {

                mostrarMensagem(
                    "Escolha uma imagem ou PDF válido."
                );

                carteiraArquivoPet.value = "";

                return;

            }

            if (arquivo.size > 5 * 1024 * 1024) {

                mostrarMensagem(
                    "A carteira deve ter no máximo 5 MB."
                );

                carteiraArquivoPet.value = "";

                return;

            }

            const leitor =
                new FileReader();

            leitor.onload = () => {

                carteiraBase64 =
                    leitor.result;

                nomeCarteiraArquivo.textContent =
                    arquivo.name;

                btnVisualizarCarteiraPet.style.display =
                    "inline-block";

            };

            leitor.readAsDataURL(arquivo);

        }
    );

    btnVisualizarCarteiraPet.addEventListener(
        "click",
        () => {

            if (!carteiraBase64) {
                return;
            }

            abrirArquivoCarteira(
                carteiraBase64,
                nomePet.value
            );

        }
    );

    function abrirArquivoCarteira(
        arquivo,
        nome
    ) {

        const janela =
            window.open("", "_blank");

        if (!janela) {

            mostrarMensagem(
                "Permita a abertura de novas janelas no navegador."
            );

            return;

        }

        janela.document.write(`
            <!DOCTYPE html>

            <html lang="pt-BR">

            <head>

                <meta charset="UTF-8">

                <title>
                    Carteira de vacinação - ${escaparHTML(nome)}
                </title>

                <style>

                    body {
                        margin: 0;
                        background: #f5f5f5;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                    }

                    iframe {
                        width: 95vw;
                        height: 95vh;
                        border: none;
                        background: white;
                    }

                    img {
                        max-width: 95vw;
                        max-height: 95vh;
                        object-fit: contain;
                    }

                </style>

            </head>

            <body>

                ${
                    arquivo.startsWith("data:application/pdf")
                        ? `<iframe src="${arquivo}"></iframe>`
                        : `<img src="${arquivo}" alt="Carteira de vacinação">`
                }

            </body>

            </html>
        `);

        janela.document.close();

    }

    formPet.addEventListener(
        "submit",
        async evento => {

            evento.preventDefault();

            const numeroIdade =
                idadePet.value.trim();

            const unidade =
                unidadeIdadePet.value;

            if (!numeroIdade) {

                mostrarMensagem(
                    "Informe a idade do pet."
                );

                return;

            }

            const idadeNumerica =
                Number(
                    numeroIdade.replace(",", ".")
                );

            if (
                Number.isNaN(idadeNumerica) ||
                idadeNumerica < 0
            ) {

                mostrarMensagem(
                    "Informe uma idade válida."
                );

                return;

            }

            const idade =
                `${numeroIdade.replace(",", ".")} ${unidade}`;

            const temCarteira =
                carteiraPet.value === "sim";

            const dadosPet = {

                tutor_id:
                    Number(tutorId),

                nome:
                    nomePet.value.trim(),

                especie:
                    especiePet.value,

                raca:
                    racaPet.value.trim(),

                idade:
                    idade,

                data_nascimento:
                    dataNascimentoPet.value || null,

                sexo:
                    sexoPet.value,

                peso:
                    pesoPet.value
                        ? Number(pesoPet.value)
                        : null,

                tem_carteira_vacinacao:
                    temCarteira,

                carteira_vacinacao:
                    temCarteira
                        ? carteiraBase64
                        : null,

                foto:
                    fotoPetBase64

            };

            try {

                const foiEdicao =
                    Boolean(petEditando);

                let resposta;

                if (foiEdicao) {

                    resposta =
                        await fetch(
                            `${API_URL}/pets/${petEditando.id}`,
                            {
                                method: "PUT",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        dadosPet
                                    )
                            }
                        );

                } else {

                    resposta =
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
                                        dadosPet
                                    )
                            }
                        );

                }

                const dados =
                    await resposta.json();

                if (!resposta.ok) {

                    throw new Error(
                        dados.mensagem ||
                        dados.message ||
                        "Não foi possível salvar o pet."
                    );

                }

                fecharModalPet();

                await carregarPets();

                mostrarMensagem(
                    foiEdicao
                        ? "Pet atualizado com sucesso!"
                        : "Pet cadastrado com sucesso!"
                );

            } catch (erro) {

                console.error(erro);

                mostrarMensagem(
                    erro.message ||
                    "Erro ao salvar o pet."
                );

            }

        }
    );

    window.abrirEdicaoPet =
        function (id) {

            const pet =
                petsAtuais.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );

            if (!pet) {

                mostrarMensagem(
                    "Não foi possível encontrar este pet."
                );

                return;

            }

            petEditando = pet;

            tituloModalPet.innerHTML =
                '<i class="fa-solid fa-pen"></i> Editar pet';

            nomePet.value =
                pet.nome || "";

            especiePet.value =
                pet.especie || "";

            racaPet.value =
                pet.raca || "";

            let idadeValor =
                pet.idade || "";

            const correspondencia =
                String(idadeValor).match(
                    /^(\d+(?:[.,]\d+)?)\s+(meses?|anos?)$/i
                );

            if (correspondencia) {

                idadePet.value =
                    correspondencia[1].replace(
                        ",",
                        "."
                    );

                unidadeIdadePet.value =
                    correspondencia[2]
                        .toLowerCase()
                        .startsWith("mes")
                        ? "meses"
                        : "anos";

            } else {

                const somenteNumero =
                    String(idadeValor).match(
                        /\d+(?:[.,]\d+)?/
                    );

                idadePet.value =
                    somenteNumero
                        ? somenteNumero[0].replace(
                            ",",
                            "."
                        )
                        : "";

                unidadeIdadePet.value =
                    "anos";

            }

            if (pet.data_nascimento) {

                dataNascimentoPet.value =
                    String(
                        pet.data_nascimento
                    ).split("T")[0];

            } else {

                dataNascimentoPet.value =
                    "";

            }

            sexoPet.value =
                pet.sexo || "";

            pesoPet.value =
                pet.peso !== null &&
                pet.peso !== undefined
                    ? pet.peso
                    : "";

            fotoPetBase64 =
                pet.foto || null;

            if (pet.foto) {

                previewFotoPet.src =
                    pet.foto;

                previewFotoPet.classList.add(
                    "mostrar"
                );

            } else {

                previewFotoPet.src =
                    "";

                previewFotoPet.classList.remove(
                    "mostrar"
                );

            }

            const possui =
                possuiCarteira(pet);

            carteiraPet.value =
                possui
                    ? "sim"
                    : "nao";

            if (possui) {

                campoArquivoCarteira.style.display =
                    "flex";

                carteiraBase64 =
                    pet.carteira_vacinacao ||
                    null;

                if (carteiraBase64) {

                    nomeCarteiraArquivo.textContent =
                        "Carteira já cadastrada";

                    btnVisualizarCarteiraPet.style.display =
                        "inline-block";

                } else {

                    nomeCarteiraArquivo.textContent =
                        "";

                    btnVisualizarCarteiraPet.style.display =
                        "none";

                }

            } else {

                campoArquivoCarteira.style.display =
                    "none";

                carteiraBase64 =
                    null;

                nomeCarteiraArquivo.textContent =
                    "";

                btnVisualizarCarteiraPet.style.display =
                    "none";

            }

            abrirModalPet();

        };

    window.visualizarCarteira =
        function (id) {

            const pet =
                petsAtuais.find(
                    item =>
                        String(item.id) ===
                        String(id)
                );

            if (!pet) {

                mostrarMensagem(
                    "Não foi possível encontrar este pet."
                );

                return;

            }

            if (!pet.carteira_vacinacao) {

                mostrarMensagem(
                    "Este pet não possui carteira cadastrada."
                );

                return;

            }

            abrirArquivoCarteira(
                pet.carteira_vacinacao,
                pet.nome
            );

        };

    btnVoltar.addEventListener(
        "click",
        () => {

            window.location.href =
                "../pages/home.html";

        }
    );

    btnCadastrar.addEventListener(
        "click",
        () => {

            const retorno =
                encodeURIComponent(
                    window.location.href
                );

            window.location.href =
                `cadastro.html?returnUrl=${retorno}`;

        }
    );

});