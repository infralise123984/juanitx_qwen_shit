import { getPersonajePos } from "../modules/player/player";
import { PlayerStats, type PlayerAndEnemyCords } from "../types";

export function calcularDistancia(coords: PlayerAndEnemyCords) {
    return Math.hypot(coords.enemy.x - coords.player.x, coords.enemy.y - coords.player.y);
}


// Mostrar texto de XP ganada
export function MostrarXP(x:number, y:number, color = "pink") {
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

// Lista de enemigos activos

export function actualizarUI() {
    document.querySelector(".stat-nivel").textContent = personaje.nivel;
    document.querySelector(".stat-xp").textContent = personaje.xp;
    document.querySelector(".stat-xp-necesario").textContent = personaje.xpParaSubir;
    document.querySelector(".stat-oro").textContent = personaje.oro;
    document.querySelector(".stat-vida").textContent = personaje.vidaActual + "/" + personaje.vidaMax;

    // Mostrar daño automático y su bonus
    document.querySelector(".stat-dano-auto").textContent = personaje.dañoAutomatico;
    const bonusDaño = obtenerBonusPorTipo("daño");
    document.querySelector(".stat-dano-auto-bonus").textContent =
        bonusDaño > 0 ? `+${bonusDaño} bonus` : "Sin bonus";

    // Mostrar daño clic y su bonus
    document.querySelector(".stat-dano-click").textContent = personaje.dañoClick;
    const bonusClick = obtenerBonusPorTipo("daño");
    document.querySelector(".stat-dano-click-bonus").textContent =
        bonusClick > 0 ? `+${bonusClick} bonus` : "Sin bonus";

    // Mostrar bonus de XP
    const bonusXP = obtenerBonusPorTipo("xp");
    document.querySelector(".stat-xp-bonus").textContent =
        bonusXP > 0 ? `+${bonusXP} bonus` : "Sin bonus";

    // Mostrar bonus de oro
    const bonusOro = obtenerBonusPorTipo("oro");
    document.querySelector(".stat-oro-bonus").textContent =
        bonusOro > 0 ? `+${bonusOro} bonus` : "Sin bonus";
}
// Generar un enemigo aleatorio fuera de la pantalla
export function generarEnemigo() {
    const container = document.querySelector(".enemies-container");

    const img = document.createElement("img");
    img.src = "enemigo.png";
    img.classList.add("enemigo");
    img.draggable = false

    // Posicionar enemigo aleatoriamente fuera de la pantalla
    let x, y;
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
    }

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    // Añadir evento de clic para atacar
    img.addEventListener("click", () => {
        const enemigo = enemigos.find(e => e.elemento === img);
        if (!enemigo || !enemigo.vivo) return;

        // Aplicar daño por clic
        enemigo.vida -= personaje.dañoClick;
        mostrarVidaEnemigo(enemigo);

        if (enemigo.vida <= 0) {
            enemigo.vivo = false;
            img.remove();
            MostrarXP(enemigo.x, enemigo.y);
            darRecompensa(); // Dar XP y oro basados en el nivel actual

            if (personaje.xp >= personaje.xpParaSubir) {
                subirNivel();
                const { x, y } = getPersonajePos();
                mostrarLevelUp(x, y);
            }
            actualizarUI();
            if (enemigo.textoVida) {
                enemigo.textoVida.remove();
                enemigo.textoVida = null;
            }
        }

        // Mostrar texto de daño
        mostrarDaño(personaje.dañoClick, enemigo.x, enemigo.y);
    });

    container.appendChild(img);

    enemigos.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        vida: 50 * personaje.nivel,
        elemento: img,
        vivo: true,
        textoVida: null // Inicializamos el texto de vida
    });
    mostrarVidaEnemigo(enemigos[enemigos.length - 1]); // Mostrar vida inicial
}

