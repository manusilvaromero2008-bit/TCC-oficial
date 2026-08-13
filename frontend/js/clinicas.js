document.addEventListener("DOMContentLoaded", () => {

    // ============================
    // PEGAR DADOS DA CLÍNICA
    // ============================

    const dadosSalvos =
        localStorage.getItem("clinicaDados");

    let clinica = null;

    if (dadosSalvos) {

        try {

            clinica = JSON.parse(dadosSalvos);

        } catch (erro) {

            console.error(
                "Erro ao carregar dados da clínica:",
                erro
            );

        }

    }


    // ============================
    // VERIFICAR CLÍNICA
    // ============================

    if (!clinica) {

        console.log(
            "Nenhuma clínica selecionada."
        );

        return;

    }


    // ============================
    // NOME DA CLÍNICA
    // ============================

    const titulo =
        document.querySelector(
            ".clinic-header h1"
        );


    if (titulo) {

        titulo.innerHTML = `
            <i class="fa-solid fa-hospital"></i>
            ${clinica.nome || "Clínica Veterinária"}
        `;

    }


    // ============================
    // INFORMAÇÕES DA CLÍNICA
    // ============================

    const infos =
        document.querySelector(".box");


    if (infos) {

        const paragrafos =
            infos.querySelectorAll("p");


        // ENDEREÇO

        if (paragrafos[0]) {

            paragrafos[0].innerHTML = `
                <i class="fa-solid fa-location-dot"></i>
                ${clinica.endereco || "Endereço não informado"}
            `;

        }


        // TELEFONE

        if (paragrafos[1]) {

            paragrafos[1].innerHTML = `
                <i class="fa-solid fa-phone"></i>
                ${clinica.telefone || "Telefone não informado"}
            `;

        }


        // HORÁRIO

        if (paragrafos[2]) {

            paragrafos[2].innerHTML = `
                <i class="fa-regular fa-clock"></i>
                ${clinica.horario || "Horário não informado"}
            `;

        }

    }


    // ============================
    // PREÇO DA CONSULTA
    // ============================

    const preco =
        document.querySelector(
            ".preco-box strong"
        );


    if (preco) {

        preco.textContent =
            clinica.consulta ||
            "Não informado";

    }


    // ============================
    // GARANTIR QUE A CLÍNICA
    // CONTINUE SALVA
    // ============================

    localStorage.setItem(
        "clinicaDados",
        JSON.stringify(clinica)
    );


    localStorage.setItem(
        "clinica",
        clinica.nome || ""
    );


    // ============================
    // DEBUG
    // ============================

    console.log(
        "Clínica atual:",
        clinica
    );

});