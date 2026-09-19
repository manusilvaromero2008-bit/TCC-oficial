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

    const tutorId =
        parametros.get("tutor_id") ||
        sessionStorage.getItem("tutor_id") ||
        localStorage.getItem("tutor_id");

    const clinicaId =
        parametros.get("clinica_id") ||
        sessionStorage.getItem("clinica_id") ||
        sessionStorage.getItem("clinicaId") ||
        localStorage.getItem("clinica_id") ||
        localStorage.getItem("clinicaId");

    const transporte = sessionStorage.getItem("transporte");

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

    function mostrarErro() {
        if (elementoClinica) {
            elementoClinica.textContent = "Agendamento não encontrado";
        }

        if (elementoPet) {
            elementoPet.textContent = "Agendamento não encontrado";
        }

        if (elementoServico) {
            elementoServico.textContent = "Agendamento não encontrado";
        }

        if (elementoData) {
            elementoData.textContent = "Agendamento não encontrado";
        }

        if (elementoHorario) {
            elementoHorario.textContent = "Agendamento não encontrado";
        }

        if (elementoTransporte) {
            elementoTransporte.textContent =
                transporte === "true"
                    ? "Solicitado"
                    : "Não solicitado";
        }
    }

    async function carregarAgendamento() {
        if (!agendamentoId) {
            mostrarErro();
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

            if (elementoClinica) {
                elementoClinica.textContent =
                    agendamento.clinica ||
                    "Clínica não informada";
            }

            if (elementoPet) {
                elementoPet.textContent =
                    agendamento.pet ||
                    "Pet não informado";
            }

            if (elementoServico) {
                elementoServico.textContent =
                    agendamento.servico ||
                    "Serviço não informado";
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
                    transporte === "true" ||
                    (
                        agendamento.observacoes &&
                        String(agendamento.observacoes)
                            .toLowerCase()
                            .includes("transporte")
                    )
                ) {
                    elementoTransporte.textContent = "Solicitado";
                } else {
                    elementoTransporte.textContent = "Não solicitado";
                }
            }

        } catch (erro) {
            console.error(
                "Erro ao carregar agendamento:",
                erro
            );

            mostrarErro();
        }
    }

    if (btnInicio) {
        btnInicio.addEventListener("click", () => {
            window.location.href = "../pages/home.html";
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

            sessionStorage.setItem(
                "clinicaId",
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