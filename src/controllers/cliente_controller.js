// Em: src/controllers/cliente_controller.js
const ClienteModel = require('../models/cliente_model');

// Função para listar todos os clientes
const getAllClientes = async (req, res) => {
    try {
        const clientes = await ClienteModel.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar clientes.' });
    }
};

// Função para buscar os detalhes de um cliente
const getClienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await ClienteModel.findById(id);

        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado.' });
        }

        const pedidoInfo = await ClienteModel.countPedidosByClienteId(id);
        
        // Combina os dados do cliente com a contagem de pedidos
        const responseData = {
            ...cliente,
            quantidade_pedidos: pedidoInfo.total_pedidos || 0
        };

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar detalhes do cliente.' });
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
};