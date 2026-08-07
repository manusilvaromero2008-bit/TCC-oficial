const nomeClinica = localStorage.getItem("clinica");

document.getElementById("nomeClinica").textContent = nomeClinica;
const servicos = document.querySelectorAll(".servico");


const btnContinuar = document.getElementById("btnContinuar");


let servicoSelecionado = null;


servicos.forEach(servico => {

    servico.addEventListener("click", () => {

       
        servicos.forEach(item => {
            item.classList.remove("selecionado");
        });

       
        servico.classList.add("selecionado");

       
        servicoSelecionado = servico.querySelector("h3").textContent;

        
        const preco = servico.querySelector(".preco").textContent;

        
        localStorage.setItem("servico", servicoSelecionado);
        localStorage.setItem("precoServico", preco);

        
        btnContinuar.disabled = false;

    });

});


btnContinuar.addEventListener("click", () => {

    if (servicoSelecionado !== null) {

        
        window.location.href = "petTransporte.html";

    } else {

        alert("Selecione um serviço para continuar.");

    }

});

