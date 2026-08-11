document.addEventListener("DOMContentLoaded", () => {

    // ===========================
    // DADOS DA CLÍNICA
    // ===========================

    const clinica =
        JSON.parse(
            localStorage.getItem("clinicaDados")
        );

    if (
        clinica &&
        document.getElementById("nomeClinica")
    ) {

        document.getElementById("nomeClinica").textContent =
            clinica.nome;

    }


    // ===========================
    // ELEMENTOS
    // ===========================

    const botoesData =
        document.querySelectorAll(".datas button");


    const botoesHora =
        document.querySelectorAll(".horarios button");


    const cardHorario =
        document.getElementById("cardHorario");


    const btnContinuar =
        document.getElementById("btnContinuar");


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


            // Remove seleção das outras datas

            botoesData.forEach(b => {

                b.classList.remove(
                    "selecionado"
                );

            });


            // Seleciona a data clicada

            botao.classList.add(
                "selecionado"
            );


            // Guarda a data

            dataSelecionada =
                botao.textContent.trim();


            // Mostra os horários

            if (cardHorario) {

                cardHorario.style.display =
                    "block";


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


            // Remove seleção dos outros horários

            botoesHora.forEach(b => {

                b.classList.remove(
                    "selecionado"
                );

            });


            // Seleciona o horário

            botao.classList.add(
                "selecionado"
            );


            // Guarda o horário

            horarioSelecionado =
                botao.textContent.trim();


            // Mostra botão continuar

            if (btnContinuar) {

                btnContinuar.style.display =
                    "block";

            }

        });

    });



    // ===========================
    // CONTINUAR
    // ===========================

    if (btnContinuar) {

        btnContinuar.addEventListener(
            "click",
            () => {


                // Verifica a data

                if (!dataSelecionada) {

                    alert(
                        "Selecione uma data."
                    );

                    return;

                }


                // Verifica o horário

                if (!horarioSelecionado) {

                    alert(
                        "Selecione um horário."
                    );

                    return;

                }



                // ===========================
                // AGENDAMENTO
                // ===========================

                const agendamento =
                    JSON.parse(
                        localStorage.getItem(
                            "agendamento"
                        )
                    ) || {};



                // Salva dentro do agendamento

                agendamento.data =
                    dataSelecionada;


                agendamento.horario =
                    horarioSelecionado;



                localStorage.setItem(
                    "agendamento",
                    JSON.stringify(
                        agendamento
                    )
                );



                // ===========================
                // SALVAR DIRETAMENTE
                // ===========================

                /*
                Essas duas linhas são importantes
                para a página Pet e Transporte.
                */

                localStorage.setItem(
                    "data",
                    dataSelecionada
                );


                localStorage.setItem(
                    "horario",
                    horarioSelecionado
                );



                // Também salva com nomes alternativos

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

                window.location.href =
                    "servicos.html";

            }

        );

    }

});