// Atacar a los enemigos cercanos automáticamente
export function atacarEnemigosCercanos() {
    const { x: personajeX, y: personajeY } = getPersonajePos(); // Usamos la posición real
    enemigos.forEach((enemigo) => {
        if (!enemigo.vivo) return;
        let distancia = calcularDistancia(personajeX, personajeY, enemigo.x, enemigo.y);
        if (distancia <= RADIO_ATAQUE) {
            enemigo.vida -= personaje.dañoAutomatico;
            mostrarVidaEnemigo(enemigo);
            mostrarDaño(personaje.dañoAutomatico, enemigo.x, enemigo.y, "blue");
            if (enemigo.vida <= 0) {
                MostrarXP(enemigo.x, enemigo.y);
                enemigo.vivo = false;
                enemigo.elemento.remove();
                darRecompensa(); // Dar XP y oro basados en el nivel actual
                if (personaje.xp >= personaje.xpParaSubir) {
                    subirNivel();
                    const { x, y } = getPersonajePos();
                    mostrarLevelUp(x, y);
                }
                actualizarUI();
                if (enemigo.textoVida) {
                    enemigo.textoVida.remove();
                    enemigo.textoVida = null;
                }
            }
        }
    });
}
// Mover enemigos hacia el personaje
export function moverEnemigos() {
    const { x: personajeX, y: personajeY } = getPersonajePos();
    enemigos.forEach((enemigo) => {
        if (!enemigo.vivo) return;
        const dx = personajeX - enemigo.x;
        const dy = personajeY - enemigo.y;
        const dist = Math.hypot(dx, dy);
        const speed = 1;
        enemigo.x += (dx / dist) * speed;
        enemigo.y += (dy / dist) * speed;
        enemigo.elemento.style.left = `${enemigo.x}px`;
        enemigo.elemento.style.top = `${enemigo.y}px`;

        actualizarPosicionTextoVida(enemigo);
    });
}
// Subir de nivel
export function subirNivel() {
    personaje.nivel++;
    personaje.xp = 0;
    personaje.xpParaSubir = Math.floor(personaje.xpParaSubir * 1.5);
    personaje.vidaMax += 20;
    personaje.vidaActual = personaje.vidaMax;
    personaje.dañoAutomatico += 5;
    personaje.dañoClick += 10;
}
// Mostrar texto de daño al hacer clic
export function mostrarDaño(daño, x, y, color = "red") {
    const dañoText = document.createElement("div");
    dañoText.className = "daño-text";
    dañoText.innerText = `-${daño}`;
    dañoText.style.left = `${x + 32}px`;
    dañoText.style.top = `${y + 40}px`;
    dañoText.style.color = color;
    document.querySelector(".enemies-container").appendChild(dañoText);
    setTimeout(() => {
        dañoText.remove();
    }, 1000);
}

// mostrar vida enemigo
export function mostrarVidaEnemigo(enemigo) {
    // Si ya existe un texto, lo eliminamos antes de crear uno nuevo
    if (enemigo.textoVida) {
        enemigo.textoVida.remove();
    }
    const vidaText = document.createElement("div");
    vidaText.className = "vida-enemigo-text";
    vidaText.innerText = `${Math.max(0, Math.floor(enemigo.vida))}`;
    vidaText.style.position = "absolute";
    vidaText.style.left = `${enemigo.x + 32}px`;
    vidaText.style.top = `${enemigo.y - 20}px`;
    vidaText.style.color = "white";
    vidaText.style.fontSize = "14px";
    vidaText.style.fontWeight = "bold";
    vidaText.style.textShadow = "1px 1px 2px black";
    vidaText.style.pointerEvents = "none";

    document.querySelector(".enemies-container").appendChild(vidaText);

    // Guardar referencia en el objeto enemigo
    enemigo.textoVida = vidaText;
}

export function actualizarPosicionTextoVida(enemigo) {
    if (enemigo.textoVida) {
        enemigo.textoVida.style.left = `${enemigo.x + 32}px`;
        enemigo.textoVida.style.top = `${enemigo.y - 20}px`;
    }
}


// Iniciar bucle del juego
