document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("pets");
    const btnAdicionar = document.getElementById("adicionarPet");
    const btnProsseguir = document.getElementById("btnProsseguir");

    // Verifica se os elementos principais existem
    if (!container || !btnAdicionar || !btnProsseguir) {
        console.error("Elementos do cadastro não foram encontrados.");
        return;
    }

    let contador = 1;

    let tutorSalvo = null;
    let petsSalvos = [];

    // ==========================================
    // CARREGAR TUTOR DO LOCALSTORAGE
    // ==========================================

    try {
        const tutorStorage = localStorage.getItem("tutor");

        if (tutorStorage) {
            tutorSalvo = JSON.parse(tutorStorage);
        }

    } catch (erro) {
        console.error("Erro ao ler os dados do tutor:", erro);

        localStorage.removeItem("tutor");
        tutorSalvo = null;
    }

    // ==========================================
    // CARREGAR PETS DO LOCALSTORAGE
    // ==========================================

    try {
        const petsStorage = localStorage.getItem("pets");

        if (petsStorage) {
            petsSalvos = JSON.parse(petsStorage);
        }

        if (!Array.isArray(petsSalvos)) {
            petsSalvos = [];
        }

    } catch (erro) {
        console.error("Erro ao ler os pets:", erro);

        localStorage.removeItem("pets");
        petsSalvos = [];
    }

    // ==========================================
    // PREENCHER DADOS DO TUTOR
    // ==========================================

    if (tutorSalvo) {

        const nomeTutor = document.getElementById("nomeTutor");
        const cpfTutor = document.getElementById("cpfTutor");
        const telefoneTutor = document.getElementById("telefoneTutor");
        const emailTutor = document.getElementById("emailTutor");
        const enderecoTutor = document.getElementById("enderecoTutor");
        const cep = document.getElementById("cep");

        if (nomeTutor) {
            nomeTutor.value = tutorSalvo.nome || "";
        }

        if (cpfTutor) {
            cpfTutor.value = tutorSalvo.cpf || "";
        }

        if (telefoneTutor) {
            telefoneTutor.value = tutorSalvo.telefone || "";
        }

        if (emailTutor) {
            emailTutor.value = tutorSalvo.email || "";
        }

        if (enderecoTutor) {
            enderecoTutor.value = tutorSalvo.endereco || "";
        }

        if (cep) {
            cep.value = tutorSalvo.cep || "";
        }
    }

    // ==========================================
    // FUNÇÃO PARA CRIAR UM PET
    // ==========================================

    function criarPet(pet = {}, numero = 1) {

        const novoPet = document.createElement("div");

        novoPet.className = "pet";

        novoPet.innerHTML = `
            <h3>
                <i class="fa-solid fa-paw"></i>
                Pet ${numero}
            </h3>

            <div class="grid">

                <div class="campo">
                    <label>Nome *</label>

                    <input
                        type="text"
                        class="nomePet"
                        placeholder="Nome do pet"
                        value="${pet.nome || ""}"
                        required
                    >
                </div>

                <div class="campo">
                    <label>Espécie *</label>

                    <select class="especiePet" required>
                        <option value="Cão">Cão</option>
                        <option value="Gato">Gato</option>
                        <option value="Ave">Ave</option>
                        <option value="Roedor">Roedor</option>
                        <option value="Outro">Outro</option>
                    </select>
                </div>

                <div class="campo">
                    <label>Raça *</label>

                    <input
                        type="text"
                        class="racaPet"
                        placeholder="Raça"
                        value="${pet.raca || ""}"
                        required
                    >
                </div>

                <div class="campo">
                    <label>Idade *</label>

                    <input
                        type="text"
                        class="idadePet"
                        placeholder="Ex: 2 anos"
                        value="${pet.idade || ""}"
                        required
                    >
                </div>

                <div class="campo">
                    <label>Sexo *</label>

                    <select class="sexoPet" required>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </select>
                </div>

                <div class="campo">
                    <label>Peso *</label>

                    <input
                        type="text"
                        class="pesoPet"
                        placeholder="Ex: 5 kg"
                        value="${pet.peso || ""}"
                        required
                    >
                </div>

            </div>
        `;

        // Selecionar espécie salva
        const especie = novoPet.querySelector(".especiePet");

        if (pet.especie) {
            especie.value = pet.especie;
        }

        // Selecionar sexo salvo
        const sexo = novoPet.querySelector(".sexoPet");

        if (pet.sexo) {
            sexo.value = pet.sexo;
        }

        container.appendChild(novoPet);
    }

    // ==========================================
    // CARREGAR PETS SALVOS
    // ==========================================

    if (petsSalvos.length > 0) {

        // Remove o pet inicial do HTML
        const primeiroPet = container.querySelector(".pet");

        if (primeiroPet) {
            primeiroPet.remove();
        }

        // Cria novamente os pets salvos
        petsSalvos.forEach((pet, index) => {

            criarPet(
                pet,
                index + 1
            );

            contador = index + 1;
        });

    }

    // ==========================================
    // ADICIONAR OUTRO PET
    // ==========================================

    btnAdicionar.addEventListener("click", () => {

        contador++;

        criarPet(
            {},
            contador
        );

    });

    // ==========================================
    // BOTÃO PROSSEGUIR
    // ==========================================

    btnProsseguir.addEventListener("click", () => {

        // ------------------------------
        // DADOS DO TUTOR
        // ------------------------------

        const nomeTutor =
            document.getElementById("nomeTutor")?.value.trim() || "";

        const cpfTutor =
            document.getElementById("cpfTutor")?.value.trim() || "";

        const telefoneTutor =
            document.getElementById("telefoneTutor")?.value.trim() || "";

        const emailTutor =
            document.getElementById("emailTutor")?.value.trim() || "";

        const enderecoTutor =
            document.getElementById("enderecoTutor")?.value.trim() || "";

        const cep =
            document.getElementById("cep")?.value.trim() || "";

        // ------------------------------
        // VALIDAR TUTOR
        // ------------------------------

        if (
            nomeTutor === "" ||
            cpfTutor === "" ||
            telefoneTutor === "" ||
            emailTutor === "" ||
            enderecoTutor === ""
        ) {

            alert(
                "Preencha todos os dados obrigatórios do tutor."
            );

            return;
        }

        // ------------------------------
        // LISTA DE PETS
        // ------------------------------

        const pets = [];

        const todosPets =
            container.querySelectorAll(".pet");

        todosPets.forEach((card) => {

            const nome =
                card.querySelector(".nomePet")?.value.trim() || "";

            const especie =
                card.querySelector(".especiePet")?.value || "";

            const raca =
                card.querySelector(".racaPet")?.value.trim() || "";

            const idade =
                card.querySelector(".idadePet")?.value.trim() || "";

            const sexo =
                card.querySelector(".sexoPet")?.value || "";

            const peso =
                card.querySelector(".pesoPet")?.value.trim() || "";

            // Só adiciona o pet se o nome estiver preenchido
            if (nome !== "") {

                pets.push({
                    nome: nome,
                    especie: especie,
                    raca: raca,
                    idade: idade,
                    sexo: sexo,
                    peso: peso
                });

            }

        });

        // ------------------------------
        // VERIFICAR SE EXISTE PET
        // ------------------------------

        if (pets.length === 0) {

            alert(
                "Cadastre pelo menos um pet."
            );

            return;
        }

        // ------------------------------
        // OBJETO DO TUTOR
        // ------------------------------

        const tutor = {
            nome: nomeTutor,
            cpf: cpfTutor,
            telefone: telefoneTutor,
            email: emailTutor,
            endereco: enderecoTutor,
            cep: cep
        };

        // ------------------------------
        // SALVAR TUTOR
        // ------------------------------

        try {

            localStorage.setItem(
                "tutor",
                JSON.stringify(tutor)
            );

            // ------------------------------
            // SALVAR PETS
            // ------------------------------

            localStorage.setItem(
                "pets",
                JSON.stringify(pets)
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar os dados:",
                erro
            );

            alert(
                "Não foi possível salvar os dados. Tente novamente."
            );

            return;
        }

        // ------------------------------
        // CONSOLE
        // ------------------------------

        console.log(
            "Tutor cadastrado:",
            tutor
        );

        console.log(
            "Pets cadastrados:",
            pets
        );

        // ------------------------------
        // IR PARA A PRÓXIMA PÁGINA
        // ------------------------------

        window.location.href = "dataehorario.html";

    });

});