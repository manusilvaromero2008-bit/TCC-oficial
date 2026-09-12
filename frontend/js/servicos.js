const API_URL = "http://localhost:3000/api";

const params = new URLSearchParams(window.location.search);

const clinicaId =
    params.get("clinica_id") ||
    sessionStorage.getItem("clinica_id") ||
    localStorage.getItem("clinica_id");

const tutorId =
    params.get("tutor_id") ||
    sessionStorage.getItem("tutor_id") ||
    localStorage.getItem("tutor_id");

const data =
    params.get("data") ||
    sessionStorage.getItem("data");

const dataVisual =
    params.get("data_visual") ||
    sessionStorage.getItem("data_visual");

const horario =
    params.get("horario") ||
    sessionStorage.getItem("horario");

const nomeClinica = document.getElementById("nomeClinica");
const listaConsultas = document.getElementById("listaConsultas");
const listaExames = document.getElementById("listaExames");
const btnContinuar = document.getElementById("btnContinuar");

let servicos = [];
let servicoSelecionado = null;

function salvarSessao(chave, valor) {
    if (valor !== null && valor !== undefined && valor !== "") {
        sessionStorage.setItem(chave, valor);
    }
}

async function carregarClinica() {
    if (!clinicaId) {
        nomeClinica.textContent = "Clínica não informada";
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/clinicas/${clinicaId}`);

        if (!resposta.ok) {
            throw new Error("Erro ao carregar clínica");
        }

        const clinica = await resposta.json();

        nomeClinica.textContent = clinica.nome || "Clínica";

        salvarSessao("clinica_id", clinica.id || clinicaId);
        salvarSessao("clinica_nome", clinica.nome || "");
    } catch (erro) {
        console.error(erro);
        nomeClinica.textContent = "Erro ao carregar clínica";
    }
}

async function carregarServicos() {
    if (!clinicaId) {
        listaConsultas.innerHTML = "<p>Clínica não informada.</p>";
        listaExames.innerHTML = "<p>Clínica não informada.</p>";
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/clinicas/${clinicaId}/servicos`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao carregar serviços");
        }

        servicos = await resposta.json();

        const consultas = servicos.filter(servico =>
            String(servico.tipo || "").toLowerCase() === "consulta"
        );

        const exames = servicos.filter(servico =>
            String(servico.tipo || "").toLowerCase() === "exame"
        );

        renderizarServicos(consultas, listaConsultas);
        renderizarServicos(exames, listaExames);

    } catch (erro) {
        console.error(erro);
        listaConsultas.innerHTML = "<p>Erro ao carregar os serviços.</p>";
        listaExames.innerHTML = "<p>Erro ao carregar os serviços.</p>";
    }
}

function renderizarServicos(lista, container) {
    container.innerHTML = "";

    if (lista.length === 0) {
        container.innerHTML = "<p>Nenhum serviço disponível.</p>";
        return;
    }

    lista.forEach(servico => {
        const card = document.createElement("div");

        card.className = "servico-card";

        const preco =
            servico.preco !== null && servico.preco !== undefined
                ? `R$ ${Number(servico.preco).toFixed(2).replace(".", ",")}`
                : "Preço não informado";

        const veterinario =
            servico.veterinario_nome || "Veterinário não informado";

        const tipo = String(servico.tipo || "").toLowerCase();

        const icone = tipo === "exame"
            ? "fa-flask"
            : "fa-stethoscope";

        card.innerHTML = `
            <div class="servico">
                <div class="icone">
                    <i class="fa-solid ${icone}"></i>
                </div>

                <div class="info">
                    <h3>${servico.nome || "Serviço"}</h3>

                    <p>
                        <i class="fa-solid fa-user-doctor"></i>
                        ${veterinario}
                    </p>

                    ${
                        servico.duracao_minutos
                            ? `<p>
                                <i class="fa-regular fa-clock"></i>
                                ${servico.duracao_minutos} minutos
                            </p>`
                            : ""
                    }
                </div>

                <div class="preco">
                    ${preco}
                </div>
            </div>
        `;

        const servicoElemento = card.querySelector(".servico");

        servicoElemento.addEventListener("click", () => {
            document.querySelectorAll(".servico").forEach(item => {
                item.classList.remove("selecionado");
            });

            servicoElemento.classList.add("selecionado");

            servicoSelecionado = servico;

            btnContinuar.disabled = false;
        });

        container.appendChild(card);
    });
}

btnContinuar.addEventListener("click", () => {
    if (!servicoSelecionado) {
        alert("Selecione um serviço para continuar.");
        return;
    }

    if (!clinicaId) {
        alert("Clínica não identificada.");
        return;
    }

    if (!data || !horario) {
        alert("Data ou horário não informado.");
        return;
    }

    salvarSessao("clinica_id", clinicaId);
    salvarSessao("tutor_id", tutorId || "");
    salvarSessao("data", data);
    salvarSessao("data_visual", dataVisual || data);
    salvarSessao("horario", horario);

    salvarSessao("servico_id", servicoSelecionado.id);
    salvarSessao("servico_nome", servicoSelecionado.nome || "");
    salvarSessao("servico_preco", servicoSelecionado.preco || "");
    salvarSessao("servico_tipo", servicoSelecionado.tipo || "");
    salvarSessao(
        "veterinario_id",
        servicoSelecionado.veterinario_id || ""
    );
    salvarSessao(
        "veterinario",
        servicoSelecionado.veterinario_nome || ""
    );

    const proximaPagina = new URL(
        "petetransporte.html",
        window.location.href
    );

    proximaPagina.searchParams.set("clinica_id", clinicaId);
    proximaPagina.searchParams.set("data", data);
    proximaPagina.searchParams.set(
        "data_visual",
        dataVisual || data
    );
    proximaPagina.searchParams.set("horario", horario);
    proximaPagina.searchParams.set(
        "servico_id",
        servicoSelecionado.id
    );

    if (tutorId) {
        proximaPagina.searchParams.set("tutor_id", tutorId);
    }

    window.location.href = proximaPagina.href;
});

carregarClinica();
carregarServicos();