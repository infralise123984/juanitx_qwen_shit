// Datos del personaje
let personaje = {
    nivel: 1,
    xp: 0,
    xpParaSubir: 10,
    oro: 0,
    vidaMax: 100,
    vidaActual: 100,
    dañoAutomatico: 10,   // Daño automático cada X ms
    dañoClick: 25        // Daño al hacer clic
};
// Configuración del combate
const RADIO_ATAQUE = 200; // radio en píxeles donde el personaje ataca
const INTERVALO_GENERAR_ENEMIGO = 800;
// Lista de enemigos activos
let enemigos = [];
// Seleccionar elementos del DOM
const gameContainer = document.querySelector(".game-container");
const personajeImg = document.querySelector(".personaje");
// Posición central del personaje (se calcula después)
let PERSONAJE_X = 0;
let PERSONAJE_Y = 0;
// Función para obtener coordenadas reales del centro del personaje
function getPersonajePos() {
    const rect = personajeImg.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();
    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
    };
}
// Actualizar la interfaz de usuario
function actualizarUI() {
    document.querySelector(".stat-nivel").textContent = personaje.nivel;
    document.querySelector(".stat-xp").textContent = personaje.xp;
    document.querySelector(".stat-xp-necesario").textContent = personaje.xpParaSubir;
    document.querySelector(".stat-oro").textContent = personaje.oro;
    document.querySelector(".stat-vida").textContent = personaje.vidaActual + "/" + personaje.vidaMax;
    document.querySelector(".stat-dano-auto").textContent = personaje.dañoAutomatico;
    document.querySelector(".stat-dano-click").textContent = personaje.dañoClick;
}
// Subir de nivel
function subirNivel() {
    personaje.nivel++;
    personaje.xp = 0;
    personaje.xpParaSubir = Math.floor(personaje.xpParaSubir * 1.5);
    personaje.vidaMax += 20;
    personaje.vidaActual = personaje.vidaMax;
    personaje.dañoAutomatico += 5;
    personaje.dañoClick += 10;
}
// Bucle principal del juego
function loop() {
    atacarEnemigosCercanos();
    moverEnemigos();
    actualizarPosicionRadioAtaque(); // Mantener el radio centrado
}
// Inicialización
window.addEventListener("load", () => {
    // Calcular dimensiones del contenedor después de cargar todo
    const GAME_WIDTH = gameContainer.offsetWidth;
    const GAME_HEIGHT = gameContainer.offsetHeight;
    PERSONAJE_X = GAME_WIDTH / 2;
    PERSONAJE_Y = GAME_HEIGHT / 2;
    // Posicionar inicialmente al personaje
    personajeImg.style.position = "absolute";
    personajeImg.style.left = `${PERSONAJE_X}px`;
    personajeImg.style.top = `${PERSONAJE_Y}px`;
    personajeImg.style.transform = "translate(-50%, -50%)";

    // Iniciar UI
    actualizarUI();
});
// Dar recompensa dinámica
function darRecompensa() {
    const xpGanada = 1 * personaje.nivel + Math.round(personaje.nivel*0.8); // Puedes ajustar esta fórmula
    const oroGanado = 5 * personaje.nivel;
    personaje.xp += xpGanada;
    personaje.oro += oroGanado;
    if (personaje.xp >= personaje.xpParaSubir) {
        subirNivel();
        const { x, y } = getPersonajePos();
        mostrarLevelUp(x, y);
    }
    actualizarUI();
}
// Iniciar bucle del juego
setInterval(loop, 50);
setInterval(generarEnemigo, INTERVALO_GENERAR_ENEMIGO);