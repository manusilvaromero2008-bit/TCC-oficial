document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "http://localhost:3000/api";

    const pesquisa = document.getElementById("pesquisa");
    const regiao = document.getElementById("regiao");
    const listaClinicas = document.getElementById("listaClinicas");

    let clinicas = [];

    const paginasClinicas = {
        1: "petvida.html",
        2: "animalcare.html",
        3: "vetcare.html",
        4: "pethealth.html"
    };

    async function carregarClinicas() {
        try {

            listaClinicas.innerHTML = `
                <p class="mensagem-carregando">
                    Carregando clínicas...
                </p>
            `;

            const resposta = await fetch(`${API_URL}/clinicas`);

            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            const dados = await resposta.json();

            console.log("CLÍNICAS RECEBIDAS:", dados);

            if (!Array.isArray(dados)) {
                throw new Error("A API não retornou uma lista de clínicas.");
            }

            clinicas = dados;

            renderizarClinicas(clinicas);
            marcarClinicasNoMapa();

        } catch (erro) {

            console.error("Erro ao carregar clínicas:", erro);

            listaClinicas.innerHTML = `
                <p class="mensagem-erro">
                    Não foi possível carregar as clínicas.
                    <br>
                    Verifique se o servidor está rodando.
                </p>
            `;
        }
    }

    function renderizarClinicas(lista) {

        listaClinicas.innerHTML = "";

        if (lista.length === 0) {

            listaClinicas.innerHTML = `
                <p class="mensagem-erro">
                    Nenhuma clínica encontrada.
                </p>
            `;

            return;
        }

        lista.forEach(clinica => {

            const cardLink = document.createElement("a");
            cardLink.className = "card-link";

            const pagina = paginasClinicas[Number(clinica.id)];

            if (pagina) {
                cardLink.href = `./frontend/pages/${pagina}?id=${clinica.id}`;
            } else {
                cardLink.href = `./frontend/pages/clinica.html?id=${clinica.id}`;
            }

            const card = document.createElement("div");

            card.className = "card";
            card.dataset.regiao = clinica.regiao || "";
            card.dataset.clinica = clinica.id;

            let classeClinica = "";

            switch (Number(clinica.id)) {
                case 1:
                    classeClinica = "petvida";
                    break;
                case 2:
                    classeClinica = "animalcare";
                    break;
                case 3:
                    classeClinica = "vetcare";
                    break;
                case 4:
                    classeClinica = "pethealth";
                    break;
            }

            card.innerHTML = `
                <div class="topo-card ${classeClinica}">
                    <h2>${escaparHTML(clinica.nome)}</h2>
                    <p>
                        <i class="fa-solid fa-location-dot"></i>
                        ${escaparHTML(clinica.regiao || "Região não informada")}
                    </p>
                </div>

                <div class="conteudo">
                    <p>
                        <i class="fa-solid fa-map-location-dot"></i>
                        ${escaparHTML(clinica.endereco || "Endereço não informado")}
                    </p>

                    <p>
                        <i class="fa-solid fa-phone"></i>
                        ${escaparHTML(clinica.telefone || "Não informado")}
                    </p>

                    <p>
                        <i class="fa-regular fa-clock"></i>
                        ${escaparHTML(clinica.horario_atendimento || "Não informado")}
                    </p>
                </div>
            `;

            cardLink.appendChild(card);
            listaClinicas.appendChild(cardLink);
        });
    }

    function escaparHTML(valor) {

        if (valor === null || valor === undefined) {
            return "";
        }

        const elemento = document.createElement("div");
        elemento.textContent = String(valor);

        return elemento.innerHTML;
    }

    function filtrarClinicas() {

        const texto = pesquisa ? pesquisa.value.toLowerCase().trim() : "";
        const filtroRegiao = regiao ? regiao.value.toLowerCase().trim() : "todas";

        const cards = document.querySelectorAll(".card-link");

        let quantidadeVisivel = 0;

        cards.forEach(cardLink => {

            const card = cardLink.querySelector(".card");

            if (!card) return;

            const titulo = card.querySelector("h2");

            const nome = titulo
                ? titulo.textContent.toLowerCase().trim()
                : "";

            const regiaoCard = (card.dataset.regiao || "")
                .toLowerCase()
                .trim();

            const nomeCorreto = nome.includes(texto);

            const regiaoCorreta =
                filtroRegiao === "todas" ||
                regiaoCard === filtroRegiao;

            const deveMostrar = nomeCorreto && regiaoCorreta;

            cardLink.style.display = deveMostrar ? "" : "none";

            if (deveMostrar) quantidadeVisivel++;
        });

        let mensagem = document.getElementById("mensagemFiltro");

        if (quantidadeVisivel === 0) {

            if (!mensagem) {

                mensagem = document.createElement("p");
                mensagem.id = "mensagemFiltro";
                mensagem.className = "mensagem-erro";

                listaClinicas.appendChild(mensagem);
            }

            mensagem.textContent = "Nenhuma clínica encontrada.";

        } else {

            if (mensagem) mensagem.remove();
        }
    }

    // ===== MAPA COM PINOS =====

    function marcarClinicasNoMapa() {

        const mapaElemento = document.getElementById("map");

        if (!mapaElemento || !window.google) return;

        const map = new google.maps.Map(mapaElemento, {
            center: { lat: -22.9056, lng: -47.0608 },
            zoom: 12
        });

        const limites = new google.maps.LatLngBounds();

        const coordenadas = {
            1: { lat: -22.9056, lng: -47.0608 }, // Pet Vida
            2: { lat: -22.8943, lng: -47.0517 }, // Animal Care
            3: { lat: -22.9128, lng: -47.0489 }, // VetCare
            4: { lat: -22.8905, lng: -47.0625 }  // Pet Health
        };

        clinicas.forEach(clinica => {

            const posicao = coordenadas[Number(clinica.id)];

            if (!posicao) return;

            const marker = new google.maps.Marker({
                position: posicao,
                map: map,
                title: clinica.nome
            });

            const info = new google.maps.InfoWindow({
                content: `
                    <div>
                        <strong>${escaparHTML(clinica.nome)}</strong><br>
                        ${escaparHTML(clinica.endereco || "Campinas - SP")}
                    </div>
                `
            });

            marker.addListener("click", () => {
                info.open(map, marker);
            });

            limites.extend(posicao);
        });

        if (clinicas.length > 0) {
            map.fitBounds(limites);
        }
    }

    if (pesquisa) {
        pesquisa.addEventListener("input", filtrarClinicas);
    }

    if (regiao) {
        regiao.addEventListener("change", filtrarClinicas);
    }

    await carregarClinicas();

});