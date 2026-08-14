document.addEventListener("DOMContentLoaded", () => {

    const nomeClinica = document.getElementById("nomeClinica");
    const cardHorario = document.getElementById("cardHorario");
    const btnContinuar = document.getElementById("btnContinuar");

    const botoesData = document.querySelectorAll(".datas button");
    const botoesHora = document.querySelectorAll(".horarios button");

    let clinica = null;
    let dataSelecionada = "";
    let horarioSelecionado = "";

    try {
        const clinicaStorage = localStorage.getItem("clinicaDados");

        if (clinicaStorage) {
            clinica = JSON.parse(clinicaStorage);
        }
    } catch (erro) {
        console.error("Erro ao carregar os dados da clínica:", erro);
    }

    if (clinica && nomeClinica) {
        nomeClinica.textContent = clinica.nome || "";
    }

    if (cardHorario) {
        cardHorario.style.display = "none";
    }

    if (btnContinuar) {
        btnContinuar.style.display = "none";
    }

    botoesData.forEach(botao => {

        botao.addEventListener("click", () => {

            botoesData.forEach(item => {
                item.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            dataSelecionada = botao.textContent.trim();

            if (cardHorario) {
                cardHorario.style.display = "block";

                cardHorario.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

    botoesHora.forEach(botao => {

        botao.addEventListener("click", () => {

            botoesHora.forEach(item => {
                item.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            horarioSelecionado = botao.textContent.trim();

            if (btnContinuar) {
                btnContinuar.style.display = "block";
            }

        });

    });

    if (btnContinuar) {

        btnContinuar.addEventListener("click", () => {

            if (!dataSelecionada) {
                alert("Selecione uma data.");
                return;
            }

            if (!horarioSelecionado) {
                alert("Selecione um horário.");
                return;
            }

            let agendamento = {};

            try {
                const agendamentoStorage =
                    localStorage.getItem("agendamento");

                if (agendamentoStorage) {
                    agendamento = JSON.parse(agendamentoStorage);
                }
            } catch (erro) {
                console.error("Erro ao carregar o agendamento:", erro);
                agendamento = {};
            }

            agendamento.data = dataSelecionada;
            agendamento.horario = horarioSelecionado;

            if (clinica) {
                agendamento.clinica = clinica.nome || "";
                agendamento.unidade = clinica.nome || "";
                agendamento.clinicaDados = clinica;
            }

            localStorage.setItem(
                "agendamento",
                JSON.stringify(agendamento)
            );

            localStorage.setItem(
                "data",
                dataSelecionada
            );

            localStorage.setItem(
                "horario",
                horarioSelecionado
            );

            localStorage.setItem(
                "dataAgendamento",
                dataSelecionada
            );

            localStorage.setItem(
                "horarioAgendamento",
                horarioSelecionado
            );

            window.location.href = "servicos.html";

        });

    }

});