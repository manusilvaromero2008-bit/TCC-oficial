document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/api";

    // =========================
    // ELEMENTOS DA PÁGINA
    // =========================

    const btnInicio = document.getElementById("btnInicio");
    const btnCadastrar = document.getElementById("btnCadastrar");

    const areaCadastro = document.getElementById("areaCadastro");
    const areaPerfil = document.getElementById("areaPerfil");

    const btnEditarTutor = document.getElementById("btnEditarTutor");
    const btnCancelarTutor = document.getElementById("btnCancelarTutor");
    const formTutor = document.getElementById("formTutor");
    const dadosTutor = document.getElementById("dadosTutor");

    const btnAdicionarPet = document.getElementById("btnAdicionarPet");
    const listaPets = document.getElementById("listaPets");

    const modalPet = document.getElementById("modalPet");
    const btnFecharModal = document.getElementById("btnFecharModal");
    const btnCancelarPet = document.getElementById("btnCancelarPet");
    const formPet = document.getElementById("formPet");
    const tituloModalPet = document.getElementById("tituloModalPet");

    const mensagem = document.getElementById("mensagem");

    const inputFotoPerfil = document.getElementById("inputFotoPerfil");
    const fotoPerfil = document.getElementById("fotoPerfil");
    const nomePerfilFoto = document.getElementById("nomePerfilFoto");
    const btnRemoverFoto = document.getElementById("btnRemoverFoto");

    // =========================
    // ID DO TUTOR
    // =========================

    const parametros = new URLSearchParams(window.location.search);

    let tutorId = parametros.get("tutor_id");

    // Também aceita "id", caso alguma página antiga ainda use esse nome
    if (!tutorId) {
        tutorId = parametros.get("id");
    }

    if (tutorId) {
        tutorId = Number(tutorId);
    }

    let tutor = null;
    let pets = [];
    let petEditando = null;

    const fotoPadrao = "../img/perfil-padrao.png";

    // =========================
    // MENSAGENS
    // =========================

    function mostrarMensagem(texto) {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = texto;
        mensagem.classList.add("mostrar");

        setTimeout(() => {
            mensagem.classList.remove("mostrar");
        }, 3000);
    }

    function mostrarErro(texto) {

        if (!mensagem) {
            return;
        }

        mensagem.textContent = texto;
        mensagem.classList.add("mostrar");

        setTimeout(() => {
            mensagem.classList.remove("mostrar");
        }, 4000);
    }

    // =========================
    // MOSTRAR ÁREA DE CADASTRO
    // =========================

    function mostrarAreaCadastro() {

        if (areaCadastro) {
            areaCadastro.style.display = "flex";
            areaCadastro.classList.remove("hidden");
        }

        if (areaPerfil) {
            areaPerfil.style.display = "none";
            areaPerfil.classList.add("hidden");
        }
    }

    // =========================
    // MOSTRAR PERFIL
    // =========================

    function mostrarAreaPerfil() {

        if (areaCadastro) {
            areaCadastro.style.display = "none";
            areaCadastro.classList.add("hidden");
        }

        if (areaPerfil) {
            areaPerfil.style.display = "block";
            areaPerfil.classList.remove("hidden");
        }
    }

    // =========================
    // VERIFICAR ID
    // =========================

    function verificarTutorId() {

        if (!tutorId || Number.isNaN(Number(tutorId))) {

            mostrarAreaCadastro();

            console.warn(
                "Nenhum tutor_id foi encontrado na URL."
            );

            return false;
        }

        return true;
    }

    // =========================
    // CARREGAR TUTOR
    // =========================

    async function carregarTutor() {

        if (!tutorId) {
            mostrarAreaCadastro();
            return;
        }

        try {

            console.log(
                "Buscando tutor no banco. ID:",
                tutorId
            );

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}`
            );

            const dados = await resposta.json();

            console.log("Resposta do tutor:", dados);

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Não foi possível carregar o tutor."
                );
            }

            tutor = dados;

            atualizarDadosTutor();

            mostrarAreaPerfil();

        } catch (erro) {

            console.error(
                "Erro ao carregar tutor:",
                erro
            );

            tutor = null;

            mostrarAreaCadastro();

            mostrarErro(
                erro.message ||
                "Não foi possível carregar os dados do tutor."
            );
        }
    }

    // =========================
    // CARREGAR PETS
    // =========================

    async function carregarPets() {

        if (!tutorId) {

            pets = [];

            mostrarPets();

            return;
        }

        try {

            console.log(
                "Buscando pets do tutor:",
                tutorId
            );

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}/pets`
            );

            const dados = await resposta.json();

            console.log("Pets recebidos:", dados);

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Não foi possível carregar os pets."
                );
            }

            pets = Array.isArray(dados)
                ? dados
                : [];

            mostrarPets();

        } catch (erro) {

            console.error(
                "Erro ao carregar pets:",
                erro
            );

            pets = [];

            if (listaPets) {

                listaPets.innerHTML = `
                    <div class="sem-pets">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                        <p>Não foi possível carregar seus pets.</p>
                    </div>
                `;
            }
        }
    }

    // =========================
    // ATUALIZAR DADOS DO TUTOR
    // =========================

    function atualizarDadosTutor() {

        if (!tutor) {
            return;
        }

        const perfilNome =
            document.getElementById("perfilNome");

        const perfilCpf =
            document.getElementById("perfilCpf");

        const perfilTelefone =
            document.getElementById("perfilTelefone");

        const perfilEmail =
            document.getElementById("perfilEmail");

        const perfilEndereco =
            document.getElementById("perfilEndereco");

        const perfilCep =
            document.getElementById("perfilCep");

        if (perfilNome) {
            perfilNome.textContent =
                tutor.nome || "Não informado";
        }

        if (perfilCpf) {
            perfilCpf.textContent =
                tutor.cpf || "Não informado";
        }

        if (perfilTelefone) {
            perfilTelefone.textContent =
                tutor.telefone || "Não informado";
        }

        if (perfilEmail) {
            perfilEmail.textContent =
                tutor.email || "Não informado";
        }

        if (perfilEndereco) {
            perfilEndereco.textContent =
                tutor.endereco || "Não informado";
        }

        if (perfilCep) {
            perfilCep.textContent =
                tutor.cep || "Não informado";
        }

        if (nomePerfilFoto) {
            nomePerfilFoto.textContent =
                tutor.nome || "Usuário";
        }
    }

    // =========================
    // PREENCHER FORMULÁRIO TUTOR
    // =========================

    function preencherFormularioTutor() {

        if (!tutor) {
            return;
        }

        document.getElementById("nomeTutor").value =
            tutor.nome || "";

        document.getElementById("cpfTutor").value =
            tutor.cpf || "";

        document.getElementById("telefoneTutor").value =
            tutor.telefone || "";

        document.getElementById("emailTutor").value =
            tutor.email || "";

        document.getElementById("enderecoTutor").value =
            tutor.endereco || "";

        document.getElementById("cepTutor").value =
            tutor.cep || "";
    }

    // =========================
    // FECHAR FORMULÁRIO TUTOR
    // =========================

    function fecharFormularioTutor() {

        if (dadosTutor) {
            dadosTutor.classList.remove("hidden");
        }

        if (formTutor) {
            formTutor.classList.add("hidden");
        }
    }

    // =========================
    // EXTRAIR IDADE E PESO
    // =========================

    function extrairInformacoesPet(pet) {

        let idade = "";
        let peso = "";

        if (pet.observacoes) {

            const observacoes =
                String(pet.observacoes);

            const idadeEncontrada =
                observacoes.match(
                    /Idade:\s*([^|]+)/i
                );

            const pesoEncontrado =
                observacoes.match(
                    /Peso:\s*([^|]+)/i
                );

            if (idadeEncontrada) {
                idade =
                    idadeEncontrada[1].trim();
            }

            if (pesoEncontrado) {
                peso =
                    pesoEncontrado[1].trim();
            }
        }

        return {
            idade,
            peso
        };
    }

    // =========================
    // CRIAR OBSERVAÇÕES
    // =========================

    function criarObservacoesPet(idade, peso) {

        const partes = [];

        if (idade) {
            partes.push(`Idade: ${idade}`);
        }

        if (peso) {
            partes.push(`Peso: ${peso}`);
        }

        return partes.join(" | ");
    }

    // =========================
    // MOSTRAR PETS
    // =========================

    function mostrarPets() {

        if (!listaPets) {
            return;
        }

        listaPets.innerHTML = "";

        if (pets.length === 0) {

            listaPets.innerHTML = `
                <div class="sem-pets">
                    <i class="fa-solid fa-paw"></i>
                    <p>Você ainda não possui pets cadastrados.</p>
                </div>
            `;

            return;
        }

        pets.forEach((pet) => {

            const informacoes =
                extrairInformacoesPet(pet);

            const card =
                document.createElement("div");

            card.className = "pet-card";

            card.innerHTML = `
                <div class="pet-icone">
                    <i class="fa-solid fa-paw"></i>
                </div>

                <div class="pet-dados">

                    <h3>
                        ${pet.nome || "Pet sem nome"}
                    </h3>

                    <p>
                        <strong>Espécie:</strong>
                        ${pet.especie || "Não informada"}
                    </p>

                    <p>
                        <strong>Raça:</strong>
                        ${pet.raca || "Não informada"}
                    </p>

                    <p>
                        <strong>Idade:</strong>
                        ${informacoes.idade || "Não informada"}
                    </p>

                    <p>
                        <strong>Sexo:</strong>
                        ${pet.sexo || "Não informado"}
                    </p>

                    <p>
                        <strong>Peso:</strong>
                        ${informacoes.peso || "Não informado"}
                    </p>

                </div>

                <button
                    type="button"
                    class="btn-editar-pet">

                    <i class="fa-solid fa-pen"></i>
                    Editar

                </button>
            `;

            const botaoEditar =
                card.querySelector(
                    ".btn-editar-pet"
                );

            botaoEditar.addEventListener(
                "click",
                () => {
                    abrirEdicaoPet(pet);
                }
            );

            listaPets.appendChild(card);
        });
    }

    // =========================
    // EDITAR PET
    // =========================

    function abrirEdicaoPet(pet) {

        if (!pet) {
            return;
        }

        petEditando = pet;

        const informacoes =
            extrairInformacoesPet(pet);

        tituloModalPet.textContent =
            "Editar Pet";

        document.getElementById("nomePet").value =
            pet.nome || "";

        document.getElementById("especiePet").value =
            pet.especie || "Cão";

        document.getElementById("racaPet").value =
            pet.raca || "";

        document.getElementById("idadePet").value =
            informacoes.idade || "";

        document.getElementById("sexoPet").value =
            pet.sexo || "Macho";

        document.getElementById("pesoPet").value =
            informacoes.peso || "";

        modalPet.classList.add("mostrar");
    }

    // =========================
    // NOVO PET
    // =========================

    function abrirNovoPet() {

        petEditando = null;

        tituloModalPet.textContent =
            "Adicionar Pet";

        formPet.reset();

        document.getElementById("especiePet").value =
            "Cão";

        document.getElementById("sexoPet").value =
            "Macho";

        modalPet.classList.add("mostrar");
    }

    // =========================
    // FECHAR MODAL
    // =========================

    function fecharModalPet() {

        modalPet.classList.remove("mostrar");

        formPet.reset();

        petEditando = null;
    }

    // =========================
    // BOTÃO INÍCIO
    // =========================

    if (btnInicio) {

        btnInicio.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../../home.html";
            }
        );
    }

    // =========================
    // BOTÃO CADASTRAR
    // =========================

    if (btnCadastrar) {

        btnCadastrar.addEventListener(
            "click",
            () => {

                const url =
                    tutorId
                        ? `cadastro.html?tutor_id=${tutorId}`
                        : "cadastro.html";

                window.location.href = url;
            }
        );
    }

    // =========================
    // EDITAR TUTOR
    // =========================

    if (btnEditarTutor) {

        btnEditarTutor.addEventListener(
            "click",
            () => {

                preencherFormularioTutor();

                dadosTutor.classList.add("hidden");

                formTutor.classList.remove("hidden");
            }
        );
    }

    // =========================
    // CANCELAR EDIÇÃO TUTOR
    // =========================

    if (btnCancelarTutor) {

        btnCancelarTutor.addEventListener(
            "click",
            () => {

                fecharFormularioTutor();
            }
        );
    }

    // =========================
    // SALVAR TUTOR
    // =========================

    if (formTutor) {

        formTutor.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                if (!tutorId) {

                    mostrarErro(
                        "Tutor não identificado."
                    );

                    return;
                }

                const dadosAtualizados = {

                    nome:
                        document
                            .getElementById("nomeTutor")
                            .value
                            .trim(),

                    cpf:
                        document
                            .getElementById("cpfTutor")
                            .value
                            .trim(),

                    telefone:
                        document
                            .getElementById("telefoneTutor")
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById("emailTutor")
                            .value
                            .trim(),

                    endereco:
                        document
                            .getElementById("enderecoTutor")
                            .value
                            .trim(),

                    cep:
                        document
                            .getElementById("cepTutor")
                            .value
                            .trim()
                };

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

                                body:
                                    JSON.stringify(
                                        dadosAtualizados
                                    )
                            }
                        );

                    const dados =
                        await resposta.json();

                    if (!resposta.ok) {

                        throw new Error(
                            dados.mensagem ||
                            "Erro ao atualizar os dados."
                        );
                    }

                    tutor = {
                        ...tutor,
                        ...dadosAtualizados
                    };

                    atualizarDadosTutor();

                    fecharFormularioTutor();

                    mostrarMensagem(
                        "Dados do tutor atualizados com sucesso!"
                    );

                } catch (erro) {

                    console.error(
                        "Erro ao atualizar tutor:",
                        erro
                    );

                    mostrarErro(
                        erro.message ||
                        "Não foi possível atualizar os dados do tutor."
                    );
                }
            }
        );
    }

    // =========================
    // FOTO DE PERFIL
    // =========================

    if (inputFotoPerfil) {

        inputFotoPerfil.addEventListener(
            "change",
            (event) => {

                const arquivo =
                    event.target.files[0];

                if (!arquivo) {
                    return;
                }

                if (
                    !arquivo.type.startsWith("image/")
                ) {

                    mostrarErro(
                        "Selecione uma imagem válida."
                    );

                    return;
                }

                const leitor =
                    new FileReader();

                leitor.onload = () => {

                    fotoPerfil.src =
                        leitor.result;

                    mostrarMensagem(
                        "Foto de perfil alterada nesta sessão."
                    );
                };

                leitor.readAsDataURL(arquivo);
            }
        );
    }

    // =========================
    // REMOVER FOTO
    // =========================

    if (btnRemoverFoto) {

        btnRemoverFoto.addEventListener(
            "click",
            () => {

                fotoPerfil.src =
                    fotoPadrao;

                mostrarMensagem(
                    "Foto de perfil removida."
                );
            }
        );
    }

    // =========================
    // ADICIONAR PET
    // =========================

    if (btnAdicionarPet) {

        btnAdicionarPet.addEventListener(
            "click",
            () => {

                if (!tutorId) {

                    mostrarErro(
                        "Tutor não identificado."
                    );

                    return;
                }

                abrirNovoPet();
            }
        );
    }

    // =========================
    // FECHAR MODAL
    // =========================

    if (btnFecharModal) {

        btnFecharModal.addEventListener(
            "click",
            () => {

                fecharModalPet();
            }
        );
    }

    if (btnCancelarPet) {

        btnCancelarPet.addEventListener(
            "click",
            () => {

                fecharModalPet();
            }
        );
    }

    // =========================
    // SALVAR PET
    // =========================

    if (formPet) {

        formPet.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();

                if (!tutorId) {

                    mostrarErro(
                        "Tutor não identificado."
                    );

                    return;
                }

                const estavaEditando =
                    petEditando !== null;

                const nome =
                    document
                        .getElementById("nomePet")
                        .value
                        .trim();

                const especie =
                    document
                        .getElementById("especiePet")
                        .value;

                const raca =
                    document
                        .getElementById("racaPet")
                        .value
                        .trim();

                const idade =
                    document
                        .getElementById("idadePet")
                        .value
                        .trim();

                const sexo =
                    document
                        .getElementById("sexoPet")
                        .value;

                const peso =
                    document
                        .getElementById("pesoPet")
                        .value
                        .trim();

                const dadosPet = {

                    tutor_id:
                        Number(tutorId),

                    nome,

                    especie,

                    raca,

                    sexo,

                    data_nascimento:
                        null,

                    observacoes:
                        criarObservacoesPet(
                            idade,
                            peso
                        )
                };

                try {

                    let resposta;

                    if (petEditando) {

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
                            "Não foi possível salvar o pet."
                        );
                    }

                    fecharModalPet();

                    await carregarPets();

                    if (estavaEditando) {

                        mostrarMensagem(
                            "Pet atualizado com sucesso!"
                        );

                    } else {

                        mostrarMensagem(
                            "Pet adicionado com sucesso!"
                        );
                    }

                } catch (erro) {

                    console.error(
                        "Erro ao salvar pet:",
                        erro
                    );

                    mostrarErro(
                        erro.message ||
                        "Não foi possível salvar o pet."
                    );
                }
            }
        );
    }

    // =========================
    // FECHAR MODAL CLICANDO FORA
    // =========================

    if (modalPet) {

        modalPet.addEventListener(
            "click",
            (event) => {

                if (
                    event.target === modalPet
                ) {

                    fecharModalPet();
                }
            }
        );
    }

    // =========================
    // INICIALIZAÇÃO
    // =========================

    if (verificarTutorId()) {

        carregarTutor();

        carregarPets();
    }

});