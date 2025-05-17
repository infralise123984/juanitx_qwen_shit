// Definición de rarezas y sus probabilidades
const RARIDADES = [
    { nombre: "Común", probabilidad: 60, color: "green" },
    { nombre: "Raro", probabilidad: 25, color: "blue" },
    { nombre: "Épico", probabilidad: 10, color: "purple" },
    { nombre: "Legendario", probabilidad: 5, color: "orange" }
];

// Tabla de efectos por rareza
const EFECTOS_POR_RARIDAD = {
    "Común": [
        { tipo: "daño", min: 1, max: 3 },
        { tipo: "xp", min: 1, max: 2 },
        { tipo: "oro", min: 2, max: 5 }
    ],
    "Raro": [
        { tipo: "daño", min: 3, max: 6 },
        { tipo: "xp", min: 2, max: 4 },
        { tipo: "oro", min: 5, max: 8 }
    ],
    "Épico": [
        { tipo: "daño", min: 6, max: 10 },
        { tipo: "xp", min: 4, max: 7 },
        { tipo: "oro", min: 8, max: 12 }
    ],
    "Legendario": [
        { tipo: "daño", min: 10, max: 15 },
        { tipo: "xp", min: 7, max: 12 },
        { tipo: "oro", min: 12, max: 20 }
    ]
};

// Inventario del jugador
let inventario = [];

// Costo de abrir una lootbox
const COSTO_LOOTBOX = 50;

// Efectos activos actualmente equipados
let efectosActivos = {
    daño: null,
    xp: null,
    oro: null
};

// Guarda el estilo original del personaje
let estiloOriginalPersonaje = "";

// Función para aplicar estilo inicial al cargar la página
window.addEventListener("load", () => {
    const personajeImg = document.querySelector(".personaje");
    if (personajeImg) {
        estiloOriginalPersonaje = personajeImg.style.filter || "";
    }
});

function abrirLootbox() {
    const resultadoDiv = document.getElementById("resultado");

    // Verificar si tiene suficiente oro
    if (personaje.oro < COSTO_LOOTBOX) {
        resultadoDiv.innerHTML = `<span style="color:red">No tienes suficiente oro.</span>`;
        return;
    }

    // Restar oro
    personaje.oro -= COSTO_LOOTBOX;
    actualizarUI();

    // Seleccionar rareza basada en probabilidad
    const rareza = obtenerRarezaAleatoria();

    // Seleccionar efecto aleatorio
    const efectosDisponibles = EFECTOS_POR_RARIDAD[rareza.nombre];
    const efecto = efectosDisponibles[Math.floor(Math.random() * efectosDisponibles.length)];

    // Generar valor aleatorio entre min y max
    const valor = Math.floor(Math.random() * (efecto.max - efecto.min + 1)) + efecto.min;

    // Configuración de efectos visuales por rareza
    const RANGO_FILTRO_POR_RARIDAD = {
        "Común": {
            brightness: [80, 120],
            contrast: [80, 120],
            shadowBlur: [2, 4]
        },
        "Raro": {
            brightness: [90, 130],
            contrast: [90, 130],
            shadowBlur: [4, 7]
        },
        "Épico": {
            brightness: [100, 140],
            contrast: [100, 140],
            shadowBlur: [7, 10]
        },
        "Legendario": {
            brightness: [120, 160],
            contrast: [120, 160],
            shadowBlur: [10, 15]
        }
    };

    const rango = RANGO_FILTRO_POR_RARIDAD[rareza.nombre];

    // Generar valores visuales dinámicos
    const hue = Math.floor(Math.random() * 360);
    const brightness = randomRange(80, 120);
    const contrast = randomRange(rango.contrast[0], rango.contrast[1]);
    const shadowX = randomRange(-5, 5);
    const shadowY = randomRange(-5, 5);
    const shadowBlur = randomRange(rango.shadowBlur[0], rango.shadowBlur[1]);

    // Escala y rotación según rareza
    const scale = rareza.nombre === "Legendario" ? 1.05 : rareza.nombre === "Épico" ? 1.02 : 1;
    const rotate = rareza.nombre === "Legendario"
        ? `${randomRange(-5, 5)}deg`
        : rareza.nombre === "Épico"
            ? `${randomRange(-2, 2)}deg`
            : "0deg";

    const filterStyle = `
        hue-rotate(${hue}deg)
        brightness(${brightness}%)
        contrast(${contrast}%)
        drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(255,255,255,0.5))
    `;

    const transformStyle = `scale(${scale}) rotate(${rotate})`;

    const boxShadowStyle = rareza.nombre === "Legendario"
        ? `0 0 ${randomRange(10, 15)}px rgba(255, 215, 0, 0.7)`
        : rareza.nombre === "Épico"
            ? `0 0 ${randomRange(5, 10)}px rgba(128, 0, 128, 0.5)`
            : "none";

    // Crear objeto obtenido
    const objeto = {
        id: Date.now(),
        nombre: `${rareza.nombre} ${efecto.tipo === "daño" ? "Gema de Daño" : efecto.tipo === "xp" ? "Esencia de XP" : "Monedas Mágicas"}`,
        tipo: efecto.tipo,
        valor,
        rareza: rareza.nombre,
        color: rareza.color,
        filtro: filterStyle,
        transform: transformStyle,
        boxShadow: boxShadowStyle,
        equipado: false
    };

    // Añadir al inventario
    inventario.push(objeto);

    // Mostrar resultado
    resultadoDiv.innerHTML = `
        <span style="color:${rareza.color}">
            🎁 Obtuviste: <strong>${objeto.nombre}</strong> (+${objeto.valor} ${objeto.tipo.toUpperCase()})
        </span>
        <br>
        <small>(Probabilidad: ${rareza.probabilidad}% | Rareza: ${rareza.nombre})</small>
    `;

    // Actualizar inventario en pantalla
    mostrarInventario();
}

