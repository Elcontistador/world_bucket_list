import { initMap } from "./map.js";
import { buildAllDreams } from "./dream.js";

window.addEventListener('load', async () => {
    try {
        await initMap();
        buildAllDreams();
    } catch (error) {
        console.error("Erreur lors de l'initialisation de l'application:", error);
    }
});

