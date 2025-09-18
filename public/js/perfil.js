// Em: public/js/perfil.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Proteger a página
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = '/login.html';
        return;
    }

    // 2. Preencher os dados do usuário
    const userEmail = localStorage.getItem('userName'); // Lembre-se que salvamos o email em 'userName'
    document.getElementById('user-email-display').textContent = userEmail;

    // 3. Lógica de Cancelar Conta
    const cancelLink = document.getElementById('cancel-account-link');
    cancelLink.addEventListener('click', async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: 'Deseja cancelar sua conta?',
            text: "Esta ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, cancelar!',
            cancelButtonText: 'Não'
        });

        if (result.isConfirmed) {
            const userId = localStorage.getItem('userId');
            try {
                const response = await fetch(`/api/clientes/${userId}`, { method: 'DELETE' });
                const data = await response.json();

                if (!response.ok) throw new Error(data.message);

                // Limpa os dados de login
                localStorage.clear();

                await Swal.fire('Cancelada!', 'Sua conta foi cancelada com sucesso.', 'success');
                window.location.href = '/index.html'; // Redireciona para a home

            } catch (error) {
                Swal.fire('Erro!', `Não foi possível cancelar a conta. ${error.message}`, 'error');
            }
        }
    });
});