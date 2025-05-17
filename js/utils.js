function calcularDistancia(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

function actualizarUI() {
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

// Mostrar texto de XP ganada
function MostrarXP(x, y, color = "pink") {
    const xpGanada = 1 * personaje.nivel + Math.round(personaje.nivel * 0.8);
    const xpText = document.createElement("div");
    xpText.className = "xp-text";
    xpText.innerText = `+${xpGanada} XP`;
    xpText.style.left = `${x + 32}px`;
    xpText.style.top = `${y - 20}px`;
    xpText.style.color = color;
    xpText.style.fontSize = "14px";
    document.querySelector(".enemies-container").appendChild(xpText);

    setTimeout(() => {
        xpText.remove();
    }, 1000);
}

function darRecompensa() {
    const xpGanada = 1 * personaje.nivel + Math.round(personaje.nivel * 0.8); // Puedes ajustar esta fórmula
    const oroGanado = 2 * personaje.nivel;
    personaje.xp += xpGanada;
    personaje.oro += oroGanado;
    if (personaje.xp >= personaje.xpParaSubir) {
        subirNivel();
        const { x, y } = getPersonajePos();
        mostrarLevelUp(x, y);
    }
    actualizarUI();
}

function mostrarLevelUp(x, y) {
    const levelUpText = document.createElement("div");
    levelUpText.className = "level-up-text";
    levelUpText.innerText = "¡Level Up!";
    levelUpText.style.left = `${x + 32}px`;
    levelUpText.style.top = `${y - 90}px`;
    levelUpText.style.color = "gold";
    levelUpText.style.fontSize = "20px";
    levelUpText.style.fontWeight = "bold";
    levelUpText.style.textShadow = "1px 1px 2px black";
    document.querySelector(".enemies-container").appendChild(levelUpText);
    setTimeout(() => {
        levelUpText.remove();
    }, 1500);
}