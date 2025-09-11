// Em: src/controllers/product_controller.js

const ProductModel = require('../models/product_model');

const getProductsByCategory = async (req, res) => {
    try {
        const { categoria } = req.query;
        if (!categoria) {
            return res.status(400).json({ erro: 'Categoria não especificada' });
        }
        const products = await ProductModel.findByCategory(categoria);
        res.json(products);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar produtos' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
};

const getProductPhoto = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductModel.findPhotoById(id);
        if (!result || !result.foto) {
            return res.status(404).send('Imagem não encontrada');
        }
        res.set('Content-Type', 'image/jpeg');
        res.send(result.foto);
    } catch (error) {
        res.status(500).send('Erro ao buscar imagem');
    }
};

const getProductColors = async (req, res) => {
    try {
        const { nome } = req.params;
        const colors = await ProductModel.findColorsByName(nome);
        res.json(colors);
    } catch (error) {
        console.error('Erro ao buscar variações de cores:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar variações de cores' });
    }
};

const createProduct = async (req, res) => {
    try {
        const { nome, quantidade, tamanho, cor, categoria, preco, descricao } = req.body;
        if (!nome || !quantidade || !tamanho || !cor || !categoria || !preco || !descricao || !req.file) {
            return res.status(400).json({ message: "Todos os campos obrigatórios devem ser preenchidos." });
        }
        
        const productData = {
            ...req.body,
            foto: req.file.buffer,
            codigo: "PRD-" + Date.now()
        };

        const newProduct = await ProductModel.create(productData);
        res.status(201).json({ message: "Produto cadastrado com sucesso!", produtoId: newProduct.id, codigo: newProduct.codigo });
    } catch (error) {
        console.error("Erro ao cadastrar produto:", error.message);
        res.status(500).json({ message: "Erro ao cadastrar produto." });
    }
};

module.exports = {
    getProductsByCategory,
    getProductById,
    getProductPhoto,
    getProductColors,
    createProduct,
};