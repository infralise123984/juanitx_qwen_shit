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
const RADIO_ATAQUE = 200; // radio en píxeles donde el personaje ataca
const INTERVALO_GENERAR_ENEMIGO = 800;
// Posición central del personaje (se calcula después)
let PERSONAJE_X = 0;
let PERSONAJE_Y = 0;

function atacarEnemigosCercanos() {
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

function subirNivel() {
    personaje.nivel++;
    personaje.xp = 0;
    personaje.xpParaSubir = Math.floor(personaje.xpParaSubir * 1.5);
    personaje.vidaMax += 20;
    personaje.vidaActual = personaje.vidaMax;
    personaje.dañoAutomatico += 5;
    personaje.dañoClick += 10;
}

// Seleccionar elementos del DOM
const gameContainer = document.querySelector(".game-container");
const personajeImg = document.querySelector(".personaje");



// Función para obtener coordenadas reales del centro del personaje
function getPersonajePos() {
    const rect = personajeImg.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    return {
        x: rect.left - containerRect.left + rect.width / 2,
        y: rect.top - containerRect.top + rect.height / 2
    };
}