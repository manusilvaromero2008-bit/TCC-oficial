const pesquisa = document.getElementById("pesquisa");
const regiao = document.getElementById("regiao");

const cards = document.querySelectorAll(".card");

function filtrar() {

    const texto = pesquisa.value.toLowerCase().trim();
    const filtroRegiao = regiao.value.toLowerCase();

    cards.forEach(card => {

        const nome = card.querySelector("h2").textContent.toLowerCase();
        const regiaoCard = card.dataset.regiao.toLowerCase();

        const nomeCorreto = nome.includes(texto);
        const regiaoCorreta =
            filtroRegiao === "todas" ||
            regiaoCard === filtroRegiao;

        // Esconde ou mostra o LINK inteiro
        card.parentElement.style.display =
            nomeCorreto && regiaoCorreta
                ? "block"
                : "none";
    });

}

pesquisa.addEventListener("keyup", filtrar);
regiao.addEventListener("change", filtrar);