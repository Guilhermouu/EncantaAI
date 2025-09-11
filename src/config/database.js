// Em: src/config/database.js

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// O '..' volta um nível da pasta 'src' para encontrar o arquivo .db na raiz
const dbPath = path.resolve(__dirname, '..', '..', 'EncantaAi.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conexão com o banco de dados SQLite estabelecida com sucesso.');
    }
});

module.exports = db;