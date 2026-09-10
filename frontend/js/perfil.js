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

    if (!tutorId) {
        tutorId = localStorage.getItem("tutor_id");
    }

    if (tutorId) {
        tutorId = Number(tutorId);
    }

    if (
        tutorId &&
        !Number.isNaN(tutorId) &&
        tutorId > 0
    ) {
        localStorage.setItem(
            "tutor_id",
            tutorId
        );
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
                tutor.nome ||
                "Não informado";
        }

        if (perfilCpf) {
            perfilCpf.textContent =
                tutor.cpf ||
                "Não informado";
        }

        if (perfilTelefone) {
            perfilTelefone.textContent =
                tutor.telefone ||
                "Não informado";
        }

        if (perfilEmail) {
            perfilEmail.textContent =
                tutor.email ||
                "Não informado";
        }

        if (perfilEndereco) {
            perfilEndereco.textContent =
                tutor.endereco ||
                "Não informado";
        }

        if (perfilCep) {
            perfilCep.textContent =
                tutor.cep ||
                "Não informado";
        }

        if (nomePerfilFoto) {
            nomePerfilFoto.textContent =
                tutor.nome ||
                "Usuário";
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
                            pet.idade ||
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
                            pet.peso ||
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

        if (tituloModalPet) {
            tituloModalPet.textContent =
                "Editar Pet";
        }

        const nomePet =
            document.getElementById("nomePet");

        const especiePet =
            document.getElementById("especiePet");

        const racaPet =
            document.getElementById("racaPet");

        const idadePet =
            document.getElementById("idadePet");

        const sexoPet =
            document.getElementById("sexoPet");

        const pesoPet =
            document.getElementById("pesoPet");

        if (nomePet) {
            nomePet.value =
                pet.nome || "";
        }

        if (especiePet) {
            especiePet.value =
                pet.especie || "Cão";
        }

        if (racaPet) {
            racaPet.value =
                pet.raca || "";
        }

        if (idadePet) {
            idadePet.value =
                pet.idade || "";
        }

        if (sexoPet) {
            sexoPet.value =
                pet.sexo || "Macho";
        }

        if (pesoPet) {
            pesoPet.value =
                pet.peso || "";
        }

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

        const especiePet =
            document.getElementById("especiePet");

        const sexoPet =
            document.getElementById("sexoPet");

        if (especiePet) {
            especiePet.value = "Cão";
        }

        if (sexoPet) {
            sexoPet.value = "Macho";
        }

        modalPet.classList.add("mostrar");
    }

    function fecharModalPet() {
        if (!modalPet) {
            return;
        }

        modalPet.classList.remove("mostrar");

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

                window.location.href = url;
            }
        );
    }

    if (btnEditarTutor) {
        btnEditarTutor.addEventListener(
            "click",
            () => {
                preencherFormularioTutor();

                if (dadosTutor) {
                    dadosTutor.classList.add("hidden");
                }

                if (formTutor) {
                    formTutor.classList.remove("hidden");
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

                const dadosAtualizados = {
                    nome:
                        nomeTutor
                            ? nomeTutor.value.trim()
                            : "",

                    cpf:
                        cpfTutor
                            ? cpfTutor.value.trim()
                            : "",

                    telefone:
                        telefoneTutor
                            ? telefoneTutor.value.trim()
                            : "",

                    email:
                        emailTutor
                            ? emailTutor.value.trim()
                            : "",

                    endereco:
                        enderecoTutor
                            ? enderecoTutor.value.trim()
                            : "",

                    cep:
                        cepTutor
                            ? cepTutor.value.trim()
                            : ""
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
            () => {
                abrirNovoPet();
            }
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

                const nomePet =
                    document.getElementById("nomePet");

                const especiePet =
                    document.getElementById("especiePet");

                const racaPet =
                    document.getElementById("racaPet");

                const idadePet =
                    document.getElementById("idadePet");

                const sexoPet =
                    document.getElementById("sexoPet");

                const pesoPet =
                    document.getElementById("pesoPet");

                const nome =
                    nomePet
                        ? nomePet.value.trim()
                        : "";

                const especie =
                    especiePet
                        ? especiePet.value
                        : "";

                const raca =
                    racaPet
                        ? racaPet.value.trim()
                        : "";

                const idade =
                    idadePet
                        ? idadePet.value.trim()
                        : "";

                const sexo =
                    sexoPet
                        ? sexoPet.value
                        : "";

                const peso =
                    pesoPet
                        ? pesoPet.value.trim()
                        : "";

                if (
                    !nome ||
                    !especie ||
                    !raca ||
                    !idade ||
                    !sexo ||
                    !peso
                ) {
                    mostrarErro(
                        "Preencha todos os campos do pet."
                    );

                    return;
                }

                const dadosPet = {
                    tutor_id: Number(tutorId),
                    nome,
                    especie,
                    raca,
                    idade,
                    sexo,
                    peso
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

                    await carregarPets();

                    fecharModalPet();

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
            fotoPerfil.src = fotoSalva;
        } else {
            fotoPerfil.src = fotoPadrao;
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

                const leitor =
                    new FileReader();

                leitor.onload = () => {
                    const imagem =
                        leitor.result;

                    if (fotoPerfil) {
                        fotoPerfil.src =
                            imagem;
                    }

                    localStorage.setItem(
                        `fotoPerfil_${tutorId}`,
                        imagem
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
                if (!tutorId) {
                    return;
                }

                localStorage.removeItem(
                    `fotoPerfil_${tutorId}`
                );

                if (fotoPerfil) {
                    fotoPerfil.src =
                        fotoPadrao;
                }

                if (inputFotoPerfil) {
                    inputFotoPerfil.value =
                        "";
                }

                mostrarMensagem(
                    "Foto removida com sucesso!"
                );
            }
        );
    }

    carregarTutor();
});