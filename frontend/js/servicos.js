
document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "http://localhost:3000/api";

    const listaConsultas =
        document.getElementById("listaConsultas");

    const listaExames =
        document.getElementById("listaExames");

    const btnContinuar =
        document.getElementById("btnContinuar");

    const nomeClinica =
        document.getElementById("nomeClinica");

    const parametros =
        new URLSearchParams(window.location.search);

    const clinicaId =
        parametros.get("clinica_id") ||
        sessionStorage.getItem("clinica_id") ||
        localStorage.getItem("clinicaId");

    if (!clinicaId) {

        if (nomeClinica) {
            nomeClinica.textContent =
                "Clínica não identificada";
        }

        if (listaConsultas) {
            listaConsultas.innerHTML =
                "<p>Não foi possível identificar a clínica.</p>";
        }

        if (listaExames) {
            listaExames.innerHTML =
                "<p>Não foi possível identificar a clínica.</p>";
        }

        return;
    }

    let servicoSelecionado = null;

    try {

        const respostaClinica =
            await fetch(
                `${API_URL}/clinicas/${clinicaId}`
            );

        if (!respostaClinica.ok) {
            throw new Error(
                "Não foi possível carregar os dados da clínica."
            );
        }

        const clinica =
            await respostaClinica.json();

        if (nomeClinica) {
            nomeClinica.textContent =
                clinica.nome || "Clínica Veterinária";
        }

        const respostaServicos =
            await fetch(
                `${API_URL}/clinicas/${clinicaId}/servicos`
            );

        if (!respostaServicos.ok) {
            throw new Error(
                "Não foi possível carregar os serviços."
            );
        }

        const servicos =
            await respostaServicos.json();

        if (!Array.isArray(servicos) || servicos.length === 0) {

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

        if (listaConsultas) {
            listaConsultas.innerHTML = "";
        }

        if (listaExames) {
            listaExames.innerHTML = "";
        }

        let encontrouConsulta = false;
        let encontrouExame = false;

        servicos.forEach(servico => {

            const card =
                document.createElement("div");

            card.className = "servico-card";

            const botao =
                document.createElement("button");

            botao.type = "button";
            botao.className = "servico";

            const icone =
                servico.tipo === "Consulta"
                    ? "fa-stethoscope"
                    : "fa-vial";

            const divIcone =
                document.createElement("div");

            divIcone.className = "icone";

            const i =
                document.createElement("i");

            i.className =
                `fa-solid ${icone}`;

            divIcone.appendChild(i);

            const divInfo =
                document.createElement("div");

            divInfo.className = "info";

            const h3 =
                document.createElement("h3");

            h3.textContent =
                servico.nome || "Serviço";

            const p =
                document.createElement("p");

            const iVeterinario =
                document.createElement("i");

            iVeterinario.className =
                "fa-solid fa-user-doctor";

            p.appendChild(iVeterinario);

            p.appendChild(
                document.createTextNode(
                    ` ${servico.veterinario || "Veterinário não informado"}`
                )
            );

            divInfo.appendChild(h3);
            divInfo.appendChild(p);

            const spanPreco =
                document.createElement("span");

            spanPreco.className = "preco";

            const preco =
                Number(servico.preco);

            if (!isNaN(preco)) {

                spanPreco.textContent =
                    `R$ ${preco.toFixed(2).replace(".", ",")}`;

            } else {

                spanPreco.textContent =
                    servico.preco || "Consultar";

            }

            botao.appendChild(divIcone);
            botao.appendChild(divInfo);
            botao.appendChild(spanPreco);

            card.appendChild(botao);

            botao.addEventListener("click", () => {

                document
                    .querySelectorAll(".servico")
                    .forEach(item => {
                        item.classList.remove("selecionado");
                    });

                botao.classList.add("selecionado");

                servicoSelecionado = servico;

                if (btnContinuar) {
                    btnContinuar.disabled = false;
                }
            });

            if (servico.tipo === "Consulta") {

                encontrouConsulta = true;

                if (listaConsultas) {
                    listaConsultas.appendChild(card);
                }

            } else {

                encontrouExame = true;

                if (listaExames) {
                    listaExames.appendChild(card);
                }

            }

        });

        if (!encontrouConsulta && listaConsultas) {

            listaConsultas.innerHTML =
                "<p>Nenhuma consulta disponível nesta clínica.</p>";

        }

        if (!encontrouExame && listaExames) {

            listaExames.innerHTML =
                "<p>Nenhum exame disponível nesta clínica.</p>";

        }

    } catch (erro) {

        console.error(erro);

        if (listaConsultas) {
            listaConsultas.innerHTML =
                "<p>Erro ao carregar as consultas.</p>";
        }

        if (listaExames) {
            listaExames.innerHTML =
                "<p>Erro ao carregar os exames.</p>";
        }

        if (nomeClinica) {
            nomeClinica.textContent =
                "Erro ao carregar clínica";
        }

    }

    if (btnContinuar) {

        btnContinuar.addEventListener("click", () => {

            if (!servicoSelecionado) {

                alert(
                    "Selecione uma consulta ou exame para continuar."
                );

                return;
            }

            sessionStorage.setItem(
                "servico_id",
                servicoSelecionado.id
            );

            sessionStorage.setItem(
                "servico_nome",
                servicoSelecionado.nome
            );

            sessionStorage.setItem(
                "servico_preco",
                servicoSelecionado.preco
            );

            sessionStorage.setItem(
                "servico_tipo",
                servicoSelecionado.tipo
            );

            sessionStorage.setItem(
                "veterinario_id",
                servicoSelecionado.veterinario_id || ""
            );

            sessionStorage.setItem(
                "veterinario",
                servicoSelecionado.veterinario || ""
            );

            const parametros =
                new URLSearchParams(window.location.search);

            const clinicaId =
                parametros.get("clinica_id") ||
                sessionStorage.getItem("clinica_id") ||
                localStorage.getItem("clinicaId");

            const tutorId =
                parametros.get("tutor_id") ||
                sessionStorage.getItem("tutor_id") ||
                localStorage.getItem("tutorId");

            let url =
                `petetransporte.html?clinica_id=${encodeURIComponent(clinicaId)}`;

            if (tutorId) {
                url +=
                    `&tutor_id=${encodeURIComponent(tutorId)}`;
            }

            window.location.href = url;

        });

    }

});

