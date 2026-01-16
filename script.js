// Variavel global para armazenar os produtos depois de busca-los
let allProducts = [];

// WhatsApp da loja
const whatsappNumber = "5511955921042"; // Verifique se este número está correto e ativo no WhatsApp
const whatsappMessage = "Olá! Seja bem-vindo(a) à BATATA D'LAS! Gostaria de fazer um pedido para o seguinte produto: ";

// Função para gerar o link do WhatsApp
function generateWhatsappLink(productName, productPrice = '') {
    let message = whatsappMessage + productName;
    if (productPrice) {
        message += " - " + productPrice;
    }
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Elementos do DOM
const productsContainer = document.getElementById('products-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('productModal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.getElementById('modalContent');

// Elementos do DOM para o pop-up de horários
const hoursPopupOverlay = document.getElementById('hoursPopupOverlay');
const closeHoursPopup = document.querySelector('.close-hours-popup');

// Carregar produtos na pagina
function loadProducts(filter = 'all') {
    productsContainer.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? allProducts 
        : allProducts.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;
        
        // Criar estrelas para avaliação
        const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
        
        productCard.innerHTML = `
            ${product.isBestSeller ? '<div class="product-badge">🔥 MAIS VENDIDO</div>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <div class="product-meta">
                    <div class="rating" title="${product.rating} estrelas">${stars} ${product.rating}</div>
                    <a href="${generateWhatsappLink(product.name)}" 
                       target="_blank" class="whatsapp-btn">
                        <i class="fab fa-whatsapp"></i> PEDIR AGORA
                    </a>
                </div>
            </div>
        `;
        
        // Adicionar evento de clique para abrir modal
        productCard.addEventListener('click', (e) => {
            if (!e.target.closest('.whatsapp-btn')) {
                openProductModal(product);
            }
        });
        
        productsContainer.appendChild(productCard);
    });
}

// Abrir modal com detalhes do produto
function openProductModal(product) {
    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="modal-image">
        <h2 style="margin-bottom: 10px; color: var(--vermelho-primario);">${product.name}</h2>
        <p style="margin-bottom: 15px; color: var(--cinza-escuro); font-size: 1.1rem;">${product.description}</p>
        <div style="font-size: 2rem; font-weight: 900; color: var(--vermelho-primario); margin-bottom: 20px; text-shadow: 1px 1px 3px rgba(0,0,0,0.1);">${product.price}</div>
        
        <div class="modal-details">
            <div style="background-color: #FFF8E1; padding: 15px; border-radius: 10px; border-left: 5px solid var(--amarelo-primario);">
                <h3 style="margin-bottom: 10px; color: var(--vermelho-primario);">INFORMAÇÕES</h3>
                <p><strong style="color: var(--vermelho-primario);">Tamanho:</strong> ${product.details.tamanho}</p>
                <p><strong style="color: var(--vermelho-primario);">Tempo de Preparo:</strong> ${product.details.tempoPreparo}</p>
                <p><strong style="color: var(--vermelho-primario);">Calorias:</strong> ${product.details.calorias}</p>
            </div>
            <div style="background-color: #FFEBEE; padding: 15px; border-radius: 10px; border-left: 5px solid var(--vermelho-primario);">
                <h3 style="margin-bottom: 10px; color: var(--vermelho-primario);">INGREDIENTES</h3>
                <p>${product.details.ingredientes}</p>
            </div>
        </div>
        
        <div style="margin-top: 25px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 15px;">
            <div>
                <div class="rating" style="font-size: 1.3rem; color: var(--amarelo-secundario);">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))} <strong style="color: var(--vermelho-primario);">${product.rating}/5.0</strong></div>
                ${product.isBestSeller ? '<span style="background: linear-gradient(to right, var(--vermelho-primario), var(--laranja-energetico)); color: var(--amarelo-primario); padding: 8px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 900; margin-left: 10px; text-transform: uppercase;">🔥 Mais Vendido</span>' : ''}
            </div>
            <a href="${generateWhatsappLink(product.name, product.price)}" 
               target="_blank" class="whatsapp-btn" style="font-size: 1.1rem; padding: 15px 25px;">
                <i class="fab fa-whatsapp"></i> PEDIR PELO WHATSAPP
            </a>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// Filtros de produtos
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        // Filtrar produtos
        loadProducts(button.dataset.filter);
    });
});

// Fechar modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Lógica para o pop-up de horários
closeHoursPopup.addEventListener('click', () => {
    hoursPopupOverlay.style.display = 'none';
});

hoursPopupOverlay.addEventListener('click', (e) => {
    if (e.target === hoursPopupOverlay) {
        hoursPopupOverlay.style.display = 'none';
    }
});


// Inicializar a pagina
document.addEventListener('DOMContentLoaded', async () => {
    // Buscar os produtos do arquivo JSON
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        allProducts = await response.json();
        loadProducts(); // Carregar todos os produtos inicialmente
    } catch (error) {
        console.error("Nao foi possivel carregar os produtos:", error);
        productsContainer.innerHTML = "<p>Nao foi possivel carregar o cardapio. Tente novamente mais tarde.</p>";
    }
    
    // Exibir o pop-up de horários ao carregar a página
    hoursPopupOverlay.style.display = 'flex';

    // Suavizar rolagem para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});