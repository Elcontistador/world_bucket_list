let map;
let Marker;
// let Size; // (Cette ligne est correcte, car vous la mettez en commentaire)
let panorama;
const resetMapButton = document.getElementById("reset-map");
let mapDiv
let panoramaDiv

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const markerLibrary = await google.maps.importLibrary("marker");
    // const coreLibrary = await google.maps.importLibrary("core"); // OK : le commentaire est conservé ou supprimé

    const { Marker: ImportedMarker } = markerLibrary;
    Marker = ImportedMarker;
    // const { Size } = coreLibrary; // LIGNE À SUPPRIMER !

    mapDiv = document.getElementById("map");
    panoramaDiv = document.getElementById("panorama");

    map = new Map(mapDiv, {
        center: { lat: 48.858159, lng: 2.294497 },
        zoom: 3,
        mapId: "d7cdceeb805b2ea959c859d9", 
        streetViewControl: false, 
    });

    panorama = new google.maps.StreetViewPanorama(
        panoramaDiv, {
            position: { lat: 48.858159, lng: 2.294497 }, 
            pov: { heading: 165, pitch: 0 },
            zoom: 1,
            visible: false,
        }
    );

    const iconSize = {
        width: 32,
        height: 40
    };
    const customIcon1 = {
        url: "images/1.png", 
        // L'utilisation de google.maps.Size est correcte ici
        scaledSize: new google.maps.Size(iconSize.width, iconSize.height), 
    };
    
    const marker = new Marker({ 
        map: map,
        position: { lat: 47.10785669384532, lng: -0.9911632007660107 },
        icon: customIcon1,
        title: "Maison",
    });

    function addMapListener() {
        resetMapButton.addEventListener("click",resetMap);
    };

    addMapListener();

    marker.addListener("click", () => {
        zoomOn(marker.position);
    });
}

function addMarkerOnMap(dream) {
    const iconSize2 = {
        width: 32,
        height: 40
    };
    const customIcon2 = {
        url: "images/4.png", 
        scaledSize: new google.maps.Size(iconSize2.width, iconSize2.height),
    };
    const customIcon3 = {
        url: "images/2.png", 
        scaledSize: new google.maps.Size(iconSize2.width, iconSize2.height),
    };

    const marker = new Marker({ 
        map: map,
        position: dream.coordinates,
        icon: dream.done ? customIcon3 : customIcon2,
        title: dream.description,
    });

    marker.addListener("click", () => {
        zoomOn(marker.position);
    });
};

function zoomToCoordinates(coordinates) {
    if (map) {
        mapDiv.style.display = 'block'; 
        panoramaDiv.style.display = 'none';

        map.setCenter(coordinates);
        map.setZoom(7);
        map.setMapTypeId('roadmap');
    }
};

async function zoomOn(position) {
    const { StreetViewService, StreetViewStatus } = await google.maps.importLibrary("streetView");
    const streetViewService = new StreetViewService(); 

    streetViewService.getPanorama({
        location: position,
        radius: 500, // Recherche dans un rayon de 50 mètres
        preference: 'nearest' // Choisir le plus proche
    }, (data, status) => {
        if (status === google.maps.StreetViewStatus.OK) {
            // Street View est disponible !

            // 1. Définir le panorama
            panorama.setPosition(data.location.latLng);

            // 2. Basculer l'affichage
            mapDiv.style.display = 'none'; // Masquer la carte
            panoramaDiv.style.display = 'block'; // Afficher le panorama

            google.maps.event.trigger(panorama, 'resize'); 
            panorama.setVisible(true);

            // 3. Mettre à jour le bouton de réinitialisation pour revenir à la carte
            resetMapButton.removeEventListener("click", resetMap); // Retirer l'ancien listener
            resetMapButton.addEventListener("click", resetView); // Ajouter le nouveau listener 

        } else {
            // Street View n'est PAS disponible, rester sur la carte
            console.log("Street View non disponible à cette position.");
            map.setZoom(18); // Zoomer moins si ce n'est pas Street View
            map.setCenter(position);
            map.setMapTypeId('satellite');

            // S'assurer que la carte est visible (utile si on vient d'un panorama)
            mapDiv.style.display = 'block'; 
            panoramaDiv.style.display = 'none'; 
        }
    });
}

function resetView() {
    // 1. Basculer l'affichage
    mapDiv.style.display = 'block'; // Afficher la carte
    panoramaDiv.style.display = 'none'; // Masquer le panorama

    google.maps.event.trigger(map, 'resize');

    // 2. Exécuter la réinitialisation de la carte
    resetMap();

    // 3. Réinitialiser le listener du bouton pour la réinitialisation normale
    resetMapButton.removeEventListener("click", resetView);
    resetMapButton.addEventListener("click", resetMap); 
}

function resetMap() {
    mapDiv.style.display = 'block';
    panoramaDiv.style.display = 'none';
    map.setCenter ({lat: 48.858159, lng: 2.294497});
    map.setZoom(3);
    map.setMapTypeId('roadmap');
    map.setMapId("d7cdceeb805b2ea959c859d9");
};

function visiteDreamOnMap(position) {
    zoomOn(position);
}


export { initMap, addMarkerOnMap, zoomToCoordinates, visiteDreamOnMap };