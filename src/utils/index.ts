import { obtenerBonusPorTipo } from "../modules/lootbox/lootbox";
import { getPersonajePos, subirNivel } from "../modules/player/player";
import { PlayerStats, type PlayerAndEnemyCords } from "../types";

// Seleccionar elementos del DOM
export const gameContainer = document.querySelector(".game-container") as HTMLElement | null;
export const personajeImg = document.querySelector(".personaje") as HTMLElement | null;

// If you use this constant, define it here or import it
export function calcularDistancia(coords: PlayerAndEnemyCords) {
    return Math.hypot(coords.enemy.x - coords.player.x, coords.enemy.y - coords.player.y);
}

// Mostrar texto de XP ganada
export function MostrarXP(x: number, y: number, color = "pink") {
    const xpGanada = 1 * PlayerStats.level + Math.round(PlayerStats.level * 0.8);
    const xpText = document.createElement("div");
    xpText.className = "xp-text";
    xpText.innerText = `+${xpGanada} XP`;
    xpText.style.left = `${x + 32}px`;
    xpText.style.top = `${y - 20}px`;
    xpText.style.color = color;
    xpText.style.fontSize = "14px";
    const container = document.querySelector(".enemies-container");
    if (container) {
        container.appendChild(xpText);
    }

    setTimeout(() => {
        xpText.remove();
    }, 1000);
}

export function darRecompensa() {
    const xpGanada = (1 * PlayerStats.level + Math.round(PlayerStats.level * 0.5)) * PlayerStats.mult.xp;
    const oroGanado = (2 * PlayerStats.level + Math.round(PlayerStats.level * 0.5)) * PlayerStats.mult.gold;
    PlayerStats.xp += xpGanada;
    PlayerStats.gold += oroGanado;
    if (PlayerStats.xp >= PlayerStats.levelUpExp) {
        subirNivel();
        const { x, y } = getPersonajePos();
        mostrarLevelUp(x, y);
    }
    actualizarUI();
}

export function mostrarLevelUp(x: number, y: number) {
    const levelUpText = document.createElement("div");
    levelUpText.className = "level-up-text";
    levelUpText.innerText = "¡Level Up!";
    levelUpText.style.left = `${x + 32}px`;
    levelUpText.style.top = `${y - 90}px`;
    levelUpText.style.color = "gold";
    levelUpText.style.fontSize = "20px";
    levelUpText.style.fontWeight = "bold";
    levelUpText.style.textShadow = "1px 1px 2px black";
    const container = document.querySelector(".enemies-container");
    if (container) {
        container.appendChild(levelUpText);
    }
    setTimeout(() => {
        levelUpText.remove();
    }, 1500);
}

export function actualizarUI() {
    const nivelElem = document.querySelector(".stat-nivel");
    if (nivelElem) nivelElem.textContent = PlayerStats.level.toString();

    const xpElem = document.querySelector(".stat-xp");
    if (xpElem) xpElem.textContent = PlayerStats.xp.toString();

    const xpNecesarioElem = document.querySelector(".stat-xp-necesario");
    if (xpNecesarioElem) xpNecesarioElem.textContent = PlayerStats.levelUpExp.toString();

    const oroElem = document.querySelector(".stat-oro");
    if (oroElem) oroElem.textContent = PlayerStats.gold.toString();

    const vidaElem = document.querySelector(".stat-vida");
    if (vidaElem) vidaElem.textContent = `${PlayerStats.currentHealth} / ${PlayerStats.maxHealth}`;

    // Mostrar daño automático y su bonus
    const danoAutoElem = document.querySelector(".stat-dano-auto");
    if (danoAutoElem) danoAutoElem.textContent = PlayerStats.autoDamage.toString();
    const bonusDaño = obtenerBonusPorTipo("daño");
    const danoAutoBonusElem = document.querySelector(".stat-dano-auto-bonus");
    if (danoAutoBonusElem)
        danoAutoBonusElem.textContent = bonusDaño > 0 ? `+${bonusDaño} bonus` : "Sin bonus";

    // Mostrar daño clic y su bonus
    const danoClickElem = document.querySelector(".stat-dano-click");
    if (danoClickElem) danoClickElem.textContent = PlayerStats.clickDamage.toString();
    const bonusClick = obtenerBonusPorTipo("daño");
    const danoClickBonusElem = document.querySelector(".stat-dano-click-bonus");
    if (danoClickBonusElem)
        danoClickBonusElem.textContent = bonusClick > 0 ? `+${bonusClick} bonus` : "Sin bonus";

    // Mostrar bonus de XP
    const bonusXP = obtenerBonusPorTipo("xp");
    const xpBonusElem = document.querySelector(".stat-xp-bonus");
    if (xpBonusElem)
        xpBonusElem.textContent = bonusXP > 0 ? `+${bonusXP} bonus` : "Sin bonus";

    // Mostrar bonus de oro
    const bonusOro = obtenerBonusPorTipo("oro");
    const oroBonusElem = document.querySelector(".stat-oro-bonus");
    if (oroBonusElem)
        oroBonusElem.textContent = bonusOro > 0 ? `+${bonusOro} bonus` : "Sin bonus";
}

// Mostrar texto de daño al hacer clic
export function mostrarDaño(daño: number, x: number, y: number, color = "red") {
    const dañoText = document.createElement("div");
    dañoText.className = "daño-text";
    dañoText.innerText = `-${daño}`;
    dañoText.style.left = `${x + 32}px`;
    dañoText.style.top = `${y + 40}px`;
    dañoText.style.color = color;
    const container = document.querySelector(".enemies-container");
    if (container) {
        container.appendChild(dañoText);
        setTimeout(() => {
            dañoText.remove();
        }, 1000);
    }
}

// Iniciar bucle del juego
