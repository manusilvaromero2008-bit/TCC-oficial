document.addEventListener("DOMContentLoaded", async () => {

    const API_URL = "http://localhost:3000/api";

    const nomeClinica = document.getElementById("nomeClinica");
    const listaPets = document.getElementById("listaPets");

    const resumoClinica = document.getElementById("resumoClinica");
    const resumoData = document.getElementById("resumoData");
    const resumoHorario = document.getElementById("resumoHorario");
    const resumoServico = document.getElementById("resumoServico");
    const resumoVeterinario = document.getElementById("resumoVeterinario");
    const resumoPet = document.getElementById("resumoPet");
    const resumoTutor = document.getElementById("resumoTutor");
    const resumoTelefone = document.getElementById("resumoTelefone");
    const resumoTransporte = document.getElementById("resumoTransporte");

    const transportOption = document.getElementById("transportOption");
    const addressCard = document.getElementById("addressCard");
    const endereco = document.getElementById("endereco");
    const cep = document.getElementById("cep");
    const btnContinuar = document.getElementById("btnContinuar");

    const params = new URLSearchParams(window.location.search);

    const clinicaId =
        params.get("clinica_id") ||
        sessionStorage.getItem("clinica_id");

    const tutorId =
        params.get("tutor_id") ||
        sessionStorage.getItem("tutor_id");

    const data =
        params.get("data") ||
        sessionStorage.getItem("data");

    const dataVisual =
        params.get("data_visual") ||
        sessionStorage.getItem("data_visual");

    const horario =
        params.get("horario") ||
        sessionStorage.getItem("horario");

    const servicoId =
        params.get("servico_id") ||
        sessionStorage.getItem("servico_id");

    let petSelecionado = null;
    let transporte = false;
    let servicoSelecionado = null;

    if (!clinicaId || !tutorId || !data || !horario || !servicoId) {
        alert("Não foi possível carregar todos os dados do agendamento.");
        return;
    }

    function formatarData(dataRecebida) {
        if (!dataRecebida) {
            return "Não informado";
        }

        const partes = dataRecebida.split("-");

        if (partes.length !== 3) {
            return dataRecebida;
        }

        const ano = Number(partes[0]);
        const mes = Number(partes[1]);
        const dia = Number(partes[2]);

        const dataObj = new Date(ano, mes - 1, dia);

        if (isNaN(dataObj.getTime())) {
            return dataRecebida;
        }

        return dataObj.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
        });
    }

    async function carregarClinica() {
        try {
            const resposta = await fetch(
                `${API_URL}/clinicas/${clinicaId}`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar clínica.");
            }

            const clinica = await resposta.json();

            const nome = clinica.nome || "Clínica Veterinária";

            if (nomeClinica) {
                nomeClinica.textContent = nome;
            }

            if (resumoClinica) {
                resumoClinica.textContent = nome;
            }

        } catch (erro) {
            console.error("Erro ao carregar clínica:", erro);

            if (nomeClinica) {
                nomeClinica.textContent = "Clínica Veterinária";
            }

            if (resumoClinica) {
                resumoClinica.textContent = "Não informado";
            }
        }
    }

    async function carregarTutor() {
        try {
            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar tutor.");
            }

            const tutor = await resposta.json();

            if (resumoTutor) {
                resumoTutor.textContent =
                    tutor.nome || "Não informado";
            }

            if (resumoTelefone) {
                resumoTelefone.textContent =
                    tutor.telefone || "Não informado";
            }

            if (endereco) {
                endereco.textContent =
                    tutor.endereco || "Endereço não informado";
            }

            if (cep) {
                cep.textContent =
                    tutor.cep
                        ? `CEP: ${tutor.cep}`
                        : "CEP não informado";
            }

        } catch (erro) {
            console.error("Erro ao carregar tutor:", erro);

            if (resumoTutor) {
                resumoTutor.textContent = "Não informado";
            }

            if (resumoTelefone) {
                resumoTelefone.textContent = "Não informado";
            }

            if (endereco) {
                endereco.textContent = "Endereço não informado";
            }

            if (cep) {
                cep.textContent = "CEP não informado";
            }
        }
    }

    async function carregarPets() {
        try {
            const resposta = await fetch(
                `${API_URL}/tutores/${tutorId}/pets`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar pets.");
            }

            const dados = await resposta.json();

            const pets = Array.isArray(dados) ? dados : [];

            listaPets.innerHTML = "";

            if (pets.length === 0) {
                listaPets.innerHTML =
                    "<p>Nenhum pet cadastrado.</p>";
                return;
            }

            pets.forEach(pet => {

                const card = document.createElement("div");

                card.className = "pet-card";
                card.dataset.id = pet.id;

                card.innerHTML = `
                    <div class="pet-icon">
                        <i class="fa-solid fa-paw"></i>
                    </div>

                    <div class="pet-info">
                        <h3>${pet.nome || "Pet sem nome"}</h3>

                        <p>
                            ${pet.especie || ""}
                            ${pet.raca ? ` • ${pet.raca}` : ""}
                        </p>
                    </div>
                `;

                card.addEventListener("click", () => {

                    document
                        .querySelectorAll(".pet-card")
                        .forEach(item => {
                            item.classList.remove("selecionado");
                        });

                    card.classList.add("selecionado");

                    petSelecionado = pet;

                    if (resumoPet) {
                        resumoPet.textContent =
                            pet.nome || "Não informado";
                    }
                });

                listaPets.appendChild(card);
            });

        } catch (erro) {
            console.error("Erro ao carregar pets:", erro);

            listaPets.innerHTML =
                "<p>Não foi possível carregar os pets.</p>";
        }
    }

    async function carregarServico() {
        try {
            const resposta = await fetch(
                `${API_URL}/clinicas/${clinicaId}/servicos`
            );

            if (!resposta.ok) {
                throw new Error("Erro ao carregar serviços.");
            }

            const servicos = await resposta.json();

            servicoSelecionado = servicos.find(
                servico =>
                    Number(servico.id) === Number(servicoId)
            );

            if (!servicoSelecionado) {
                throw new Error("Serviço selecionado não encontrado.");
            }

            if (resumoServico) {

                const preco =
                    servicoSelecionado.preco !== null &&
                    servicoSelecionado.preco !== undefined &&
                    servicoSelecionado.preco !== ""
                        ? ` - R$ ${Number(
                            servicoSelecionado.preco
                        ).toFixed(2).replace(".", ",")}`
                        : "";

                resumoServico.textContent =
                    `${servicoSelecionado.nome || "Serviço"}${preco}`;
            }

            if (resumoVeterinario) {
                resumoVeterinario.textContent =
                    servicoSelecionado.veterinario_nome ||
                    "Não informado";
            }

            sessionStorage.setItem(
                "servico_id",
                servicoSelecionado.id
            );

            sessionStorage.setItem(
                "servico_nome",
                servicoSelecionado.nome || ""
            );

            sessionStorage.setItem(
                "servico_preco",
                servicoSelecionado.preco || ""
            );

            sessionStorage.setItem(
                "servico_tipo",
                servicoSelecionado.tipo || ""
            );

            sessionStorage.setItem(
                "veterinario_id",
                servicoSelecionado.veterinario_id || ""
            );

            sessionStorage.setItem(
                "veterinario",
                servicoSelecionado.veterinario_nome || ""
            );

        } catch (erro) {
            console.error("Erro ao carregar serviço:", erro);

            if (resumoServico) {
                resumoServico.textContent = "Não informado";
            }

            if (resumoVeterinario) {
                resumoVeterinario.textContent = "Não informado";
            }
        }
    }

    function atualizarTransporte() {

        if (transporte) {

            transportOption.classList.add("selected");
            addressCard.classList.add("show");

            if (resumoTransporte) {
                resumoTransporte.textContent = "Solicitado";
            }

        } else {

            transportOption.classList.remove("selected");
            addressCard.classList.remove("show");

            if (resumoTransporte) {
                resumoTransporte.textContent = "Não solicitado";
            }
        }
    }

    if (resumoData) {
        resumoData.textContent =
            dataVisual || formatarData(data);
    }

    if (resumoHorario) {
        resumoHorario.textContent = horario;
    }

    transportOption.addEventListener("click", () => {

        transporte = !transporte;

        atualizarTransporte();
    });

    btnContinuar.addEventListener("click", async () => {

        if (!petSelecionado) {
            alert("Selecione um pet antes de continuar.");
            return;
        }

        if (!servicoSelecionado) {
            alert("Não foi possível identificar o serviço selecionado.");
            return;
        }

        try {

            btnContinuar.disabled = true;

            btnContinuar.innerHTML = `
                Salvando...
                <i class="fa-solid fa-spinner fa-spin"></i>
            `;

            const dadosAgendamento = {
                tutor_id: Number(tutorId),
                pet_id: Number(petSelecionado.id),
                clinica_id: Number(clinicaId),
                servico_id: Number(servicoSelecionado.id),
                veterinario_id:
                    servicoSelecionado.veterinario_id
                        ? Number(servicoSelecionado.veterinario_id)
                        : null,
                data_agendamento: data,
                horario: horario,
                observacoes: transporte
                    ? "Transporte solicitado"
                    : null
            };

            const resposta = await fetch(
                `${API_URL}/agendamentos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dadosAgendamento)
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.mensagem ||
                    resultado.erro ||
                    "Não foi possível realizar o agendamento."
                );
            }

            if (resultado.id) {
                sessionStorage.setItem(
                    "agendamentoId",
                    resultado.id
                );
            }

            window.location.href = "final.html";

        } catch (erro) {

            console.error(
                "Erro ao realizar agendamento:",
                erro
            );

            alert(
                erro.message ||
                "Não foi possível realizar o agendamento."
            );

            btnContinuar.disabled = false;

            btnContinuar.innerHTML = `
                Continuar
                <i class="fa-solid fa-arrow-right"></i>
            `;
        }
    });

    atualizarTransporte();

    await carregarClinica();
    await carregarTutor();
    await carregarPets();
    await carregarServico();
});