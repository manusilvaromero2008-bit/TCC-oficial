document.addEventListener("DOMContentLoaded", () => {


    // ============================
    // ELEMENTOS
    // ============================

    const nomeClinica =
        document.getElementById("nomeClinica");


    const listaPets =
        document.getElementById("listaPets");


    const resumoClinica =
        document.getElementById("resumoClinica");


    const resumoData =
        document.getElementById("resumoData");


    const resumoHorario =
        document.getElementById("resumoHorario");


    const resumoServico =
        document.getElementById("resumoServico");


    const resumoVeterinario =
        document.getElementById("resumoVeterinario");


    const resumoPet =
        document.getElementById("resumoPet");


    const resumoTutor =
        document.getElementById("resumoTutor");


    const resumoTelefone =
        document.getElementById("resumoTelefone");


    const resumoTransporte =
        document.getElementById("resumoTransporte");


    const transportOption =
        document.getElementById("transportOption");


    const addressCard =
        document.getElementById("addressCard");


    const endereco =
        document.getElementById("endereco");


    const cep =
        document.getElementById("cep");


    const btnVoltar =
        document.getElementById("btnVoltar");


    const btnConfirmar =
        document.getElementById("btnConfirmar");


    const btnContinuar =
        document.getElementById("btnContinuar");



    // ============================
    // PEGAR DADOS
    // ============================

    const clinicaDados =
        JSON.parse(
            localStorage.getItem("clinicaDados")
        ) || {};


    const tutorDados =
        JSON.parse(
            localStorage.getItem("tutor")
        ) || {};


    const pets =
        JSON.parse(
            localStorage.getItem("pets")
        ) || [];


    const servico =
        localStorage.getItem("servico")
        || "Não informado";


    const preco =
        localStorage.getItem("precoServico")
        || "";


    const veterinario =
        localStorage.getItem("veterinario")
        || "Não informado";


    /*
    ==========================================
    DATA
    ==========================================

    Primeiro procura por dataAgendamento.

    Se não encontrar, procura por data.
    */

    const data =
        localStorage.getItem("dataAgendamento")
        || localStorage.getItem("data")
        || "Não informado";



    /*
    ==========================================
    HORÁRIO
    ==========================================

    Primeiro procura por horarioAgendamento.

    Se não encontrar, procura por horario.
    */

    const horario =
        localStorage.getItem("horarioAgendamento")
        || localStorage.getItem("horario")
        || "Não informado";



    let petSelecionado =

        JSON.parse(
            localStorage.getItem("petSelecionado")
        ) || null;


    let transporte =

        localStorage.getItem("transporte")
        === "true";



    // ============================
    // MOSTRAR CLÍNICA
    // ============================

    if (nomeClinica) {

        nomeClinica.textContent =
            clinicaDados.nome
            || "Clínica Veterinária";

    }


    if (resumoClinica) {

        resumoClinica.textContent =
            clinicaDados.nome
            || "Não informado";

    }



    // ============================
    // MOSTRAR PETS
    // ============================

    if (listaPets) {


        if (pets.length === 0) {

            listaPets.innerHTML = `

                <p>
                    Nenhum pet cadastrado.
                </p>

            `;

        }


        pets.forEach((pet) => {


            const card =
                document.createElement("div");


            card.classList.add(
                "pet-card"
            );


            card.innerHTML = `

                <div class="pet-icon">

                    <i class="fa-solid fa-paw"></i>

                </div>


                <div class="pet-info">

                    <h3>
                        ${pet.nome}
                    </h3>

                    <p>

                        ${pet.especie || ""}

                        ${pet.raca
                            ? " • " + pet.raca
                            : ""
                        }

                        ${pet.idade
                            ? " • " + pet.idade
                            : ""
                        }

                    </p>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {


                    document
                        .querySelectorAll(".pet-card")
                        .forEach(item => {

                            item.classList.remove(
                                "selecionado"
                            );

                        });


                    card.classList.add(
                        "selecionado"
                    );


                    petSelecionado = pet;


                    localStorage.setItem(
                        "petSelecionado",
                        JSON.stringify(pet)
                    );


                    atualizarResumoPet();

                }
            );


            if (
                petSelecionado &&
                petSelecionado.nome === pet.nome
            ) {

                card.classList.add(
                    "selecionado"
                );

            }


            listaPets.appendChild(card);

        });

    }



    // ============================
    // ATUALIZAR PET
    // ============================

    function atualizarResumoPet() {

        if (resumoPet) {

            resumoPet.textContent =

                petSelecionado
                    ? petSelecionado.nome
                    : "Nenhum pet selecionado";

        }

    }


    atualizarResumoPet();



    // ============================
    // RESUMO
    // ============================

    if (resumoData) {

        resumoData.textContent =
            data;

    }


    if (resumoHorario) {

        resumoHorario.textContent =
            horario;

    }


    if (resumoServico) {

        resumoServico.textContent =

            preco
                ? `${servico} - ${preco}`
                : servico;

    }


    if (resumoVeterinario) {

        resumoVeterinario.textContent =
            veterinario;

    }


    if (resumoTutor) {

        resumoTutor.textContent =
            tutorDados.nome
            || "Não informado";

    }


    if (resumoTelefone) {

        resumoTelefone.textContent =
            tutorDados.telefone
            || "Não informado";

    }



    // ============================
    // ENDEREÇO
    // ============================

    if (endereco) {

        endereco.textContent =
            tutorDados.endereco
            || "Endereço não informado";

    }


    if (cep) {

        cep.textContent =

            tutorDados.cep
                ? "CEP: " + tutorDados.cep
                : "CEP não informado";

    }



    // ============================
    // TRANSPORTE
    // ============================

    function atualizarTransporte() {


        if (transporte) {


            transportOption?.classList.add(
                "selected"
            );


            addressCard?.classList.add(
                "show"
            );


            if (resumoTransporte) {

                resumoTransporte.textContent =
                    "Solicitado";

            }


        } else {


            transportOption?.classList.remove(
                "selected"
            );


            addressCard?.classList.remove(
                "show"
            );


            if (resumoTransporte) {

                resumoTransporte.textContent =
                    "Não solicitado";

            }

        }

    }


    atualizarTransporte();



    if (transportOption) {


        transportOption.addEventListener(
            "click",
            () => {


                transporte =
                    !transporte;


                localStorage.setItem(
                    "transporte",
                    transporte
                );


                atualizarTransporte();

            }
        );

    }



    // ============================
    // VOLTAR
    // ============================

    if (btnVoltar) {


        btnVoltar.addEventListener(
            "click",
            () => {

                window.location.href =
                    "servicos.html";

            }
        );

    }



    // ============================
    // BOTÃO CONTINUAR
    // ============================

    if (btnContinuar) {


        btnContinuar.addEventListener(
            "click",
            () => {


                // Verifica se selecionou um pet

                if (!petSelecionado) {

                    alert(
                        "Selecione um pet antes de continuar."
                    );

                    return;

                }



                // ============================
                // SALVAR AGENDAMENTO FINAL
                // ============================

                const agendamentoFinal = {

                    clinica:
                        clinicaDados.nome
                        || "Não informado",


                    data:
                        data,


                    horario:
                        horario,


                    servico:
                        servico,


                    preco:
                        preco,


                    veterinario:
                        veterinario,


                    pet:
                        petSelecionado,


                    tutor:
                        tutorDados,


                    transporte:
                        transporte

                };



                localStorage.setItem(
                    "agendamentoFinal",
                    JSON.stringify(
                        agendamentoFinal
                    )
                );



                // ============================
                // IR PARA PÁGINA FINAL
                // ============================

                window.location.href =
                    "final.html";

            }
        );

    }



    // ============================
    // CONFIRMAR
    // ============================

    if (btnConfirmar) {


        btnConfirmar.addEventListener(
            "click",
            () => {


                if (!petSelecionado) {


                    alert(
                        "Selecione um pet antes de continuar."
                    );


                    return;

                }



                const agendamentoFinal = {

                    clinica:
                        clinicaDados.nome
                        || "Não informado",


                    data:
                        data,


                    horario:
                        horario,


                    servico:
                        servico,


                    preco:
                        preco,


                    veterinario:
                        veterinario,


                    pet:
                        petSelecionado,


                    tutor:
                        tutorDados,


                    transporte:
                        transporte

                };



                localStorage.setItem(
                    "agendamentoFinal",
                    JSON.stringify(
                        agendamentoFinal
                    )
                );



                alert(
                    "Agendamento confirmado com sucesso!"
                );


                window.location.href =
                    "../../home.html";

            }
        );

    }

});