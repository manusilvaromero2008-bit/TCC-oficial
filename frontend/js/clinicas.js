document.addEventListener("DOMContentLoaded", () => {


    // ============================
    // PEGAR DADOS DA CLÍNICA
    // ============================

    const clinica =
        JSON.parse(
            localStorage.getItem("clinicaDados")
        );


    if(!clinica){
        console.log("Nenhuma clínica encontrada");
        return;
    }



    // ============================
    // MOSTRAR NOME
    // ============================

    const titulo =
        document.querySelector(".clinic-header h1");


    if(titulo){

        titulo.innerHTML =
        `
        <i class="fa-solid fa-hospital"></i>
        ${clinica.nome}
        `;

    }



    // ============================
    // MOSTRAR INFORMAÇÕES
    // ============================

    const infos =
        document.querySelector(".box");


    if(infos){

        const paragrafos =
            infos.querySelectorAll("p");


        if(paragrafos[0])
            paragrafos[0].innerHTML =
            `
            <i class="fa-solid fa-location-dot"></i>
            ${clinica.endereco}
            `;


        if(paragrafos[1])
            paragrafos[1].innerHTML =
            `
            <i class="fa-solid fa-phone"></i>
            ${clinica.telefone}
            `;


        if(paragrafos[2])
            paragrafos[2].innerHTML =
            `
            <i class="fa-regular fa-clock"></i>
            ${clinica.horario}
            `;

    }



    // ============================
    // MOSTRAR PREÇO CONSULTA
    // ============================

    const preco =
        document.querySelector(".preco-box strong");


    if(preco){

        preco.textContent =
            clinica.consulta;

    }


});