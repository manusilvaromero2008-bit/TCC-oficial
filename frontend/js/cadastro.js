const container = document.getElementById("pets");
const btnAdicionar = document.getElementById("adicionarPet");

let contador = 1;

btnAdicionar.addEventListener("click", () => {

    contador++;

    const novoPet = document.createElement("div");

    novoPet.className = "pet";

    novoPet.innerHTML = `
        <h3>Pet ${contador}</h3>

        <div class="campo">
            <label>Nome do Pet</label>
            <input type="text" required>
        </div>

        <div class="campo">
            <label>Espécie</label>
            <select required>
                <option>Cachorro</option>
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
            <input type="number">
        </div>

        <div class="campo">
            <label>Sexo</label>
            <select>
                <option>Macho</option>
                <option>Fêmea</option>
            </select>
        </div>

        <div class="campo">
            <label>Peso (kg)</label>
            <input type="number" step="0.1">
        </div>
    `;

    container.appendChild(novoPet);

});



const btnProsseguir = document.getElementById("btnProsseguir");

btnProsseguir.addEventListener("click", () => {
    window.location.href = "dataehorario.html";
});