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
module.exports = {
    findByCpf,
    create,
    findByEmail
};