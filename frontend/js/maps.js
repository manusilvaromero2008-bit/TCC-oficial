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

    new google.maps.Marker({
        position: localizacao,
        map: mapa,
        title: "Clínicas veterinárias"
    });
}