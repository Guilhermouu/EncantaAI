import { HeaderFuncoes } from "./header.js";
HeaderFuncoes()

// Em: public/js/main.js
function updateUserDisplay() {
    // ...
    const userDisplay = document.getElementById('user-session-display');

    if (isLoggedIn === 'true' && userName) {
        // MUDANÇA: Mostra o ícone de perfil que leva à página de perfil
        userDisplay.innerHTML = `
            <a href="/perfil.html" class="profile-icon-link" title="Acessar Perfil">
                <img src="/images/user_icon.png" alt="Ícone de Perfil">
            </a>
        `;
    } else {
        userDisplay.innerHTML = '<a href="/login.html">Login / Cadastro</a>';
    }
}

updateUserDisplay()