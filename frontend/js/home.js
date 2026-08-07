const pesquisa = document.getElementById("pesquisa");
const regiao = document.getElementById("regiao");
const cards = document.querySelectorAll(".card");

// ===============================
// FILTRO DAS CLÍNICAS
// ===============================

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

        card.parentElement.style.display =
            nomeCorreto && regiaoCorreta
                ? "block"
                : "none";
    });

}

pesquisa.addEventListener("keyup", filtrar);
regiao.addEventListener("change", filtrar);

// ===============================
// SALVAR DADOS DA CLÍNICA
// ===============================

cards.forEach(card => {

    card.parentElement.addEventListener("click", () => {

        const nome = card.querySelector("h2").textContent;

        const endereco = card.querySelectorAll(".conteudo p")[0].textContent.trim();

        const telefone = card.querySelectorAll(".conteudo p")[1].textContent.trim();

        const horario = card.querySelectorAll(".conteudo p")[2].textContent.trim();

        const consulta = card.querySelector(".info-extra strong").textContent;

        const dadosClinica = {

            nome: nome,
            regiao: card.dataset.regiao,
            endereco: endereco,
            telefone: telefone,
            horario: horario,
            consulta: consulta

        };

        localStorage.setItem(
            "clinicaDados",
            JSON.stringify(dadosClinica)
        );

    });

});