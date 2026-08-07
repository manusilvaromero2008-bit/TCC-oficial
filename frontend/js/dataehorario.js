document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // DADOS DA CLÍNICA
    // ===========================

    const clinica = JSON.parse(localStorage.getItem("clinicaDados"));

    if (clinica && document.getElementById("nomeClinica")) {
        document.getElementById("nomeClinica").textContent = clinica.nome;
    }

    // ===========================
    // ELEMENTOS
    // ===========================

    const botoesData = document.querySelectorAll(".datas button");
    const botoesHora = document.querySelectorAll(".horarios button");

    const cardHorario = document.getElementById("cardHorario");
    const btnContinuar = document.getElementById("btnContinuar");

    cardHorario.style.display = "none";
    btnContinuar.style.display = "none";

    let dataSelecionada = "";
    let horarioSelecionado = "";

    // ===========================
    // DATA
    // ===========================

    botoesData.forEach(botao => {

        botao.addEventListener("click", () => {

            botoesData.forEach(b => {
                b.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            dataSelecionada = botao.textContent.trim();

            cardHorario.style.display = "block";

            cardHorario.scrollIntoView({
                behavior: "smooth"
            });

        });

    });

    // ===========================
    // HORÁRIO
    // ===========================

    botoesHora.forEach(botao => {

        botao.addEventListener("click", () => {

            botoesHora.forEach(b => {
                b.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            horarioSelecionado = botao.textContent.trim();

            btnContinuar.style.display = "block";

        });

    });

    // ===========================
    // CONTINUAR
    // ===========================

    btnContinuar.addEventListener("click", () => {

        if (!dataSelecionada) {
            alert("Selecione uma data.");
            return;
        }

        if (!horarioSelecionado) {
            alert("Selecione um horário.");
            return;
        }

        const agendamento = JSON.parse(localStorage.getItem("agendamento")) || {};

        agendamento.data = dataSelecionada;
        agendamento.horario = horarioSelecionado;

        localStorage.setItem(
            "agendamento",
            JSON.stringify(agendamento)
        );

        window.location.href = "servicos.html";

    });

});