// BOTÃO VOLTAR PARA O INÍCIO

const btnInicio = document.getElementById("btnInicio");

btnInicio.addEventListener("click", function () {

    window.location.href = "index.html";

});


// PEGAR O NOME DO PET
// Caso vocês tenham salvado o nome do pet anteriormente,
// ele aparecerá automaticamente nesta página.

const petSelecionado = localStorage.getItem("petSelecionado");

if (petSelecionado) {

    document.getElementById("pet").textContent = petSelecionado;

}


// PEGAR O SERVIÇO ESCOLHIDO

const servicoSelecionado = localStorage.getItem("servicoSelecionado");

if (servicoSelecionado) {

    document.getElementById("servico").textContent =
        servicoSelecionado;

}


// PEGAR A DATA

const dataSelecionada = localStorage.getItem("dataSelecionada");

if (dataSelecionada) {

    document.getElementById("data").textContent =
        dataSelecionada;

}


// PEGAR O HORÁRIO

const horarioSelecionado = localStorage.getItem("horarioSelecionado");

if (horarioSelecionado) {

    document.getElementById("horario").textContent =
        horarioSelecionado;

}