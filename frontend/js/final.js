document.addEventListener("DOMContentLoaded", async () => {


const API_URL = "http://localhost:3000/api";

const btnInicio =
    document.getElementById("btnInicio");

const btnOutroPet =
    document.getElementById("btnOutroPet");

const elementoClinica =
    document.getElementById("unidade");

const elementoPet =
    document.getElementById("pet");

const elementoServico =
    document.getElementById("servico");

const elementoData =
    document.getElementById("data");

const elementoHorario =
    document.getElementById("horario");

const elementoTransporte =
    document.getElementById("transporte");

const parametros =
    new URLSearchParams(window.location.search);

const agendamentoId =
    parametros.get("agendamento_id");

const tutorId =
    parametros.get("tutor_id");

if (!agendamentoId || !tutorId) {

    if (elementoClinica) {
        elementoClinica.textContent =
            "Agendamento não encontrado";
    }

    if (elementoPet) {
        elementoPet.textContent =
            "Agendamento não encontrado";
    }

    if (elementoServico) {
        elementoServico.textContent =
            "Agendamento não encontrado";
    }

    if (elementoData) {
        elementoData.textContent =
            "Agendamento não encontrado";
    }

    if (elementoHorario) {
        elementoHorario.textContent =
            "Agendamento não encontrado";
    }

    if (elementoTransporte) {
        elementoTransporte.textContent =
            "Não informado";
    }

    return;
}

function formatarData(data) {

    if (!data) {
        return "Data não informada";
    }

    const partes =
        String(data).split("T")[0].split("-");

    if (partes.length !== 3) {
        return data;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarHorario(horario) {

    if (!horario) {
        return "Horário não informado";
    }

    return String(horario).substring(0, 5);
}

async function carregarAgendamento() {

    try {

        const resposta = await fetch(
            `${API_URL}/tutores/${tutorId}/agendamentos`
        );

        const agendamentos =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                agendamentos.mensagem ||
                "Não foi possível carregar o agendamento."
            );
        }

        const agendamento =
            agendamentos.find(
                item =>
                    Number(item.id) ===
                    Number(agendamentoId)
            );

        if (!agendamento) {

            throw new Error(
                "Agendamento não encontrado."
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

            let textoServico =
                agendamento.servico ||
                "Serviço não informado";

            elementoServico.textContent =
                textoServico;
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

            try {

                const respostaTransportes =
                    await fetch(
                        `${API_URL}/tutores/${tutorId}/agendamentos`
                    );

                if (respostaTransportes.ok) {

                    const dados =
                        await respostaTransportes.json();

                    const agendamentoAtual =
                        dados.find(
                            item =>
                                Number(item.id) ===
                                Number(agendamentoId)
                        );

                    if (
                        agendamentoAtual &&
                        agendamentoAtual.observacoes &&
                        String(
                            agendamentoAtual.observacoes
                        ).toLowerCase().includes("transporte")
                    ) {

                        elementoTransporte.textContent =
                            "Solicitado";

                    } else {

                        elementoTransporte.textContent =
                            "Não solicitado";
                    }
                } else {

                    elementoTransporte.textContent =
                        "Não informado";
                }

            } catch (erro) {

                console.error(
                    "Erro ao verificar transporte:",
                    erro
                );

                elementoTransporte.textContent =
                    "Não informado";
            }
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar agendamento:",
            erro
        );

        if (elementoClinica) {
            elementoClinica.textContent =
                "Não foi possível carregar";
        }

        if (elementoPet) {
            elementoPet.textContent =
                "Não foi possível carregar";
        }

        if (elementoServico) {
            elementoServico.textContent =
                "Não foi possível carregar";
        }

        if (elementoData) {
            elementoData.textContent =
                "Não foi possível carregar";
        }

        if (elementoHorario) {
            elementoHorario.textContent =
                "Não foi possível carregar";
        }

        if (elementoTransporte) {
            elementoTransporte.textContent =
                "Não informado";
        }
    }
}

if (btnInicio) {

    btnInicio.addEventListener("click", () => {

        window.location.href =
            "../../home.html";

    });
}

if (btnOutroPet) {

    btnOutroPet.addEventListener("click", () => {

        window.location.href =
            `dataehorario.html?tutor_id=${tutorId}`;

    });
}

await carregarAgendamento();


});
