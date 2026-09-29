document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "http://localhost:3000/api";

    const btnInicio = document.getElementById("btnInicio");
    const btnOutroPet = document.getElementById("btnOutroPet");

    const elementoClinica = document.getElementById("unidade");
    const elementoPet = document.getElementById("pet");
    const elementoServico = document.getElementById("servico");
    const elementoData = document.getElementById("data");
    const elementoHorario = document.getElementById("horario");
    const elementoTransporte = document.getElementById("transporte");

    const parametros = new URLSearchParams(window.location.search);

    const agendamentoId =
        parametros.get("agendamento_id") ||
        sessionStorage.getItem("agendamentoId");

    let tutorId =
        parametros.get("tutor_id") ||
        sessionStorage.getItem("tutor_id");

    let clinicaId =
        parametros.get("clinica_id") ||
        sessionStorage.getItem("clinica_id");

    function formatarData(data) {
        if (!data) {
            return "Data não informada";
        }

        const partes = String(data)
            .split("T")[0]
            .split("-");

        if (partes.length !== 3) {
            return data;
        }

        const dataObj = new Date(
            Number(partes[0]),
            Number(partes[1]) - 1,
            Number(partes[2])
        );

        if (isNaN(dataObj.getTime())) {
            return data;
        }

        return dataObj.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
        });
    }

    function formatarHorario(horario) {
        if (!horario) {
            return "Horário não informado";
        }

        return String(horario).substring(0, 5);
    }

    function mostrarErro(mensagem = "Agendamento não encontrado") {

        if (elementoClinica) {
            elementoClinica.textContent = mensagem;
        }

        if (elementoPet) {
            elementoPet.textContent = mensagem;
        }

        if (elementoServico) {
            elementoServico.textContent = mensagem;
        }

        if (elementoData) {
            elementoData.textContent = mensagem;
        }

        if (elementoHorario) {
            elementoHorario.textContent = mensagem;
        }

        if (elementoTransporte) {
            elementoTransporte.textContent = "Não informado";
        }
    }

    async function carregarAgendamento() {

        if (!agendamentoId) {
            mostrarErro("ID do agendamento não informado.");
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/agendamentos/${agendamentoId}`
            );

            const agendamento = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    agendamento.mensagem ||
                    agendamento.erro ||
                    "Não foi possível carregar o agendamento."
                );
            }

            console.log("Agendamento carregado do banco:", agendamento);

            if (elementoClinica) {
                elementoClinica.textContent =
                    agendamento.clinica ||
                    agendamento.nome_clinica ||
                    "Clínica não informada";
            }

            if (elementoPet) {
                elementoPet.textContent =
                    agendamento.pet ||
                    agendamento.nome_pet ||
                    "Pet não informado";
            }

            if (elementoServico) {
                let textoServico =
                    agendamento.servico ||
                    agendamento.nome_servico ||
                    "Serviço não informado";

                if (agendamento.preco_servico !== null &&
                    agendamento.preco_servico !== undefined) {

                    textoServico += ` - R$ ${Number(
                        agendamento.preco_servico
                    ).toFixed(2).replace(".", ",")}`;
                }

                elementoServico.textContent = textoServico;
            }

            if (elementoData) {
                elementoData.textContent =
                    formatarData(
                        agendamento.data_agendamento
                    );
            }

            if (elementoHorario) {
                elementoHorario.textContent =
                    formatarHorario(
                        agendamento.horario
                    );
            }

            if (elementoTransporte) {

                if (
                    agendamento.transporte_id ||
                    agendamento.status_transporte
                ) {
                    elementoTransporte.textContent =
                        agendamento.status_transporte ||
                        "Solicitado";
                } else {
                    elementoTransporte.textContent =
                        "Não solicitado";
                }
            }

            tutorId =
                agendamento.tutor_id ||
                tutorId;

            clinicaId =
                agendamento.clinica_id ||
                clinicaId;

            if (tutorId) {
                sessionStorage.setItem(
                    "tutor_id",
                    String(tutorId)
                );
            }

            if (clinicaId) {
                sessionStorage.setItem(
                    "clinica_id",
                    String(clinicaId)
                );
            }

        } catch (erro) {

            console.error(
                "Erro ao carregar agendamento:",
                erro
            );

            mostrarErro(
                "Não foi possível carregar o agendamento"
            );
        }
    }

    if (btnInicio) {

        btnInicio.addEventListener("click", () => {

            window.location.href =
                "../pages/home.html";

        });

    }

    if (btnOutroPet) {

        btnOutroPet.addEventListener("click", () => {

            if (!tutorId) {

                alert(
                    "Não foi possível identificar o tutor. Verifique se o cadastro está salvo."
                );

                return;
            }

            if (!clinicaId) {

                alert(
                    "Não foi possível identificar a clínica. Volte para a escolha da clínica e tente novamente."
                );

                return;
            }

            sessionStorage.setItem(
                "tutor_id",
                String(tutorId)
            );

            sessionStorage.setItem(
                "clinica_id",
                String(clinicaId)
            );

            sessionStorage.removeItem("agendamentoId");
            sessionStorage.removeItem("pet_id");
            sessionStorage.removeItem("petId");
            sessionStorage.removeItem("data");
            sessionStorage.removeItem("data_visual");
            sessionStorage.removeItem("horario");
            sessionStorage.removeItem("servico_id");
            sessionStorage.removeItem("servico_nome");
            sessionStorage.removeItem("servico_preco");
            sessionStorage.removeItem("servico_tipo");
            sessionStorage.removeItem("veterinario_id");
            sessionStorage.removeItem("veterinario");
            sessionStorage.removeItem("transporte");

            const destino =
                `../pages/dataehorario.html?tutor_id=${encodeURIComponent(tutorId)}&clinica_id=${encodeURIComponent(clinicaId)}`;

            window.location.href = destino;

        });

    }

    await carregarAgendamento();

});