import { generarEnemigo, moverEnemigos } from "./modules/enemies/enemies";
import { atacarEnemigosCercanos } from "./modules/player/player";
import { actualizarUI, gameContainer, personajeImg } from "./utils";
// src/main.ts
import "./styles/style.css";

const generateIntervalEnemy = 800; // Intervalo para generar enemigos en milisegundos

window.addEventListener("load", () => {
    if (gameContainer && personajeImg) {
        const GAME_WIDTH = gameContainer.offsetWidth;
        const GAME_HEIGHT = gameContainer.offsetHeight;

        const PERSONAJE_X = GAME_WIDTH / 2;
        const PERSONAJE_Y = GAME_HEIGHT / 2;

        personajeImg.style.position = "absolute";
        personajeImg.style.left = `${PERSONAJE_X}px`;
        personajeImg.style.top = `${PERSONAJE_Y}px`;
        personajeImg.style.transform = "translate(-50%, -50%)";
    } else {
        console.error("No se encontró el contenedor o la imagen del personaje");
    }

    actualizarUI(); // Asegúrate que esta función exista
});

// Bucle principal del juego
function loop() {
    atacarEnemigosCercanos();
    moverEnemigos(); // Mantener el radio centrado
}

setInterval(loop, 50);
setInterval(generarEnemigo, generateIntervalEnemy);
