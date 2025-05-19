import { PlayerStats } from "../../types";
import { actualizarUI } from "../../utils";

// Definición de rarezas y sus probabilidades
const RAREZA = [
    { nombre: "Común", probabilidad: 60, color: "green" },
    { nombre: "Raro", probabilidad: 25, color: "blue" },
    { nombre: "Épico", probabilidad: 10, color: "purple" },
    { nombre: "Legendario", probabilidad: 5, color: "orange" }
];

// Definir tipo de rareza como string literal type
type RarezaNombre = "Común" | "Raro" | "Épico" | "Legendario";

// Tabla de efectos por rareza
const EFECTOS_POR_RAREZA: Record<RarezaNombre, { tipo: string; min: number; max: number; }[]> = {
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
type InventarioItem = {
    id: number;
    nombre: string;
    tipo: string;
    valor: number;
    rareza: string;
    color: string;
    filtro: string;
    transform: string;
    boxShadow: string;
    equipado: boolean;
    claseEstilo?: string; // Añadido para evitar el error de propiedad inexistente
};
let inventario: InventarioItem[] = PlayerStats.inventory as InventarioItem[];

// Costo de abrir una lootbox
const COSTO_LOOTBOX = 1000;

// Efectos activos actualmente equipados
type EfectoTipo = "daño" | "xp" | "oro";
type EfectosActivos = { [key in EfectoTipo]: number | null };

let efectosActivos: EfectosActivos = {
    daño: null,
    xp: null,
    oro: null
};

// Guarda el estilo original del personaje
let estiloOriginalPersonaje = "";

// Función para aplicar estilo inicial al cargar la página
window.addEventListener("load", () => {
    const personajeImg = document.querySelector(".personaje") as HTMLElement;
    if (personajeImg) {
        estiloOriginalPersonaje = personajeImg.style.filter || "";
    }
});

export function abrirLootbox() {
    const resultadoDiv = document.getElementById("resultado");

    // Verificar si tiene suficiente oro
    if (PlayerStats.gold < COSTO_LOOTBOX) {
        if (resultadoDiv) {
            resultadoDiv.innerHTML = `<span style="color:red">No tienes suficiente oro.</span>`;
        }
        return;
    }

    // Restar oro
    // Seleccionar rareza basada en probabilidad
    const rareza = obtenerRarezaAleatoria();

    // Seleccionar efecto aleatorio
    const efectosDisponibles = EFECTOS_POR_RAREZA[rareza.nombre as RarezaNombre];
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

    const rango = RANGO_FILTRO_POR_RARIDAD[rareza.nombre as RarezaNombre];

    // Generar valores visuales dinámicos
    const hue = Math.floor(Math.random() * 360);
    const brightness = randomRange(80, 120);
    const contrast = randomRange(rango.contrast[0], rango.contrast[1]);
    const shadowX = randomRange(-5, 5);
    const shadowY = randomRange(-5, 5);
    const shadowBlur = randomRange(rango.shadowBlur[0], rango.shadowBlur[1]);

    // Escala y rotación según rareza
    let scale: number;
    if (rareza.nombre === "Legendario") {
        scale = 1.05;
    } else if (rareza.nombre === "Épico") {
        scale = 1.02;
    } else {
        scale = 1;
    }
    let rotate: string;
    if (rareza.nombre === "Legendario") {
        rotate = `${randomRange(-5, 5)}deg`;
    } else if (rareza.nombre === "Épico") {
        rotate = `${randomRange(-2, 2)}deg`;
    } else {
        rotate = "0deg";
    }

    const filterStyle = `
        hue-rotate(${hue}deg)
        brightness(${brightness}%)
        contrast(${contrast}%)
        drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(255,255,255,0.5))
    `;

    const transformStyle = `scale(${scale}) rotate(${rotate})`;

    let boxShadowStyle: string;
    if (rareza.nombre === "Legendario") {
        boxShadowStyle = `0 0 ${randomRange(10, 15)}px rgba(255, 215, 0, 0.7)`;
    } else if (rareza.nombre === "Épico") {
        boxShadowStyle = `0 0 ${randomRange(5, 10)}px rgba(128, 0, 128, 0.5)`;
    } else {
        boxShadowStyle = "none";
    }

    // Crear objeto obtenido
    let nombreEfecto: string;
    if (efecto.tipo === "daño") {
        nombreEfecto = "Gema de Daño";
    } else if (efecto.tipo === "xp") {
        nombreEfecto = "Esencia de XP";
    } else {
        nombreEfecto = "Monedas Mágicas";
    }
    const objeto = {
        id: Date.now(),
        nombre: `${rareza.nombre} ${nombreEfecto}`,
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
    if (resultadoDiv) {
        resultadoDiv.innerHTML = `
        <span style="color:${rareza.color}">
            🎁 Obtuviste: <strong>${objeto.nombre}</strong> (+${objeto.valor} ${objeto.tipo.toUpperCase()})
        </span>
        <br>
        <small>(Probabilidad: ${rareza.probabilidad}% | Rareza: ${rareza.nombre})</small>
    `;
    }

    // Actualizar inventario en pantalla
    mostrarInventario();
}

(window as any).abrirLootbox = abrirLootbox;

// Función auxiliar para generar números aleatorios entre min y max
function randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para seleccionar rareza aleatoria
function obtenerRarezaAleatoria() {
    let total = RAREZA.reduce((sum, r) => sum + r.probabilidad, 0);
    let random = Math.random() * total;

    for (let r of RAREZA) {
        if (random < r.probabilidad) return r;
        random -= r.probabilidad;
    }

    return RAREZA[RAREZA.length - 1]; // Por defecto
}

// Mostrar inventario
function mostrarInventario() {
    const inventarioDiv = document.getElementById("inventario");
    if (!inventarioDiv) return;
    inventarioDiv.innerHTML = "";

    if (inventario.length === 0) {
        inventarioDiv.innerHTML = "<em>Inventario vacío</em>";
        return;
    }

    inventario.forEach((item, index) => {
        const rareza = RAREZA.find(r => r.nombre === item.rareza);

        const itemDiv = document.createElement("div");
        itemDiv.className = "inventario-item";
        itemDiv.style.border = `2px solid ${(rareza?.color ?? "gray")}`;

        let botonEquipar = '';
        if (item.equipado) {
            botonEquipar = `<button onclick="desequiparObjeto(${index})">Desequipar</button>`;
        } else {
            botonEquipar = `<button onclick="equiparObjeto(${index})">Equipar</button>`;
        }

        itemDiv.innerHTML = `
            <span style="color:${rareza?.color ?? 'gray'}">
                🎖️ ${item.nombre} (+${item.valor} ${item.tipo.toUpperCase()})
            </span>
            ${botonEquipar}
        `;
        inventarioDiv.appendChild(itemDiv);
    });
}

// Equipar un objeto
function equiparObjeto(index: number) {
    const item = inventario[index];
    if (!item) return;
    const tipo = item.tipo as EfectoTipo;
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
function desequiparObjeto(index: number) {
    const item = inventario[index];
    if (!item || !item.equipado) return;

    const tipo = item.tipo as EfectoTipo;

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

// Attach to window for HTML onclick access
(window as any).equiparObjeto = equiparObjeto;
(window as any).desequiparObjeto = desequiparObjeto;

// Aplicar estilo visual a ambos personajes (principal y miniatura)
function actualizarEstiloPersonaje() {
    const personajeImg = document.querySelector(".personaje") as HTMLElement | null;
    const miniaturaImg = document.getElementById("miniatura-personaje") as HTMLElement | null;

    if (!personajeImg || !miniaturaImg) return;

    // Eliminar cualquier clase anterior de estilo
    personajeImg.classList.remove(...personajeImg.classList);
    miniaturaImg.classList.remove(...miniaturaImg.classList);

    personajeImg.classList.add("personaje");
    miniaturaImg.classList.add("miniatura-personaje");

    const objetoEquipado = inventario.find(i => i.equipado && i.claseEstilo);

    if (objetoEquipado?.claseEstilo) {
        personajeImg.classList.add(objetoEquipado.claseEstilo);
        miniaturaImg.classList.add(objetoEquipado.claseEstilo);
    } else {
        personajeImg.classList.add("personaje-estilo-default");
        miniaturaImg.classList.add("personaje-estilo-default");
    }
}


// Devuelve el BONUS (no el total con multiplicación)
export function obtenerBonusPorTipo(tipo: EfectoTipo): number {
    const efecto = inventario.find(i => i.id === efectosActivos[tipo]);
    return efecto ? efecto.valor : 0;
}