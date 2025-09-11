// Em: server.js (na raiz do projeto)

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Importa o nosso arquivo de rotas
const mainRoutes = require('./src/routes/index_routes');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve os arquivos estáticos da pasta public

// O Express vai usar as rotas definidas no nosso arquivo importado
app.use('/', mainRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Aplicação rodando em: http://localhost:${PORT}/home.html`);
});