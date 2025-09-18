// Em: js/gestao-cliente-vermais.js
document.addEventListener('DOMContentLoaded', async () => {
    // Pega o ID do cliente da URL (ex: ...?id=5)
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('id');

    if (!clienteId) {
        document.body.innerHTML = '<h1>Erro: ID do cliente não fornecido.</h1>';
        return;
    }

    try {
        const response = await fetch(`/api/clientes/${clienteId}`);
        const cliente = await response.json();

        if (!response.ok) {
            throw new Error(cliente.message);
        }

        // Preenche os campos do formulário com os dados recebidos da API
        document.querySelector('.user-name').textContent = cliente.nome;
        document.querySelector('.user-email').textContent = `Email: ${cliente.email}`;
        
        document.getElementById('cep').value = cliente.cep || '';
        document.getElementById('rua').value = cliente.rua || '';
        document.getElementById('bairro').value = cliente.bairro || '';
        document.getElementById('numero').value = cliente.numero || '';
        document.getElementById('cidade').value = cliente.cidade || '';
        document.getElementById('estado').value = cliente.estado || '';
        document.getElementById('complemento').value = cliente.complemento || '';
        document.getElementById('qtd').textContent = cliente.quantidade_pedidos;

    } catch (error) {
        console.error("Erro ao buscar detalhes do cliente:", error);
        document.querySelector('.wrapper').innerHTML = `<h1>Erro: ${error.message}</h1>`;
    }
});

function voltar() {
    window.history.back();
}