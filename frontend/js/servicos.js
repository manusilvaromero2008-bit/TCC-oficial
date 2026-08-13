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





    

    const servicos =
        JSON.parse(
            localStorage.getItem("servicosClinica")
        ) || [];





    

    if(servicos.length === 0){


        if(listaConsultas){

            listaConsultas.innerHTML =
            "<p>Nenhuma consulta disponível.</p>";

        }


        if(listaExames){

            listaExames.innerHTML =
            "<p>Nenhum exame disponível.</p>";

        }


    }





   

    servicos.forEach(servico => {


        const card =
            document.createElement("div");


        card.className =
            "servico-card";



        card.innerHTML = `

            <button type="button" class="servico">


                <div class="icone">

                    <i class="fa-solid ${
                    
                    servico.tipo === "Consulta"
                    ? "fa-stethoscope"
                    : "fa-vial"

                    }"></i>

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



        botao.addEventListener("click",()=>{


            document
            .querySelectorAll(".servico")
            .forEach(item=>{

                item.classList.remove(
                    "selecionado"
                );

            });



            botao.classList.add(
                "selecionado"
            );



            servicoSelecionado =
                servico;



            btnContinuar.disabled =
                false;



        });





        if(servico.tipo === "Consulta"){


            listaConsultas.appendChild(card);


        }else{


            listaExames.appendChild(card);


        }



    });







    


    btnContinuar.addEventListener(
        "click",
        ()=>{


        if(!servicoSelecionado)
            return;



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



        window.location.href =
            "petetransporte.html";



    });



});