// Función auxiliar para generar números aleatorios entre min y max
function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para seleccionar rareza aleatoria
function obtenerRarezaAleatoria() {
    let total = RARIDADES.reduce((sum, r) => sum + r.probabilidad, 0);
    let random = Math.random() * total;

    for (let r of RARIDADES) {
        if (random < r.probabilidad) return r;
        random -= r.probabilidad;
    }

    return RARIDADES[RARIDADES.length - 1]; // Por defecto
}

// Mostrar inventario
function mostrarInventario() {
    const inventarioDiv = document.getElementById("inventario");
    inventarioDiv.innerHTML = "";

    if (inventario.length === 0) {
        inventarioDiv.innerHTML = "<em>Inventario vacío</em>";
        return;
    }

    inventario.forEach((item, index) => {
        const rareza = RARIDADES.find(r => r.nombre === item.rareza);

        const itemDiv = document.createElement("div");
        itemDiv.className = "inventario-item";
        itemDiv.style.border = `2px solid ${rareza.color}`;

        let botonEquipar = '';
        if (item.equipado) {
            botonEquipar = `<button onclick="desequiparObjeto(${index})">Desequipar</button>`;
        } else {
            botonEquipar = `<button onclick="equiparObjeto(${index})">Equipar</button>`;
        }

        itemDiv.innerHTML = `
            <span style="color:${rareza.color}">
                🎖️ ${item.nombre} (+${item.valor} ${item.tipo.toUpperCase()})
            </span>
            ${botonEquipar}
        `;
        inventarioDiv.appendChild(itemDiv);
    });
}

// Equipar un objeto
function equiparObjeto(index) {
    const item = inventario[index];
    if (!item) return;

    const tipo = item.tipo;

    // Desactivar efecto anterior del mismo tipo
    if (efectosActivos[tipo]) {
        const idAnterior = efectosActivos[tipo];
        const itemAnterior = inventario.find(i => i.id === idAnterior);
        if (itemAnterior) itemAnterior.equipado = false;
    }

    // Equipar este objeto
    item.equipado = true;
    efectosActivos[tipo] = item.id;

    // Aplicar nuevo estilo visual
    actualizarEstiloPersonaje();

    // Actualizar UI
    actualizarUI();
    mostrarInventario();
}

// Desequipar un objeto
function desequiparObjeto(index) {
    const item = inventario[index];
    if (!item || !item.equipado) return;

    const tipo = item.tipo;

    // Si es el que está equipado, lo eliminamos
    if (efectosActivos[tipo] === item.id) {
        efectosActivos[tipo] = null;
        item.equipado = false;
    }

    // Restablecer estilo del personaje
    actualizarEstiloPersonaje();

    // Actualizar UI
    actualizarUI();
    mostrarInventario();
}

// Aplicar estilo visual a ambos personajes (principal y miniatura)
function actualizarEstiloPersonaje() {
    const personajeImg = document.querySelector(".personaje");
    const miniaturaImg = document.getElementById("miniatura-personaje");

    if (!personajeImg || !miniaturaImg) return;

    // Buscar objeto equipado con estilo
    const objetoEquipado = inventario.find(i => i.equipado && i.filtro);

    if (objetoEquipado) {
        personajeImg.style.filter = objetoEquipado.filtro;
        personajeImg.style.transform = objetoEquipado.transform;
        personajeImg.style.boxShadow = objetoEquipado.boxShadow;

        miniaturaImg.style.filter = objetoEquipado.filtro;
        miniaturaImg.style.transform = objetoEquipado.transform;
        miniaturaImg.style.boxShadow = objetoEquipado.boxShadow;
    } else {
        personajeImg.style.filter = estiloOriginalPersonaje;
        personajeImg.style.transform = "scale(1) rotate(0deg)";
        personajeImg.style.boxShadow = "none";

        miniaturaImg.style.filter = estiloOriginalPersonaje;
        miniaturaImg.style.transform = "scale(1) rotate(0deg)";
        miniaturaImg.style.boxShadow = "none";
    }
}

// Devuelve el BONUS (no el total con multiplicación)
function obtenerBonusPorTipo(tipo) {
    const efecto = inventario.find(i => i.id === efectosActivos[tipo]);
    return efecto ? efecto.valor : 0;
}