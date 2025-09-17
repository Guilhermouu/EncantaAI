

document.getElementById('formulario-login').addEventListener('submit', async function(e) {
    e.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;

    const response = await fetch('http://localhost:3000/api/login-cargo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, senha })
    });

    const data = await response.json();

    if (response.ok) {
        if ( data.cargo === 'ADMINISTRADOR') {
            window.location.href = 'painel-administrador.html';
            alert('Login bem-sucedido! Redirecionando para a tela de administrador.');
        } else if (data.cargo === 'FUNCIONÁRIO') {
            window.location.href = 'painel-funcionario.html';
        } else {
            alert('Cargo não reconhecido!');
            messageDiv.textContent = data.message || 'Email ou senha incorretos';
            messageDiv.className = 'mensagem erro';
        }
    } else {
        alert(data.message || 'Erro no login');
        messageDiv.textContent = data.message || 'Email ou senha incorretos'; // Linha onde o erro ocorreu
        messageDiv.className = 'mensagem erro';
    }
});