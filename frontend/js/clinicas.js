document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "http://localhost:3000/api";

    const nomeClinica = document.getElementById("nomeClinica");
    const enderecoClinica = document.getElementById("enderecoClinica");
    const telefoneClinica = document.getElementById("telefoneClinica");
    const horarioClinica = document.getElementById("horarioClinica");
    const precoConsulta = document.getElementById("precoConsulta");

    const listaServicos = document.getElementById("listaServicos");
    const listaVeterinarios = document.getElementById("listaVeterinarios");

    const btnAgendar = document.getElementById("btnAgendar");

    const clinicaId = document.body.dataset.clinicaId;

    if (!clinicaId) {
        console.error("ID da clínica não encontrado no HTML.");
        return;
    }

    /*
    ============================================================
    CARREGAR DADOS DA CLÍNICA
    ============================================================
    */

    async function carregarClinica() {

        try {

            const resposta = await fetch(
                `${API_URL}/clinicas/${clinicaId}`
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    dados.mensagem || "Erro ao carregar clínica."
                );
            }

            if (nomeClinica) {

                nomeClinica.innerHTML = `
                    <i class="fa-solid fa-hospital"></i>
                    ${escaparHTML(dados.nome || "Clínica")}
                `;

            }

            document.title = dados.nome || "Clínica";

            if (enderecoClinica) {

                enderecoClinica.innerHTML = `
                    <i class="fa-solid fa-location-dot"></i>
                    ${escaparHTML(dados.endereco || "Endereço não informado")}
                `;

            }

            if (telefoneClinica) {

                telefoneClinica.innerHTML = `
                    <i class="fa-solid fa-phone"></i>
                    ${escaparHTML(dados.telefone || "Telefone não informado")}
                `;

            }

            if (horarioClinica) {

                let horario = dados.horario_atendimento || "Horário não informado";

                if (dados.atendimento_24h) {
                    horario = "Atendimento 24 horas";
                }

                horarioClinica.innerHTML = `
                    <i class="fa-regular fa-clock"></i>
                    ${escaparHTML(horario)}
                `;

            }

        } catch (erro) {

            console.error("Erro ao carregar clínica:", erro);

            if (nomeClinica) {
                nomeClinica.innerHTML = `
                    <i class="fa-solid fa-hospital"></i>
                    Erro ao carregar
                `;
            }

            if (enderecoClinica) {
                enderecoClinica.innerHTML = `
                    <i class="fa-solid fa-location-dot"></i>
                    Não foi possível carregar o endereço.
                `;
            }

            if (telefoneClinica) {
                telefoneClinica.innerHTML = `
                    <i class="fa-solid fa-phone"></i>
                    Não foi possível carregar o telefone.
                `;
            }

            if (horarioClinica) {
                horarioClinica.innerHTML = `
                    <i class="fa-regular fa-clock"></i>
                    Não foi possível carregar o horário.
                `;
            }
        }
    }


    /*
    ============================================================
    CARREGAR SERVIÇOS
    ============================================================
    */

    async function carregarServicos() {

        if (!listaServicos) {
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/clinicas/${clinicaId}/servicos`
            );

            const servicos = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    servicos.mensagem || "Erro ao carregar serviços."
                );
            }

            listaServicos.innerHTML = "";

            if (!Array.isArray(servicos) || servicos.length === 0) {

                listaServicos.innerHTML = `
                    <p>Nenhum serviço disponível.</p>
                `;

                return;
            }

            /*
            Procuramos um serviço do tipo Consulta
            para mostrar o preço da consulta.
            */

            const consulta = servicos.find(servico => {

                const tipo = String(
                    servico.tipo || ""
                ).toLowerCase();

                const nome = String(
                    servico.nome || ""
                ).toLowerCase();

                return (
                    tipo.includes("consulta") ||
                    nome.includes("consulta")
                );

            });

            if (precoConsulta) {

                if (consulta && consulta.preco !== null) {

                    const valor = Number(consulta.preco);

                    if (!Number.isNaN(valor)) {

                        precoConsulta.textContent =
                            valor.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL"
                            });

                    } else {

                        precoConsulta.textContent =
                            `R$ ${consulta.preco}`;

                    }

                } else {

                    precoConsulta.textContent =
                        "Consultar valor";

                }

            }

            /*
            Mostra os serviços/exames
            */

            servicos.forEach(servico => {

                const card = document.createElement("div");

                card.className = "card-exame";

                const preco = servico.preco !== null &&
                    servico.preco !== undefined
                    ? Number(servico.preco).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    )
                    : "";

                card.innerHTML = `
                    <h3>
                        ${escaparHTML(servico.nome || "Serviço")}
                    </h3>

                    ${
                        servico.descricao
                            ? `<p>${escaparHTML(servico.descricao)}</p>`
                            : ""
                    }

                    ${
                        preco
                            ? `<strong>${preco}</strong>`
                            : ""
                    }
                `;

                listaServicos.appendChild(card);

            });

        } catch (erro) {

            console.error("Erro ao carregar serviços:", erro);

            listaServicos.innerHTML = `
                <p>
                    Não foi possível carregar os serviços.
                </p>
            `;

            if (precoConsulta) {
                precoConsulta.textContent =
                    "Não informado";
            }
        }
    }


    /*
    ============================================================
    CARREGAR VETERINÁRIOS
    ============================================================
    */

    async function carregarVeterinarios() {

        if (!listaVeterinarios) {
            return;
        }

        try {

            const resposta = await fetch(
                `${API_URL}/clinicas/${clinicaId}/veterinarios`
            );

            const veterinarios = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    veterinarios.mensagem ||
                    "Erro ao carregar veterinários."
                );
            }

            listaVeterinarios.innerHTML = "";

            if (
                !Array.isArray(veterinarios) ||
                veterinarios.length === 0
            ) {

                listaVeterinarios.innerHTML = `
                    <p>Nenhum veterinário disponível.</p>
                `;

                return;
            }

            veterinarios.forEach(veterinario => {

                const card = document.createElement("div");

                card.className = "card-veterinario";

                card.innerHTML = `
                    <h3>
                        <i class="fa-solid fa-user-doctor"></i>
                        ${escaparHTML(veterinario.nome)}
                    </h3>

                    ${
                        veterinario.especialidade
                            ? `<p>${escaparHTML(
                                veterinario.especialidade
                            )}</p>`
                            : ""
                    }

                    ${
                        veterinario.telefone
                            ? `<p>
                                <i class="fa-solid fa-phone"></i>
                                ${escaparHTML(
                                    veterinario.telefone
                                )}
                            </p>`
                            : ""
                    }

                    ${
                        veterinario.email
                            ? `<p>
                                <i class="fa-solid fa-envelope"></i>
                                ${escaparHTML(
                                    veterinario.email
                                )}
                            </p>`
                            : ""
                    }

                    ${
                        veterinario.disponivel
                            ? `
                                <span>
                                    Disponível
                                </span>
                            `
                            : `
                                <span>
                                    Indisponível
                                </span>
                            `
                    }
                `;

                listaVeterinarios.appendChild(card);

            });

        } catch (erro) {

            console.error(
                "Erro ao carregar veterinários:",
                erro
            );

            listaVeterinarios.innerHTML = `
                <p>
                    Não foi possível carregar os veterinários.
                </p>
            `;
        }
    }


    /*
    ============================================================
    BOTÃO AGENDAR
    ============================================================
    */

    if (btnAgendar) {

        btnAgendar.addEventListener("click", async event => {

            event.preventDefault();

            try {

                /*
                Agora existe uma rota /api/tutores
                no servidor.

                Pegamos o tutor mais recente.
                */

                const resposta = await fetch(
                    `${API_URL}/tutores`
                );

                const tutores = await resposta.json();

                if (!resposta.ok) {

                    throw new Error(
                        tutores.mensagem ||
                        "Não foi possível verificar o cadastro."
                    );

                }

                if (
                    !Array.isArray(tutores) ||
                    tutores.length === 0
                ) {

                    window.location.href =
                        "cadastro.html";

                    return;
                }

                /*
                O servidor retorna os tutores do mais recente
                para o mais antigo.

                Portanto, o primeiro é o último cadastro.
                */

                const tutorId = tutores[0].id;

                if (!tutorId) {

                    window.location.href =
                        "cadastro.html";

                    return;
                }

                /*
                Verifica se o tutor possui pets.
                */

                const respostaPets = await fetch(
                    `${API_URL}/tutores/${tutorId}/pets`
                );

                const pets = await respostaPets.json();

                if (!respostaPets.ok) {

                    throw new Error(
                        pets.mensagem ||
                        "Não foi possível verificar os pets."
                    );

                }

                if (
                    !Array.isArray(pets) ||
                    pets.length === 0
                ) {

                    window.location.href =
                        `cadastro.html?tutor_id=${encodeURIComponent(
                            tutorId
                        )}`;

                    return;
                }

                /*
                Tudo certo.

                Vai para a página de data e horário
                levando o ID da clínica e do tutor.
                */

                const parametros =
                    new URLSearchParams();

                parametros.set(
                    "clinica_id",
                    clinicaId
                );

                parametros.set(
                    "tutor_id",
                    tutorId
                );

                window.location.href =
                    `dataehorario.html?${parametros.toString()}`;

            } catch (erro) {

                console.error(
                    "Erro ao verificar cadastro:",
                    erro
                );

                alert(
                    erro.message ||
                    "Não foi possível verificar seu cadastro."
                );
            }

        });
    }


    /*
    ============================================================
    FUNÇÃO DE SEGURANÇA
    ============================================================
    */

    function escaparHTML(valor) {

        if (
            valor === null ||
            valor === undefined
        ) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    /*
    ============================================================
    INICIAR CARREGAMENTO
    ============================================================
    */

    await carregarClinica();

    await carregarServicos();

    await carregarVeterinarios();

});