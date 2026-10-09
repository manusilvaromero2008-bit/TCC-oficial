
const API_URL = "http://localhost:3000/api";

const modal = document.getElementById("modalCadastro");
const btnAbrirFormulario = document.getElementById("btnAbrirFormulario");
const fecharModal = document.getElementById("fecharModal");
const formAnimal = document.getElementById("formAnimal");
const listaAnimais = document.getElementById("listaAnimais");
const nenhumAnimal = document.getElementById("nenhumAnimal");
const pesquisaAnimal = document.getElementById("pesquisaAnimal");
const filtroEspecie = document.getElementById("filtroEspecie");
const contadorAnimais = document.getElementById("contadorAnimais");
const fotoAnimal = document.getElementById("fotoAnimal");
const previewFoto = document.getElementById("previewFoto");
const nomeAnimal = document.getElementById("nomeAnimal");
const especieAnimal = document.getElementById("especieAnimal");

let animais = [];
let filtroStatusAtual = "todos";

function obterTutorId() {
    const parametros = new URLSearchParams(window.location.search);
    const tutorId = parametros.get("tutor_id") ||
        sessionStorage.getItem("agendaPetTutorId") ||
        sessionStorage.getItem("tutor_id");

    if (!tutorId) return null;

    const numero = Number(tutorId);

    if (!Number.isInteger(numero) || numero <= 0) return null;

    sessionStorage.setItem("agendaPetTutorId", String(numero));
    sessionStorage.setItem("tutor_id", String(numero));

    return numero;
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[caractere]);
}

function atualizarCamposPorStatus() {
    const status = document.querySelector('input[name="status"]:checked')?.value;
    const perdido = status === "perdido";

    document.getElementById("labelNomeAnimal").textContent =
        perdido ? "Nome *" : "Nome (opcional)";

    nomeAnimal.required = perdido;
    nomeAnimal.placeholder = perdido
        ? "Ex.: Thor"
        : "Se souber, informe o nome";

    document.getElementById("ajudaNome").textContent = perdido
        ? "Informe o nome do seu animal."
        : "Se não souber o nome, deixe este campo vazio.";

    document.getElementById("labelLocalAnimal").textContent =
        perdido ? "Local onde foi perdido *" : "Local onde foi encontrado *";

    document.getElementById("ajudaStatus").textContent = perdido
        ? "Informe os dados do seu animal que está perdido."
        : "Se encontrou um animal na rua, não precisa saber o nome dele.";

    nomeAnimal.setCustomValidity("");

    if (!perdido && !nomeAnimal.value.trim()) {
        nomeAnimal.value = "";
    }
}

document.querySelectorAll('input[name="status"]').forEach(radio => {
    radio.addEventListener("change", atualizarCamposPorStatus);
});

async function carregarAnimais() {
    try {
        const resposta = await fetch(`${API_URL}/animais`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os animais.");
        }

        animais = await resposta.json();
        renderizarAnimais();
    } catch (erro) {
        console.error("Erro ao carregar animais:", erro);
        listaAnimais.innerHTML = "";
        nenhumAnimal.style.display = "block";
        nenhumAnimal.querySelector("h3").textContent =
            "Não foi possível carregar os animais";
        nenhumAnimal.querySelector("p").textContent =
            "Verifique se o servidor do Agenda Pet está funcionando.";
        contadorAnimais.textContent = "0 animais";
    }
}

