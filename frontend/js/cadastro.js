document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("pets");
    const btnAdicionar = document.getElementById("adicionarPet");
    const btnProsseguir = document.getElementById("btnProsseguir");


    let contador = 1;



    // ============================
    // ADICIONAR NOVO PET
    // ============================

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






    // ============================
    // SALVAR CADASTRO
    // ============================


    btnProsseguir.addEventListener("click", () => {



        // TUTOR

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






        // PETS

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



            // só salva se tiver nome

            if(pet.nome.trim() !== ""){

                pets.push(pet);

            }



        });






        // SALVAR NO LOCAL STORAGE


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