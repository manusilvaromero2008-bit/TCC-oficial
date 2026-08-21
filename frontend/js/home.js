document.addEventListener("DOMContentLoaded", async () => {

    const pesquisa = document.getElementById("pesquisa");
    const regiao = document.getElementById("regiao");
    const listaClinicas = document.getElementById("listaClinicas");

    let clinicas = [];

    try {

        const resposta = await fetch("http://localhost:3000/api/clinicas");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar clínicas.");
        }

        clinicas = await resposta.json();

        renderizarClinicas(clinicas);

    } catch (erro) {

        console.error(erro);

        listaClinicas.innerHTML = `
            <p class="mensagem-erro">
                Não foi possível carregar as clínicas.
            </p>
        `;

    }

    function renderizarClinicas(lista) {

        listaClinicas.innerHTML = "";

        lista.forEach(clinica => {

            const cardLink = document.createElement("a");

            cardLink.className = "card-link";
            cardLink.href = `./frontend/pages/clinica.html?id=${clinica.id}`;

            const card = document.createElement("div");

            card.className = "card";
            card.dataset.regiao = clinica.regiao;
            card.dataset.clinica = clinica.id;

            const classeClinica =
                clinica.id === 1 ? "petvida" :
                clinica.id === 2 ? "animalcare" :
                clinica.id === 3 ? "vetcare" :
                "pethealth";

            const precoConsulta =
                clinica.id === 1 ? "R$ 120" :
                clinica.id === 2 ? "R$ 150" :
                clinica.id === 3 ? "R$ 100" :
                "R$ 130";

            card.innerHTML = `
                <div class="topo-card ${classeClinica}">
                    <h2>${clinica.nome}</h2>
                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        ${clinica.regiao}
                    </p>
                </div>

                <div class="conteudo">

                    <p>
                        <i class="fa-solid fa-map-location-dot"></i>
                        ${clinica.endereco}
                    </p>

                    <p>
                        <i class="fa-solid fa-phone"></i>
                        ${clinica.telefone || "Não informado"}
                    </p>

                    <p>
                        <i class="fa-regular fa-clock"></i>
                        ${clinica.horario_atendimento}
                    </p>

                    <div class="info-extra">
                        <span>Consulta</span>
                        <strong>${precoConsulta}</strong>
                    </div>

                </div>
            `;

            cardLink.appendChild(card);
            listaClinicas.appendChild(cardLink);

        });

    }

    function filtrar() {

        const texto = pesquisa.value
            .toLowerCase()
            .trim();

        const filtroRegiao = regiao.value
            .toLowerCase();

        const cards = document.querySelectorAll(".card-link");

        cards.forEach(cardLink => {

            const card = cardLink.querySelector(".card");

            const nome = card
                .querySelector("h2")
                .textContent
                .toLowerCase();

            const regiaoCard = card
                .dataset.regiao
                .toLowerCase();

            const nomeCorreto = nome.includes(texto);

            const regiaoCorreta =
                filtroRegiao === "todas" ||
                regiaoCard === filtroRegiao;

            cardLink.style.display =
                nomeCorreto && regiaoCorreta
                    ? "block"
                    : "none";

        });

    }

    pesquisa.addEventListener("input", filtrar);

    regiao.addEventListener("change", filtrar);

});