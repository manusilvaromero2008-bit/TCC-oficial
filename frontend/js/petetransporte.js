document.addEventListener("DOMContentLoaded", () => {

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

    const btnContinuar =
        document.getElementById("btnContinuar");


    let clinicaDados = {};
    let tutorDados = {};
    let pets = [];
    let petSelecionado = null;
    let transporte = false;


    try {

        const clinicaSalva =
            localStorage.getItem("clinicaDados");

        if (clinicaSalva) {
            clinicaDados =
                JSON.parse(clinicaSalva);
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar dados da clínica:",
            erro
        );

    }


    try {

        const tutorSalvo =
            localStorage.getItem("tutor");

        if (tutorSalvo) {
            tutorDados =
                JSON.parse(tutorSalvo);
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar dados do tutor:",
            erro
        );

    }


    try {

        const petsSalvos =
            localStorage.getItem("pets");

        if (petsSalvos) {
            pets =
                JSON.parse(petsSalvos);
        }

        if (!Array.isArray(pets)) {
            pets = [];
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar pets:",
            erro
        );

        pets = [];

    }


    const nomeDaClinica =
        clinicaDados.nome ||
        clinicaDados.unidade ||
        "Clínica Veterinária";


    const servico =
        localStorage.getItem("servicoSelecionado") ||
        localStorage.getItem("servico") ||
        "Não informado";


    const preco =
        localStorage.getItem("precoServico") ||
        "";


    const veterinario =
        localStorage.getItem("veterinario") ||
        "Não informado";


    const data =
        localStorage.getItem("dataAgendamento") ||
        localStorage.getItem("data") ||
        "Não informado";


    const horario =
        localStorage.getItem("horarioAgendamento") ||
        localStorage.getItem("horario") ||
        "Não informado";


    localStorage.removeItem("petSelecionado");
    localStorage.removeItem("transporte");


    if (nomeClinica) {
        nomeClinica.textContent =
            nomeDaClinica;
    }


    if (resumoClinica) {
        resumoClinica.textContent =
            nomeDaClinica;
    }


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
            tutorDados.nome ||
            "Não informado";
    }


    if (resumoTelefone) {
        resumoTelefone.textContent =
            tutorDados.telefone ||
            "Não informado";
    }


    if (endereco) {
        endereco.textContent =
            tutorDados.endereco ||
            "Endereço não informado";
    }


    if (cep) {

        cep.textContent =
            tutorDados.cep
                ? "CEP: " + tutorDados.cep
                : "CEP não informado";

    }


    if (listaPets) {

        listaPets.innerHTML = "";

        if (pets.length === 0) {

            listaPets.innerHTML = `
                <p>Nenhum pet cadastrado.</p>
            `;

        } else {

            pets.forEach((pet, index) => {

                const card =
                    document.createElement("div");

                card.classList.add("pet-card");

                card.dataset.index =
                    index;

                card.innerHTML = `

                    <div class="pet-icon">
                        <i class="fa-solid fa-paw"></i>
                    </div>

                    <div class="pet-info">

                        <h3>
                            ${pet.nome || "Pet sem nome"}
                        </h3>

                        <p>
                            ${pet.especie || ""}
                            ${pet.raca ? " • " + pet.raca : ""}
                            ${pet.idade ? " • " + pet.idade : ""}
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


                        petSelecionado =
                            pet;


                        localStorage.setItem(
                            "petSelecionado",
                            JSON.stringify(pet)
                        );


                        atualizarResumoPet();

                    }
                );


                listaPets.appendChild(card);

            });

        }

    }


    function atualizarResumoPet() {

        if (resumoPet) {

            resumoPet.textContent =
                petSelecionado
                    ? petSelecionado.nome
                    : "Nenhum pet selecionado";

        }

    }


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


    atualizarResumoPet();

    atualizarTransporte();


    if (transportOption) {

        transportOption.addEventListener(
            "click",
            () => {

                transporte =
                    !transporte;


                localStorage.setItem(
                    "transporte",
                    transporte.toString()
                );


                atualizarTransporte();

            }
        );

    }


    function criarAgendamentoFinal() {

        if (!petSelecionado) {

            alert(
                "Selecione um pet antes de continuar."
            );

            return false;

        }


        const agendamentoFinal = {

            clinica:
                nomeDaClinica,

            clinicaDados:
                clinicaDados,

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


        localStorage.setItem(
            "agendamento",
            JSON.stringify(
                agendamentoFinal
            )
        );


        return true;

    }


    if (btnContinuar) {

        btnContinuar.addEventListener(
            "click",
            () => {

                if (criarAgendamentoFinal()) {

                    window.location.href =
                        "final.html";

                }

            }
        );

    }

});