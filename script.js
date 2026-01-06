/* ============================================
   FLOR DE CHOCOLATE - JAVASCRIPT
   Sistema de gerenciamento de produtos
   Integração com WhatsApp para pedidos
   Animações ao rolar a página
   Mensagem de boas-vindas
   ============================================ */

// ============================================
// ARRAY DE PRODUTOS
// Contém todos os produtos disponíveis na doceria
// Cada produto possui: nome, descricao, preco e imagem
// ============================================
const produtos = [
    {
        nome: "Brigadeiro Dourado",
        descricao: "O clássico brasileiro elevado à perfeição! Feito com chocolate belga premium e leite condensado selecionado, enrolado à mão com muito carinho. Coberto com granulados dourados que brilham como pequenas joias. Cada mordida é uma explosão de sabor que derrete na boca e aquece o coração.",
        preco: 3.50,
        imagem: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Brownie do Céu",
        descricao: "Uma tentação irresistível de chocolate! Macio e cremoso por dentro, com uma crosta crocante e dourada por fora. Feito com chocolate belga premium e muito amor. Cada pedaço é uma experiência única que você não vai conseguir esquecer.",
        preco: 9.00,
        imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Cupcake Surpresa",
        descricao: "Pequenos bolos recheados com surpresas deliciosas! Massa fofinha, recheio cremoso e cobertura especial. Cada cupcake é uma obra de arte doce, perfeita para celebrar momentos especiais ou simplesmente se mimar.",
        preco: 7.50,
        imagem: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Bolo da Vovó",
        descricao: "O sabor caseiro que aquece a alma! Feito com receita tradicional e ingredientes selecionados. Macio, fofinho e cheio de carinho. Perfeito para aniversários, comemorações ou qualquer momento que mereça ser celebrado com doçura.",
        preco: 75.00,
        imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Trufa dos Sonhos",
        descricao: "Pequenas esferas de puro prazer! Recheio cremoso de chocolate premium envolto em uma casca delicada. Cada trufa é uma experiência sofisticada que derrete na boca e deixa um sabor inesquecível. Elegância e sabor em cada mordida.",
        preco: 4.00,
        imagem: "https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Beijinho de Coco",
        descricao: "A doçura do coco em sua forma mais pura! Preparado com coco fresco e leite condensado selecionado. Enrolado à mão e coberto com açúcar cristal que brilha como pérolas. Um carinho doce que derrete na boca.",
        preco: 3.00,
        imagem: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Cookie Crocante",
        descricao: "A combinação perfeita de texturas! Crocante por fora, macio por dentro, recheado com pedaços generosos de chocolate. Feito com receita especial e muito carinho. Perfeito para acompanhar um café ou chá especial.",
        preco: 5.00,
        imagem: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
        nome: "Copo da Felicidade",
        descricao: "Felicidade em camadas especialmente para você! Bolo macio, recheio cremoso e cobertura especial em um copo individual. Cada colherada é uma surpresa deliciosa. Perfeito para presentear ou se mimar!",
        preco: 12.00,
        imagem: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
];

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Formata o número do WhatsApp removendo caracteres especiais
 * @param {string} numero - Número de telefone com formatação
 * @returns {string} - Número apenas com dígitos
 */
function formatarWhatsApp(numero) {
    return numero.replace(/\D/g, '');
}

/**
 * Abre o WhatsApp com mensagem pré-formatada
 * @param {string} produtoNome - Nome do produto
 * @param {number} produtoPreco - Preço do produto
 */
function abrirWhatsApp(produtoNome, produtoPreco) {
    const whatsappNumero = formatarWhatsApp('+55 12 99221-6807');
    const mensagem = encodeURIComponent(
        `Olá! Gostaria de encomendar: ${produtoNome} - R$ ${produtoPreco.toFixed(2).replace('.', ',')}`
    );
    const linkWhatsApp = `https://wa.me/${whatsappNumero}?text=${mensagem}`;
    window.open(linkWhatsApp, '_blank');
}

// ============================================
// FUNÇÕES DE PRODUTOS
// ============================================

/**
 * Cria um card HTML para exibir um produto
 * @param {Object} produto - Objeto com informações do produto
 * @returns {HTMLElement} - Elemento HTML do card
 */
function criarCardProduto(produto) {
    // Cria o elemento card
    const card = document.createElement('div');
    card.className = 'produto-card fade-in';
    
    // Prepara HTML da imagem com fallback para emoji
    let imagemHTML;
    if (produto.imagem) {
        // Se tiver imagem, cria tag img com fallback para emoji em caso de erro
        imagemHTML = `
            <img 
                src="${produto.imagem}" 
                alt="${produto.nome}" 
                class="produto-img" 
                onerror="this.onerror=null; this.style.display='none'; const emoji = this.nextElementSibling; if(emoji) emoji.style.display='flex';" 
            />
            <span class="produto-emoji" style="display:none;">${produto.emoji || '🍰'}</span>
        `;
    } else {
        // Se não tiver imagem, usa emoji
        imagemHTML = `<span class="produto-emoji">${produto.emoji || '🍰'}</span>`;
    }
    
    // Formata preço para exibição brasileira
    const precoFormatado = produto.preco.toFixed(2).replace('.', ',');
    
    // Monta o HTML completo do card
    card.innerHTML = `
        <div class="produto-imagem">
            ${imagemHTML}
            <div class="produto-overlay"></div>
        </div>
        <div class="produto-info">
            <h3 class="produto-nome">${produto.nome}</h3>
            <p class="produto-descricao">${produto.descricao}</p>
            <div class="produto-preco">${precoFormatado}</div>
            <button class="btn-comprar" onclick="abrirWhatsApp('${produto.nome}', ${produto.preco})">
                Comprar Agora
            </button>
        </div>
    `;
    
    // Adiciona efeito de destaque ao passar o mouse
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-12px) scale(1.02)';
        this.style.boxShadow = '0 20px 50px rgba(93, 64, 55, 0.25)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.boxShadow = '';
    });
    
    return card;
}

