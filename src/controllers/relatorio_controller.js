// Em: src/controllers/relatorio_controller.js
const RelatorioModel = require('../models/relatorio_model')

const getRelatorioVendas = async (req, res) => {
    try {
        // MUDANÇA: Agora lemos dataInicio e dataFim
        const filter = {
            tipo: req.query.tipo || 'mais_vendidos',
            dataInicio: req.query.dataInicio,
            dataFim: req.query.dataFim
        };

        // Validação simples para garantir que as datas foram enviadas
        if (!filter.dataInicio || !filter.dataFim) {
            return res.status(400).json({ message: 'Data de início e data de fim são obrigatórias.' });
        }

        const reportData = await RelatorioModel.getVendasReport(filter);
        res.status(200).json(reportData);
    } catch (error) {
        console.error("Erro ao gerar relatório de vendas:", error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = { getRelatorioVendas };  