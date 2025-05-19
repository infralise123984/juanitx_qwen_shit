import { PlayerStats } from "../../types";
import type { Enemy } from "../../types/enemy.types";
import { actualizarUI, darRecompensa, mostrarDaño, mostrarLevelUp, MostrarXP } from "../../utils";
import { getPersonajePos, subirNivel } from "../player/player";

let enemies: Enemy[] = [];

// mostrar vida enemigo
export function enemyLife(enemy: Enemy) {
    // Si ya existe un texto, lo eliminamos antes de crear uno nuevo
    if (enemy.textoVida) {
        enemy.textoVida.remove();
    }
    const vidaText = document.createElement("div");
    vidaText.className = "vida-enemigo-text";
    vidaText.innerText = `${Math.max(0, Math.floor(enemy.vida))}`;
    vidaText.style.position = "absolute";
    vidaText.style.left = `${enemy.x + 32}px`;
    vidaText.style.top = `${enemy.y - 20}px`;
    vidaText.style.color = "white";
    vidaText.style.fontSize = "14px";
    vidaText.style.fontWeight = "bold";
    vidaText.style.textShadow = "1px 1px 2px black";
    vidaText.style.pointerEvents = "none";

    const container = document.querySelector(".enemies-container");
    if (container) {
        container.appendChild(vidaText);
        // Guardar referencia en el objeto enemigo
        enemy.textoVida = vidaText;
    }
}

function refreshEnemyLife(enemy: Enemy) {
    if (enemy.textoVida) {
        enemy.textoVida.style.left = `${enemy.x + 32}px`;
        enemy.textoVida.style.top = `${enemy.y - 20}px`;
    }
}


// Mover enemigos hacia el personaje
export function moverEnemigos() {
    const { x: personajeX, y: personajeY } = getPersonajePos();
    enemies.forEach((enemy) => {
        if (!enemy.vivo) return;
        const dx = personajeX - enemy.x;
        const dy = personajeY - enemy.y;
        const dist = Math.hypot(dx, dy);
        const speed = 1;
        enemy.x += (dx / dist) * speed;
        enemy.y += (dy / dist) * speed;
        enemy.elemento.style.left = `${enemy.x}px`;
        enemy.elemento.style.top = `${enemy.y}px`;

        refreshEnemyLife(enemy);
    });
}

// Generar un enemigo aleatorio fuera de la pantalla
export function generarEnemigo() {
    const container = document.querySelector(".enemies-container");
    if (!container) return;

    const img = document.createElement("img");
    img.src = "/images/enemigo.png";
    img.classList.add("enemigo");
    img.draggable = false;

    // Posicionar enemigo aleatoriamente fuera de la pantalla
    let x: number, y: number;
    const lado = Math.floor(Math.random() * 4); // 0-3: arriba, abajo, izq, der

    switch (lado) {
        case 0:
            x = Math.random() * 800;
            y = -64;
            break; // arriba
        case 1:
            x = Math.random() * 800;
            y = 600;
            break; // abajo
        case 2:
            x = -64;
            y = Math.random() * 600;
            break; // izquierda
        case 3:
            x = 800;
            y = Math.random() * 600;
            break; // derecha
        default:
            x = 0;
            y = 0;
    }

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    // Añadir evento de clic para atacar
    img.addEventListener("click", () => {
        const enemy = enemies.find(e => e.elemento === img);
        if (!enemy?.vivo) return;

        // Aplicar daño por clic
        enemy.vida -= PlayerStats.clickDamage;
        enemyLife(enemy);

        if (enemy.vida <= 0) {
            enemy.vivo = false;
            img.remove();
            MostrarXP(enemy.x, enemy.y);
            darRecompensa(); // Dar XP y oro basados en el nivel actual

            if (PlayerStats.xp >= PlayerStats.levelUpExp) {
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

        // Mostrar texto de daño
        mostrarDaño(PlayerStats.clickDamage, enemy.x, enemy.y);
    });

    container.appendChild(img);

    enemies.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        vida: 50 * PlayerStats.level,
        elemento: img,
        vivo: true,
        textoVida: null // Inicializamos el texto de vida
    });
    enemyLife(enemies[enemies.length - 1]); // Mostrar vida inicial
}
