document.addEventListener('DOMContentLoaded', () => {
    // ADICIONE ESTAS LINHAS DE VOLTA
    new Cleave('#cpf', {
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        numericOnly: true
    });

    const form = document.getElementById('form-funcionario');
    // ... resto do seu código JS ...
});
document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('form-funcionario');
    const cancelButton = document.querySelector('.btn-cancel');

    cancelButton.addEventListener('click', () => {
        window.history.back();
    });

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // MUDANÇA: Coleta de dados simplificada
        const nome = document.getElementById('nome').value;
        const cpf = document.getElementById('cpf').value;
        const senha = document.getElementById('senha').value;
        const confirmacaoSenha = document.getElementById('confirmacao-senha').value;
        const cargo = document.getElementById('perfil').value;

        // Validação de front-end
        const cpfNumeros = cpf.replace(/\D/g, ''); // Limpa o CPF para ter apenas números
        if (cpfNumeros.length !== 11) {
            Swal.fire({
                icon: 'error',
                title: 'CPF Inválido',
                text: 'O CPF deve conter exatamente 11 dígitos.',
            });
            return;
        }

        if (senha !== confirmacaoSenha) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'As senhas não coincidem. Por favor, verifique.',
            });
            return;
        }

        try {
            // MUDANÇA: Body do fetch simplificado
            const response = await fetch('/api/gestao-usuario', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, cpf: cpfNumeros, senha, cargo }) // Envia o CPF já limpo
            });

            const data = await response.json();

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Sucesso!',
                    text: 'Usuário cadastrado com sucesso!',
                }).then(() => {
                    form.reset();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro no Cadastro',
                    text: data.message || 'Não foi possível cadastrar o usuário.',
                });
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            Swal.fire({
                icon: 'error',
                title: 'Erro de Conexão',
                text: 'Não foi possível se conectar ao servidor.',
            });
        }
    });
});