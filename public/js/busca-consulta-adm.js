const productNameInput = document.getElementById('product-name');
 
productNameInput.addEventListener('input', function() {
    let cleanValue = this.value.replace(/[^A-Za-zÀ-ÿ ]/g, '');
    if (cleanValue.length > 20) {
        cleanValue = cleanValue.substring(0, 20);
    }
    this.value = cleanValue;
});
 
function voltar(){
    window.history.back()
}  

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('product-name-search');
    const updateForm = document.getElementById('update-form');
    const searchResultsContainer = document.getElementById('search-results');

    // Mapeamento dos campos do formulário de atualização
    const fields = {
        id: document.getElementById('product-id'),
        image: document.getElementById('product-image'),
        name: document.getElementById('product-name'),
        quantity: document.getElementById('product-quantity'),
        size: document.getElementById('product-size'),
        color: document.getElementById('product-color'),
        price: document.getElementById('product-price'),
        category: document.getElementById('product-category'),
        description: document.getElementById('product-description'),
    };

    // --- LÓGICA DE BUSCA ---
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        try {
            const response = await fetch(`/api/produtos/search?nome=${encodeURIComponent(searchTerm)}`);
            const products = await response.json();

            updateForm.classList.add('hidden'); // Esconde o formulário de update
            searchResultsContainer.innerHTML = ''; // Limpa resultados anteriores

            if (products.length === 0) {
                searchResultsContainer.innerHTML = '<p>Nenhum produto encontrado.</p>';
            } else if (products.length === 1) {
                // Se encontrou só um, já preenche o formulário
                populateUpdateForm(products[0]);
            } else {
                // Se encontrou vários, mostra uma lista para o usuário escolher
                displaySearchResults(products);
            }
        } catch (error) {
            console.error('Erro na busca:', error);
            Swal.fire('Erro', 'Não foi possível realizar a busca.', 'error');
        }
    });
    
    // --- LÓGICA PARA EXIBIR MÚLTIPLOS RESULTADOS ---
    function displaySearchResults(products) {
        const list = document.createElement('ul');
        list.className = 'search-results-list';
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.nome} (ID: ${product.id})`;
            listItem.addEventListener('click', () => {
                populateUpdateForm(product);
                searchResultsContainer.innerHTML = ''; // Limpa a lista após a seleção
            });
            list.appendChild(listItem);
        });
        searchResultsContainer.appendChild(list);
    }


    // --- LÓGICA PARA PREENCHER O FORMULÁRIO DE ATUALIZAÇÃO ---
    function populateUpdateForm(product) {
        fields.id.value = product.id;
        fields.name.value = product.nome;
        fields.quantity.value = product.quantidade;
        fields.size.value = product.tamanho;
        fields.color.value = product.cor;
        fields.price.value = product.preco;
        fields.category.value = product.categoria;
        fields.description.value = product.descricao;
        fields.image.src = `/api/produto/${product.id}/foto`; // Busca a imagem do produto

        updateForm.classList.remove('hidden'); // Mostra o formulário
    }

    // --- LÓGICA DE ATUALIZAÇÃO ---
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productId = fields.id.value;
        if (!productId) return;

        const updatedData = {
            nome: fields.name.value,
            quantidade: fields.quantity.value,
            tamanho: fields.size.value,
            cor: fields.color.value,
            categoria: fields.category.value,
            preco: fields.price.value,
            descricao: fields.description.value,
        };

        try {
            const response = await fetch(`/api/produtos/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            const result = await response.json();

            if (response.ok) {
                Swal.fire('Sucesso!', result.message, 'success');
                updateForm.classList.add('hidden'); // Esconde o formulário após o sucesso
            } else {
                Swal.fire('Erro', result.message, 'error');
            }
        } catch (error) {
            console.error('Erro na atualização:', error);
            Swal.fire('Erro', 'Não foi possível conectar ao servidor para atualizar.', 'error');
        }
    });
});