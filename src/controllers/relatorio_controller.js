// Em: src/controllers/relatorio_controller.js
const RelatorioModel = require('../models/relatorio_model');

const getRelatorioVendas = async (req, res) => {
    try {
        const filter = {
            tipo: req.query.tipo || 'mais_vendidos',
            data: req.query.data || new Date().toISOString().split('T')[0]
        };
        const reportData = await RelatorioModel.getVendasReport(filter);
        res.status(200).json(reportData);
    } catch (error) {
        console.error("Erro ao gerar relatório de vendas:", error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = { getRelatorioVendas };