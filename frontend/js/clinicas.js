document.addEventListener("DOMContentLoaded", () => {

    const dadosSalvos = localStorage.getItem("clinicaDados");

    let clinica = null;

    if (dadosSalvos) {
        try {
            clinica = JSON.parse(dadosSalvos);
        } catch (erro) {
            console.error("Erro ao carregar dados da clínica:", erro);
            localStorage.removeItem("clinicaDados");
        }
    }

    if (!clinica) {
        console.log("Nenhuma clínica selecionada.");
        return;
    }

    const titulo = document.querySelector(".clinic-header h1");

    if (titulo) {
        titulo.innerHTML = `
            <i class="fa-solid fa-hospital"></i>
            ${clinica.nome || "Clínica Veterinária"}
        `;
    }

    const infos = document.querySelector(".box");

    if (infos) {

        const paragrafos = infos.querySelectorAll("p");

        if (paragrafos[0]) {
            paragrafos[0].innerHTML = `
                <i class="fa-solid fa-location-dot"></i>
                ${clinica.endereco || "Endereço não informado"}
            `;
        }

        if (paragrafos[1]) {
            paragrafos[1].innerHTML = `
                <i class="fa-solid fa-phone"></i>
                ${clinica.telefone || "Telefone não informado"}
            `;
        }

        if (paragrafos[2]) {
            paragrafos[2].innerHTML = `
                <i class="fa-regular fa-clock"></i>
                ${clinica.horario || "Horário não informado"}
            `;
        }

    }

    const preco = document.querySelector(".preco-box strong");

    if (preco) {
        preco.textContent = clinica.consulta || "Não informado";
    }

    localStorage.setItem(
        "clinicaDados",
        JSON.stringify(clinica)
    );

    localStorage.setItem(
        "clinica",
        clinica.nome || ""
    );

    const btnAgendar = document.getElementById("btnAgendar");

    if (btnAgendar) {

        btnAgendar.addEventListener("click", (event) => {

            event.preventDefault();

            const tutorSalvo = localStorage.getItem("tutor");
            const petsSalvos = localStorage.getItem("pets");

            let cadastroCompleto = false;

            try {

                const tutor = tutorSalvo
                    ? JSON.parse(tutorSalvo)
                    : null;

                const pets = petsSalvos
                    ? JSON.parse(petsSalvos)
                    : [];

                if (
                    tutor &&
                    tutor.nome &&
                    tutor.cpf &&
                    tutor.telefone &&
                    tutor.email &&
                    tutor.endereco &&
                    Array.isArray(pets) &&
                    pets.length > 0
                ) {
                    cadastroCompleto = true;
                }

            } catch (erro) {

                console.error(
                    "Erro ao verificar cadastro:",
                    erro
                );

                cadastroCompleto = false;
            }

            if (cadastroCompleto) {

                window.location.href = "dataehorario.html";

            } else {

                window.location.href = "cadastro.html";

            }

        });

    }

    console.log("Clínica atual:", clinica);

});