document.addEventListener('DOMContentLoaded', () => {
    const filterType = document.getElementById('filter-type');
    const filterDate = document.getElementById('filter-date');
    const reportBody = document.getElementById('report-body');
    const totalVendasEl = document.getElementById('total-vendas');

    // Define a data de hoje como padrão no input de data
    filterDate.value = new Date().toISOString().split('T')[0];

    // Função para formatar valores em moeda BRL
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // Função principal que busca e renderiza o relatório
    async function fetchAndRenderReport() {
        const tipo = filterType.value;
        const data = filterDate.value;

        if (!data) {
            reportBody.innerHTML = '<tr><td colspan="5" class="text-center">Por favor, selecione uma data.</td></tr>';
            return;
        }

        try {
            // Monta a URL da API com os filtros
            const response = await fetch(`/api/relatorios/vendas?tipo=${tipo}&data=${data}`);
            if (!response.ok) throw new Error('Falha ao buscar dados do relatório');
            
            const reportData = await response.json();
            
            // Limpa a tabela
            reportBody.innerHTML = '';

            // Renderiza os produtos Top 3
            if (reportData.topProdutos && reportData.topProdutos.length > 0) {
                reportData.topProdutos.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="text-center">${index + 1}</td>
                        <td><img src="/api/produto/${item.id}/foto" alt="${item.nome}" class="w-12 h-12 object-cover mx-auto"></td>
                        <td>${item.nome}</td>
                        <td>${item.quantidade_total}</td>
                        <td>${formatCurrency(item.valor_total_produto)}</td>
                    `;
                    reportBody.appendChild(row);
                });
            } else {
                reportBody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma venda encontrada para esta data.</td></tr>';
            }

            // Atualiza o valor total das vendas
            totalVendasEl.textContent = formatCurrency(reportData.valorTotalGeral);

        } catch (error) {
            console.error(error);
            reportBody.innerHTML = `<tr><td colspan="5" class="text-center">Erro ao carregar o relatório.</td></tr>`;
            totalVendasEl.textContent = 'R$ 0,00';
        }
    }

    // Adiciona os eventos para os filtros
    filterType.addEventListener('change', fetchAndRenderReport);
    filterDate.addEventListener('change', fetchAndRenderReport);

    // Carrega o relatório inicial ao carregar a página
    fetchAndRenderReport();
});

function voltar() {
    window.history.back();
}