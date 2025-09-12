const db = require('../config/database');

const findAll = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT c.id as carrinho_id, p.id, p.nome, p.preco, p.foto, c.quantidade
            FROM carrinho c JOIN produto p ON c.produto_id = p.id
        `;
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const findByProductId = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM carrinho WHERE produto_id = ?';
        db.get(sql, [productId], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const add = (productId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO carrinho (produto_id, quantidade) VALUES (?, 1)';
        db.run(sql, [productId], function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
};

const updateQuantity = (cartId, newQuantity) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE carrinho SET quantidade = ? WHERE id = ?';
        db.run(sql, [newQuantity, cartId], function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
};

const remove = (cartId) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM carrinho WHERE id = ?';
        db.run(sql, [cartId], function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
};

module.exports = {
    findAll,
    findByProductId,
    add,
    updateQuantity,
    remove,
};