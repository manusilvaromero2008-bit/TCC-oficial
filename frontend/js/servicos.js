document.addEventListener("DOMContentLoaded", () => {

    const clinicaDados = JSON.parse(
        localStorage.getItem("clinicaDados")
    ) || {};

    const elementoClinica =
        document.getElementById("nomeClinica");

    if (elementoClinica) {
        elementoClinica.textContent =
            clinicaDados.nome || "Clínica Veterinária";
    }


    const listaConsultas =
        document.getElementById("listaConsultas");

    const listaExames =
        document.getElementById("listaExames");

    const btnContinuar =
        document.getElementById("btnContinuar");


    let servicoSelecionado = null;


    const servicosSalvos =
        localStorage.getItem("servicosClinica");

    let servicos = [];

    if (servicosSalvos) {

        try {

            servicos = JSON.parse(servicosSalvos);

        } catch (erro) {

            console.error(
                "Erro ao carregar os serviços:",
                erro
            );

            servicos = [];

        }

    }


    if (btnContinuar) {
        btnContinuar.disabled = true;
    }


    if (servicos.length === 0) {

        if (listaConsultas) {
            listaConsultas.innerHTML =
                "<p>Nenhuma consulta disponível nesta clínica.</p>";
        }

        if (listaExames) {
            listaExames.innerHTML =
                "<p>Nenhum exame disponível nesta clínica.</p>";
        }

        return;
    }


    servicos.forEach(servico => {

        const card =
            document.createElement("div");

        card.className = "servico-card";


        const icone =
            servico.tipo === "Consulta"
                ? "fa-stethoscope"
                : "fa-vial";


        card.innerHTML = `

            <button type="button" class="servico">

                <div class="icone">
                    <i class="fa-solid ${icone}"></i>
                </div>

                <div class="info">

                    <h3>
                        ${servico.nome}
                    </h3>

                    <p>
                        <i class="fa-solid fa-user-doctor"></i>
                        ${servico.veterinario}
                    </p>

                </div>

                <span class="preco">
                    ${servico.preco}
                </span>

            </button>

        `;


        const botao =
            card.querySelector(".servico");


        botao.addEventListener("click", () => {

            document
                .querySelectorAll(".servico")
                .forEach(item => {

                    item.classList.remove(
                        "selecionado"
                    );

                });


            botao.classList.add(
                "selecionado"
            );


            servicoSelecionado = servico;


            if (btnContinuar) {
                btnContinuar.disabled = false;
            }

        });


        if (servico.tipo === "Consulta") {

            if (listaConsultas) {
                listaConsultas.appendChild(card);
            }

        } else {

            if (listaExames) {
                listaExames.appendChild(card);
            }

        }

    });


    if (btnContinuar) {

        btnContinuar.addEventListener("click", () => {

            if (!servicoSelecionado) {

                alert(
                    "Selecione uma consulta ou exame para continuar."
                );

                return;
            }


            localStorage.setItem(
                "servico",
                servicoSelecionado.nome
            );


            localStorage.setItem(
                "precoServico",
                servicoSelecionado.preco
            );


            localStorage.setItem(
                "veterinario",
                servicoSelecionado.veterinario
            );


            localStorage.setItem(
                "tipoServico",
                servicoSelecionado.tipo
            );


            localStorage.setItem(
                "servicoId",
                servicoSelecionado.id || ""
            );


            window.location.href =
                "petetransporte.html";

        });

    }

});