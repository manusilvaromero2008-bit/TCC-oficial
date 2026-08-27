document.addEventListener("DOMContentLoaded", async () => {


const API_URL = "http://localhost:3000/api";

const nomeClinica =
    document.getElementById("nomeClinica");

const listaDatas =
    document.getElementById("listaDatas");

const cardHorario =
    document.getElementById("cardHorario");

const btnContinuar =
    document.getElementById("btnContinuar");

const botoesHora =
    document.querySelectorAll(".horarios button");

const parametros =
    new URLSearchParams(window.location.search);

const clinicaId =
    parametros.get("clinica_id");

const tutorId =
    parametros.get("tutor_id");

let clinica = null;
let dataSelecionada = "";
let dataBanco = "";
let horarioSelecionado = "";

if (!clinicaId || !tutorId) {

    alert(
        "Não foi possível identificar a clínica ou o tutor."
    );

    window.location.href =
        "../../home.html";

    return;
}

async function carregarClinica() {

    try {

        const resposta = await fetch(
            `${API_URL}/clinicas/${clinicaId}`
        );

        const dados =
            await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.mensagem ||
                "Clínica não encontrada."
            );
        }

        clinica = dados;

        if (nomeClinica) {

            nomeClinica.textContent =
                clinica.nome || "";
        }

    } catch (erro) {

        console.error(
            "Erro ao carregar clínica:",
            erro
        );

        if (nomeClinica) {

            nomeClinica.textContent =
                "Clínica não encontrada";
        }

        alert(
            "Não foi possível carregar os dados da clínica."
        );
    }
}

async function verificarTutor() {

    try {

        const resposta = await fetch(
            `${API_URL}/tutores/${tutorId}`
        );

        if (!resposta.ok) {

            alert(
                "Tutor não encontrado. Faça seu cadastro novamente."
            );

            window.location.href =
                "cadastro.html";

            return false;
        }

        return true;

    } catch (erro) {

        console.error(
            "Erro ao verificar tutor:",
            erro
        );

        alert(
            "Não foi possível conectar ao servidor."
        );

        return false;
    }
}

function formatarDataVisual(data) {

    const diasSemana = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado"
    ];

    const meses = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro"
    ];

    const partes =
        data.split("-");

    const ano =
        Number(partes[0]);

    const mes =
        Number(partes[1]) - 1;

    const dia =
        Number(partes[2]);

    const dataObj =
        new Date(
            ano,
            mes,
            dia
        );

    return `${diasSemana[dataObj.getDay()]}, ${dia} de ${meses[mes]}`;
}

function gerarDatas() {

    if (!listaDatas) {
        return;
    }

    listaDatas.innerHTML = "";

    const hoje =
        new Date();

    for (let i = 1; i <= 7; i++) {

        const data =
            new Date(hoje);

        data.setDate(
            hoje.getDate() + i
        );

        const ano =
            data.getFullYear();

        const mes =
            String(
                data.getMonth() + 1
            ).padStart(2, "0");

        const dia =
            String(
                data.getDate()
            ).padStart(2, "0");

        const dataFormatada =
            `${ano}-${mes}-${dia}`;

        const botao =
            document.createElement("button");

        botao.type = "button";

        botao.textContent =
            formatarDataVisual(
                dataFormatada
            );

        botao.dataset.data =
            dataFormatada;

        listaDatas.appendChild(botao);

        botao.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(".datas button")
                    .forEach(item => {

                        item.classList.remove(
                            "selecionado"
                        );

                    });

                botao.classList.add(
                    "selecionado"
                );

                dataSelecionada =
                    botao.textContent.trim();

                dataBanco =
                    botao.dataset.data;

                if (cardHorario) {

                    cardHorario.style.display =
                        "block";

                    cardHorario.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    }
}

if (cardHorario) {

    cardHorario.style.display =
        "none";
}

if (btnContinuar) {

    btnContinuar.style.display =
        "none";
}

botoesHora.forEach(botao => {

    botao.addEventListener(
        "click",
        async () => {

            botoesHora.forEach(item => {

                item.classList.remove(
                    "selecionado"
                );

            });

            botao.classList.add(
                "selecionado"
            );

            horarioSelecionado =
                botao.textContent.trim();

            if (
                !dataBanco ||
                !horarioSelecionado
            ) {
                return;
            }

            try {

                const resposta =
                    await fetch(
                        `${API_URL}/tutores/${tutorId}/agendamentos`
                    );

                const agendamentos =
                    await resposta.json();

                if (resposta.ok) {

                    const horarioOcupado =
                        agendamentos.some(
                            agendamento => {

                                const data =
                                    String(
                                        agendamento.data_agendamento
                                    ).split("T")[0];

                                const horario =
                                    String(
                                        agendamento.horario
                                    ).substring(0, 5);

                                return (
                                    Number(
                                        agendamento.clinica_id
                                    ) ===
                                    Number(clinicaId) &&
                                    data ===
                                    dataBanco &&
                                    horario ===
                                    horarioSelecionado &&
                                    (
                                        agendamento.status ===
                                            "Agendado" ||
                                        agendamento.status ===
                                            "Confirmado"
                                    )
                                );
                            }
                        );

                    if (horarioOcupado) {

                        alert(
                            "Este horário já está ocupado. Escolha outro horário."
                        );

                        botao.classList.remove(
                            "selecionado"
                        );

                        horarioSelecionado =
                            "";

                        if (btnContinuar) {

                            btnContinuar.style.display =
                                "none";
                        }

                        return;
                    }
                }

                if (btnContinuar) {

                    btnContinuar.style.display =
                        "block";
                }

            } catch (erro) {

                console.error(
                    "Erro ao verificar horário:",
                    erro
                );

                if (btnContinuar) {

                    btnContinuar.style.display =
                        "block";
                }
            }
        }
    );

});

if (btnContinuar) {

    btnContinuar.addEventListener(
        "click",
        () => {

            if (!dataBanco) {

                alert(
                    "Selecione uma data."
                );

                return;
            }

            if (!horarioSelecionado) {

                alert(
                    "Selecione um horário."
                );

                return;
            }

            const parametrosProximaPagina =
                new URLSearchParams();

            parametrosProximaPagina.set(
                "clinica_id",
                clinicaId
            );

            parametrosProximaPagina.set(
                "tutor_id",
                tutorId
            );

            parametrosProximaPagina.set(
                "data",
                dataBanco
            );

            parametrosProximaPagina.set(
                "data_visual",
                dataSelecionada
            );

            parametrosProximaPagina.set(
                "horario",
                horarioSelecionado
            );

            window.location.href =
                `servicos.html?${parametrosProximaPagina.toString()}`;
        }
    );
}

const tutorValido =
    await verificarTutor();

if (!tutorValido) {
    return;
}

await carregarClinica();

gerarDatas();


});
