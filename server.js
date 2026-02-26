const express = require('express');
const mysql = require('mysql2');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Asd.123*',
    database: 'Gestion_Ventas_TallerSQL'
});

connection.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ', err);
        return;
    }
    console.log('Conexión a la base de datos establecida');
});

app.post('/pedidos', (req, res) => {
    const { cliente_nombre, cliente_email, fecha_pedido } = req.body;

    // 1. Buscar cliente por email
    const buscarCliente = "SELECT cliente_id FROM Cliente WHERE cliente_email = ?";

    connection.query(buscarCliente, [cliente_email], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length > 0) {
            // Cliente ya existe
            const clienteId = result[0].cliente_id;
            crearPedido(clienteId);
        } else {
            // 2. Crear cliente
            const crearCliente = `
                INSERT INTO Cliente (cliente_nombre, cliente_email)
                VALUES (?, ?)
            `;

            connection.query(crearCliente, [cliente_nombre, cliente_email], (err2, result2) => {
                if (err2) return res.status(500).json({ error: err2.message });

                const clienteId = result2.insertId;
                crearPedido(clienteId);
            });
        }

        // 3. Crear pedido
        function crearPedido(clienteId) {
            const sqlPedido = `
                INSERT INTO Pedido (fecha_pedido, cliente_id)
                VALUES (?, ?)
            `;

            connection.query(sqlPedido, [fecha_pedido, clienteId], (err3, result3) => {
                if (err3) return res.status(500).json({ error: err3.message });

                res.json({
                    message: "Pedido creado correctamente",
                    pedido_id: result3.insertId,
                    cliente_id: clienteId
                });
            });
        }
    });
});

app.get('/pedidos', (req, res) => {
    const sql = `
        SELECT p.pedido_id, p.fecha_pedido, c.cliente_nombre, c.cliente_email
        FROM Pedido p
        JOIN Cliente c ON p.cliente_id = c.cliente_id
    `;

    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.put('/pedidos/:id', (req, res) => {
    const pedidoId = req.params.id;
    const { cliente_nombre, cliente_email, fecha_pedido } = req.body;

    const sqlCliente = `
        UPDATE Cliente
        SET cliente_nombre=?, cliente_email=?
        WHERE cliente_id = (SELECT cliente_id FROM Pedido WHERE pedido_id=?)
    `;

    connection.query(sqlCliente, [cliente_nombre, cliente_email, pedidoId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const sqlPedido = `
            UPDATE Pedido SET fecha_pedido=? WHERE pedido_id=?
        `;

        connection.query(sqlPedido, [fecha_pedido, pedidoId], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });

            res.json({ message: "Pedido actualizado correctamente" });
        });
    });
});

app.delete('/pedidos/:id', (req, res) => {
    const pedidoId = req.params.id;

    connection.query("DELETE FROM Pedido WHERE pedido_id=?", [pedidoId], (err) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Pedido eliminado correctamente" });
    });
});

app.listen(3000, () => {
    console.log('Servidor escuchando en el puerto 3000');
});