/**
 * Renderiza todos os produtos no grid
 * Se não houver produtos, exibe mensagem informativa
 */
function renderizarProdutos() {
    const grid = document.getElementById('produtosGrid');
    
    // Verifica se há produtos
    if (produtos.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.3rem; color: var(--dark-soft); line-height: 1.8;">
                    Produtos serão adicionados em breve! 🍰<br>
                    <span style="font-size: 1rem; opacity: 0.8;">Fique de olho nas novidades</span>
                </p>
            </div>
        `;
        return;
    }
    
    // Limpa o grid e adiciona cada produto
    grid.innerHTML = '';
    produtos.forEach((produto, index) => {
        const card = criarCardProduto(produto);
        // Adiciona delay escalonado para animação
        card.style.transitionDelay = `${index * 0.1}s`;
        grid.appendChild(card);
    });
    
    // Observa os cards para animação ao scroll
    setTimeout(() => {
        const cards = document.querySelectorAll('.produto-card');
        cards.forEach(card => {
            observer.observe(card);
        });
    }, 100);
}

/**
 * Adiciona um novo produto ao array
 * @param {string} nome - Nome do produto
 * @param {string} descricao - Descrição do produto
 * @param {number} preco - Preço do produto
 * @param {string|null} imagem - URL da imagem (opcional)
 * @param {string} emoji - Emoji de fallback (opcional)
 */
function adicionarProduto(nome, descricao, preco, imagem = null, emoji = '🍰') {
    produtos.push({
        nome,
        descricao,
        preco: parseFloat(preco),
        imagem: imagem || null,
        emoji
    });
    renderizarProdutos();
}

/**
 * Remove um produto do array pelo nome
 * @param {string} nome - Nome do produto a ser removido
 */
function removerProduto(nome) {
    const index = produtos.findIndex(p => p.nome === nome);
    if (index > -1) {
        produtos.splice(index, 1);
        renderizarProdutos();
    }
}

/**
 * Remove todos os produtos do array
 */
function limparProdutos() {
    produtos.length = 0;
    renderizarProdutos();
}

// ============================================
// NAVEGAÇÃO E SCROLL SUAVE
// ============================================

/**
 * Configura scroll suave para todos os links âncora
 * Melhora a experiência de navegação no site
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ANIMAÇÕES AO SCROLL
// ============================================

/**
 * Configurações do Intersection Observer
 * Detecta quando elementos entram na viewport
 */
const observerOptions = {
    threshold: 0.1,           // Dispara quando 10% do elemento está visível
    rootMargin: '0px 0px -50px 0px'  // Margem de detecção
};

/**
 * Observer que anima elementos quando entram na tela
 */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Para elementos com classe fade-in, slide-in-left, slide-in-right
            if (entry.target.classList.contains('fade-in') || 
                entry.target.classList.contains('slide-in-left') || 
                entry.target.classList.contains('slide-in-right')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = entry.target.classList.contains('slide-in-left') 
                    ? 'translateX(0)' 
                    : entry.target.classList.contains('slide-in-right')
                    ? 'translateX(0)'
                    : 'translateY(0)';
            }
        }
    });
}, observerOptions);

/**
 * Configura animações para elementos ao fazer scroll
 */
function configurarAnimacoesScroll() {
    // Anima cards de produtos
    const produtoCards = document.querySelectorAll('.produto-card');
    produtoCards.forEach(card => {
        if (!card.classList.contains('visible')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
        }
    });
    
    // Anima features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.classList.add('fade-in');
        if (index % 2 === 0) {
            feature.classList.add('slide-in-left');
        } else {
            feature.classList.add('slide-in-right');
        }
        observer.observe(feature);
    });
    
    // Anima cards de promoção
    const promocaoCards = document.querySelectorAll('.promocao-card');
    promocaoCards.forEach((card, index) => {
        card.classList.add('fade-in');
        if (index % 2 === 0) {
            card.classList.add('slide-in-left');
        } else {
            card.classList.add('slide-in-right');
        }
        observer.observe(card);
    });
    
    // Anima seções
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// ============================================
// HEADER COM SCROLL
// ============================================

/**
 * Adiciona classe ao header quando o usuário rola a página
 */
function configurarHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// MENSAGEM DE BOAS-VINDAS
// ============================================

/**
 * Cria e exibe modal de boas-vindas
 */
function criarModalBoasVindas() {
    // Verifica se já foi exibido (usando localStorage)
    const jaExibido = localStorage.getItem('welcomeModalExibido');
    
    if (jaExibido) {
        return; // Não exibe novamente se já foi mostrado
    }
    
    // Cria o modal
    const modal = document.createElement('div');
    modal.className = 'welcome-modal';
    modal.id = 'welcomeModal';
    
    modal.innerHTML = `
        <div class="welcome-modal-content">
            <button class="welcome-modal-close" onclick="fecharModalBoasVindas()">&times;</button>
            <h2>🌺 Bem-vindo à Flor de Chocolate!</h2>
            <p>Que alegria ter você aqui! Somos uma doceria artesanal apaixonada por criar doces especiais que transformam momentos simples em memórias doces.</p>
            <p>Explore nossos sabores únicos e deixe-se envolver pela doçura artesanal feita com muito carinho!</p>
            <button class="btn-primary" onclick="fecharModalBoasVindas()" style="margin-top: 20px;">
                Começar a Explorar
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Exibe o modal após um pequeno delay
    setTimeout(() => {
        modal.classList.add('show');
    }, 500);
    
    // Fecha ao clicar fora do modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModalBoasVindas();
        }
    });
}

