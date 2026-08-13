document.addEventListener("DOMContentLoaded", () => {

    

    const clinicaDados = localStorage.getItem("clinicaDados");
    const clinica = clinicaDados ? JSON.parse(clinicaDados) : null;

    const nomeClinica = document.getElementById("nomeClinica");

    if (clinica && nomeClinica) {
        nomeClinica.textContent = clinica.nome || "";
    }


    

    const botoesData = document.querySelectorAll(".datas button");
    const botoesHora = document.querySelectorAll(".horarios button");

    const cardHorario = document.getElementById("cardHorario");
    const btnContinuar = document.getElementById("btnContinuar");


    

    if (cardHorario) {
        cardHorario.style.display = "none";
    }

    if (btnContinuar) {
        btnContinuar.style.display = "none";
    }


    let dataSelecionada = "";
    let horarioSelecionado = "";


    

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


            

            const agendamentoSalvo =
                localStorage.getItem("agendamento");

            const agendamento =
                agendamentoSalvo
                    ? JSON.parse(agendamentoSalvo)
                    : {};


            

            agendamento.data = dataSelecionada;
            agendamento.horario = horarioSelecionado;


            
            

            if (clinica) {

                agendamento.clinica = clinica.nome || "";

                agendamento.unidade = clinica.nome || "";

                agendamento.clinicaDados = clinica;

            }


           

            const servicoSelecionado =
                localStorage.getItem("servicoSelecionado");

            if (servicoSelecionado) {

                agendamento.servico =
                    servicoSelecionado;

            }


            

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