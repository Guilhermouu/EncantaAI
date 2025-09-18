const db = require('../config/database');

const findByCpf = (cpf) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM funcionario WHERE cpf = ?';
        db.get(sql, [cpf], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

const create = (employeeData) => {
    return new Promise((resolve, reject) => {
        // MUDANÇA: Removidos email e telefone
        const { nome, cpf, hashedPassword, cargo } = employeeData;
        
        // MUDANÇA: Query SQL simplificada
        const sql = 'INSERT INTO funcionario (nome, cpf, senha, cargo, criado_em) VALUES (?, ?, ?, ?, datetime("now"))';
        
        const params = [nome, cpf, hashedPassword, cargo];
        
        db.run(sql, params, function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
};


const findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM funcionario WHERE email = ?';
        db.get(sql, [email], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};
// NOVA FUNÇÃO: para listar todos os funcionários
const findAll = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, nome, cargo FROM funcionario';
        db.all(sql, [], (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });
};

// NOVA FUNÇÃO: para buscar um funcionário por ID (sem a senha)
const findById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, nome, cpf, cargo FROM funcionario WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) return reject(err);
            resolve(row);
        });
    });
};

// NOVA FUNÇÃO: para atualizar um funcionário
const update = (id, employeeData) => {
    return new Promise((resolve, reject) => {
        const { nome, cpf, cargo, hashedPassword } = employeeData;
        
        // Monta a query dinamicamente para atualizar a senha apenas se ela for fornecida
        let sql = 'UPDATE funcionario SET nome = ?, cpf = ?, cargo = ?';
        const params = [nome, cpf, cargo];

        if (hashedPassword) {
            sql += ', senha = ?';
            params.push(hashedPassword);
        }

        sql += ' WHERE id = ?';
        params.push(id);

        db.run(sql, params, function(err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};

// NOVA FUNÇÃO: para remover um funcionário
const remove = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM funcionario WHERE id = ?';
        db.run(sql, [id], function(err) {
            if (err) return reject(err);
            resolve({ changes: this.changes });
        });
    });
};
module.exports = {
    findByCpf,
    create,
    findByEmail,
    findAll,
    findById,
    update,
    remove
};