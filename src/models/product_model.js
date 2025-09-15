const db = require('../config/database');
// Encontrar pela categoria
const findByCategory = (category) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM produto WHERE categoria = ?';
        db.all(sql, [category], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};
// Encontrar o produto pelo ID
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM produto WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};
// Encontrar a foto pelo ID
const findPhotoById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT foto FROM produto WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};
// Encontrar os produtos pelo ID, cor, nome
const findColorsByName = (name) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, nome, cor FROM produto WHERE nome = ?';
        db.all(sql, [name], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

const create = (productData) => {
    return new Promise((resolve, reject) => {
        // Agora inclui o modelo_3d
        const { nome, quantidade, tamanho, cor, categoria, preco, descricao, foto, modelo_3d, codigo } = productData;
        
        const sql = 'INSERT INTO produto (nome, quantidade, tamanho, cor, categoria, preco, descricao, foto, modelo_3d, codigo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        // Adiciona o novo parâmetro
        const params = [nome, quantidade, tamanho, cor, categoria, preco, descricao, foto, modelo_3d, codigo];

        db.run(sql, params, function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID, codigo });
        });
    });
};
module.exports = {
    findByCategory,
    findById,
    findPhotoById,
    findColorsByName,
    create,
};