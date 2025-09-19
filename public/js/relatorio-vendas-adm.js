document.addEventListener('DOMContentLoaded', () => {
    // MUDANÇA: Seleciona os dois campos de data
    const filterType = document.getElementById('filter-type');
    const filterDateStart = document.getElementById('filter-date-start');
    const filterDateEnd = document.getElementById('filter-date-end');
    
    const reportBody = document.getElementById('report-body');
    const totalVendasEl = document.getElementById('total-vendas');

    // Define um período padrão (ex: o último mês)
    const hoje = new Date();
    const umMesAtras = new Date();
    umMesAtras.setMonth(hoje.getMonth() - 1);
    
    filterDateEnd.value = hoje.toISOString().split('T')[0];
    filterDateStart.value = umMesAtras.toISOString().split('T')[0];

    function formatCurrency(value) {
        return (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    async function fetchAndRenderReport() {
        const tipo = filterType.value;
        const dataInicio = filterDateStart.value;
        const dataFim = filterDateEnd.value;

        if (!dataInicio || !dataFim) {
            reportBody.innerHTML = '<tr><td colspan="5" class="text-center">Por favor, selecione um período de datas.</td></tr>';
            return;
        }

        try {
            // MUDANÇA: A URL da API agora envia dataInicio e dataFim
            const response = await fetch(`/api/relatorios/vendas?tipo=${tipo}&dataInicio=${dataInicio}&dataFim=${dataFim}`);
            if (!response.ok) throw new Error('Falha ao buscar dados do relatório');
            
            const reportData = await response.json();
            
            reportBody.innerHTML = '';

            if (reportData.topProdutos && reportData.topProdutos.length > 0) {
                reportData.topProdutos.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="text-center">${index + 1}</td>
                        <td><img src="/api/produto/${item.id}/foto" alt="${item.nome}" style="width:50px; height:50px; object-fit:cover; border-radius:8px;"></td>
                        <td>${item.nome}</td>
                        <td>${item.quantidade_total}</td>
                        <td>${formatCurrency(item.valor_total_produto)}</td>
                    `;
                    reportBody.appendChild(row);
                });
            } else {
                reportBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma venda encontrada para este período.</td></tr>';
            }

            totalVendasEl.textContent = formatCurrency(reportData.valorTotalGeral);

        } catch (error) {
            console.error(error);
            reportBody.innerHTML = `<tr><td colspan="5" class="text-center">Erro ao carregar o relatório.</td></tr>`;
            totalVendasEl.textContent = 'R$ 0,00';
        }
    }

    // Adiciona os eventos para os filtros
    filterType.addEventListener('change', fetchAndRenderReport);
    filterDateStart.addEventListener('change', fetchAndRenderReport);
    filterDateEnd.addEventListener('change', fetchAndRenderReport);

    // Carrega o relatório inicial
    fetchAndRenderReport();
});

function voltar() {
    window.history.back();
}