document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastro-form');
    if (!form) return;

    // --- Seleção de Elementos ---
    const nomeProduto = document.getElementById('nome-produto');
    const quantidade = document.getElementById('quantidade');
    const tamanho = document.getElementById('tamanho');
    const cor = document.getElementById('cor');
    const categoria = document.getElementById('categoria');
    const precoInput = document.getElementById('preco');
    const descricao = document.getElementById('descricao');
    const imagemJpgInput = document.getElementById('imagem-jpg');
    const imagemGblInput = document.getElementById('imagem-gbl');
    const cancelBtn = document.getElementById('cancel-btn');
    const fileInputDisplays = document.querySelectorAll('.file-input-display');

    // --- Configuração do Cleave.js para o Preço ---
    const cleavePreco = new Cleave(precoInput, {
        numeral: true,
        numeralDecimalMark: ',',
        delimiter: '.',
        numeralDecimalScale: 2,
        numeralPositiveOnly: true,
    });

    // --- Função para mostrar Pop-up (você pode usar sua implementação de modal aqui) ---
    function showMessage(message, isSuccess = false) {
        alert(message); // Usando alert simples por velocidade, troque pelo seu modal se preferir.
        if (isSuccess) {
            form.reset();
            fileInputDisplays.forEach(display => display.value = '');
            cleavePreco.setRawValue('');
        }
    }

    // --- Validações (seu código de validação, muito bom!) ---
    function validateForm() {
        if (!nomeProduto.value.trim() || !/^[a-zA-Z\s]{1,100}$/.test(nomeProduto.value.trim())) {
            showMessage("Erro: Nome do Produto deve conter apenas letras e espaços (até 100 caracteres).");
            return false;
        }
        if (parseInt(quantidade.value) <= 0) {
            showMessage("Erro: Quantidade em estoque deve ser um número inteiro positivo.");
            return false;
        }
        const precoValue = parseFloat(cleavePreco.getRawValue());
        if (isNaN(precoValue) || precoValue <= 0) {
            showMessage("Erro: Preço Unitário deve ser um número maior que 0.");
            return false;
        }
        if (!imagemJpgInput.files[0]) {
            showMessage("Erro: Imagem JPG é obrigatória.");
            return false;
        }
        // Adicione outras validações se necessário...
        return true;
    }

    // --- Evento Principal de Envio do Formulário ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 1. Valida os campos antes de enviar
        if (!validateForm()) {
            return;
        }

        // 2. Cria o FormData para enviar arquivos e textos
        const formData = new FormData();
        formData.append("nome", nomeProduto.value);
        formData.append("quantidade", quantidade.value);
        formData.append("tamanho", tamanho.value);
        formData.append("cor", cor.value);
        formData.append("categoria", categoria.value);
        formData.append("preco", cleavePreco.getRawValue()); // Envia o valor numérico puro
        formData.append("descricao", descricao.value);
        formData.append("foto", imagemJpgInput.files[0]); // Arquivo JPG

        // Adiciona o arquivo GBL apenas se ele foi selecionado
        if (imagemGblInput.files[0]) {
            formData.append("modelo_3d", imagemGblInput.files[0]);
        }

        // 3. Envia para o servidor com fetch
        try {
            const response = await fetch("http://localhost:3000/api/produto/administrador", {
                method: "POST",
                body: formData // Não precisa de 'headers', o FormData cuida disso
            });

            const data = await response.json();

            if (response.ok) {
                showMessage(`Produto cadastrado com sucesso!\nCódigo: ${data.codigo}`, true);
            } else {
                showMessage(data.message || "Erro ao cadastrar produto");
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            showMessage("Erro de conexão com o servidor.");
        }
    });

    // --- Eventos Auxiliares ---
    cancelBtn.addEventListener('click', () => { window.history.back(); });

    document.querySelectorAll('.btn-upload').forEach((button, index) => {
        button.addEventListener('click', () => {
            if(index === 0) imagemJpgInput.click();
            if(index === 1) imagemGblInput.click();
        });
    });

    imagemJpgInput.addEventListener('change', () => {
        fileInputDisplays[0].value = imagemJpgInput.files.length > 0 ? imagemJpgInput.files[0].name : '';
    });
    imagemGblInput.addEventListener('change', () => {
        fileInputDisplays[1].value = imagemGblInput.files.length > 0 ? imagemGblInput.files[0].name : '';
    });
});