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
// Bucle principal del juego
function loop() {
    atacarEnemigosCercanos();
    moverEnemigos(); // Mantener el radio centrado
}
function calcularDistancia(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

setInterval(loop, 50);
setInterval(generarEnemigo, INTERVALO_GENERAR_ENEMIGO);