function initMap() {

    const centroCampinas = {
        lat: -22.9099,
        lng: -47.0626
    };

    const mapa = new google.maps.Map(
        document.getElementById("map"),
        {
            center: centroCampinas,
            zoom: 13
        }
    );

    // ==========================================
    // CLÍNICAS
    // ==========================================

    const clinicas = [
        {
            nome: "HVNC",
            endereco: "Av. Dr. Jesuíno Marcondes Machado, 1077 - Nova Campinas, Campinas - SP",
            position: {
                lat: -22.8958,
                lng: -47.0339
            }
        },

        {
            nome: "Pet Vida Veterinária",
            endereco: "Av. Ralfo Leite de Barros, 93 - Jardim Nova Europa, Campinas - SP",
            position: {
                lat: -22.9380,
                lng: -47.0730
            }
        },

        {
            nome: "+Pet",
            endereco: "Av. Dr. Heitor Penteado, 861 - Jardim Nossa Sra. Auxiliadora, Campinas - SP",
            position: {
                lat: -22.8730,
                lng: -47.0550
            }
        },

        {
            nome: "S.O.S Animal e Cia",
            endereco: "Av. Brg. Rafael Tobias de Aguiar, 1098 - Jardim Aurelia, Campinas - SP",
            position: {
                lat: -22.8980,
                lng: -47.0940
            }
        }
    ];


    // ==========================================
    // CRIAR OS MARCADORES
    // ==========================================

    clinicas.forEach(clinica => {

        const marcador = new google.maps.Marker({
            position: clinica.position,
            map: mapa,
            title: clinica.nome
        });


        // ==========================================
        // INFORMAÇÕES DO MARCADOR
        // ==========================================

        const janelaInformacao =
            new google.maps.InfoWindow({
                content: `
                    <div style="
                        padding: 8px;
                        max-width: 250px;
                    ">

                        <strong>
                            ${clinica.nome}
                        </strong>

                        <br><br>

                        ${clinica.endereco}

                        <br><br>

                        <button
                            style="
                                background: #4285F4;
                                color: white;
                                border: none;
                                padding: 8px 12px;
                                border-radius: 5px;
                                cursor: pointer;
                            "
                            onclick="
                                window.open(
                                    'https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinica.endereco)}',
                                    '_blank'
                                )
                            "
                        >
                            Ver rota
                        </button>

                    </div>
                `
            });


        // ==========================================
        // CLIQUE NO MARCADOR
        // ==========================================

        marcador.addListener("click", () => {

            janelaInformacao.open({
                anchor: marcador,
                map: mapa
            });

        });

    });

}