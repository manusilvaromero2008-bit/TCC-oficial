const nomeClinica = localStorage.getItem("clinica");

document.getElementById("nomeClinica").textContent = clinica;
const botoesData = document.querySelectorAll(".datas button");
const botoesHora = document.querySelectorAll(".horarios button");

const cardHorario = document.getElementById("cardHorario");
const btnContinuar = document.getElementById("btnContinuar");

cardHorario.style.display = "none";
btnContinuar.style.display = "none";


botoesData.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesData.forEach(b => b.classList.remove("selecionado"));

        botao.classList.add("selecionado");

        cardHorario.style.display = "block";

        cardHorario.scrollIntoView({
            behavior: "smooth"
        });

    });

});


botoesHora.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesHora.forEach(b => b.classList.remove("selecionado"));

        botao.classList.add("selecionado");

        btnContinuar.style.display = "block";

    });

});


btnContinuar.addEventListener("click", () => {

    window.location.href = "servicos.html";

});