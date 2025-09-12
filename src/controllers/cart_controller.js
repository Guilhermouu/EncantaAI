const CartModel = require('../models/cart_model');
const ProductModel = require('../models/product_model'); // O controller precisa verificar se o produto existe

const viewCart = async (req, res) => {
    try {
        const items = await CartModel.findAll();
        res.json(items);
    } catch (error) {
        console.error('Erro ao listar carrinho:', error.message);
        res.status(500).json({ erro: 'Erro ao listar carrinho' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await ProductModel.findById(id);
        if (!product) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        const cartItem = await CartModel.findByProductId(id);
        if (cartItem) {
            const newQuantity = cartItem.quantidade + 1;
            await CartModel.updateQuantity(cartItem.id, newQuantity);
            res.json({ mensagem: `Quantidade atualizada para ${newQuantity}` });
        } else {
            await CartModel.add(id);
            res.json({ mensagem: 'Produto adicionado ao carrinho' });
        }
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error.message);
        res.status(500).json({ erro: 'Erro ao adicionar ao carrinho' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await CartModel.remove(id);
        if (result.changes === 0) {
            return res.status(404).json({ erro: 'Item do carrinho não encontrado' });
        }
        res.json({ mensagem: 'Item removido do carrinho com sucesso' });
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error.message);
        res.status(500).json({ erro: 'Erro ao remover item do carrinho' });
    }
};

module.exports = {
    viewCart,
    addToCart,
    removeFromCart,
};