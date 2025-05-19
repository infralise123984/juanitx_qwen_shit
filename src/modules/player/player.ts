import { enemies } from "../../data/enemyState";
import type { Enemy } from "../../types/enemy.types";
import { actualizarUI, calcularDistancia, darRecompensa, gameContainer, mostrarDaño, mostrarLevelUp, MostrarXP, personajeImg } from "../../utils";
import { enemyLife } from "../enemies/enemies";

// Datos del personaje
let personaje = {
    nivel: 1,
    xp: 0,
    xpParaSubir: 10,
    oro: 1000,
    vidaMax: 100,
    vidaActual: 100,
    dañoAutomatico: 1,   // Daño automático cada X ms
    dañoClick: 25,        // Daño al hacer clic
    inventario: [],
    mult: {
        daño : 1,
        vidamax : 1,
        xp : 1,
        oro: 1
    }
};

// Configuración del combate
const atackRadius = 200; // radio en píxeles donde el personaje ataca

export function atacarEnemigosCercanos() {
    const { x: personajeX, y: personajeY } = getPersonajePos(); // Usamos la posición real
    enemies.forEach((enemy) => {
        if (!enemy.vivo) return;
        let distancia = calcularDistancia({
            player: { x: personajeX, y: personajeY },
            enemy: { x: enemy.x, y: enemy.y }
        });
        if (distancia <= atackRadius) {
            enemy.vida -= personaje.dañoAutomatico;
            enemyLife(enemy);
            mostrarDaño(personaje.dañoAutomatico, enemy.x, enemy.y, "blue");
            if (enemy.vida <= 0) {
                MostrarXP(enemy.x, enemy.y);
                enemy.vivo = false;
                enemy.elemento.remove();
                darRecompensa(); // Dar XP y oro basados en el nivel actual
                if (personaje.xp >= personaje.xpParaSubir) {
                    subirNivel();
                    const { x, y } = getPersonajePos();
                    mostrarLevelUp(x, y);
                }
                actualizarUI();
                if (enemy.textoVida) {
                    enemy.textoVida.remove();
                    enemy.textoVida = null;
                }
            }
        }
    });
}

export function subirNivel() {
    personaje.nivel++;
    personaje.xp = 0;
    personaje.xpParaSubir = Math.floor(personaje.xpParaSubir * 1.5);
    personaje.vidaMax += 20;
    personaje.vidaActual = personaje.vidaMax;
    personaje.dañoAutomatico += 5;
    personaje.dañoClick += 10;
}

// Función para obtener coordenadas reales del centro del personaje
export function getPersonajePos() {
    if (!personajeImg || !gameContainer) {
        // Return a default position or handle the error as needed
        return { x: 0, y: 0 };
    }
    const rect = personajeImg.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
    };
}