// Em: src/models/cliente_model.js
const db = require('../config/database');

// Função para encontrar todos os clientes (apenas o essencial para a lista)
const findAll = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, nome, email FROM cliente';
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// Função para encontrar um cliente específico por seu ID (com todos os detalhes)
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cliente WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

// Função para contar quantos pedidos um cliente já fez
const countPedidosByClienteId = (clienteId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(id) as total_pedidos FROM pedidos WHERE cliente_id = ?';
        db.get(sql, [clienteId], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

module.exports = {
    findAll,
    findById,
    countPedidosByClienteId,
};