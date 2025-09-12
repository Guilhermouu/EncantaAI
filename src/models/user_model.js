const db = require('../config/database');

const findByCpf = (cpf) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cliente WHERE cpf = ?';
        db.get(sql, [cpf], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM cliente WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

// Nova função para salvar o token de reset
const saveResetToken = (userId, token, expiresAt) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)";
        // Usamos toISOString() para um formato de data compatível com SQLite
        db.run(sql, [userId, token, expiresAt.toISOString()], function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
};

// Nova função para encontrar um token válido
const findUserByValidToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM reset_tokens WHERE token = ? AND expires_at > datetime('now')";
        db.get(sql, [token], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

// Nova função para atualizar a senha do cliente
const updatePassword = (userId, hashedPassword) => {
    return new Promise((resolve, reject) => {
        // CORREÇÃO: O código original atualizava a tabela 'funcionario', o correto para o fluxo do cliente é a tabela 'cliente'.
        const sql = "UPDATE cliente SET senha = ? WHERE id = ?";
        db.run(sql, [hashedPassword, userId], function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
};

// Nova função para deletar o token após o uso
const deleteToken = (token) => {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM reset_tokens WHERE token = ?";
        db.run(sql, [token], function(err) {
            if (err) return reject(err);
            resolve(this);
        });
    });
};

const create = (userData) => {
    return new Promise((resolve, reject) => {
        const { nome, cpf, email, hashedPassword, cep, rua, numero, bairro, cidade, estado, complemento } = userData;
        
        const sql = `
            INSERT INTO cliente (nome, cpf, email, senha, cep, rua, numero, bairro, cidade, estado, complemento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const params = [nome, cpf, email, hashedPassword, cep, rua, numero, bairro, cidade, estado, complemento];
        
        db.run(sql, params, function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
};

module.exports = {
    findByEmail,
    create,
    saveResetToken,
    findUserByValidToken,
    updatePassword,
    deleteToken,
    findByCpf,
    create
};