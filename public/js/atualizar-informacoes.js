// Em: public/js/atualizar-informacoes.js
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Proteger a página e buscar ID
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userId = localStorage.getItem('userId');

    if (isLoggedIn !== 'true' || !userId) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = '/login.html';
        return;
    }

    // 2. Selecionar todos os campos do formulário
    const form = document.getElementById('update-form');
    const fields = {
        nome: document.getElementById('nome'), email: document.getElementById('email'),
        cpf: document.getElementById('cpf'), cep: document.getElementById('cep'),
        rua: document.getElementById('rua'), bairro: document.getElementById('bairro'),
        numero: document.getElementById('numero'), cidade: document.getElementById('cidade'),
        estado: document.getElementById('estado'), complemento: document.getElementById('complemento'),
        senha: document.getElementById('senha'), confirmarSenha: document.getElementById('confirmar-senha')
    };

    // Aplicar máscaras
    new Cleave(fields.cpf, { delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true });
    new Cleave(fields.cep, { delimiters: ['-'], blocks: [5, 3], numericOnly: true });

    // 3. Lógica ViaCEP
    fields.cep.addEventListener('blur', async () => {
        const cep = fields.cep.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();
            if (!data.erro) {
                fields.rua.value = data.logradouro; fields.bairro.value = data.bairro;
                fields.cidade.value = data.localidade; fields.estado.value = data.uf;
            }
        } catch (error) { console.error('Erro ao buscar CEP:', error); }
    });

    // 4. Buscar dados atuais e preencher o formulário
    try {
        const response = await fetch(`/api/clientes/${userId}`);
        const cliente = await response.json();
        if (!response.ok) throw new Error(cliente.message);

        for (const key in fields) {
            if (cliente[key] && fields[key].type !== 'password') {
                fields[key].value = cliente[key];
            }
        }
    } catch (error) {
        Swal.fire('Erro!', `Não foi possível carregar seus dados. ${error.message}`, 'error');
    }

    // 5. Lógica de envio do formulário
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (fields.senha.value && fields.senha.value !== fields.confirmarSenha.value) {
            Swal.fire('Erro', 'As novas senhas não coincidem!', 'error');
            return;
        }

        const updatedData = {};
        for (const key in fields) {
            // Inclui a senha apenas se ela foi preenchida
            if (fields[key].type !== 'password' || (key === 'senha' && fields[key].value)) {
                 updatedData[key] = fields[key].value;
            }
        }

        try {
            const response = await fetch(`/api/clientes/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            Swal.fire('Sucesso!', 'Suas informações foram atualizadas!', 'success');
        } catch (error) {
            Swal.fire('Erro!', `Não foi possível atualizar suas informações. ${error.message}`, 'error');
        }
    });
});