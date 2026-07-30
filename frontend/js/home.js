
const pesquisa = document.getElementById("pesquisa");
const regiao = document.getElementById("regiao");
const cards = document.querySelectorAll(".card");

function filtrarClinicas() {

    const textoPesquisa = pesquisa.value.toLowerCase().trim();
    const regiaoSelecionada = regiao.value;

    cards.forEach(card => {

        const nomeClinica = card.querySelector("h2").textContent.toLowerCase();
        const regiaoClinica = card.dataset.regiao;

        const correspondePesquisa = nomeClinica.includes(textoPesquisa);

        const correspondeRegiao =
            regiaoSelecionada === "todas" ||
            regiaoClinica === regiaoSelecionada;

        if (correspondePesquisa && correspondeRegiao) {
            card.parentElement.style.display = "block";
        } else {
            card.parentElement.style.display = "none";
        }

    });

}

pesquisa.addEventListener("input", filtrarClinicas);
regiao.addEventListener("change", filtrarClinicas);


filtrarClinicas();