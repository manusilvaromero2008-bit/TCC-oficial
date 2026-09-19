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

    function escaparHTML(valor) {
        if (valor === null || valor === undefined) {
            return "";
        }

        return String(valor)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async function carregarClinica() {
        try {
            const resposta = await fetch(`${API_URL}/clinicas/${clinicaId}`);
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
                let horario =
                    dados.horario_atendimento || "Horário não informado";

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

                if (precoConsulta) {
                    precoConsulta.textContent = "Consultar valor";
                }

                return;
            }

            const consulta = servicos.find(servico => {
                const tipo = String(servico.tipo || "").toLowerCase();
                const nome = String(servico.nome || "").toLowerCase();

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
                        precoConsulta.textContent = `R$ ${consulta.preco}`;
                    }
                } else {
                    precoConsulta.textContent = "Consultar valor";
                }
            }

            servicos.forEach(servico => {
                const card = document.createElement("div");

                card.className = "exame";

                const preco =
                    servico.preco !== null &&
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
                    <div class="icone-exame">
                        <i class="fa-solid fa-flask"></i>
                    </div>

                    <div class="exame-info">
                        <h3>
                            ${escaparHTML(servico.nome || "Serviço")}
                        </h3>

                        ${
                            servico.tipo
                                ? `<span class="tipo-exame">${escaparHTML(servico.tipo)}</span>`
                                : ""
                        }

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
                    </div>
                `;

                listaServicos.appendChild(card);
            });

        } catch (erro) {
            console.error("Erro ao carregar serviços:", erro);

            listaServicos.innerHTML = `
                <p>Não foi possível carregar os serviços.</p>
            `;

            if (precoConsulta) {
                precoConsulta.textContent = "Não informado";
            }
        }
    }

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

                card.className = "vet-card";

                const disponivel =
                    veterinario.disponivel === true ||
                    veterinario.disponivel === 1 ||
                    veterinario.disponivel === "1";

                card.innerHTML = `
                    <div class="vet-icon">
                        <i class="fa-solid fa-user-doctor"></i>
                    </div>

                    <div class="vet-info">
                        <h3>
                            ${escaparHTML(
                                veterinario.nome || "Veterinário"
                            )}
                        </h3>

                        ${
                            veterinario.especialidade
                                ? `
                                    <p>
                                        <i class="fa-solid fa-stethoscope"></i>
                                        ${escaparHTML(
                                            veterinario.especialidade
                                        )}
                                    </p>
                                `
                                : ""
                        }

                        ${
                            veterinario.telefone
                                ? `
                                    <p>
                                        <i class="fa-solid fa-phone"></i>
                                        ${escaparHTML(
                                            veterinario.telefone
                                        )}
                                    </p>
                                `
                                : ""
                        }

                        ${
                            veterinario.email
                                ? `
                                    <p>
                                        <i class="fa-solid fa-envelope"></i>
                                        ${escaparHTML(
                                            veterinario.email
                                        )}
                                    </p>
                                `
                                : ""
                        }

                        <span class="status ${
                            disponivel
                                ? "disponivel"
                                : "indisponivel"
                        }">
                            <i class="fa-solid fa-circle"></i>
                            ${
                                disponivel
                                    ? "Disponível"
                                    : "Indisponível"
                            }
                        </span>
                    </div>
                `;

                listaVeterinarios.appendChild(card);
            });

        } catch (erro) {
            console.error(
                "Erro ao carregar veterinários:",
                erro
            );

            listaVeterinarios.innerHTML = `
                <p>Não foi possível carregar os veterinários.</p>
            `;
        }
    }

    if (btnAgendar) {
        btnAgendar.addEventListener("click", async event => {
            event.preventDefault();

            try {
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
                    window.location.href = "cadastro.html";
                    return;
                }

                const tutorId = tutores[0].id;

                if (!tutorId) {
                    window.location.href = "cadastro.html";
                    return;
                }

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
                        `cadastro.html?tutor_id=${encodeURIComponent(tutorId)}`;
                    return;
                }

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

                sessionStorage.setItem(
                    "clinica_id",
                    String(clinicaId)
                );

                sessionStorage.setItem(
                    "tutor_id",
                    String(tutorId)
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

    await carregarClinica();
    await carregarServicos();
    await carregarVeterinarios();
});