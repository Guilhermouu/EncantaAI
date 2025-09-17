// Em: src/routes/index_routes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require("multer");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Importa a conexão do banco de dados já configurada
const db = require('../config/database');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Controladores
const authController = require('../controllers/auth_controllers')
const productController = require('../controllers/product_controller')
const cartController = require('../controllers/cart_controller')
const employeeController= require('../controllers/employee_controller');
const { create } = require('domain');

// ROTAS DE AUTENTICAÇÃO ===
router.post('/api/cadastro', authController.registerClient); 
router.post('/api/login', authController.loginClient);

// ROTAS DE CARRINHO ===
router.post('/api/produto', productController.getProductsByCategory);

// === ROTAS DE CARRINHO ===
router.get('/carrinho', cartController.viewCart);
// ...

// === ROTAS DE FUNCIONÁRIO ===
router.post('/api/cadastro-funcionario', employeeController.registerEmployee);
router.post('/api/login-cargo', employeeController.loginEmployee)
router.post('/api/gestao-usuario', employeeController.createUserByAdmin)



// === ROTAS DE PRODUTO ===
router.post(
    "/api/produto/administrador", 
    upload.fields([
        { name: 'foto', maxCount: 1 },
        { name: 'modelo_3d', maxCount: 1 }
    ]), 
    productController.createProduct
);

// ROTA PARA BUSCAR PRODUTOS POR NOME
router.get('/api/produtos/search', productController.searchProducts);

// ROTA PARA ATUALIZAR UM PRODUTO POR ID
router.put('/api/produtos/:id', productController.updateProduct);

// Exporta o router para ser usado no server.js principal
module.exports = router;