// Em: src/models/relatorio_model.js
const db = require('../config/database');

const getVendasReport = (filter) => {
    return new Promise((resolve, reject) => {
        const orderBy = filter.tipo === 'menos_vendidos' ? 'ASC' : 'DESC';
        const params = [filter.data];

        const topProdutosQuery = `
            SELECT
                p.id, p.nome,
                SUM(pi.quantidade) as quantidade_total,
                SUM(pi.quantidade * pi.preco_unitario) as valor_total_produto
            FROM pedido_itens pi
            JOIN produto p ON pi.produto_id = p.id
            JOIN pedidos ped ON pi.pedido_id = ped.id
            WHERE DATE(ped.data_pedido) = ?
            GROUP BY pi.produto_id
            ORDER BY quantidade_total ${orderBy}
            LIMIT 3;
        `;

        const valorTotalQuery = `
            SELECT SUM(valor_total) as valor_total_geral
            FROM pedidos
            WHERE DATE(data_pedido) = ?;
        `;

        Promise.all([
            new Promise((res, rej) => db.all(topProdutosQuery, params, (err, rows) => err ? rej(err) : res(rows))),
            new Promise((res, rej) => db.get(valorTotalQuery, params, (err, row) => err ? rej(err) : res(row)))
        ]).then(([topProdutos, totalGeral]) => {
            resolve({
                topProdutos,
                valorTotalGeral: totalGeral?.valor_total_geral || 0
            });
        }).catch(reject);
    });
};

module.exports = { getVendasReport };