document.addEventListener("DOMContentLoaded", () => {

   

    const btnInicio =
        document.getElementById("btnInicio");

    if (btnInicio) {

        btnInicio.addEventListener("click", () => {

            window.location.href = "../../home.html";

        });

    }


   

    const dadosSalvos =
        localStorage.getItem("agendamentoFinal");

    let agendamento = null;

    if (dadosSalvos) {

        try {

            agendamento =
                JSON.parse(dadosSalvos);

        } catch (erro) {

            console.error(
                "Erro ao ler agendamentoFinal:",
                erro
            );

        }

    }


    
    if (!agendamento) {

        console.error(
            "Nenhum agendamento encontrado."
        );

        return;

    }


    

    const elementoClinica =
        document.getElementById("unidade");


    if (elementoClinica) {

        elementoClinica.textContent =
            agendamento.clinica ||
            "Clínica não informada";

    }


   
    const elementoPet =
        document.getElementById("pet");


    if (elementoPet) {

        let nomePet = "";

        if (
            agendamento.pet &&
            typeof agendamento.pet === "object"
        ) {

            nomePet =
                agendamento.pet.nome ||
                "";

        } else {

            nomePet =
                agendamento.pet ||
                "";

        }


        elementoPet.textContent =
            nomePet ||
            "Pet não informado";

    }


   

    const elementoServico =
        document.getElementById("servico");


    if (elementoServico) {

        let textoServico =
            agendamento.servico ||
            "Serviço não informado";


        if (agendamento.preco) {

            textoServico +=
                " - " + agendamento.preco;

        }


        elementoServico.textContent =
            textoServico;

    }


    

    const elementoData =
        document.getElementById("data");


    if (elementoData) {

        elementoData.textContent =
            agendamento.data ||
            "Data não informada";

    }


  

    const elementoHorario =
        document.getElementById("horario");


    if (elementoHorario) {

        elementoHorario.textContent =
            agendamento.horario ||
            "Horário não informado";

    }


   

    const elementoVeterinario =
        document.getElementById("veterinario");


    if (elementoVeterinario) {

        elementoVeterinario.textContent =
            agendamento.veterinario ||
            "Não informado";

    }


    

    const elementoTutor =
        document.getElementById("tutor");


    if (elementoTutor) {

        let nomeTutor = "";


        if (
            agendamento.tutor &&
            typeof agendamento.tutor === "object"
        ) {

            nomeTutor =
                agendamento.tutor.nome ||
                "";

        } else {

            nomeTutor =
                agendamento.tutor ||
                "";

        }


        elementoTutor.textContent =
            nomeTutor ||
            "Não informado";

    }


   

    const elementoTelefone =
        document.getElementById("telefone");


    if (elementoTelefone) {

        let telefone = "";


        if (
            agendamento.tutor &&
            typeof agendamento.tutor === "object"
        ) {

            telefone =
                agendamento.tutor.telefone ||
                "";

        }


        elementoTelefone.textContent =
            telefone ||
            "Não informado";

    }


    

    const elementoTransporte =
        document.getElementById("transporte");


    if (elementoTransporte) {

        elementoTransporte.textContent =
            agendamento.transporte
                ? "Solicitado"
                : "Não solicitado";

    }

});