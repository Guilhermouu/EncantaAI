// Em: js/gestao-cliente-adm.js
document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('cliente-list-container');
    
    try {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();

        if (clientes.length === 0) {
            container.innerHTML = '<p>Nenhum cliente cadastrado.</p>';
            return;
        }

        // Limpa o container antes de adicionar os novos cards
        container.innerHTML = ''; 

        clientes.forEach(cliente => {
            const card = document.createElement('div');
            card.className = 'cliente-card';
            card.innerHTML = `
                <div class="cliente-info">
                    <img src="/images/icone-perfil.png" alt="Ícone de perfil" class="cliente-icon">
                    <div class="cliente-text">
                        <p class="cliente-name">${cliente.nome}</p>
                        <p class="cliente-email">${cliente.email}</p>
                    </div>
                </div>
                <button class="btn btn-more">VER MAIS</button>
            `;
            
            // Adiciona o evento de clique ao botão para redirecionar com o ID correto
            card.querySelector('.btn-more').addEventListener('click', () => {
                window.location.href = `gestao-cliente-vermais.html?id=${cliente.id}`;
            });

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        container.innerHTML = '<p>Não foi possível carregar a lista de clientes.</p>';
    }
});

function voltar() {
    window.history.back();
}