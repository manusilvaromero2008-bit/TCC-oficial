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

let filtroStatusAtual = "todos";


// ========================================
// DADOS INICIAIS
// ========================================

const animaisExemplo = [
    {
        id: 1,
        nome: "Thor",
        especie: "cachorro",
        raca: "Golden Retriever",
        cor: "Dourado",
        data: "2026-09-15",
        bairro: "Taquaral",
        local: "Próximo à praça",
        descricao: "Cachorro de porte médio, muito dócil e usando coleira azul.",
        contato: "(19) 99999-1111",
        status: "perdido",
        foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 2,
        nome: "Mel",
        especie: "gato",
        raca: "SRD",
        cor: "Branca e cinza",
        data: "2026-09-14",
        bairro: "Cambuí",
        local: "Rua Maria Monteiro",
        descricao: "Gata pequena, com uma mancha cinza próxima ao olho.",
        contato: "(19) 98888-2222",
        status: "encontrado",
        foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
    },

    {
        id: 3,
        nome: "Nina",
        especie: "cachorro",
        raca: "SRD",
        cor: "Caramelo",
        data: "2026-09-13",
        bairro: "Jardim Aurélia",
        local: "Próximo ao supermercado",
        descricao: "Porte pequeno, pelo caramelo e coleira vermelha.",
        contato: "(19) 97777-3333",
        status: "perdido",
        foto: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80"
    }
];


// ========================================
// LOCAL STORAGE
// ========================================

function carregarAnimais() {

    const animaisSalvos =
        localStorage.getItem("agendaPetAnimais");

    if (!animaisSalvos) {

        localStorage.setItem(
            "agendaPetAnimais",
            JSON.stringify(animaisExemplo)
        );

        return animaisExemplo;
    }

    return JSON.parse(animaisSalvos);
}


function salvarAnimais(animais) {

    localStorage.setItem(
        "agendaPetAnimais",
        JSON.stringify(animais)
    );
}


// ========================================
// RENDERIZAR
// ========================================

function renderizarAnimais() {

    const animais = carregarAnimais();

    const pesquisa =
        pesquisaAnimal.value.toLowerCase().trim();

    const especie =
        filtroEspecie.value;


    const filtrados = animais.filter(animal => {

        const correspondeStatus =
            filtroStatusAtual === "todos" ||
            animal.status === filtroStatusAtual;


        const correspondeEspecie =
            especie === "todos" ||
            animal.especie === especie;


        const textoBusca = `
            ${animal.nome}
            ${animal.bairro}
            ${animal.local}
            ${animal.cor}
            ${animal.raca}
            ${animal.descricao}
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

        return;
    }


    nenhumAnimal.style.display = "none";


    filtrados.forEach(animal => {

        const card =
            document.createElement("article");

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


        card.innerHTML = `

            <div class="foto-card">

                <img
                    src="${animal.foto}"
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
                        <span>${animal.bairro}</span>
                    </div>

                    <div class="detalhe">
                        <i class="fa-solid fa-calendar"></i>
                        <span>${formatarData(animal.data)}</span>
                    </div>

                    <div class="detalhe">
                        <i class="fa-solid fa-map-pin"></i>
                        <span>${animal.local}</span>
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


                ${
                    animal.criadoPeloUsuario
                    ? `
                    <button
                        class="btn-remover"
                        onclick="removerAnimal(${animal.id})"
                    >
                        <i class="fa-solid fa-trash"></i>
                        Remover anúncio
                    </button>
                    `
                    : ""
                }

            </div>

        `;


        listaAnimais.appendChild(card);

    });

}


// ========================================
// FORMATAR DATA
// ========================================

function formatarData(data) {

    if (!data) {
        return "Data não informada";
    }

    const partes = data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ========================================
// MODAL
// ========================================

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
    (event) => {

        if (event.target === modal) {
            fecharFormulario();
        }

    }
);


// ========================================
// PREVIEW DA FOTO
// ========================================

fotoAnimal.addEventListener(
    "change",
    function () {

        const arquivo = this.files[0];

        if (!arquivo) {
            return;
        }


        const leitor = new FileReader();


        leitor.onload = function (event) {

            previewFoto.src =
                event.target.result;

            previewFoto.style.display =
                "block";

        };


        leitor.readAsDataURL(arquivo);

    }
);


// ========================================
// CADASTRAR ANIMAL
// ========================================

formAnimal.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const status =
            document.querySelector(
                'input[name="status"]:checked'
            ).value;


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


        let foto =
            "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80";


        if (previewFoto.src) {
            foto = previewFoto.src;
        }


        const novoAnimal = {

            id: Date.now(),

            nome,
            especie,
            raca,
            cor,
            data,
            bairro,
            local,
            descricao,
            contato,
            status,
            foto,

            criadoPeloUsuario: true

        };


        const animais =
            carregarAnimais();


        animais.unshift(novoAnimal);


        salvarAnimais(animais);


        formAnimal.reset();


        previewFoto.style.display =
            "none";

        previewFoto.src = "";


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


        renderizarAnimais();


        alert(
            "Animal cadastrado com sucesso! 🐾"
        );

    }
);


// ========================================
// FILTROS DE STATUS
// ========================================

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


// ========================================
// PESQUISA
// ========================================

pesquisaAnimal.addEventListener(
    "input",
    renderizarAnimais
);


// ========================================
// ESPÉCIE
// ========================================

filtroEspecie.addEventListener(
    "change",
    renderizarAnimais
);


// ========================================
// CONTATO
// ========================================

function entrarEmContato(numero) {

    const numeroLimpo =
        numero.replace(/\D/g, "");


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


// ========================================
// REMOVER ANIMAL
// ========================================

function removerAnimal(id) {

    const confirmar =
        confirm(
            "Tem certeza que deseja remover este anúncio?"
        );


    if (!confirmar) {
        return;
    }


    let animais =
        carregarAnimais();


    animais =
        animais.filter(
            animal => animal.id !== id
        );


    salvarAnimais(animais);


    renderizarAnimais();

}


// ========================================
// INICIAR
// ========================================

renderizarAnimais();