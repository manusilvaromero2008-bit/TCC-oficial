document.addEventListener("DOMContentLoaded", () => {

    const API_URL = "http://localhost:3000/api";

    const container = document.getElementById("pets");
    const btnAdicionar = document.getElementById("adicionarPet");
    const btnProsseguir = document.getElementById("btnProsseguir");
    const formCadastro = document.getElementById("formCadastro");

    if (!container || !btnAdicionar || !btnProsseguir || !formCadastro) {
        console.error("Elementos do cadastro não foram encontrados.");
        return;
    }

    // =====================================================
    // RECUPERAR O ID DO TUTOR
    // =====================================================

    const parametros = new URLSearchParams(window.location.search);

    let tutorId = parametros.get("tutor_id");

    // Se não tiver o ID na URL, procura no localStorage
    if (!tutorId) {
        tutorId = localStorage.getItem("tutor_id");
    }

    if (tutorId) {
        tutorId = Number(tutorId);
    }

    let contador = 1;


    // =====================================================
    // ESCAPAR HTML
    // =====================================================

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


    // =====================================================
    // CRIAR PET
    // =====================================================

    function criarPet(pet = {}, numero = 1) {

        const novoPet = document.createElement("div");

        novoPet.className = "pet";

        novoPet.dataset.petId = pet.id || "";

        novoPet.innerHTML = `
            <h3>
                <i class="fa-solid fa-paw"></i>
                Pet ${numero}
            </h3>

            <div class="grid">

                <div class="campo">

                    <label>
                        Nome *
                    </label>

                    <input
                        type="text"
                        class="nomePet"
                        placeholder="Nome do pet"
                        value="${escaparHTML(pet.nome || "")}"
                        required>

                </div>

                <div class="campo">

                    <label>
                        Espécie *
                    </label>

                    <select
                        class="especiePet"
                        required>

                        <option value="Cão">Cão</option>
                        <option value="Gato">Gato</option>
                        <option value="Ave">Ave</option>
                        <option value="Roedor">Roedor</option>
                        <option value="Outro">Outro</option>

                    </select>

                </div>

                <div class="campo">

                    <label>
                        Raça *
                    </label>

                    <input
                        type="text"
                        class="racaPet"
                        placeholder="Raça"
                        value="${escaparHTML(pet.raca || "")}"
                        required>

                </div>

                <div class="campo">

                    <label>
                        Idade *
                    </label>

                    <input
                        type="text"
                        class="idadePet"
                        placeholder="Ex: 2 anos"
                        value="${escaparHTML(pet.idade || "")}"
                        required>

                </div>

                <div class="campo">

                    <label>
                        Sexo *
                    </label>

                    <select
                        class="sexoPet"
                        required>

                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>

                    </select>

                </div>

                <div class="campo">

                    <label>
                        Peso *
                    </label>

                    <input
                        type="text"
                        class="pesoPet"
                        placeholder="Ex: 5 kg"
                        value="${escaparHTML(pet.peso || "")}"
                        required>

                </div>

            </div>
        `;

        const especie =
            novoPet.querySelector(".especiePet");

        if (pet.especie) {
            especie.value = pet.especie;
        }

        const sexo =
            novoPet.querySelector(".sexoPet");

        if (pet.sexo) {
            sexo.value = pet.sexo;
        }

        container.appendChild(novoPet);
    }

// =====================================================
    // CARREGAR DADOS DO TUTOR
    // =====================================================

    async function carregarTutor() {

        if (!tutorId) {
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}`
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    resultado.mensagem ||
                    "Não foi possível carregar o tutor."
                );
            }

            document.getElementById("nomeTutor").value =
                resultado.nome || "";

            document.getElementById("cpfTutor").value =
                resultado.cpf || "";

            document.getElementById("telefoneTutor").value =
                resultado.telefone || "";

            document.getElementById("emailTutor").value =
                resultado.email || "";

            document.getElementById("enderecoTutor").value =
                resultado.endereco || "";

            document.getElementById("cep").value =
                resultado.cep || "";

            await carregarPets();

        } catch (erro) {

            console.error(
                "Erro ao carregar tutor:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível carregar os dados."
            );
        }
    }


    // =====================================================
    // CARREGAR PETS DO TUTOR
    // =====================================================

    async function carregarPets() {

        if (!tutorId) {
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}/pets`
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {

                throw new Error(
                    resultado.mensagem ||
                    "Não foi possível carregar os pets."
                );
            }

            if (
                !Array.isArray(resultado) ||
                resultado.length === 0
            ) {
                return;
            }

            container.innerHTML = "";

            contador = 0;

            resultado.forEach((pet, index) => {

                criarPet(
                    pet,
                    index + 1
                );

                contador = index + 1;
            });

        } catch (erro) {

            console.error(
                "Erro ao carregar pets:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível carregar os pets."
            );
        }
    }


    // =====================================================
    // BOTÃO ADICIONAR PET
    // =====================================================

    btnAdicionar.addEventListener(
        "click",
        () => {

            contador++;

            criarPet(
                {},
                contador
            );

        }
    );

// =====================================================
    // SALVAR CADASTRO
    // =====================================================

    formCadastro.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            if (!formCadastro.checkValidity()) {

                formCadastro.reportValidity();

                return;
            }

            const dadosTutor = {

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
                        .getElementById("cep")
                        .value
                        .trim()
            };


            // =================================================
            // PEGAR OS PETS PREENCHIDOS
            // =================================================

            const cardsPets =
                container.querySelectorAll(".pet");

            const pets = [];


            cardsPets.forEach((card) => {

                const petId =
                    card.dataset.petId || null;

                const nome =
                    card
                        .querySelector(".nomePet")
                        .value
                        .trim();

                const especie =
                    card
                        .querySelector(".especiePet")
                        .value;

                const raca =
                    card
                        .querySelector(".racaPet")
                        .value
                        .trim();

                const idade =
                    card
                        .querySelector(".idadePet")
                        .value
                        .trim();

                const sexo =
                    card
                        .querySelector(".sexoPet")
                        .value;

                const peso =
                    card
                        .querySelector(".pesoPet")
                        .value
                        .trim();


                pets.push({

                    id: petId,

                    nome,

                    especie,

                    raca,

                    idade,

                    sexo,

                    peso

                });

            });


            // =================================================
            // VERIFICAR SE TEM PET
            // =================================================

            if (pets.length === 0) {

                alert(
                    "Cadastre pelo menos um pet."
                );

                return;
            }


            // =================================================
            // VERIFICAR CAMPOS DOS PETS
            // =================================================

            const petIncompleto =
                pets.some((pet) =>

                    !pet.nome ||
                    !pet.especie ||
                    !pet.raca ||
                    !pet.idade ||
                    !pet.sexo ||
                    !pet.peso

                );


            if (petIncompleto) {

                alert(
                    "Preencha todos os campos obrigatórios dos pets."
                );

                return;
            }


            // =================================================
            // DESABILITAR BOTÃO
            // =================================================

            btnProsseguir.disabled = true;

            const textoOriginal =
                btnProsseguir.innerHTML;

            btnProsseguir.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Salvando...
            `;


            try {

                // =============================================
                // SE O TUTOR JÁ EXISTE
                // =============================================

                if (tutorId) {

                    const respostaTutor =
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
                                        dadosTutor
                                    )
                            }
                        );


                    const resultadoTutor =
                        await respostaTutor.json();


                    if (!respostaTutor.ok) {

                        throw new Error(
                            resultadoTutor.mensagem ||
                            "Erro ao atualizar tutor."
                        );
                    }


                    // =========================================
                    // SALVAR / ATUALIZAR PETS
                    // =========================================

                    for (const pet of pets) {

                        if (pet.id) {

                            await atualizarPet(
                                tutorId,
                                pet
                            );

                        } else {

                            await cadastrarPet(
                                tutorId,
                                pet
                            );

                        }

                    }


                // =============================================
                // SE FOR UM NOVO TUTOR
                // =============================================

                } else {

                    const respostaTutor =
                        await fetch(
                            `${API_URL}/tutores`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        dadosTutor
                                    )
                            }
                        );


                    const resultadoTutor =
                        await respostaTutor.json();


                    if (!respostaTutor.ok) {

                        throw new Error(
                            resultadoTutor.mensagem ||
                            "Erro ao cadastrar tutor."
                        );
                    }


                    // =========================================
                    // PEGAR O ID GERADO PELO BANCO
                    // =========================================

                    tutorId =
                        resultadoTutor.id ||
                        resultadoTutor.tutor_id ||
                        resultadoTutor.tutorId ||
                        resultadoTutor.insertId;


                    if (!tutorId) {

                        console.error(
                            "Resposta recebida do servidor:",
                            resultadoTutor
                        );

                        throw new Error(
                            "O tutor foi salvo, mas o servidor não retornou o ID."
                        );
                    }


                    tutorId = Number(tutorId);


                    // =========================================
                    // GUARDAR O ID NO LOCALSTORAGE
                    // =========================================

                    localStorage.setItem(
                        "tutor_id",
                        tutorId
                    );


                    // =========================================
                    // CADASTRAR OS PETS
                    // =========================================

                    for (const pet of pets) {

                        await cadastrarPet(
                            tutorId,
                            pet
                        );

                    }

                }


                // =============================================
                // GARANTIR QUE O ID CONTINUE SALVO
                // =============================================

                localStorage.setItem(
                    "tutor_id",
                    tutorId
                );


                alert(
                    "Cadastro salvo com sucesso!"
                );


                // =============================================
                // IR PARA O PERFIL
                // =============================================

                window.location.href =
                    `perfil.html?tutor_id=${tutorId}`;


            } catch (erro) {

                console.error(
                    "Erro ao salvar cadastro:",
                    erro
                );

                alert(
                    erro.message ||
                    "Não foi possível salvar o cadastro."
                );


            } finally {

                btnProsseguir.disabled = false;

                btnProsseguir.innerHTML =
                    textoOriginal;

            }

        }
    );

// =====================================================
    // CADASTRAR PET
    // =====================================================

    async function cadastrarPet(idTutor, pet) {

        const resposta = await fetch(
            `${API_URL}/pets`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    tutor_id: Number(idTutor),

                    nome: pet.nome,

                    especie: pet.especie,

                    raca: pet.raca,

                    sexo: pet.sexo,

                    observacoes:
                        `Idade: ${pet.idade} | Peso: ${pet.peso}`

                })
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao cadastrar o pet."
            );
        }


        return resultado;
    }


    // =====================================================
    // ATUALIZAR PET
    // =====================================================

    async function atualizarPet(idTutor, pet) {

        const resposta = await fetch(
            `${API_URL}/pets/${pet.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    tutor_id: Number(idTutor),

                    nome: pet.nome,

                    especie: pet.especie,

                    raca: pet.raca,

                    sexo: pet.sexo,

                    observacoes:
                        `Idade: ${pet.idade} | Peso: ${pet.peso}`

                })
            }
        );


        const resultado =
            await resposta.json();


        if (!resposta.ok) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao atualizar o pet."
            );
        }


        return resultado;
    }


    // =====================================================
    // INICIAR CARREGAMENTO
    // =====================================================

    carregarTutor();

});