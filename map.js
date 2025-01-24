function initMap() {
    // Créer la carte centrée sur Paris
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 48.8566, lng: 2.3522 },
        zoom: 13,
    });

    // Ajouter un marqueur
    new google.maps.Marker({
        position: { lat: 48.8566, lng: 2.3522 },
        map: map,
        title: "Paris",
    });
}
