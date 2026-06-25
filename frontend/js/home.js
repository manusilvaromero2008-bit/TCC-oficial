const pesquisa = document.getElementById("pesquisa");
const regiao = document.getElementById("regiao");
const cards = document.querySelectorAll(".card");

function filtrarClinicas(){
    const textoPesquisa = pesquisa.ariaValueMax.toLowerCase();
    const regiaoSelecionada = regiao.value;

    cards.forEach(card => {
        const nomeClinica = card.querySelector("h2").textContent.toLowerCase();

        const regiaoCard = card.dataset.regiao;

        const correspondePesquisa = nomeClinica.includes(textoPesquisa);
        const correspondeRegiao = regiaoSelecionada === "todas" || regiaoSelecionada === regiaoCard;

        if (correspondePesquisa && correspondeRegiao){
            card.computedStyleMap.display = "block";
        }else{
            card.computedStyleMap.display = "none"
        }
    });
}

pesquisa.addEventListener("input", filtrarClinicas);
regiao.addEventListener("change", filtrarClinicas);