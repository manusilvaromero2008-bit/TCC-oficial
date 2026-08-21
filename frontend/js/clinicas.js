document.addEventListener("DOMContentLoaded", () => {

    const btnAgendar = document.getElementById("btnAgendar");

    if (!btnAgendar) {
        return;
    }

    btnAgendar.addEventListener("click", event => {

        event.preventDefault();

        const tutorSalvo = localStorage.getItem("tutor");
        const petsSalvos = localStorage.getItem("pets");

        let cadastroCompleto = false;

        try {

            const tutor = tutorSalvo
                ? JSON.parse(tutorSalvo)
                : null;

            const pets = petsSalvos
                ? JSON.parse(petsSalvos)
                : [];

            cadastroCompleto =
                tutor &&
                tutor.nome &&
                tutor.cpf &&
                tutor.telefone &&
                tutor.email &&
                tutor.endereco &&
                Array.isArray(pets) &&
                pets.length > 0;

        } catch (erro) {

            console.error("Erro ao verificar cadastro:", erro);

            cadastroCompleto = false;
        }

        if (cadastroCompleto) {

            window.location.href = "dataehorario.html";

        } else {

            window.location.href = "cadastro.html";
        }
    });
});