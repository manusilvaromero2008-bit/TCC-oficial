document.addEventListener("DOMContentLoaded", () => {

    const btnInicio =
        document.getElementById("btnInicio");

    const btnOutroPet =
        document.getElementById("btnOutroPet");

    let agendamento = null;

    const dadosFinal =
        localStorage.getItem("agendamentoFinal");

    if (dadosFinal) {

        try {

            agendamento =
                JSON.parse(dadosFinal);

        } catch (erro) {

            console.error(
                "Erro ao ler agendamentoFinal:",
                erro
            );

        }

    }

    if (!agendamento) {

        const dadosAgendamento =
            localStorage.getItem("agendamento");

        if (dadosAgendamento) {

            try {

                agendamento =
                    JSON.parse(dadosAgendamento);

            } catch (erro) {

                console.error(
                    "Erro ao ler agendamento:",
                    erro
                );

            }

        }

    }

    if (!agendamento) {

        console.error(
            "Nenhum agendamento encontrado."
        );

        return;

    }

    const tutorSalvo =
        localStorage.getItem("tutor");

    if (tutorSalvo) {

        try {

            const tutor =
                JSON.parse(tutorSalvo);

            if (!agendamento.tutor) {

                agendamento.tutor =
                    tutor;

            }

        } catch (erro) {

            console.error(
                "Erro ao carregar dados do tutor:",
                erro
            );

        }

    }

    const elementoClinica =
        document.getElementById("unidade");

    if (elementoClinica) {

        elementoClinica.textContent =
            agendamento.clinica ||
            agendamento.unidade ||
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
                " - " +
                agendamento.preco;

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

    const elementoTransporte =
        document.getElementById("transporte");

    if (elementoTransporte) {

        if (
            agendamento.transporte === true ||
            agendamento.transporte === "true" ||
            agendamento.transporte === "Sim" ||
            agendamento.transporte === "sim"
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
                JSON.parse(
                    agendamentosSalvos
                );

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

    const petNome =
        agendamento.pet &&
        typeof agendamento.pet === "object"
            ? agendamento.pet.nome
            : agendamento.pet;

    const agendamentoExiste =
        agendamentos.some(item => {

            const itemPet =
                item.pet &&
                typeof item.pet === "object"
                    ? item.pet.nome
                    : item.pet;

            return (
                item.data === agendamento.data &&
                item.horario === agendamento.horario &&
                itemPet === petNome &&
                item.clinica === agendamento.clinica
            );

        });

    if (!agendamentoExiste) {

        agendamentos.push(
            agendamento
        );

        localStorage.setItem(
            "agendamentos",
            JSON.stringify(
                agendamentos
            )
        );

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

    if (btnOutroPet) {

        btnOutroPet.addEventListener(
            "click",
            () => {

                localStorage.removeItem(
                    "agendamento"
                );

                localStorage.removeItem(
                    "agendamentoFinal"
                );

                localStorage.removeItem(
                    "petSelecionado"
                );

                localStorage.removeItem(
                    "transporte"
                );

                localStorage.removeItem(
                    "data"
                );

                localStorage.removeItem(
                    "horario"
                );

                localStorage.removeItem(
                    "dataAgendamento"
                );

                localStorage.removeItem(
                    "horarioAgendamento"
                );

                localStorage.removeItem(
                    "servico"
                );

                localStorage.removeItem(
                    "servicoSelecionado"
                );

                localStorage.removeItem(
                    "precoServico"
                );

                localStorage.removeItem(
                    "veterinario"
                );

                localStorage.removeItem(
                    "tipoServico"
                );

                localStorage.removeItem(
                    "servicoId"
                );

                window.location.href =
                    "dataehorario.html";

            }
        );

    }

});