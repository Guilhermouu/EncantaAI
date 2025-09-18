// Em: js/gestao-usuario-adm.js
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
});

async function loadUsers() {
    const container = document.getElementById('user-list-container');
    container.innerHTML = ''; // Limpa a lista

    try {
        const response = await fetch('/api/funcionarios');
        const users = await response.json();

        if (users.length === 0) {
            container.innerHTML = '<p>Nenhum usuário cadastrado.</p>';
            return;
        }

        users.forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.innerHTML = `
                <div class="user-info">
                    <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="Ícone de perfil" class="user-icon">
                    <div class="user-text">
                        <p class="user-name">${user.nome}</p>
                        <p class="user-profile">Perfil: ${user.cargo}</p>
                    </div>
                </div>
                <a href="#" class="excluir" data-id="${user.id}">Excluir</a>
                <button class="btn btn-update" data-id="${user.id}">ATUALIZAR</button>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar usuários.</p>';
    }
}

// Delegação de eventos para os botões de Ação
document.getElementById('user-list-container').addEventListener('click', async (e) => {
    const target = e.target;
    const userId = target.dataset.id;

    // Ação de ATUALIZAR
    if (target.classList.contains('btn-update')) {
        window.location.href = `atualizar-usuario-adm.html?id=${userId}`;
    }

    // Ação de EXCLUIR
    if (target.classList.contains('excluir')) {
        e.preventDefault();
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter esta ação!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`/api/funcionarios/${userId}`, { method: 'DELETE' });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message);
                
                Swal.fire('Excluído!', 'O usuário foi excluído com sucesso.', 'success');
                loadUsers(); // Recarrega a lista de usuários
            } catch (error) {
                Swal.fire('Erro!', `Não foi possível excluir o usuário. ${error.message}`, 'error');
            }
        }
    }
});

function voltar() { window.history.back(); }