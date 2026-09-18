function initMap() {

    const localizacao = {
        lat: -22.9099,
        lng: -47.0626
    };

    const mapa = new google.maps.Map(
        document.getElementById("map"),
        {
            center: localizacao,
            zoom: 13
        }
    );

    const marcador = new google.maps.Marker({
        position: localizacao,
        map: mapa,
        title: "Clínica Veterinária"
    });

    // Ao clicar no marcador, abre a rota no Google Maps
    marcador.addListener("click", function () {

        const destino = `${localizacao.lat},${localizacao.lng}`;

        const url =
            "https://www.google.com/maps/dir/?api=1&destination="
            + destino;

        window.open(url, "_blank");
    });
}