function formatarData(data) {
    if (!data) return "Data não informada";

    const partes = String(data).split("T")[0].split("-");

    if (partes.length !== 3) return "Data não informada";

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function renderizarAnimais() {
    const pesquisa = pesquisaAnimal.value.toLowerCase().trim();
    const especie = filtroEspecie.value;
    const tutorId = obterTutorId();

    const filtrados = animais.filter(animal => {
        const correspondeStatus =
            filtroStatusAtual === "todos" ||
            animal.status === filtroStatusAtual;

        const correspondeEspecie =
            especie === "todos" ||
            animal.especie === especie;

        const textoBusca = `
            ${animal.nome || ""}
            ${animal.bairro || ""}
            ${animal.local_perdido || ""}
            ${animal.cor || ""}
            ${animal.raca || ""}
            ${animal.descricao || ""}
            ${animal.especie || ""}
        `.toLowerCase();

        return correspondeStatus &&
            correspondeEspecie &&
            textoBusca.includes(pesquisa);
    });

    listaAnimais.innerHTML = "";

    contadorAnimais.textContent =
        `${filtrados.length} ${filtrados.length === 1 ? "animal" : "animais"}`;

    if (filtrados.length === 0) {
        nenhumAnimal.style.display = "block";
        nenhumAnimal.querySelector("h3").textContent = "Nenhum animal encontrado";
        nenhumAnimal.querySelector("p").textContent =
            "Tente mudar os filtros ou cadastrar um novo animal.";
        return;
    }

    nenhumAnimal.style.display = "none";

    filtrados.forEach(animal => {
        const card = document.createElement("article");
        card.className = "card-animal";

        const meuAnuncio = tutorId !== null &&
            Number(animal.tutor_id) === tutorId;

        const nomeExibido = animal.nome?.trim() || "Nome não informado";
        const statusTexto = animal.status === "perdido"
            ? "Animal perdido"
            : "Animal encontrado";

        const iconeStatus = animal.status === "perdido"
            ? "fa-circle-exclamation"
            : "fa-heart";

        const especieTexto = {
            cachorro: "Cachorro",
            gato: "Gato",
            outro: "Outro / não identificado"
        }[animal.especie] || "Espécie não identificada";

        const foto = animal.foto ||
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80";

        card.innerHTML = `
            <div class="foto-card">
                <img src="${escaparHTML(foto)}" alt="Foto de ${escaparHTML(nomeExibido)}">
                <span class="status ${animal.status === "encontrado" ? "encontrado" : "perdido"}">
                    <i class="fa-solid ${iconeStatus}"></i>
                    ${statusTexto}
                </span>
            </div>

            <div class="info-card">
                <h3>${escaparHTML(nomeExibido)}</h3>

                <span class="tipo-animal">
                    ${escaparHTML(especieTexto)}
                    ${animal.raca ? " • " + escaparHTML(animal.raca) : ""}
                </span>

                <div class="detalhes">
                    <div class="detalhe">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${escaparHTML(animal.bairro || "Bairro não informado")}</span>
                    </div>

                    <div class="detalhe">
                        <i class="fa-solid fa-calendar"></i>
                        <span>${formatarData(animal.data_perdido || animal.data)}</span>
                    </div>

                    <div class="detalhe">
                        <i class="fa-solid fa-map-pin"></i>
                        <span>${escaparHTML(animal.local_perdido || "Local não informado")}</span>
                    </div>

                    ${animal.cor ? `
                        <div class="detalhe">
                            <i class="fa-solid fa-palette"></i>
                            <span>${escaparHTML(animal.cor)}</span>
                        </div>
                    ` : ""}
                </div>

                ${animal.descricao ? `
                    <p class="descricao">${escaparHTML(animal.descricao)}</p>
                ` : ""}

                <button type="button" class="btn-contato">
                    <i class="fa-solid fa-phone"></i> Entrar em contato
                </button>

                ${meuAnuncio ? `
                    <div class="acoes-anuncio">
                        <button type="button" class="btn-status">
                            <i class="fa-solid fa-arrows-rotate"></i>
                            ${animal.status === "perdido"
                                ? "Marcar como encontrado"
                                : "Marcar como perdido"}
                        </button>

                        <button type="button" class="btn-remover">
                            <i class="fa-solid fa-trash"></i> Remover anúncio
                        </button>
                    </div>
                ` : ""}
            </div>
        `;

        card.querySelector(".btn-contato").addEventListener("click", () => {
            entrarEmContato(animal.contato);
        });

        if (meuAnuncio) {
            card.querySelector(".btn-status").addEventListener("click", () => {
                alterarStatusAnimal(animal);
            });

            card.querySelector(".btn-remover").addEventListener("click", () => {
                removerAnimal(animal.id);
            });
        }

        listaAnimais.appendChild(card);
    });
}

function abrirFormulario() {
    formAnimal.reset();
    previewFoto.src = "";
    previewFoto.style.display = "none";

    document.querySelector('input[name="status"][value="perdido"]').checked = true;
    atualizarCamposPorStatus();

    const hoje = new Date();
    const dataLocal = new Date(hoje.getTime() - hoje.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

    document.getElementById("dataAnimal").value = dataLocal;

    modal.classList.add("abrir");
    document.body.style.overflow = "hidden";
}

function fecharFormulario() {
    modal.classList.remove("abrir");
    document.body.style.overflow = "auto";
}

btnAbrirFormulario.addEventListener("click", abrirFormulario);
fecharModal.addEventListener("click", fecharFormulario);

modal.addEventListener("click", event => {
    if (event.target === modal) fecharFormulario();
});

fotoAnimal.addEventListener("change", function () {
    const arquivo = this.files[0];

    if (!arquivo) {
        previewFoto.src = "";
        previewFoto.style.display = "none";
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem válido.");
        this.value = "";
        return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5 MB.");
        this.value = "";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = event => {
        previewFoto.src = event.target.result;
        previewFoto.style.display = "block";
    };

    leitor.readAsDataURL(arquivo);
});

formAnimal.addEventListener("submit", async event => {
    event.preventDefault();

    const tutorId = obterTutorId();

    if (!tutorId) {
        alert("Não foi possível identificar o tutor. Entre novamente no seu perfil.");
        return;
    }

    const status = document.querySelector('input[name="status"]:checked')?.value;
    const nome = nomeAnimal.value.trim();
    const especie = especieAnimal.value;
    const raca = document.getElementById("racaAnimal").value.trim();
    const cor = document.getElementById("corAnimal").value.trim();
    const data = document.getElementById("dataAnimal").value;
    const bairro = document.getElementById("bairroAnimal").value.trim();
    const local = document.getElementById("localAnimal").value.trim();
    const descricao = document.getElementById("descricaoAnimal").value.trim();
    const contato = document.getElementById("contatoAnimal").value.trim();

    if (status === "perdido" && !nome) {
        alert("Informe o nome do animal perdido.");
        nomeAnimal.focus();
        return;
    }

    if (!especie || !data || !bairro || !local || !contato) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    const novoAnimal = {
        tutor_id: tutorId,
        nome,
        especie,
        raca,
        cor,
        data,
        bairro,
        local,
        descricao,
        contato,
        foto: previewFoto.style.display !== "none" ? previewFoto.src : null,
        status
    };

    const botaoEnviar = formAnimal.querySelector(".btn-enviar");
    botaoEnviar.disabled = true;
    botaoEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publicando...';

    try {
        const resposta = await fetch(`${API_URL}/animais`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoAnimal)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível cadastrar o animal.");
        }

        alert("Anúncio publicado com sucesso! 🐾");
        fecharFormulario();
        filtroStatusAtual = "todos";

        document.querySelectorAll(".filtro").forEach(botao => {
            botao.classList.toggle("ativo", botao.dataset.status === "todos");
        });

        await carregarAnimais();
    } catch (erro) {
        console.error("Erro ao cadastrar animal:", erro);
        alert(erro.message || "Não foi possível cadastrar o animal.");
    } finally {
        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = '<i class="fa-solid fa-paw"></i> Publicar anúncio';
    }
});

async function alterarStatusAnimal(animal) {
    const tutorId = obterTutorId();

    if (!tutorId || Number(animal.tutor_id) !== tutorId) {
        alert("Somente quem publicou este anúncio pode alterar o status.");
        return;
    }

    const novoStatus = animal.status === "perdido" ? "encontrado" : "perdido";
    const mensagem = novoStatus === "encontrado"
        ? "Deseja marcar este animal como encontrado?"
        : "Deseja voltar a marcar este animal como perdido?";

    if (!confirm(mensagem)) return;

    try {
        const resposta = await fetch(`${API_URL}/animais/${animal.id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tutor_id: tutorId,
                status: novoStatus
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível alterar o status.");
        }

        alert("Status atualizado com sucesso!");
        await carregarAnimais();
    } catch (erro) {
        console.error("Erro ao alterar status:", erro);
        alert(erro.message || "Não foi possível alterar o status.");
    }
}

function entrarEmContato(numero) {
    const numeroLimpo = String(numero || "").replace(/\D/g, "");

    if (numeroLimpo.length < 10 || numeroLimpo.length > 13) {
        alert("Telefone de contato inválido ou não informado.");
        return;
    }

    if (confirm(`Deseja entrar em contato pelo número ${numero}?`)) {
        window.open(`https://wa.me/${numeroLimpo.startsWith("55") ? numeroLimpo : "55" + numeroLimpo}`, "_blank");
    }
}

async function removerAnimal(id) {
    const tutorId = obterTutorId();

    if (!tutorId) {
        alert("Entre novamente no seu perfil para gerenciar seus anúncios.");
        return;
    }

    if (!confirm("Tem certeza que deseja remover este anúncio?")) return;

    try {
        const resposta = await fetch(
            `${API_URL}/animais/${id}?tutor_id=${encodeURIComponent(tutorId)}`,
            { method: "DELETE" }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || "Não foi possível remover o anúncio.");
        }

        alert("Anúncio removido com sucesso.");
        await carregarAnimais();
    } catch (erro) {
        console.error("Erro ao remover animal:", erro);
        alert(erro.message || "Não foi possível remover o anúncio.");
    }
}

document.querySelectorAll(".filtro").forEach(botao => {
    botao.addEventListener("click", () => {
        document.querySelectorAll(".filtro").forEach(item => {
            item.classList.remove("ativo");
        });

        botao.classList.add("ativo");
        filtroStatusAtual = botao.dataset.status;
        renderizarAnimais();
    });
});

pesquisaAnimal.addEventListener("input", renderizarAnimais);
filtroEspecie.addEventListener("change", renderizarAnimais);

atualizarCamposPorStatus();
carregarAnimais();
