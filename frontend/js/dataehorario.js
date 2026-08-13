document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // DADOS DA CLÍNICA
    // ===========================

    const clinicaDados = localStorage.getItem("clinicaDados");
    const clinica = clinicaDados ? JSON.parse(clinicaDados) : null;

    const nomeClinica = document.getElementById("nomeClinica");

    if (clinica && nomeClinica) {
        nomeClinica.textContent = clinica.nome || "";
    }


    // ===========================
    // ELEMENTOS
    // ===========================

    const botoesData = document.querySelectorAll(".datas button");
    const botoesHora = document.querySelectorAll(".horarios button");

    const cardHorario = document.getElementById("cardHorario");
    const btnContinuar = document.getElementById("btnContinuar");


    // ===========================
    // CONFIGURAÇÃO INICIAL
    // ===========================

    if (cardHorario) {
        cardHorario.style.display = "none";
    }

    if (btnContinuar) {
        btnContinuar.style.display = "none";
    }


    let dataSelecionada = "";
    let horarioSelecionado = "";


    // ===========================
    // SELECIONAR DATA
    // ===========================

    botoesData.forEach(botao => {

        botao.addEventListener("click", () => {

            botoesData.forEach(b => {
                b.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            dataSelecionada = botao.textContent.trim();

            if (cardHorario) {

                cardHorario.style.display = "block";

                cardHorario.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });

    });


    // ===========================
    // SELECIONAR HORÁRIO
    // ===========================

    botoesHora.forEach(botao => {

        botao.addEventListener("click", () => {

            botoesHora.forEach(b => {
                b.classList.remove("selecionado");
            });

            botao.classList.add("selecionado");

            horarioSelecionado = botao.textContent.trim();

            if (btnContinuar) {
                btnContinuar.style.display = "block";
            }

        });

    });


    // ===========================
    // CONTINUAR
    // ===========================

    if (btnContinuar) {

        btnContinuar.addEventListener("click", () => {

            // Verifica data
            if (!dataSelecionada) {

                alert("Selecione uma data.");

                return;
            }


            // Verifica horário
            if (!horarioSelecionado) {

                alert("Selecione um horário.");

                return;
            }


            // ===========================
            // RECUPERAR DADOS EXISTENTES
            // ===========================

            const agendamentoSalvo =
                localStorage.getItem("agendamento");

            const agendamento =
                agendamentoSalvo
                    ? JSON.parse(agendamentoSalvo)
                    : {};


            // ===========================
            // DATA E HORÁRIO
            // ===========================

            agendamento.data = dataSelecionada;
            agendamento.horario = horarioSelecionado;


            // ===========================
            // CLÍNICA / UNIDADE
            // ===========================

            if (clinica) {

                agendamento.clinica = clinica.nome || "";

                agendamento.unidade = clinica.nome || "";

                agendamento.clinicaDados = clinica;

            }


            // ===========================
            // SERVIÇO
            // ===========================

            const servicoSelecionado =
                localStorage.getItem("servicoSelecionado");

            if (servicoSelecionado) {

                agendamento.servico =
                    servicoSelecionado;

            }


            // ===========================
            // PET
            // ===========================

            let petSelecionado =
                localStorage.getItem("petSelecionado");

            if (!petSelecionado) {

                petSelecionado =
                    localStorage.getItem("pet");

            }

            if (!petSelecionado) {

                petSelecionado =
                    localStorage.getItem("petDados");

            }


            // Se o pet estiver salvo como JSON
            if (petSelecionado) {

                try {

                    const petObjeto =
                        JSON.parse(petSelecionado);

                    if (typeof petObjeto === "object" && petObjeto !== null) {

                        agendamento.pet =
                            petObjeto.nome ||
                            petObjeto.name ||
                            petObjeto.pet ||
                            "";

                    } else {

                        agendamento.pet =
                            petObjeto;

                    }

                } catch (erro) {

                    agendamento.pet =
                        petSelecionado;

                }

            }


            // ===========================
            // SALVAR AGENDAMENTO
            // ===========================

            localStorage.setItem(
                "agendamento",
                JSON.stringify(agendamento)
            );


            // ===========================
            // SALVAR DATA E HORÁRIO
            // ===========================

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


            // ===========================
            // IR PARA SERVIÇOS
            // ===========================

            window.location.href = "servicos.html";

        });

    }

});