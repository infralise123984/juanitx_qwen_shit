const INTERVALO_GENERAR_ENEMIGO = 1000;
let enemigos = [];
function mostrarVidaEnemigo(enemigo) {
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

// function actualizarPosicionTextoVida(enemigo) {
//     if (enemigo.textoVida) {
//         enemigo.textoVida.style.left = `${enemigo.x + 32}px`;
//         enemigo.textoVida.style.top = `${enemigo.y - 20}px`;
//     }
// }



// Mover enemigos hacia el personaje
function moverEnemigos() {
    const { x: personajeX, y: personajeY } = getPersonajePos();
    enemigos.forEach((enemigo) => {
        if (!enemigo.vivo) return;
        const dx = personajeX - enemigo.x;
        const dy = personajeY - enemigo.y;
        const dist = Math.hypot(dx, dy);
        const speed = 2;
        enemigo.x += (dx / dist) * speed;
        enemigo.y += (dy / dist) * speed;
        enemigo.elemento.style.left = `${enemigo.x}px`;
        enemigo.elemento.style.top = `${enemigo.y}px`;
        enemigo.textoVida.style.left = `${enemigo.x + 32}px`;
        enemigo.textoVida.style.top = `${enemigo.y - 20}px`;
    });
}

function generarEnemigo() {
    const container = document.querySelector(".enemies-container");

    const img = document.createElement("img");
    img.src = "enemigo.png";
    img.classList.add("enemigo");
    img.draggable = false;

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

function mostrarDaño(daño, x, y, color = "red") {
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
