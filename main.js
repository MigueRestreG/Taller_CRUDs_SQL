let pedidoEditandoId = null; // null = creando, número = editando

// Crear / Actualizar pedido
document.getElementById("pedidoForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        cliente_nombre: document.getElementById("cliente_nombre").value,
        cliente_email: document.getElementById("cliente_email").value,
        fecha_pedido: document.getElementById("fecha_pedido").value
    };

    let url = "/pedidos";
    let method = "POST";

    if (pedidoEditandoId) {
        url = "/pedidos/" + pedidoEditandoId;
        method = "PUT";
    }

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    alert(json.message);

    pedidoEditandoId = null;
    document.getElementById("pedidoForm").reset();
});

// Cargar pedidos
document.getElementById("btnCargar").addEventListener("click", async () => {
    const res = await fetch("/pedidos");
    const pedidos = await res.json();

    const tabla = document.getElementById("tablaPedidos");
    tabla.innerHTML = "";

    pedidos.forEach(p => {
        tabla.innerHTML += `
            <tr>
                <td>${p.pedido_id}</td>
                <td>${p.fecha_pedido}</td>
                <td>${p.cliente_nombre}</td>
                <td>${p.cliente_email}</td>
                <td>
                    <button onclick="editarPedido(${p.pedido_id}, '${p.cliente_nombre}', '${p.cliente_email}', '${p.fecha_pedido}')">Editar</button>
                    <button onclick="eliminarPedido(${p.pedido_id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
});

// Editar pedido: llena el formulario
function editarPedido(id, nombre, email, fecha) {
    pedidoEditandoId = id;
    document.getElementById("cliente_nombre").value = nombre;
    document.getElementById("cliente_email").value = email;
    document.getElementById("fecha_pedido").value = fecha;
}

// Eliminar pedido
async function eliminarPedido(id) {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

    const res = await fetch("/pedidos/" + id, { method: "DELETE" });
    const json = await res.json();
    alert(json.message);
}

// ==================== MONGODB CRUD ====================
// Variables para MongoDB
let pedidoEditandoIdMongo = null; // null = creando, ID = editando

// CREATE/UPDATE: Crear o actualizar pedido en MongoDB
document.getElementById("pedidoFormMongo").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
        cliente_nombre: document.getElementById("cliente_nombre_mongo").value,
        cliente_email: document.getElementById("cliente_email_mongo").value,
        fecha_pedido: document.getElementById("fecha_pedido_mongo").value
    };

    let url = "/mongo/pedidos";
    let method = "POST";

    // Si estamos editando, cambiar a PUT
    if (pedidoEditandoIdMongo) {
        url = "/mongo/pedidos/" + pedidoEditandoIdMongo;
        method = "PUT";
    }

    const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const json = await res.json();
    alert(json.message);

    // Limpiar variables y formulario
    pedidoEditandoIdMongo = null;
    document.getElementById("pedidoFormMongo").reset();
});

// READ: Cargar todos los pedidos de MongoDB
document.getElementById("btnCargarMongo").addEventListener("click", async () => {
    const res = await fetch("/mongo/pedidos");
    const pedidos = await res.json();

    const tabla = document.getElementById("tablaPedidosMongo");
    tabla.innerHTML = "";

    pedidos.forEach(p => {
        // Formatear la fecha
        const fecha = new Date(p.fecha_pedido).toISOString().split('T')[0];
        
        tabla.innerHTML += `
            <tr>
                <td>${p._id}</td>
                <td>${fecha}</td>
                <td>${p.cliente_nombre}</td>
                <td>${p.cliente_email}</td>
                <td>
                    <button onclick="editarPedidoMongo('${p._id}', '${p.cliente_nombre}', '${p.cliente_email}', '${fecha}')">Editar</button>
                    <button onclick="eliminarPedidoMongo('${p._id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });
});

// UPDATE: Llenar formulario para editar
function editarPedidoMongo(id, nombre, email, fecha) {
    pedidoEditandoIdMongo = id;
    document.getElementById("cliente_nombre_mongo").value = nombre;
    document.getElementById("cliente_email_mongo").value = email;
    document.getElementById("fecha_pedido_mongo").value = fecha;
}

// DELETE: Eliminar pedido de MongoDB
async function eliminarPedidoMongo(id) {
    if (!confirm("¿Seguro que deseas eliminar este pedido?")) return;

    const res = await fetch("/mongo/pedidos/" + id, { method: "DELETE" });
    const json = await res.json();
    alert(json.message);
}