/**
 * Fecha o modal de boas-vindas
 */
function fecharModalBoasVindas() {
    const modal = document.getElementById('welcomeModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            // Marca como exibido no localStorage
            localStorage.setItem('welcomeModalExibido', 'true');
        }, 500);
    }
}

// ============================================
// BOTÃO DE CONTATO WHATSAPP
// ============================================

/**
 * Configura botões de WhatsApp para abrir com mensagem
 */
function configurarBotoesWhatsApp() {
    // Botão principal de contato
    const btnWhatsApp = document.querySelector('.btn-whatsapp');
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', function(e) {
            e.preventDefault();
            const whatsappNumero = formatarWhatsApp('+55 12 99221-6807');
            const mensagem = encodeURIComponent(
                'Olá! Gostaria de saber mais sobre os doces da Flor de Chocolate! 🌺'
            );
            const linkWhatsApp = `https://wa.me/${whatsappNumero}?text=${mensagem}`;
            window.open(linkWhatsApp, '_blank');
        });
    }
    
    // Links de WhatsApp no footer
    const linksWhatsApp = document.querySelectorAll('a[href*="wa.me"]');
    linksWhatsApp.forEach(link => {
        link.addEventListener('click', function(e) {
            // Permite que o link funcione normalmente, mas adiciona tracking se necessário
            console.log('WhatsApp clicado');
        });
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Executa quando o DOM está completamente carregado
 * Inicializa produtos e configura animações
 */
document.addEventListener('DOMContentLoaded', () => {
    // Renderiza os produtos
    renderizarProdutos();
    
    // Configura animações ao scroll
    setTimeout(() => {
        configurarAnimacoesScroll();
    }, 300);
    
    // Configura header com scroll
    configurarHeaderScroll();
    
    // Configura botões de WhatsApp
    configurarBotoesWhatsApp();
    
    // Exibe modal de boas-vindas
    setTimeout(() => {
        criarModalBoasVindas();
    }, 1000);
});

// ============================================
// EXPOSIÇÃO GLOBAL DE FUNÇÕES
// Permite uso via console do navegador para testes
// ============================================
window.adicionarProduto = adicionarProduto;
window.removerProduto = removerProduto;
window.limparProdutos = limparProdutos;
window.produtos = produtos;
window.abrirWhatsApp = abrirWhatsApp;
window.fecharModalBoasVindas = fecharModalBoasVindas;