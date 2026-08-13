document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("pets");
    const btnAdicionar = document.getElementById("adicionarPet");
    const btnProsseguir = document.getElementById("btnProsseguir");


    let contador = 1;



   

    btnAdicionar.addEventListener("click", () => {


        contador++;


        const novoPet = document.createElement("div");


        novoPet.className = "pet";


        novoPet.innerHTML = `

            <h3>
                <i class="fa-solid fa-paw"></i>
                Pet ${contador}
            </h3>


            <div class="grid">


                <div class="campo">
                    <label>Nome</label>
                    <input type="text">
                </div>



                <div class="campo">
                    <label>Espécie</label>

                    <select>
                        <option>Cão</option>
                        <option>Gato</option>
                        <option>Ave</option>
                        <option>Roedor</option>
                        <option>Outro</option>
                    </select>

                </div>




                <div class="campo">

                    <label>Raça</label>

                    <input type="text">

                </div>




                <div class="campo">

                    <label>Idade</label>

                    <input type="text">

                </div>




                <div class="campo">

                    <label>Sexo</label>

                    <select>

                        <option>Macho</option>
                        <option>Fêmea</option>

                    </select>

                </div>




                <div class="campo">

                    <label>Peso</label>

                    <input type="text">

                </div>


            </div>

        `;



        container.appendChild(novoPet);


    });






    


    btnProsseguir.addEventListener("click", () => {



       

        const tutor = {


            nome:
            document.getElementById("nomeTutor").value,


            cpf:
            document.getElementById("cpfTutor").value,


            telefone:
            document.getElementById("telefoneTutor").value,


            email:
            document.getElementById("emailTutor").value,


            endereco:
            document.getElementById("enderecoTutor").value,


            cep:
            document.getElementById("cep").value


        };






       

        const pets = [];



        const todosPets =
        document.querySelectorAll(".pet");




        todosPets.forEach(card => {



            const inputs =
            card.querySelectorAll("input");


            const selects =
            card.querySelectorAll("select");



            const pet = {



                nome:
                inputs[0]?.value || "",



                especie:
                selects[0]?.value || "",



                raca:
                inputs[1]?.value || "",



                idade:
                inputs[2]?.value || "",



                sexo:
                selects[1]?.value || "",



                peso:
                inputs[3]?.value || ""



            };



            

            if(pet.nome.trim() !== ""){

                pets.push(pet);

            }



        });






        


        localStorage.setItem(
            "tutor",
            JSON.stringify(tutor)
        );



        localStorage.setItem(
            "pets",
            JSON.stringify(pets)
        );




        console.log("Pets cadastrados:", pets);




        window.location.href =
        "dataehorario.html";



    });



});