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
const employeeController= require('../controllers/employee_controller')

// ROTAS DE AUTENTICAÇÃO ===
router.post('/api/cadastro', authController.registerClient); 
router.post('/api/login', authController.loginClient);

// ROTAS DE CARRINHO ===
router.post('/api/produto', productController.getProductsByCategory);
// router.post('/api/produto/administrador', productController.upload.single("foto"))

// === ROTAS DE CARRINHO ===
router.get('/carrinho', cartController.viewCart);
// ...

// === ROTAS DE FUNCIONÁRIO ===
router.post('/api/cadastro-funcionario', employeeController.registerEmployee);
// ...

// Exporta o router para ser usado no server.js principal
module.exports = router;