// Em: src/models/employee_model.js

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
        const { nome, cpf, email, hashedPassword, telefone, cargo } = employeeData;
        const sql = 'INSERT INTO funcionario (nome, cpf, email, senha, telefone, cargo, criado_em) VALUES (?, ?, ?, ?, ?, ?, datetime("now"))';
        db.run(sql, [nome, cpf, email, hashedPassword, telefone, cargo], function(err) {
            if (err) return reject(err);
            resolve({ id: this.lastID });
        });
    });
};

module.exports = {
    findByCpf,
    create,
};