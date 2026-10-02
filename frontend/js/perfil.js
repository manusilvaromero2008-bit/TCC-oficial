document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/api";

    const btnVoltar =
        document.getElementById("btnVoltar");

    const btnCadastrar =
        document.getElementById("btnCadastrar");

    const areaCadastro =
        document.getElementById("areaCadastro");

    const areaPerfil =
        document.getElementById("areaPerfil");

    const btnEditarTutor =
        document.getElementById("btnEditarTutor");

    const btnCancelarTutor =
        document.getElementById("btnCancelarTutor");

    const formTutor =
        document.getElementById("formTutor");

    const dadosTutor =
        document.getElementById("dadosTutor");

    const btnAdicionarPet =
        document.getElementById("btnAdicionarPet");

    const listaPets =
        document.getElementById("listaPets");

    const modalPet =
        document.getElementById("modalPet");

    const btnFecharModal =
        document.getElementById("btnFecharModal");

    const btnCancelarPet =
        document.getElementById("btnCancelarPet");

    const formPet =
        document.getElementById("formPet");

    const tituloModalPet =
        document.getElementById("tituloModalPet");

    const mensagem =
        document.getElementById("mensagem");

    const inputFotoPerfil =
        document.getElementById("inputFotoPerfil");

    const fotoPerfil =
        document.getElementById("fotoPerfil");

    const nomePerfilFoto =
        document.getElementById("nomePerfilFoto");

    const btnRemoverFoto =
        document.getElementById("btnRemoverFoto");

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    let tutorId =
        parametros.get("tutor_id") ||
        parametros.get("id");

    const returnUrl =
        parametros.get("returnUrl");

    let tutor = null;
    let pets = [];
    let petEditando = null;

    const fotoPadrao =
        "../img/perfil-padrao.png";

    function mostrarMensagem(texto) {
        if (!mensagem) return;

        mensagem.textContent = texto;

        mensagem.classList.add("mostrar");

        setTimeout(() => {
            mensagem.classList.remove(
                "mostrar"
            );
        }, 3000);
    }

    function mostrarErro(texto) {
        if (!mensagem) return;

        mensagem.textContent = texto;

        mensagem.classList.add("mostrar");

        setTimeout(() => {
            mensagem.classList.remove(
                "mostrar"
            );
        }, 4000);
    }

    function mostrarAreaCadastro() {
        if (areaCadastro) {
            areaCadastro.style.display =
                "flex";

            areaCadastro.classList.remove(
                "hidden"
            );
        }

        if (areaPerfil) {
            areaPerfil.style.display =
                "none";

            areaPerfil.classList.add(
                "hidden"
            );
        }
    }

    function mostrarAreaPerfil() {
        if (areaCadastro) {
            areaCadastro.style.display =
                "none";

            areaCadastro.classList.add(
                "hidden"
            );
        }

        if (areaPerfil) {
            areaPerfil.style.display =
                "block";

            areaPerfil.classList.remove(
                "hidden"
            );
        }
    }

    function verificarTutorId() {
        if (
            !tutorId ||
            Number.isNaN(
                Number(tutorId)
            ) ||
            Number(tutorId) <= 0
        ) {
            mostrarAreaCadastro();
            return false;
        }

        tutorId = Number(tutorId);

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

    function formatarCPF(valor) {
        const numeros =
            String(valor || "")
                .replace(/\D/g, "")
                .slice(0, 11);

        if (numeros.length <= 3) {
            return numeros;
        }

        if (numeros.length <= 6) {
            return `${numeros.slice(0, 3)}.${numeros.slice(3)}`;
        }

        if (numeros.length <= 9) {
            return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6)}`;
        }

        return `${numeros.slice(0, 3)}.${numeros.slice(3, 6)}.${numeros.slice(6, 9)}-${numeros.slice(9, 11)}`;
    }

    function formatarTelefone(valor) {
        const numeros =
            String(valor || "")
                .replace(/\D/g, "")
                .slice(0, 11);

        if (numeros.length <= 2) {
            return numeros;
        }

        if (numeros.length <= 6) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
        }

        if (numeros.length <= 10) {
            return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
        }

        return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7, 11)}`;
    }

    function formatarCEP(valor) {
        const numeros =
            String(valor || "")
                .replace(/\D/g, "")
                .slice(0, 8);

        if (numeros.length <= 5) {
            return numeros;
        }

        return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
    }

    function validarCPF(valor) {
        const cpf =
            String(valor || "")
                .replace(/\D/g, "");

        if (cpf.length !== 11) {
            return false;
        }

        if (/^(\d)\1{10}$/.test(cpf)) {
            return false;
        }

        let soma = 0;

        for (let i = 0; i < 9; i++) {
            soma +=
                Number(cpf[i]) *
                (10 - i);
        }

        let resto =
            (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }

        if (
            resto !==
            Number(cpf[9])
        ) {
            return false;
        }

        soma = 0;

        for (let i = 0; i < 10; i++) {
            soma +=
                Number(cpf[i]) *
                (11 - i);
        }

        resto =
            (soma * 10) % 11;

        if (resto === 10) {
            resto = 0;
        }

        return (
            resto ===
            Number(cpf[10])
        );
    }

    function validarTelefone(valor) {
        const telefone =
            String(valor || "")
                .replace(/\D/g, "");

        return (
            telefone.length === 10 ||
            telefone.length === 11
        );
    }

    function validarEmail(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            String(valor || "").trim()
        );
    }

    async function validarCEP(valor) {
        const cep =
            String(valor || "")
                .replace(/\D/g, "");

        if (!cep) {
            return true;
        }

        if (cep.length !== 8) {
            return false;
        }

        try {
            const resposta =
                await fetch(
                    `https://viacep.com.br/ws/${cep}/json/`
                );

            if (!resposta.ok) {
                return false;
            }

            const dados =
                await resposta.json();

            return !dados.erro;

        } catch (erro) {
            console.error(
                "Erro ao consultar CEP:",
                erro
            );

            return false;
        }
    }

    function configurarFormatacaoCampos() {
        const cpfTutor =
            document.getElementById(
                "cpfTutor"
            );

        const telefoneTutor =
            document.getElementById(
                "telefoneTutor"
            );

        const cepTutor =
            document.getElementById(
                "cepTutor"
            );

        if (cpfTutor) {
            cpfTutor.addEventListener(
                "input",
                () => {
                    cpfTutor.value =
                        formatarCPF(
                            cpfTutor.value
                        );
                }
            );
        }

        if (telefoneTutor) {
            telefoneTutor.addEventListener(
                "input",
                () => {
                    telefoneTutor.value =
                        formatarTelefone(
                            telefoneTutor.value
                        );
                }
            );
        }

        if (cepTutor) {
            cepTutor.addEventListener(
                "input",
                () => {
                    cepTutor.value =
                        formatarCEP(
                            cepTutor.value
                        );
                }
            );
        }
    }

    async function carregarTutor() {
        if (!verificarTutorId()) {
            return;
        }

        try {
            const resposta =
                await fetch(
                    `${API_URL}/tutores/${tutorId}`
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    "Não foi possível carregar o tutor."
                );
            }

            tutor =
                dados.tutor ||
                dados;

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
            const resposta =
                await fetch(
                    `${API_URL}/tutores/${tutorId}/pets`
                );

            const dados =
                await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    "Não foi possível carregar os pets."
                );
            }

            pets =
                Array.isArray(dados)
                    ? dados
                    : dados.pets || [];

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

    function atualizarDadosTutor() {
        if (!tutor) return;

        const perfilNome =
            document.getElementById(
                "perfilNome"
            );

        const perfilCpf =
            document.getElementById(
                "perfilCpf"
            );

        const perfilTelefone =
            document.getElementById(
                "perfilTelefone"
            );

        const perfilEmail =
            document.getElementById(
                "perfilEmail"
            );

        const perfilEndereco =
            document.getElementById(
                "perfilEndereco"
            );

        const perfilCep =
            document.getElementById(
                "perfilCep"
            );

        if (perfilNome) {
            perfilNome.textContent =
                tutor.nome ||
                "Não informado";
        }

        if (perfilCpf) {
            perfilCpf.textContent =
                formatarCPF(
                    tutor.cpf || ""
                );
        }

        if (perfilTelefone) {
            perfilTelefone.textContent =
                formatarTelefone(
                    tutor.telefone || ""
                );
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
                tutor.cep
                    ? formatarCEP(
                        tutor.cep
                    )
                    : "Não informado";
        }

        if (nomePerfilFoto) {
            nomePerfilFoto.textContent =
                tutor.nome ||
                "Usuário";
        }
    }

    function preencherFormularioTutor() {
        if (!tutor) return;

        const nomeTutor =
            document.getElementById(
                "nomeTutor"
            );

        const cpfTutor =
            document.getElementById(
                "cpfTutor"
            );

        const telefoneTutor =
            document.getElementById(
                "telefoneTutor"
            );

        const emailTutor =
            document.getElementById(
                "emailTutor"
            );

        const enderecoTutor =
            document.getElementById(
                "enderecoTutor"
            );

        const cepTutor =
            document.getElementById(
                "cepTutor"
            );

        if (nomeTutor) {
            nomeTutor.value =
                tutor.nome || "";
        }

        if (cpfTutor) {
            cpfTutor.value =
                formatarCPF(
                    tutor.cpf || ""
                );
        }

        if (telefoneTutor) {
            telefoneTutor.value =
                formatarTelefone(
                    tutor.telefone || ""
                );
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
                formatarCEP(
                    tutor.cep || ""
                );
        }
    }

    function fecharFormularioTutor() {
        if (dadosTutor) {
            dadosTutor.classList.remove(
                "hidden"
            );
        }

        if (formTutor) {
            formTutor.classList.add(
                "hidden"
            );
        }
    }

    function mostrarPets() {
        if (!listaPets) return;

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
            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "pet-card";

            const carteira =
                pet.tem_carteira_vacinacao === true ||
                pet.tem_carteira_vacinacao === 1 ||
                pet.tem_carteira_vacinacao === "1" ||
                pet.tem_carteira_vacinacao === "true";

            const dataNascimento =
                pet.data_nascimento
                    ? String(
                        pet.data_nascimento
                    ).slice(0, 10)
                    : "";

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
                            pet.idade ??
                            "Não informada"
                        )}
                    </p>

                    <p>
                        <strong>Data de nascimento:</strong>
                        ${escaparHTML(
                            dataNascimento ||
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
                        ${
                            pet.peso !== null &&
                            pet.peso !== undefined &&
                            pet.peso !== ""
                                ? escaparHTML(
                                    `${pet.peso} kg`
                                )
                                : "Não informado"
                        }
                    </p>

                    <p>
                        <strong>Carteira de vacinação:</strong>
                        ${carteira ? "Sim" : "Não"}
                    </p>

                </div>

                <button
                    type="button"
                    class="btn-editar-pet"
                >
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
                        abrirEdicaoPet(
                            pet
                        );
                    }
                );
            }

            listaPets.appendChild(
                card
            );
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
            document.getElementById(
                "nomePet"
            );

        const especiePet =
            document.getElementById(
                "especiePet"
            );

        const racaPet =
            document.getElementById(
                "racaPet"
            );

        const idadePet =
            document.getElementById(
                "idadePet"
            );

        const dataNascimentoPet =
            document.getElementById(
                "dataNascimentoPet"
            );

        const sexoPet =
            document.getElementById(
                "sexoPet"
            );

        const pesoPet =
            document.getElementById(
                "pesoPet"
            );

        const carteiraPet =
            document.getElementById(
                "carteiraPet"
            );

        if (nomePet) {
            nomePet.value =
                pet.nome || "";
        }

        if (especiePet) {
            especiePet.value =
                pet.especie || "";
        }

        if (racaPet) {
            racaPet.value =
                pet.raca || "";
        }

        if (idadePet) {
            idadePet.value =
                pet.idade ?? "";
        }

        if (dataNascimentoPet) {
            dataNascimentoPet.value =
                pet.data_nascimento
                    ? String(
                        pet.data_nascimento
                    ).slice(0, 10)
                    : "";
        }

        if (sexoPet) {
            sexoPet.value =
                pet.sexo || "";
        }

        if (pesoPet) {
            pesoPet.value =
                pet.peso ?? "";
        }

        if (carteiraPet) {
            const possuiCarteira =
                pet.tem_carteira_vacinacao === true ||
                pet.tem_carteira_vacinacao === 1 ||
                pet.tem_carteira_vacinacao === "1" ||
                pet.tem_carteira_vacinacao === "true";

            carteiraPet.value =
                possuiCarteira
                    ? "sim"
                    : "nao";
        }

        modalPet.classList.add(
            "mostrar"
        );
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

        const carteiraPet =
            document.getElementById(
                "carteiraPet"
            );

        if (carteiraPet) {
            carteiraPet.value =
                "nao";
        }

        modalPet.classList.add(
            "mostrar"
        );
    }

    function fecharModalPet() {
        if (!modalPet) return;

        modalPet.classList.remove(
            "mostrar"
        );

        if (formPet) {
            formPet.reset();
        }

        petEditando = null;
    }

    function voltarParaOrigem() {
        if (returnUrl) {
            const origem =
                new URL(
                    returnUrl,
                    window.location.href
                );

            if (tutorId) {
                origem.searchParams.set(
                    "tutor_id",
                    tutorId
                );
            }

            window.location.href =
                origem.href;

            return;
        }

        const urlHome =
            new URL(
                "../pages/home.html",
                window.location.href
            );

        if (tutorId) {
            urlHome.searchParams.set(
                "tutor_id",
                tutorId
            );
        }

        window.location.href =
            urlHome.href;
    }

    if (btnVoltar) {
        btnVoltar.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                voltarParaOrigem();
            }
        );
    }

    if (btnCadastrar) {
        btnCadastrar.addEventListener(
            "click",
            () => {
                const parametrosCadastro =
                    new URLSearchParams();

                if (tutorId) {
                    parametrosCadastro.set(
                        "tutor_id",
                        tutorId
                    );
                }

                const origemAtual =
                    new URL(
                        window.location.href
                    );

                origemAtual.searchParams.delete(
                    "returnUrl"
                );

                parametrosCadastro.set(
                    "returnUrl",
                    origemAtual.href
                );

                const query =
                    parametrosCadastro.toString();

                window.location.href =
                    `cadastro.html?${query}`;
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
            async (event) => {
                event.preventDefault();

                if (!tutorId) {
                    mostrarErro(
                        "Tutor não identificado."
                    );
                    return;
                }

                const nomeTutor =
                    document.getElementById(
                        "nomeTutor"
                    );

                const cpfTutor =
                    document.getElementById(
                        "cpfTutor"
                    );

                const telefoneTutor =
                    document.getElementById(
                        "telefoneTutor"
                    );

                const emailTutor =
                    document.getElementById(
                        "emailTutor"
                    );

                const enderecoTutor =
                    document.getElementById(
                        "enderecoTutor"
                    );

                const cepTutor =
                    document.getElementById(
                        "cepTutor"
                    );

                const nome =
                    nomeTutor
                        ? nomeTutor.value.trim()
                        : "";

                const cpf =
                    cpfTutor
                        ? cpfTutor.value.trim()
                        : "";

                const telefone =
                    telefoneTutor
                        ? telefoneTutor.value.trim()
                        : "";

                const email =
                    emailTutor
                        ? emailTutor.value.trim()
                        : "";

                const endereco =
                    enderecoTutor
                        ? enderecoTutor.value.trim()
                        : "";

                const cep =
                    cepTutor
                        ? cepTutor.value.trim()
                        : "";

                if (
                    !nome ||
                    !cpf ||
                    !telefone ||
                    !email ||
                    !endereco
                ) {
                    mostrarErro(
                        "Preencha todos os campos obrigatórios."
                    );
                    return;
                }

                if (!validarCPF(cpf)) {
                    mostrarErro(
                        "Digite um CPF válido."
                    );
                    return;
                }

                if (
                    !validarTelefone(
                        telefone
                    )
                ) {
                    mostrarErro(
                        "Digite um telefone válido."
                    );
                    return;
                }

                if (
                    !validarEmail(
                        email
                    )
                ) {
                    mostrarErro(
                        "Digite um e-mail válido."
                    );
                    return;
                }

                if (cep) {
                    const cepValido =
                        await validarCEP(
                            cep
                        );

                    if (!cepValido) {
                        mostrarErro(
                            "O CEP informado não foi encontrado."
                        );
                        return;
                    }
                }

                const dadosAtualizados = {
                    nome,
                    cpf,
                    telefone,
                    email,
                    endereco,
                    cep:
                        cep || null
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
                            dados.message ||
                            "Erro ao atualizar os dados."
                        );
                    }

                    tutor =
                        dados.tutor ||
                        dadosAtualizados;

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
            (event) => {
                if (
                    event.target ===
                    modalPet
                ) {
                    fecharModalPet();
                }
            }
        );
    }

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

                const nomePet =
                    document.getElementById(
                        "nomePet"
                    );

                const especiePet =
                    document.getElementById(
                        "especiePet"
                    );

                const racaPet =
                    document.getElementById(
                        "racaPet"
                    );

                const idadePet =
                    document.getElementById(
                        "idadePet"
                    );

                const dataNascimentoPet =
                    document.getElementById(
                        "dataNascimentoPet"
                    );

                const sexoPet =
                    document.getElementById(
                        "sexoPet"
                    );

                const pesoPet =
                    document.getElementById(
                        "pesoPet"
                    );

                const carteiraPet =
                    document.getElementById(
                        "carteiraPet"
                    );

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

                const dataNascimento =
                    dataNascimentoPet
                        ? dataNascimentoPet.value
                        : "";

                const sexo =
                    sexoPet
                        ? sexoPet.value
                        : "";

                const peso =
                    pesoPet
                        ? pesoPet.value.trim()
                        : "";

                const possuiCarteira =
                    carteiraPet &&
                    carteiraPet.value ===
                        "sim";

                if (
                    !nome ||
                    !especie ||
                    !raca ||
                    !idade ||
                    !sexo ||
                    !peso
                ) {
                    mostrarErro(
                        "Preencha todos os campos obrigatórios do pet."
                    );
                    return;
                }

                const pesoNumerico =
                    Number(
                        peso
                            .replace(",", ".")
                            .replace(
                                /[^\d.]/g,
                                ""
                            )
                    );

                if (
                    Number.isNaN(
                        pesoNumerico
                    ) ||
                    pesoNumerico <= 0
                ) {
                    mostrarErro(
                        "Digite um peso válido para o pet."
                    );
                    return;
                }

                const dadosPet = {
                    tutor_id:
                        Number(tutorId),
                    nome,
                    especie,
                    raca,
                    idade:
                        String(
                            idade
                        ).trim(),
                    data_nascimento:
                        dataNascimento ||
                        null,
                    sexo,
                    peso:
                        String(
                            pesoNumerico
                        ),
                    tem_carteira_vacinacao:
                        possuiCarteira,
                    carteira_vacinacao:
                        null
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

                    const texto =
                        await resposta.text();

                    let dados = {};

                    try {
                        dados =
                            texto
                                ? JSON.parse(
                                    texto
                                )
                                : {};
                    } catch {
                        dados = {};
                    }

                    if (!resposta.ok) {
                        throw new Error(
                            dados.mensagem ||
                            dados.message ||
                            `Erro ${resposta.status} ao salvar o pet.`
                        );
                    }

                    await carregarPets();

                    const mensagemPet =
                        petEditando
                            ? "Pet atualizado com sucesso!"
                            : "Pet cadastrado com sucesso!";

                    fecharModalPet();

                    mostrarMensagem(
                        mensagemPet
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
        if (!fotoPerfil) return;

        fotoPerfil.src =
            fotoPadrao;
    }

    if (inputFotoPerfil) {
        inputFotoPerfil.addEventListener(
            "change",
            (event) => {
                const arquivo =
                    event.target.files[0];

                if (!arquivo) return;

                const leitor =
                    new FileReader();

                leitor.onload = () => {
                    if (fotoPerfil) {
                        fotoPerfil.src =
                            leitor.result;
                    }
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

    configurarFormatacaoCampos();

    console.log(
        "Tutor ID carregado no perfil:",
        tutorId
    );

    carregarTutor();
});