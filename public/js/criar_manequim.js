    document.addEventListener("DOMContentLoaded", () => {
      // Pega o ID do usuário logado
      const userId = localStorage.getItem("userId");
      const erroEl = document.getElementById("erro");

      if (!userId) {
        erroEl.innerText = "Erro: Usuário não logado. Volte para a página inicial e faça login novamente.";
        document.getElementById("salvarBtn").disabled = true;
        return;
      }

      document.getElementById("salvarBtn").addEventListener("click", () => {
        const urlManequim = document.getElementById("urlManequim").value.trim();

        if (!urlManequim) {
          alert("Cole a URL do manequim!");
          return;
        }

        // Salva no localStorage vinculado ao ID do usuário
        localStorage.setItem(`manequim_${userId}`, urlManequim);

        // Atualiza o widget se ele estiver aberto
        const widget = document.getElementById("manequim");
        if (widget) {
          widget.innerHTML = `
            <model-viewer src="${urlManequim}" camera-controls auto-rotate shadow-intensity="1" background-color="#FFFFFF" class="enc-main-image"></model-viewer>
          `;
        }

        alert("Manequim salvo com sucesso!");
        window.location.href = "index.html"; // Redireciona para a loja
      });
    });