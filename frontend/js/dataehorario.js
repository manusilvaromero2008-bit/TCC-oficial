// Nome da clínica
const nomeClinica = localStorage.getItem("clinica");
document.getElementById("nomeClinica").textContent = nomeClinica;

// Elementos da página
const botoesData = document.querySelectorAll(".datas button");
const botoesHora = document.querySelectorAll(".horarios button");

const cardHorario = document.getElementById("cardHorario");
const btnContinuar = document.getElementById("btnContinuar");

// Esconde os elementos inicialmente
cardHorario.style.display = "none";
btnContinuar.style.display = "none";

// Variáveis que guardarão as escolhas
let dataSelecionada = "";
let horarioSelecionado = "";

// =======================
// Seleção da Data
// =======================

botoesData.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesData.forEach(b => b.classList.remove("selecionado"));

        botao.classList.add("selecionado");

        dataSelecionada = botao.textContent.trim();

        // Salva a data
        localStorage.setItem("data", dataSelecionada);

        // Mostra os horários
        cardHorario.style.display = "block";

        cardHorario.scrollIntoView({
            behavior: "smooth"
        });

    });

});

// =======================
// Seleção do Horário
// =======================

botoesHora.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesHora.forEach(b => b.classList.remove("selecionado"));

        botao.classList.add("selecionado");

        horarioSelecionado = botao.textContent.trim();

        // Salva o horário
        localStorage.setItem("horario", horarioSelecionado);

        // Mostra o botão continuar
        btnContinuar.style.display = "block";

    });

});



btnContinuar.addEventListener("click", () => {

    if (dataSelecionada === "") {
        alert("Selecione uma data.");
        return;
    }

    if (horarioSelecionado === "") {
        alert("Selecione um horário.");
        return;
    }

    window.location.href = "servicos.html";

});