document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "http://localhost:3000/api";

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


    // =========================================================
    // VARIÁVEIS
    // =========================================================

    let clinicaDados = {};
    let tutorDados = {};
    let pets = [];
    let petSelecionado = null;
    let transporte = false;


    // =========================================================
    // PEGAR DADOS DA URL
    // =========================================================

    const params =
        new URLSearchParams(window.location.search);

    const clinicaId =
        params.get("clinica_id");

    const tutorId =
        params.get("tutor_id");


    // =========================================================
    // VALIDAR IDs
    // =========================================================

    if (!clinicaId) {

        alert(
            "Clínica não identificada."
        );

        console.error(
            "clinica_id não foi informado na URL."
        );

        return;
    }

    if (!tutorId) {

        alert(
            "Tutor não identificado."
        );

        console.error(
            "tutor_id não foi informado na URL."
        );

        return;
    }


    // =========================================================
    // CARREGAR CLÍNICA DO BANCO
    // =========================================================

    async function carregarClinica() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/clinicas/${clinicaId}`
                );

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar a clínica."
                );
            }

            clinicaDados =
                await resposta.json();

            const nomeDaClinica =
                clinicaDados.nome ||
                "Clínica Veterinária";

            if (nomeClinica) {

                nomeClinica.textContent =
                    nomeDaClinica;
            }

            if (resumoClinica) {

                resumoClinica.textContent =
                    nomeDaClinica;
            }

        } catch (erro) {

            console.error(
                "Erro ao carregar clínica:",
                erro
            );

            if (nomeClinica) {

                nomeClinica.textContent =
                    "Clínica Veterinária";
            }
        }
    }


    // =========================================================
    // CARREGAR TUTOR DO BANCO
    // =========================================================

    async function carregarTutor() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/tutores/${tutorId}`
                );

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar o tutor."
                );
            }

            tutorDados =
                await resposta.json();

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

        } catch (erro) {

            console.error(
                "Erro ao carregar tutor:",
                erro
            );

            if (resumoTutor) {

                resumoTutor.textContent =
                    "Não informado";
            }

            if (resumoTelefone) {

                resumoTelefone.textContent =
                    "Não informado";
            }

            if (endereco) {

                endereco.textContent =
                    "Endereço não informado";
            }

            if (cep) {

                cep.textContent =
                    "CEP não informado";
            }
        }
    }


    // =========================================================
    // CARREGAR PETS DO BANCO
    // =========================================================

    async function carregarPets() {

        try {

            const resposta =
                await fetch(
                    `${API_URL}/tutores/${tutorId}/pets`
                );

            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar os pets."
                );
            }

            pets =
                await resposta.json();

            if (!Array.isArray(pets)) {

                pets = [];
            }

            mostrarPets();

        } catch (erro) {

            console.error(
                "Erro ao carregar pets:",
                erro
            );

            pets = [];

            if (listaPets) {

                listaPets.innerHTML = `
                    <p>
                        Não foi possível carregar os pets.
                    </p>
                `;
            }
        }
    }


    // =========================================================
    // MOSTRAR PETS
    // =========================================================

    function mostrarPets() {

        if (!listaPets) {
            return;
        }

        listaPets.innerHTML = "";

        if (pets.length === 0) {

            listaPets.innerHTML = `
                <p>
                    Nenhum pet cadastrado.
                </p>
            `;

            return;
        }


        pets.forEach((pet) => {

            const card =
                document.createElement("div");

            card.classList.add(
                "pet-card"
            );

            card.dataset.id =
                pet.id;


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

                        ${pet.raca
                            ? " • " + pet.raca
                            : ""
                        }

                    </p>

                </div>

            `;


            // =================================================
            // SELECIONAR PET
            // =================================================

            card.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".pet-card")
                        .forEach((item) => {

                            item.classList.remove(
                                "selecionado"
                            );

                        });


                    card.classList.add(
                        "selecionado"
                    );


                    petSelecionado =
                        pet;


                    atualizarResumoPet();

                }
            );


            listaPets.appendChild(card);

        });

    }


    // =========================================================
    // RESUMO DO PET
    // =========================================================

    function atualizarResumoPet() {

        if (!resumoPet) {
            return;
        }

        resumoPet.textContent =
            petSelecionado
                ? petSelecionado.nome
                : "Nenhum pet selecionado";
    }


    // =========================================================
    // TRANSPORTE
    // =========================================================

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


    // =========================================================
    // CARREGAR DADOS DA DATA E SERVIÇO
    // =========================================================
    //
    // Esses dados devem vir da URL.
    //
    // Exemplo:
    //
    // petetransporte.html?
    // clinica_id=2&
    // tutor_id=1&
    // data=2026-08-30&
    // horario=14:00&
    // servico_id=1
    //
    // =========================================================

    const data =
        params.get("data") ||
        params.get("dataAgendamento") ||
        "Não informado";

    const horario =
        params.get("horario") ||
        params.get("horarioAgendamento") ||
        "Não informado";

    const servicoId =
        params.get("servico_id");


    let servicoDados = null;


    // =========================================================
    // CARREGAR SERVIÇO DO BANCO
    // =========================================================

    async function carregarServico() {

        if (!servicoId) {

            if (resumoServico) {

                resumoServico.textContent =
                    "Não informado";
            }

            if (resumoVeterinario) {

                resumoVeterinario.textContent =
                    "Não informado";
            }

            return;
        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/servicos/${servicoId}`
                );


            if (!resposta.ok) {

                throw new Error(
                    "Não foi possível carregar o serviço."
                );
            }


            servicoDados =
                await resposta.json();


            if (resumoServico) {

                const preco =
                    servicoDados.preco
                        ? ` - R$ ${servicoDados.preco}`
                        : "";

                resumoServico.textContent =
                    `${servicoDados.nome}${preco}`;
            }


            if (resumoVeterinario) {

                resumoVeterinario.textContent =
                    servicoDados.veterinario ||
                    "Não informado";
            }


        } catch (erro) {

            console.error(
                "Erro ao carregar serviço:",
                erro
            );

            if (resumoServico) {

                resumoServico.textContent =
                    "Não informado";
            }

            if (resumoVeterinario) {

                resumoVeterinario.textContent =
                    "Não informado";
            }
        }
    }


    // =========================================================
    // RESUMO DATA E HORÁRIO
    // =========================================================

    if (resumoData) {

        resumoData.textContent =
            data;
    }


    if (resumoHorario) {

        resumoHorario.textContent =
            horario;
    }


    // =========================================================
    // INICIALIZAR TRANSPORTE
    // =========================================================

    atualizarTransporte();


    if (transportOption) {

        transportOption.addEventListener(
            "click",
            () => {

                transporte =
                    !transporte;

                atualizarTransporte();

            }
        );
    }


    // =========================================================
    // SALVAR AGENDAMENTO NO BANCO
    // =========================================================

    async function criarAgendamentoFinal() {

        if (!petSelecionado) {

            alert(
                "Selecione um pet antes de continuar."
            );

            return false;
        }


        if (!servicoId) {

            alert(
                "Serviço não identificado."
            );

            return false;
        }


        if (!data || data === "Não informado") {

            alert(
                "Data do agendamento não identificada."
            );

            return false;
        }


        if (!horario || horario === "Não informado") {

            alert(
                "Horário do agendamento não identificado."
            );

            return false;
        }


        try {

            btnContinuar.disabled = true;

            btnContinuar.innerHTML =
                `Salvando...
                 <i class="fa-solid fa-spinner fa-spin"></i>`;


            const dadosAgendamento = {

                tutor_id:
                    Number(tutorId),

                pet_id:
                    Number(petSelecionado.id),

                clinica_id:
                    Number(clinicaId),

                servico_id:
                    Number(servicoId),

                data:
                    data,

                horario:
                    horario,

                transporte:
                    transporte

            };


            const resposta =
                await fetch(
                    `${API_URL}/agendamentos`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                dadosAgendamento
                            )
                    }
                );


            const resultado =
                await resposta.json();


            if (!resposta.ok) {

                throw new Error(
                    resultado.erro ||
                    resultado.message ||
                    "Erro ao criar agendamento."
                );
            }


            console.log(
                "Agendamento criado:",
                resultado
            );


            // Guarda somente o ID retornado pela API
            // para a página final consultar o banco.

            if (resultado.id) {

                sessionStorage.setItem(
                    "agendamentoId",
                    resultado.id
                );
            }


            window.location.href =
                "final.html";


            return true;


        } catch (erro) {

            console.error(
                "Erro ao criar agendamento:",
                erro
            );


            alert(
                "Não foi possível realizar o agendamento.\n\n" +
                erro.message
            );


            btnContinuar.disabled =
                false;

            btnContinuar.innerHTML =
                `Continuar
                 <i class="fa-solid fa-arrow-right"></i>`;


            return false;
        }
    }


    // =========================================================
    // BOTÃO CONTINUAR
    // =========================================================

    if (btnContinuar) {

        btnContinuar.addEventListener(
            "click",
            async () => {

                await criarAgendamentoFinal();

            }
        );
    }


    // =========================================================
    // CARREGAR TUDO
    // =========================================================

    await carregarClinica();

    await carregarTutor();

    await carregarPets();

    await carregarServico();

});