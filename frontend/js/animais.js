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

let animais = [];
let filtroStatusAtual = "todos";

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

function renderizarAnimais() {
    const pesquisa = pesquisaAnimal.value.toLowerCase().trim();
    const especie = filtroEspecie.value;

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
        `.toLowerCase();

        const correspondePesquisa =
            textoBusca.includes(pesquisa);

        return (
            correspondeStatus &&
            correspondeEspecie &&
            correspondePesquisa
        );
    });

    listaAnimais.innerHTML = "";

    contadorAnimais.textContent =
        `${filtrados.length} ${
            filtrados.length === 1
                ? "animal"
                : "animais"
        }`;

    if (filtrados.length === 0) {
        nenhumAnimal.style.display = "block";

        nenhumAnimal.querySelector("h3").textContent =
            "Nenhum animal encontrado";

        nenhumAnimal.querySelector("p").textContent =
            "Tente mudar os filtros ou cadastrar um novo animal.";

        return;
    }

    nenhumAnimal.style.display = "none";

    filtrados.forEach(animal => {
        const card = document.createElement("article");

        card.className = "card-animal";

        const nomeExibido =
            animal.nome || "Nome não informado";

        const statusTexto =
            animal.status === "perdido"
                ? "Animal perdido"
                : "Animal encontrado";

        const iconeStatus =
            animal.status === "perdido"
                ? "fa-circle-exclamation"
                : "fa-heart";

        const especieTexto =
            animal.especie === "cachorro"
                ? "Cachorro"
                : animal.especie === "gato"
                    ? "Gato"
                    : "Outro";

        const foto =
            animal.foto ||
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80";

        card.innerHTML = `
            <div class="foto-card">

                <img
                    src="${foto}"
                    alt="Foto de ${nomeExibido}"
                >

                <span class="status ${animal.status}">
                    <i class="fa-solid ${iconeStatus}"></i>
                    ${statusTexto}
                </span>

            </div>

            <div class="info-card">

                <h3>
                    ${nomeExibido}
                </h3>

                <span class="tipo-animal">
                    ${especieTexto}
                    ${animal.raca ? " • " + animal.raca : ""}
                </span>

                <div class="detalhes">

                    <div class="detalhe">
                        <i class="fa-solid fa-location-dot"></i>
                        <span>${animal.bairro || "Bairro não informado"}</span>
                    </div>

                    <div class="detalhe">
                        <i class="fa-solid fa-calendar"></i>
                        <span>${formatarData(animal.data_perdido)}</span>
                    </div>

                    <div class="detalhe">
                        <i class="fa-solid fa-map-pin"></i>
                        <span>${animal.local_perdido || "Local não informado"}</span>
                    </div>

                    ${
                        animal.cor
                            ? `
                            <div class="detalhe">
                                <i class="fa-solid fa-palette"></i>
                                <span>${animal.cor}</span>
                            </div>
                            `
                            : ""
                    }

                </div>

                ${
                    animal.descricao
                        ? `
                        <p class="descricao">
                            ${animal.descricao}
                        </p>
                        `
                        : ""
                }

                <button
                    class="btn-contato"
                    onclick="entrarEmContato('${animal.contato}')"
                >
                    <i class="fa-solid fa-phone"></i>
                    Entrar em contato
                </button>

                <button
                    class="btn-remover"
                    onclick="removerAnimal(${animal.id})"
                >
                    <i class="fa-solid fa-trash"></i>
                    Remover anúncio
                </button>

            </div>
        `;

        listaAnimais.appendChild(card);
    });
}

function formatarData(data) {
    if (!data) {
        return "Data não informada";
    }

    const dataString = String(data).split("T")[0];
    const partes = dataString.split("-");

    if (partes.length !== 3) {
        return "Data não informada";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

btnAbrirFormulario.addEventListener(
    "click",
    () => {
        modal.classList.add("abrir");
        document.body.style.overflow = "hidden";
    }
);

function fecharFormulario() {
    modal.classList.remove("abrir");
    document.body.style.overflow = "auto";
}

fecharModal.addEventListener(
    "click",
    fecharFormulario
);

modal.addEventListener(
    "click",
    event => {
        if (event.target === modal) {
            fecharFormulario();
        }
    }
);

fotoAnimal.addEventListener(
    "change",
    function () {
        const arquivo = this.files[0];

        if (!arquivo) {
            previewFoto.src = "";
            previewFoto.style.display = "none";
            return;
        }

        const leitor = new FileReader();

        leitor.onload = event => {
            previewFoto.src = event.target.result;
            previewFoto.style.display = "block";
        };

        leitor.readAsDataURL(arquivo);
    }
);

formAnimal.addEventListener(
    "submit",
    async event => {
        event.preventDefault();

        const statusSelecionado =
            document.querySelector(
                'input[name="status"]:checked'
            );

        if (!statusSelecionado) {
            alert("Selecione a situação do animal.");
            return;
        }

        const nome =
            document.getElementById("nomeAnimal").value.trim();

        const especie =
            document.getElementById("especieAnimal").value;

        const raca =
            document.getElementById("racaAnimal").value.trim();

        const cor =
            document.getElementById("corAnimal").value.trim();

        const data =
            document.getElementById("dataAnimal").value;

        const bairro =
            document.getElementById("bairroAnimal").value.trim();

        const local =
            document.getElementById("localAnimal").value.trim();

        const descricao =
            document.getElementById("descricaoAnimal").value.trim();

        const contato =
            document.getElementById("contatoAnimal").value.trim();

        if (!especie || !data || !bairro || !local || !contato) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }

        let foto = null;

        if (previewFoto.src && previewFoto.style.display !== "none") {
            foto = previewFoto.src;
        }

        const novoAnimal = {
            nome,
            especie,
            raca,
            cor,
            data,
            bairro,
            local,
            descricao,
            contato,
            foto,
            status: statusSelecionado.value
        };

        try {
            const resposta = await fetch(
                `${API_URL}/animais`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(novoAnimal)
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem ||
                    "Não foi possível cadastrar o animal."
                );
            }

            alert("Animal cadastrado com sucesso! 🐾");

            formAnimal.reset();

            previewFoto.src = "";
            previewFoto.style.display = "none";

            fecharFormulario();

            filtroStatusAtual = "todos";

            document
                .querySelectorAll(".filtro")
                .forEach(botao => {
                    botao.classList.remove("ativo");
                });

            document
                .querySelector('[data-status="todos"]')
                .classList.add("ativo");

            await carregarAnimais();

        } catch (erro) {
            console.error("Erro ao cadastrar animal:", erro);

            alert(
                erro.message ||
                "Não foi possível cadastrar o animal."
            );
        }
    }
);

document
    .querySelectorAll(".filtro")
    .forEach(botao => {
        botao.addEventListener(
            "click",
            () => {
                document
                    .querySelectorAll(".filtro")
                    .forEach(item => {
                        item.classList.remove("ativo");
                    });

                botao.classList.add("ativo");

                filtroStatusAtual =
                    botao.dataset.status;

                renderizarAnimais();
            }
        );
    });

pesquisaAnimal.addEventListener(
    "input",
    renderizarAnimais
);

filtroEspecie.addEventListener(
    "change",
    renderizarAnimais
);

function entrarEmContato(numero) {
    const numeroLimpo =
        String(numero || "").replace(/\D/g, "");

    if (!numeroLimpo) {
        alert("Telefone de contato não informado.");
        return;
    }

    const confirmar =
        confirm(
            `Deseja entrar em contato pelo número ${numero}?`
        );

    if (confirmar) {
        window.open(
            `https://wa.me/55${numeroLimpo}`,
            "_blank"
        );
    }
}

async function removerAnimal(id) {
    const confirmar =
        confirm(
            "Tem certeza que deseja remover este anúncio?"
        );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `${API_URL}/animais/${id}`,
            {
                method: "DELETE"
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem ||
                "Não foi possível remover o anúncio."
            );
        }

        alert("Anúncio removido com sucesso.");

        await carregarAnimais();

    } catch (erro) {
        console.error("Erro ao remover animal:", erro);

        alert(
            erro.message ||
            "Não foi possível remover o anúncio."
        );
    }
}

carregarAnimais();