document.addEventListener("DOMContentLoaded", () => {

    

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


   

    if (!clinica) {

        console.log(
            "Nenhuma clínica selecionada."
        );

        return;

    }


    

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


    

    const infos =
        document.querySelector(".box");


    if (infos) {

        const paragrafos =
            infos.querySelectorAll("p");


        

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


    

    const preco =
        document.querySelector(
            ".preco-box strong"
        );


    if (preco) {

        preco.textContent =
            clinica.consulta ||
            "Não informado";

    }


    

    localStorage.setItem(
        "clinicaDados",
        JSON.stringify(clinica)
    );


    localStorage.setItem(
        "clinica",
        clinica.nome || ""
    );


   

    console.log(
        "Clínica atual:",
        clinica
    );

});