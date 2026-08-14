document.addEventListener("DOMContentLoaded", () => {

    const btnInicio = document.getElementById("btnInicio");
    const btnOutroPet = document.getElementById("btnOutroPet");
    const btnAgendamentos = document.getElementById("btnAgendamentos");

    const dadosSalvos = localStorage.getItem("agendamentoFinal");

    let agendamento = null;

    if (dadosSalvos) {
        try {
            agendamento = JSON.parse(dadosSalvos);
        } catch (erro) {
            console.error("Erro ao ler agendamentoFinal:", erro);
        }
    }

    if (!agendamento) {

        const agendamentoSalvo =
            localStorage.getItem("agendamento");

        if (agendamentoSalvo) {
            try {
                agendamento = JSON.parse(agendamentoSalvo);
            } catch (erro) {
                console.error("Erro ao ler agendamento:", erro);
            }
        }
    }

    if (!agendamento) {
        console.error("Nenhum agendamento encontrado.");
        return;
    }

    const tutorSalvo = localStorage.getItem("tutor");

    if (tutorSalvo) {
        try {
            const tutor = JSON.parse(tutorSalvo);

            if (!agendamento.tutor) {
                agendamento.tutor = tutor;
            }
        } catch (erro) {
            console.error("Erro ao carregar dados do tutor:", erro);
        }
    }

    const elementoClinica = document.getElementById("unidade");

    if (elementoClinica) {
        elementoClinica.textContent =
            agendamento.clinica ||
            agendamento.unidade ||
            "Clínica não informada";
    }

    const elementoPet = document.getElementById("pet");

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

    const elementoServico = document.getElementById("servico");

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

    const elementoData = document.getElementById("data");

    if (elementoData) {
        elementoData.textContent =
            agendamento.data ||
            "Data não informada";
    }

    const elementoHorario = document.getElementById("horario");

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

        const transporte =
            agendamento.transporte;

        if (
            transporte === true ||
            transporte === "Sim" ||
            transporte === "sim"
        ) {
            elementoTransporte.textContent =
                "Solicitado";
        } else {
            elementoTransporte.textContent =
                "Não solicitado";
        }
    }

    let agendamentos = [];

    try {

        const agendamentosSalvos =
            localStorage.getItem("agendamentos");

        if (agendamentosSalvos) {
            agendamentos =
                JSON.parse(agendamentosSalvos);
        }

        if (!Array.isArray(agendamentos)) {
            agendamentos = [];
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar agendamentos:",
            erro
        );

        agendamentos = [];
    }

    const agendamentoExiste =
        agendamentos.some(item =>
            item.data === agendamento.data &&
            item.horario === agendamento.horario &&
            item.pet === agendamento.pet &&
            item.clinica === agendamento.clinica
        );

    if (!agendamentoExiste) {

        agendamentos.push(agendamento);

        localStorage.setItem(
            "agendamentos",
            JSON.stringify(agendamentos)
        );
    }

    if (btnInicio) {

        btnInicio.addEventListener("click", () => {
            window.location.href = "../../home.html";
        });

    }

    if (btnOutroPet) {

        btnOutroPet.addEventListener("click", () => {

            localStorage.removeItem("agendamento");
            localStorage.removeItem("agendamentoFinal");

            window.location.href =
                "dataehorario.html";

        });

    }

    if (btnAgendamentos) {

        btnAgendamentos.addEventListener("click", () => {

            window.location.href =
                "meusagendamentos.html";

        });

    }

});