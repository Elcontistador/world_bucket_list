import { event } from "jquery";
import { data } from "./data.js";
import { addMarkerOnMap } from "./map";
import { zoomToCoordinates } from "./map";
import { visiteDreamOnMap } from "./map.js";

const dreamsContainer = document.querySelector("#dreams-container");

function buildAllDreams() {
    while (dreamsContainer.firstChild) {
        dreamsContainer.removeChild(dreamsContainer.firstChild);
    }
    data.forEach(buildOneDream);
    addDreamsLiseners();
}

function buildOneDream(dream) {
    const dreamElement = document.createElement("div");

    dreamElement.innerHTML = `
        <div class="card text-center" id="dream-${dream.id}">
            <h4 class="card-header"><strong>${dream.description}</strong></h4>
            <img src="${dream.imagePath}" class="card-img-top" alt="${dream.alt}">
            <div class="card-body">
                <div class="d-grid gap-2">
                    <a href="#" class="button-action btn btn-${dream.done ? "secondary" : "danger"} btn-lg">${dream.done ? "Je veux le refaire" : "Je me lance !"}</a>
                </div>
            </div>
            <div class="card-footer text-body-secondary">
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                    <a href="#" class="btn btn-outline-primary btn-sm dream-zoom-btn">Zoom</a>
                    <a href="#" class="button-visit btn btn-outline-success btn-sm">Visiter</a>
                    <a href="${dream.link}" class="btn btn-outline-dark btn-sm" target=_blank">Plus d'infos</a>
                </div>
            </div>
        </div>
    `;

    const zoomButton = dreamElement.querySelector(".dream-zoom-btn");

    dreamsContainer.appendChild(dreamElement);

    zoomButton.addEventListener("click", (e) => {
        e.preventDefault();
        zoomToCoordinates(dream.coordinates);
    });

    addMarkerOnMap(dream);

}

function addDreamsLiseners() {
    document.querySelectorAll(".button-visit").forEach(item =>{
        item.addEventListener("click", event => {
            visiteDream(item.parentElement.parentElement.parentElement.getAttribute("id"));
        })
    });

    document.querySelectorAll(".button-action").forEach(item =>{
        item.addEventListener("click", event => {
            toggleDreamDone(item.parentElement.parentElement.parentElement.getAttribute("id"));
        })
    });
}

function visiteDream(dreamId) {
    const dream = data.find(item => `dream-${item.id}` === dreamId);
    if (dream) {
        visiteDreamOnMap(dream.coordinates);
    } else {
        console.error(`Rêve avec l'ID ${dreamId} non trouvé.`);
    }
}

function toggleDreamDone(dreamId) {
    const dream = data.find(item => `dream-${item.id}` === dreamId);
    if (dream) {
        dream.done = !dream.done;
        buildAllDreams();
    } else {
        console.error(`Rêve avec l'ID ${dreamId} non trouvé.`);
    } 
}


export { buildAllDreams };