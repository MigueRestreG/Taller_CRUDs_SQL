// Este archivo define la estructura (esquema) de los Pedidos en MongoDB

const mongoose = require('mongoose');

// Definir el esquema (estructura) de Pedido
// Es como decirle a MongoDB: "Los pedidos deben tener estos campos"
const pedidoSchema = new mongoose.Schema({
    cliente_nombre: {
        type: String,
        required: true  // Este campo es obligatorio
    },
    cliente_email: {
        type: String,
        required: true
    },
    fecha_pedido: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now  // Guarda automáticamente la fecha de creación
    }
});

// Crear el modelo "Pedido"
// Este es el objeto que usaremos para interactuar con MongoDB
const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;
