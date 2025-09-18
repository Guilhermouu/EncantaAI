// Em: js/atualizar-usuario-adm.js
document.addEventListener('DOMContentLoaded', async () => {
    new Cleave('#cpf', { delimiters: ['.', '.', '-'], blocks: [3, 3, 3, 2], numericOnly: true });

    const form = document.getElementById('update-form');
    const nomeInput = document.getElementById('nome');
    const cpfInput = document.getElementById('cpf');
    const perfilSelect = document.getElementById('perfil');
    const senhaInput = document.getElementById('senha');
    const confirmacaoSenhaInput = document.getElementById('confirmacao-senha');

    // Pega o ID da URL
    const params = new URLSearchParams(window.location.search);
    const userId = params.get('id');

    if (!userId) {
        document.body.innerHTML = '<h1>Erro: ID do usuário não fornecido.</h1>';
        return;
    }

    // 1. Busca os dados atuais do usuário para preencher o formulário
    try {
        const response = await fetch(`/api/funcionarios/${userId}`);
        const user = await response.json();
        if (!response.ok) throw new Error(user.message);

        nomeInput.value = user.nome;
        cpfInput.value = user.cpf;
        perfilSelect.value = user.cargo;
    } catch (error) {
        Swal.fire('Erro!', `Não foi possível carregar os dados do usuário. ${error.message}`, 'error');
    }

    // 2. Adiciona o evento para enviar a atualização
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (senhaInput.value && senhaInput.value !== confirmacaoSenhaInput.value) {
            Swal.fire('Erro', 'As senhas não coincidem!', 'error');
            return;
        }

        const updatedData = {
            nome: nomeInput.value,
            cpf: cpfInput.value.replace(/\D/g, ''),
            cargo: perfilSelect.value
        };

        // Adiciona a senha ao corpo da requisição apenas se ela foi preenchida
        if (senhaInput.value) {
            updatedData.senha = senhaInput.value;
        }

        try {
            const response = await fetch(`/api/funcionarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);

            await Swal.fire('Sucesso!', 'Usuário atualizado com sucesso!', 'success');
            window.location.href = 'gestao-usuario-adm.html'; // Volta para a lista
        } catch (error) {
            Swal.fire('Erro!', `Não foi possível atualizar o usuário. ${error.message}`, 'error');
        }
    });
});

function voltar() { window.history.back(); }