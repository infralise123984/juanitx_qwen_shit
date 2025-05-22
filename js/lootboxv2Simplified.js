// variables
let inventario = personaje.inventario
let rarezasParaTirar = [];
let costoLootbox = 1000;
fetch('../loot.json')
    .then(res => res.json())
    .then(data => {
        rarezasParaTirar = data.loot.map(r => ({
            nombre: r.nombre,
            probabilidad: r.probabilidad,
            color: r.color,
            efectos: r.efectos
        }));
    });


function obtenerRarezaAleatoria(rarezas) {
    const totalProbabilidad = rarezas.reduce((sum, r) => sum + r.probabilidad, 0);
    const random = Math.random() * totalProbabilidad;

    let acumulado = 0;
    for (const rareza of rarezas) {
        acumulado += rareza.probabilidad;
        if (random <= acumulado) {
            return rareza;
        }
    }

    return rarezas[rarezas.length - 1];
}
function obtenerEfectoAleatorio(rareza) {
    const efectos = rareza.efectos;
    const indiceAleatorio = Math.floor(Math.random() * efectos.length);
    return efectos[indiceAleatorio];
}

function abrirLootbox() {
    const resultadoDiv = document.getElementById("resultado");

    // Verificar si tiene suficiente oro
    if (personaje.oro < costoLootbox) {
        resultadoDiv.innerHTML = `<span style="color:red">No tienes suficiente oro.</span>`;
        return;
    }

    // Restar oro
    personaje.oro -= costoLootbox;
    actualizarUI();

    // Seleccionar rareza basada en probabilidad
    const rareza = obtenerRarezaAleatoria(rarezasParaTirar); // Pasamos el array aquí
    const efecto = obtenerEfectoAleatorio(rareza);

    // Generar valor aleatorio entre min y max del efecto
    const valor = Math.floor(Math.random() * (efecto.max - efecto.min + 1)) + efecto.min;

    // Crear objeto obtenido
    let objeto = {
        id: Date.now(), // ID único
        nombre: `${rareza.nombre} ${efecto.tipo === "daño" ? "Gema de Daño" : efecto.tipo === "xp" ? "Esencia de XP" : "Monedas Mágicas"}`,
        tipo: efecto.tipo,
        valor: valor,
        rareza: rareza.nombre,
        color: rareza.color,
        equipado: false
    };

    // Añadir al inventario
    inventario.push(objeto);

    // Mostrar resultado
    resultadoDiv.innerHTML = `
        <span style="color:${objeto.color}">
            🎁 Obtuviste: <strong>${objeto.nombre}</strong> (+${objeto.valor} ${objeto.tipo.toUpperCase()})
        </span>
        <br>
        <small>(Rareza: ${objeto.rareza})</small>
    `;

    // Actualizar inventario en pantalla
    mostrarInventario();
}

function mostrarInventario() {
    const inventarioDiv = document.getElementById("inventario");
    inventarioDiv.innerHTML = "";

    if (inventario.length === 0) {
        inventarioDiv.innerHTML = "<em>Inventario vacío</em>";
        return;
    }

    inventario.forEach((item, index) => {
        // Usamos "rarezasParaTirar" en lugar de "RAREZA"
        const rareza = rarezasParaTirar.find(r => r.nombre === item.rareza);

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