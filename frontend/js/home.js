document.addEventListener("DOMContentLoaded", () => {

    const pesquisa = document.getElementById("pesquisa");
    const regiao = document.getElementById("regiao");
    const cards = document.querySelectorAll(".card");


    // ===============================
    // FILTRAR CLÍNICAS
    // ===============================

    function filtrar() {

        const texto = pesquisa
            ? pesquisa.value.toLowerCase().trim()
            : "";

        const filtroRegiao = regiao
            ? regiao.value.toLowerCase().trim()
            : "todas";


        cards.forEach(card => {

            const titulo = card.querySelector("h2");

            const nome = titulo
                ? titulo.textContent.toLowerCase().trim()
                : "";

            const regiaoCard =
                (card.dataset.regiao || "")
                .toLowerCase()
                .trim();


            const nomeCorreto =
                nome.includes(texto);

            const regiaoCorreta =
                filtroRegiao === "todas" ||
                regiaoCard === filtroRegiao;


            const link =
                card.closest(".card-link");


            if (link) {

                link.style.display =
                    nomeCorreto && regiaoCorreta
                        ? "block"
                        : "none";

            }

        });

    }


    // ===============================
    // EVENTOS DO FILTRO
    // ===============================

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            filtrar
        );

    }


    if (regiao) {

        regiao.addEventListener(
            "change",
            filtrar
        );

    }


    // ===============================
    // SELECIONAR CLÍNICA
    // ===============================

    cards.forEach(card => {

        const link =
            card.closest(".card-link");


        if (!link) {
            return;
        }


        link.addEventListener("click", function(event) {

            const titulo =
                card.querySelector("h2");


            const nome =
                titulo
                    ? titulo.textContent.trim()
                    : "";


            const regiaoClinica =
                (card.dataset.regiao || "").trim();


            const paragrafos =
                card.querySelectorAll(".conteudo > p");


            const endereco =
                paragrafos[0]
                    ? paragrafos[0].textContent.trim()
                    : "";


            const telefone =
                paragrafos[1]
                    ? paragrafos[1].textContent.trim()
                    : "";


            const horario =
                paragrafos[2]
                    ? paragrafos[2].textContent.trim()
                    : "";


            const preco =
                card.querySelector(
                    ".info-extra strong"
                );


            const consulta =
                preco
                    ? preco.textContent.trim()
                    : "";


            const dadosClinica = {

                nome: nome,

                regiao: regiaoClinica,

                endereco: endereco,

                telefone: telefone,

                horario: horario,

                consulta: consulta

            };


            // Salva a clínica escolhida

            localStorage.setItem(
                "clinicaDados",
                JSON.stringify(dadosClinica)
            );


            // Salva também somente o nome

            localStorage.setItem(
                "clinica",
                nome
            );


            console.log(
                "Clínica selecionada:",
                dadosClinica
            );


            // Impede a navegação automática

            event.preventDefault();


            // Navega depois de salvar

            window.location.href =
                link.getAttribute("href");

        });

    });

});