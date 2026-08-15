document.addEventListener("DOMContentLoaded", () => {

    const btnInicio =
        document.getElementById("btnInicio");

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

    let tutor = null;
    let pets = [];
    let petEditando = null;

    try {

        const tutorSalvo =
            localStorage.getItem("tutor");

        if (tutorSalvo) {

            tutor =
                JSON.parse(tutorSalvo);

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar os dados do tutor:",
            erro
        );

        tutor = null;

    }

    try {

        const petsSalvos =
            localStorage.getItem("pets");

        if (petsSalvos) {

            pets =
                JSON.parse(petsSalvos);

        }

        if (!Array.isArray(pets)) {

            pets = [];

        }

    } catch (erro) {

        console.error(
            "Erro ao carregar os pets:",
            erro
        );

        pets = [];

    }

    function verificarCadastro() {

        if (tutor && tutor.nome) {

            areaCadastro.classList.add("hidden");

            areaPerfil.classList.remove("hidden");

        } else {

            areaCadastro.classList.remove("hidden");

            areaPerfil.classList.add("hidden");

        }

    }

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

    function atualizarDadosTutor() {

        document.getElementById("perfilNome").textContent =
            tutor?.nome || "Não informado";

        document.getElementById("perfilCpf").textContent =
            tutor?.cpf || "Não informado";

        document.getElementById("perfilTelefone").textContent =
            tutor?.telefone || "Não informado";

        document.getElementById("perfilEmail").textContent =
            tutor?.email || "Não informado";

        document.getElementById("perfilEndereco").textContent =
            tutor?.endereco || "Não informado";

        document.getElementById("perfilCep").textContent =
            tutor?.cep || "Não informado";

    }

    function preencherFormularioTutor() {

        document.getElementById("nomeTutor").value =
            tutor?.nome || "";

        document.getElementById("cpfTutor").value =
            tutor?.cpf || "";

        document.getElementById("telefoneTutor").value =
            tutor?.telefone || "";

        document.getElementById("emailTutor").value =
            tutor?.email || "";

        document.getElementById("enderecoTutor").value =
            tutor?.endereco || "";

        document.getElementById("cepTutor").value =
            tutor?.cep || "";

    }

    function fecharFormularioTutor() {

        dadosTutor.classList.remove("hidden");

        formTutor.classList.add("hidden");

    }

    function mostrarPets() {

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

        pets.forEach((pet, index) => {

            const card =
                document.createElement("div");

            card.className =
                "pet-card";

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
                        ${pet.idade || "Não informada"}
                    </p>

                    <p>
                        <strong>Sexo:</strong>
                        ${pet.sexo || "Não informado"}
                    </p>

                    <p>
                        <strong>Peso:</strong>
                        ${pet.peso || "Não informado"}
                    </p>

                </div>

                <button
                    type="button"
                    class="btn-editar-pet"
                    data-index="${index}">

                    <i class="fa-solid fa-pen"></i>

                    Editar

                </button>

            `;

            listaPets.appendChild(card);

        });

        document
            .querySelectorAll(".btn-editar-pet")
            .forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                botao.dataset.index
                            );

                        abrirEdicaoPet(index);

                    }
                );

            });

    }

    function abrirEdicaoPet(index) {

        const pet =
            pets[index];

        if (!pet) {
            return;
        }

        petEditando =
            index;

        tituloModalPet.textContent =
            "Editar Pet";

        document.getElementById("nomePet").value =
            pet.nome || "";

        document.getElementById("especiePet").value =
            pet.especie || "Cão";

        document.getElementById("racaPet").value =
            pet.raca || "";

        document.getElementById("idadePet").value =
            pet.idade || "";

        document.getElementById("sexoPet").value =
            pet.sexo || "Macho";

        document.getElementById("pesoPet").value =
            pet.peso || "";

        modalPet.classList.add("mostrar");

    }

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

    function fecharModalPet() {

        modalPet.classList.remove("mostrar");

        formPet.reset();

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

                window.location.href =
                    "cadastro.html";

            }
        );

    }

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

    if (btnCancelarTutor) {

        btnCancelarTutor.addEventListener(
            "click",
            () => {

                fecharFormularioTutor();

            }
        );

    }

    if (formTutor) {

        formTutor.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                tutor = {

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

                localStorage.setItem(
                    "tutor",
                    JSON.stringify(tutor)
                );

                atualizarDadosTutor();

                verificarCadastro();

                fecharFormularioTutor();

                mostrarMensagem(
                    "Dados do tutor atualizados com sucesso!"
                );

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

    if (formPet) {

        formPet.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                const pet = {

                    nome:
                        document
                            .getElementById("nomePet")
                            .value
                            .trim(),

                    especie:
                        document
                            .getElementById("especiePet")
                            .value,

                    raca:
                        document
                            .getElementById("racaPet")
                            .value
                            .trim(),

                    idade:
                        document
                            .getElementById("idadePet")
                            .value
                            .trim(),

                    sexo:
                        document
                            .getElementById("sexoPet")
                            .value,

                    peso:
                        document
                            .getElementById("pesoPet")
                            .value
                            .trim()

                };

                if (petEditando !== null) {

                    pets[petEditando] =
                        pet;

                    mostrarMensagem(
                        "Pet atualizado com sucesso!"
                    );

                } else {

                    pets.push(pet);

                    mostrarMensagem(
                        "Pet adicionado com sucesso!"
                    );

                }

                localStorage.setItem(
                    "pets",
                    JSON.stringify(pets)
                );

                mostrarPets();

                fecharModalPet();

            }
        );

    }

    if (modalPet) {

        modalPet.addEventListener(
            "click",
            event => {

                if (event.target === modalPet) {

                    fecharModalPet();

                }

            }
        );

    }

    atualizarDadosTutor();

    mostrarPets();

    verificarCadastro();

});