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

const deleteCliente = async (req, res) => {
    try {
        // ATENÇÃO: Em um projeto real, aqui haveria uma validação de token
        // para garantir que o usuário só pode deletar a si mesmo.
        const { id } = req.params;
        const result = await ClienteModel.remove(id);
        if (result.changes === 0) return res.status(404).json({ message: 'Cliente não encontrado.' });
        res.status(200).json({ message: 'Conta cancelada com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao cancelar a conta.' });
    }
};

const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, cpf, cep, rua, numero, bairro, cidade, estado, complemento } = req.body;
        
        let hashedPassword = null;
        // Se uma nova senha foi enviada, criptografa-a
        if (senha) {
            hashedPassword = await bcrypt.hash(senha, 10);
        }

        const clienteData = { nome, email, hashedPassword, cpf, cep, rua, numero, bairro, cidade, estado, complemento };
        
        const result = await ClienteModel.update(id, clienteData);

        if (result.changes === 0) {
            return res.status(404).json({ message: 'Cliente não encontrado para atualização.' });
        }
        res.status(200).json({ message: 'Informações atualizadas com sucesso!' });
    } catch (error) {
        console.error("Erro ao atualizar cliente:", error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    getAllClientes,
    getClienteById,
    deleteCliente,
    updateCliente
};