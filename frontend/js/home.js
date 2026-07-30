const pesquisa = document.getElementById("pesquisa");
const regiao = document.getElementById("regiao");
const cards = document.querySelectorAll(".card");

const paginas = {
    "Pet Vida Veterinária": "petvida.html",
    "Clínica Animal Care": "animalcare.html",
    "VetCare Taquaral": "vetcare.html",
    "Pet Health Barão": "pethealth.html"
};

function filtrar() {
    const texto = pesquisa.value.toLowerCase();
    const filtroRegiao = regiao.value.toLowerCase();

    cards.forEach(card => {
        const nome = card.querySelector("h2").textContent.toLowerCase();
        const reg = card.dataset.regiao.toLowerCase();

        const pesquisaOk = nome.includes(texto);
        const regiaoOk = filtroRegiao === "todas" || reg === filtroRegiao;

        card.style.display = pesquisaOk && regiaoOk ? "block" : "none";
    });
}

pesquisa.addEventListener("input", filtrar);
regiao.addEventListener("change", filtrar);

cards.forEach(card => {
    card.style.cursor = "pointer";

    card.addEventListener("click", () => {
        const nome = card.querySelector("h2").textContent;

        if (paginas[nome]) {
            window.location.href = paginas[nome];
        }
    });
});