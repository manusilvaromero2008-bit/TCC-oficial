document.addEventListener("DOMContentLoaded", function () {


    // ==========================================
    // ELEMENTOS DA PÁGINA
    // ==========================================

    const petNome = document.getElementById("petNome");
    const petDetalhes = document.getElementById("petDetalhes");

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

    const btnConfirmar = document.getElementById("btnConfirmar");
    const btnVoltar = document.getElementById("btnVoltar");


    

    function pegarDado(chaves) {

        for (let chave of chaves) {

            const valor = localStorage.getItem(chave);

            if (valor !== null && valor !== "") {
                return valor;
            }

        }

        return "";
    }


    

    let dadosSalvos = {};

    const agendamentoSalvo = localStorage.getItem("agendamento");

    if (agendamentoSalvo) {

        try {

            dadosSalvos = JSON.parse(agendamentoSalvo);

        } catch (erro) {

            console.log("Não foi possível ler o agendamento.");

        }

    }


   

    let data = dadosSalvos.data ||
        pegarDado([
            "data",
            "dataConsulta",
            "dataSelecionada"
        ]);


    function formatarData(data) {

        if (!data) {
            return "Não informado";
        }

        
        if (data.includes("-")) {

            const partes = data.split("-");

            if (partes.length === 3) {

                const dataObj = new Date(
                    partes[0],
                    partes[1] - 1,
                    partes[2]
                );

                return dataObj.toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long"
                });
            }
        }

        return data;
    }


    resumoData.textContent = formatarData(data);



    

    const horario = dadosSalvos.horario ||
        dadosSalvos.hora ||
        pegarDado([
            "horario",
            "hora",
            "horarioConsulta",
            "horaConsulta"
        ]);


    resumoHorario.textContent = horario || "Não informado";



    

    let servico = dadosSalvos.servico ||
        pegarDado([
            "servico",
            "servicoSelecionado",
            "servicoNome"
        ]);


    let preco = dadosSalvos.preco ||
        dadosSalvos.valor ||
        pegarDado([
            "preco",
            "valor",
            "precoServico",
            "valorServico"
        ]);


    if (servico && preco) {

        resumoServico.textContent =
            servico + " - R$ " + preco;

    } else if (servico) {

        resumoServico.textContent = servico;

    } else {

        resumoServico.textContent = "Não informado";

    }



    
    const veterinario = dadosSalvos.veterinario ||
        dadosSalvos.vet ||
        pegarDado([
            "veterinario",
            "veterinarioSelecionado",
            "vet"
        ]);


    resumoVeterinario.textContent =
        veterinario || "Não informado";



    

    const nomePet = dadosSalvos.petNome ||
        dadosSalvos.pet ||
        pegarDado([
            "petNome",
            "pet",
            "nomePet"
        ]);


    const especiePet = dadosSalvos.especie ||
        dadosSalvos.petEspecie ||
        pegarDado([
            "especie",
            "petEspecie"
        ]);


    const racaPet = dadosSalvos.raca ||
        dadosSalvos.petRaca ||
        pegarDado([
            "raca",
            "petRaca"
        ]);


    const idadePet = dadosSalvos.idade ||
        dadosSalvos.petIdade ||
        pegarDado([
            "idade",
            "petIdade"
        ]);


    petNome.textContent =
        nomePet || "Pet não informado";


    let detalhes = [];


    if (especiePet) {
        detalhes.push(especiePet);
    }


    if (racaPet) {
        detalhes.push(racaPet);
    }


    if (idadePet) {
        detalhes.push(idadePet + " anos");
    }


    petDetalhes.textContent =
        detalhes.length > 0
            ? detalhes.join(" • ")
            : "Informações do pet não disponíveis";


    resumoPet.textContent =
        nomePet || "Não informado";



    

    const tutor = dadosSalvos.tutor ||
        pegarDado([
            "tutor",
            "nomeTutor",
            "nomeUsuario"
        ]);


    resumoTutor.textContent =
        tutor || "Não informado";



    

    const telefone = dadosSalvos.telefone ||
        pegarDado([
            "telefone",
            "celular",
            "telefoneTutor"
        ]);


    resumoTelefone.textContent =
        telefone || "Não informado";



    

    const rua = dadosSalvos.endereco ||
        pegarDado([
            "endereco",
            "rua",
            "enderecoTutor"
        ]);


    const cidade = dadosSalvos.cidade ||
        pegarDado([
            "cidade"
        ]);


    const estado = dadosSalvos.estado ||
        pegarDado([
            "estado",
            "uf"
        ]);


    const cepValor = dadosSalvos.cep ||
        pegarDado([
            "cep"
        ]);


    let enderecoCompleto = rua || "";


    if (cidade) {

        if (enderecoCompleto) {
            enderecoCompleto += ", ";
        }

        enderecoCompleto += cidade;

    }


    if (estado) {

        if (cidade) {
            enderecoCompleto += " - ";
        }

        enderecoCompleto += estado;

    }


    endereco.textContent =
        enderecoCompleto || "Endereço não informado";


    cep.textContent =
        "CEP: " + (cepValor || "--");



    

    let transporte = dadosSalvos.transporte;


    if (transporte === undefined) {

        transporte = pegarDado([
            "transporte",
            "solicitarTransporte"
        ]);

    }


    transporte =
        transporte === true ||
        transporte === "true" ||
        transporte === "sim" ||
        transporte === "Sim";


    function atualizarTransporte() {

        if (transporte) {

            transportOption.classList.add("selected");

            addressCard.classList.add("show");

            resumoTransporte.textContent = "Sim";

        } else {

            transportOption.classList.remove("selected");

            addressCard.classList.remove("show");

            resumoTransporte.textContent = "Não";

        }

    }


    atualizarTransporte();



    

    transportOption.addEventListener("click", function () {

        transporte = !transporte;

        atualizarTransporte();

    });



   

    btnVoltar.addEventListener("click", function () {

        window.history.back();

    });



    

    btnConfirmar.addEventListener("click", function () {

        const agendamentoFinal = {

            data: data,

            horario: horario,

            servico: servico,

            preco: preco,

            veterinario: veterinario,

            pet: nomePet,

            especie: especiePet,

            raca: racaPet,

            idade: idadePet,

            tutor: tutor,

            telefone: telefone,

            transporte: transporte,

            endereco: enderecoCompleto,

            cep: cepValor

        };


        // Salva o agendamento final
        localStorage.setItem(
            "agendamentoFinal",
            JSON.stringify(agendamentoFinal)
        );


        alert("Agendamento confirmado com sucesso!");


        console.log(
            "Agendamento:",
            agendamentoFinal
        );

    });

});