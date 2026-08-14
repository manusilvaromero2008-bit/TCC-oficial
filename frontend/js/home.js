document.addEventListener("DOMContentLoaded", () => {

    const pesquisa = document.getElementById("pesquisa");
    const regiao = document.getElementById("regiao");
    const cards = document.querySelectorAll(".card-link");

    const clinicas = {
        "petvida": {
            id: 1,
            nome: "Pet Vida Veterinária",
            regiao: "Centro",
            endereco: "Av. Francisco Glicério, 1200",
            telefone: "(19) 3234-5678",
            horario: "Seg-Sex: 8h às 18h | Sáb: 8h às 12h",
            consulta: "R$ 120"
        },

        "animalcare": {
            id: 2,
            nome: "Clínica Animal Care",
            regiao: "Cambuí",
            endereco: "Rua Coronel Quirino, 456",
            telefone: "(19) 3345-6788",
            horario: "Seg-Sex: 9h às 19h | Sáb: 9h às 14h",
            consulta: "R$ 150"
        },

        "vetcare": {
            id: 3,
            nome: "VetCare Taquaral",
            regiao: "Taquaral",
            endereco: "Av. Heitor Penteado, 890",
            telefone: "(19) 3456-7809",
            horario: "Atendimento 24 horas",
            consulta: "R$ 100"
        },

        "pethealth": {
            id: 4,
            nome: "Pet Health Barão",
            regiao: "Barão Geraldo",
            endereco: "Av. Albino J. B. de Oliveira, 1511",
            telefone: "(19) 3567-8910",
            horario: "Seg-Sex: 8h às 20h | Sáb-Dom: 8h às 16h",
            consulta: "R$ 130"
        }
    };


    cards.forEach(cardLink => {

        cardLink.addEventListener("click", () => {

            const card = cardLink.querySelector(".card");

            const clinicaId = card.dataset.clinica;

            const clinicaSelecionada = clinicas[clinicaId];

            if (!clinicaSelecionada) {
                console.error("Clínica não encontrada.");
                return;
            }

            localStorage.setItem(
                "clinica",
                clinicaSelecionada.nome
            );

            localStorage.setItem(
                "clinicaId",
                clinicaSelecionada.id
            );

            localStorage.setItem(
                "clinicaDados",
                JSON.stringify(clinicaSelecionada)
            );

        });

    });


    function filtrar() {

        const texto = pesquisa.value
            .toLowerCase()
            .trim();

        const filtroRegiao = regiao.value
            .toLowerCase();

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