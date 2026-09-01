document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/api";

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

    const parametros = new URLSearchParams(window.location.search);

    let tutorId = parametros.get("tutor_id");

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

    function verificarTutorId() {

        if (
            !tutorId ||
            Number.isNaN(Number(tutorId)) ||
            Number(tutorId) <= 0
        ) {
            mostrarAreaCadastro();
            return false;
        }

        return true;
    }

    function escaparHTML(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function extrairInformacoesPet(pet) {

        let idade = pet.idade || "";
        let peso = pet.peso || "";

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

            if (idadeEncontrada && !idade) {
                idade =
                    idadeEncontrada[1].trim();
            }

            if (pesoEncontrado && !peso) {
                peso =
                    pesoEncontrado[1].trim();
            }
        }

        return {
            idade,
            peso
        };
    }

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

    async function carregarTutor() {

        if (!verificarTutorId()) {
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}`
            );

            const dados = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    dados.mensagem ||
                    "Não foi possível carregar o tutor."
                );
            }

            tutor = dados;

            atualizarDadosTutor();

            preencherFormularioTutor();

            mostrarAreaPerfil();

            await carregarPets();

            carregarFotoPerfil();

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

    async function carregarPets() {

        if (!tutorId) {

            pets = [];

            mostrarPets();

            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}/pets`
            );

            const dados = await resposta.json();

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

                        <p>
                            Não foi possível carregar seus pets.
                        </p>

                    </div>
                `;
            }
        }
    }

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

    function preencherFormularioTutor() {

        if (!tutor) {
            return;
        }

        const nomeTutor =
            document.getElementById("nomeTutor");

        const cpfTutor =
            document.getElementById("cpfTutor");

        const telefoneTutor =
            document.getElementById("telefoneTutor");

        const emailTutor =
            document.getElementById("emailTutor");

        const enderecoTutor =
            document.getElementById("enderecoTutor");

        const cepTutor =
            document.getElementById("cepTutor");

        if (nomeTutor) {
            nomeTutor.value =
                tutor.nome || "";
        }

        if (cpfTutor) {
            cpfTutor.value =
                tutor.cpf || "";
        }

        if (telefoneTutor) {
            telefoneTutor.value =
                tutor.telefone || "";
        }

        if (emailTutor) {
            emailTutor.value =
                tutor.email || "";
        }

        if (enderecoTutor) {
            enderecoTutor.value =
                tutor.endereco || "";
        }

        if (cepTutor) {
            cepTutor.value =
                tutor.cep || "";
        }
    }

    function fecharFormularioTutor() {

        if (dadosTutor) {
            dadosTutor.classList.remove("hidden");
        }

        if (formTutor) {
            formTutor.classList.add("hidden");
        }
    }

    function mostrarPets() {

        if (!listaPets) {
            return;
        }

        listaPets.innerHTML = "";

        if (pets.length === 0) {

            listaPets.innerHTML = `
                <div class="sem-pets">

                    <i class="fa-solid fa-paw"></i>

                    <p>
                        Você ainda não possui pets cadastrados.
                    </p>

                </div>
            `;

            return;
        }

        pets.forEach(pet => {

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
                        ${escaparHTML(
                            pet.nome ||
                            "Pet sem nome"
                        )}
                    </h3>

                    <p>
                        <strong>Espécie:</strong>
                        ${escaparHTML(
                            pet.especie ||
                            "Não informada"
                        )}
                    </p>

                    <p>
                        <strong>Raça:</strong>
                        ${escaparHTML(
                            pet.raca ||
                            "Não informada"
                        )}
                    </p>

                    <p>
                        <strong>Idade:</strong>
                        ${escaparHTML(
                            informacoes.idade ||
                            "Não informada"
                        )}
                    </p>

                    <p>
                        <strong>Sexo:</strong>
                        ${escaparHTML(
                            pet.sexo ||
                            "Não informado"
                        )}
                    </p>

                    <p>
                        <strong>Peso:</strong>
                        ${escaparHTML(
                            informacoes.peso ||
                            "Não informado"
                        )}
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

            if (botaoEditar) {

                botaoEditar.addEventListener(
                    "click",
                    () => {
                        abrirEdicaoPet(pet);
                    }
                );
            }

            listaPets.appendChild(card);
        });
    }

    function abrirEdicaoPet(pet) {

        if (
            !pet ||
            !modalPet ||
            !formPet
        ) {
            return;
        }

        petEditando = pet;

        const informacoes =
            extrairInformacoesPet(pet);

        if (tituloModalPet) {
            tituloModalPet.textContent =
                "Editar Pet";
        }

        document.getElementById(
            "nomePet"
        ).value =
            pet.nome || "";

        document.getElementById(
            "especiePet"
        ).value =
            pet.especie || "Cão";

        document.getElementById(
            "racaPet"
        ).value =
            pet.raca || "";

        document.getElementById(
            "idadePet"
        ).value =
            informacoes.idade || "";

        document.getElementById(
            "sexoPet"
        ).value =
            pet.sexo || "Macho";

        document.getElementById(
            "pesoPet"
        ).value =
            informacoes.peso || "";

        modalPet.classList.add("mostrar");
    }

    function abrirNovoPet() {

        if (
            !modalPet ||
            !formPet
        ) {
            return;
        }

        petEditando = null;

        if (tituloModalPet) {
            tituloModalPet.textContent =
                "Adicionar Pet";
        }

        formPet.reset();

        document.getElementById(
            "especiePet"
        ).value = "Cão";

        document.getElementById(
            "sexoPet"
        ).value = "Macho";

        modalPet.classList.add("mostrar");
    }

    function fecharModalPet() {

        if (!modalPet) {
            return;
        }

        modalPet.classList.remove(
            "mostrar"
        );

        if (formPet) {
            formPet.reset();
        }

        petEditando = null;
    }

    if (btnInicio) {

        btnInicio.addEventListener(
            "click",
            () => {

                window.location.href =
                    "../../home.html";
            }
        );
    }

    if (btnCadastrar) {

        btnCadastrar.addEventListener(
            "click",
            () => {

                const url = tutorId
                    ? `cadastro.html?tutor_id=${encodeURIComponent(tutorId)}`
                    : "cadastro.html";

                window.location.href =
                    url;
            }
        );
    }

    if (btnEditarTutor) {

        btnEditarTutor.addEventListener(
            "click",
            () => {

                preencherFormularioTutor();

                if (dadosTutor) {
                    dadosTutor.classList.add(
                        "hidden"
                    );
                }

                if (formTutor) {
                    formTutor.classList.remove(
                        "hidden"
                    );
                }
            }
        );
    }

    if (btnCancelarTutor) {

        btnCancelarTutor.addEventListener(
            "click",
            fecharFormularioTutor
        );
    }

    if (formTutor) {

        formTutor.addEventListener(
            "submit",
            async event => {

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
                            .getElementById(
                                "nomeTutor"
                            )
                            .value
                            .trim(),

                    cpf:
                        document
                            .getElementById(
                                "cpfTutor"
                            )
                            .value
                            .trim(),

                    telefone:
                        document
                            .getElementById(
                                "telefoneTutor"
                            )
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById(
                                "emailTutor"
                            )
                            .value
                            .trim(),

                    endereco:
                        document
                            .getElementById(
                                "enderecoTutor"
                            )
                            .value
                            .trim(),

                    cep:
                        document
                            .getElementById(
                                "cepTutor"
                            )
                            .value
                            .trim()
                };

                if (
                    !dadosAtualizados.nome ||
                    !dadosAtualizados.cpf ||
                    !dadosAtualizados.telefone ||
                    !dadosAtualizados.email ||
                    !dadosAtualizados.endereco
                ) {

                    mostrarErro(
                        "Preencha todos os campos obrigatórios."
                    );

                    return;
                }

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

                    preencherFormularioTutor();

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

    if (btnAdicionarPet) {

        btnAdicionarPet.addEventListener(
            "click",
            abrirNovoPet
        );
    }

    if (btnFecharModal) {

        btnFecharModal.addEventListener(
            "click",
            fecharModalPet
        );
    }

    if (btnCancelarPet) {

        btnCancelarPet.addEventListener(
            "click",
            fecharModalPet
        );
    }

    if (modalPet) {

        modalPet.addEventListener(
            "click",
            event => {

                if (
                    event.target === modalPet
                ) {
                    fecharModalPet();
                }
            }
        );
    }

    if (formPet) {

        formPet.addEventListener(
            "submit",
            async event => {

                event.preventDefault();

                if (!tutorId) {

                    mostrarErro(
                        "Tutor não identificado."
                    );

                    return;
                }

                if (
                    !formPet.checkValidity()
                ) {

                    formPet.reportValidity();

                    return;
                }

                const nome =
                    document
                        .getElementById(
                            "nomePet"
                        )
                        .value
                        .trim();

                const especie =
                    document
                        .getElementById(
                            "especiePet"
                        )
                        .value;

                const raca =
                    document
                        .getElementById(
                            "racaPet"
                        )
                        .value
                        .trim();

                const idade =
                    document
                        .getElementById(
                            "idadePet"
                        )
                        .value
                        .trim();

                const sexo =
                    document
                        .getElementById(
                            "sexoPet"
                        )
                        .value;

                const peso =
                    document
                        .getElementById(
                            "pesoPet"
                        )
                        .value
                        .trim();

                const dadosPet = {

                    tutor_id:
                        Number(tutorId),

                    nome: nome,

                    especie: especie,

                    raca: raca,

                    sexo: sexo,

                    data_nascimento: null,

                    observacoes:
                        criarObservacoesPet(
                            idade,
                            peso
                        )
                };

                try {

                    let resposta;

                    if (
                        petEditando &&
                        petEditando.id
                    ) {

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
                            "Erro ao salvar o pet."
                        );
                    }

                    fecharModalPet();

                    await carregarPets();

                    mostrarMensagem(
                        petEditando
                            ? "Pet atualizado com sucesso!"
                            : "Pet cadastrado com sucesso!"
                    );

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

    function carregarFotoPerfil() {

        if (!fotoPerfil || !tutorId) {
            return;
        }

        const fotoSalva =
            localStorage.getItem(
                `fotoPerfil_${tutorId}`
            );

        if (fotoSalva) {

            fotoPerfil.src =
                fotoSalva;

        } else {

            fotoPerfil.src =
                fotoPadrao;
        }
    }

    if (inputFotoPerfil) {

        inputFotoPerfil.addEventListener(
            "change",
            event => {

                const arquivo =
                    event.target.files[0];

                if (!arquivo) {
                    return;
                }

                if (
                    !arquivo.type.startsWith(
                        "image/"
                    )
                ) {

                    mostrarErro(
                        "Selecione uma imagem válida."
                    );

                    inputFotoPerfil.value = "";

                    return;
                }

                const leitor =
                    new FileReader();

                leitor.onload = () => {

                    if (fotoPerfil) {

                        fotoPerfil.src =
                            leitor.result;
                    }

                    if (tutorId) {

                        localStorage.setItem(
                            `fotoPerfil_${tutorId}`,
                            leitor.result
                        );
                    }

                    mostrarMensagem(
                        "Foto de perfil atualizada!"
                    );
                };

                leitor.readAsDataURL(
                    arquivo
                );
            }
        );
    }

    if (btnRemoverFoto) {

        btnRemoverFoto.addEventListener(
            "click",
            () => {

                if (tutorId) {

                    localStorage.removeItem(
                        `fotoPerfil_${tutorId}`
                    );
                }

                if (fotoPerfil) {

                    fotoPerfil.src =
                        fotoPadrao;
                }

                if (inputFotoPerfil) {

                    inputFotoPerfil.value =
                        "";
                }

                mostrarMensagem(
                    "Foto de perfil removida."
                );
            }
        );
    }

    carregarTutor();

});