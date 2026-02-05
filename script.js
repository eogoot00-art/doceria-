// ===== FIX TELA BRANCA MOBILE =====

// Garante variáveis globais
window.produtos = window.produtos || [];
window.carrinho = window.carrinho || [];

// Fallback para cacheManager (mobile quebra sem isso)
window.cacheManager = window.cacheManager || {
    getFromCache: () => null,
    saveToCache: () => {}
};

// Carregamento seguro de produtos
function carregarProdutosSeguro() {
    try {
        const dados = localStorage.getItem('produtosFlorChocolate');
        if (!dados) {
            produtos.length = 0;
            return;
        }

        const lista = JSON.parse(dados);
        if (Array.isArray(lista)) {
            produtos.length = 0;
            produtos.push(...lista);
        }
    } catch (e) {
        console.error('Erro ao carregar produtos (mobile):', e);
        produtos.length = 0;
    }
}

// Renderização protegida
function renderizarProdutosSeguro() {
    try {
        if (typeof renderizarProdutos === 'function') {
            renderizarProdutos();
        }
    } catch (e) {
        console.error('Erro ao renderizar produtos:', e);
    }
}

// Executa no load (mobile safe)
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosSeguro();
    renderizarProdutosSeguro();
});

/* ============================================
   FLOR DE CHOCOLATE - JAVASCRIPT
   Sistema de gerenciamento de produtos
   Integração com WhatsApp para pedidos
   Animações ao rolar a página
   Mensagem de boas-vindas
   Sistema de autenticação (Admin e Cliente)
   Painel administrativo
   Sistema de notificações push
   Cache de dados offline
   Analytics básico
   ============================================ */

// ============================================
// CONFIGURAÇÕES GLOBAIS
// ============================================
const CONFIG = {
    whatsappNumber: '+55 12 99221-6807',
    instagramUrl: 'https://www.instagram.com/flor_de_chocolate2025',
    businessName: 'Flor de Chocolate',
    businessEmail: 'flordechocolate2026@gmail.com',
    version: '2.1.0',
    cacheVersion: 'v2.1',
    enableAnalytics: true,
    enableNotifications: true
};

// Detecta se é dispositivo móvel
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ============================================
// SISTEMA DE CACHE E OFFLINE
// ============================================
class CacheManager {
    constructor() {
        this.cacheName = `florchocolate-${CONFIG.cacheVersion}`;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registrado com sucesso');
            } catch (error) {
                console.log('Erro ao registrar Service Worker:', error);
            }
        }
    }

    saveToCache(key, data) {
        try {
            const cacheData = {
                data,
                timestamp: Date.now(),
                version: CONFIG.cacheVersion
            };
            localStorage.setItem(`${this.cacheName}-${key}`, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Erro ao salvar no cache:', error);
        }
    }

    getFromCache(key, maxAge = 24 * 60 * 60 * 1000) { // 24 horas por padrão
        try {
            const cached = localStorage.getItem(`${this.cacheName}-${key}`);
            if (!cached) return null;

            const cacheData = JSON.parse(cached);
            const isExpired = Date.now() - cacheData.timestamp > maxAge;
            const isOldVersion = cacheData.version !== CONFIG.cacheVersion;

            if (isExpired || isOldVersion) {
                localStorage.removeItem(`${this.cacheName}-${key}`);
                return null;
            }

            return cacheData.data;
        } catch (error) {
            console.warn('Erro ao ler do cache:', error);
            return null;
        }
    }

    clearOldCache() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith('florchocolate-') && !key.includes(CONFIG.cacheVersion)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Erro ao limpar cache antigo:', error);
        }
    }
}

// ============================================
// SISTEMA DE ANALYTICS BÁSICO
// ============================================
class Analytics {
    constructor() {
        this.events = [];
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.init();
    }

    generateSessionId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    init() {
        if (!CONFIG.enableAnalytics) return;
        
        this.trackPageView();
        this.trackUserAgent();
        this.setupEventListeners();
    }

    trackEvent(eventName, data = {}) {
        if (!CONFIG.enableAnalytics) return;

        const event = {
            name: eventName,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href
        };

        this.events.push(event);
        this.saveEvents();
        
        // Log para desenvolvimento
        console.log('📊 Analytics:', eventName, data);
    }

    trackPageView() {
        this.trackEvent('page_view', {
            page: window.location.pathname,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        });
    }

    trackUserAgent() {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.trackEvent('device_info', {
            isMobile,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            language: navigator.language
        });
    }

    setupEventListeners() {
        // Track clicks em botões importantes
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-comprar')) {
                this.trackEvent('product_buy_click', {
                    product: e.target.closest('.produto-card')?.querySelector('.produto-nome')?.textContent
                });
            }
            
            if (e.target.matches('.btn-carrinho')) {
                this.trackEvent('add_to_cart_click', {
                    product: e.target.closest('.produto-card')?.querySelector('.produto-nome')?.textContent
                });
            }

            if (e.target.matches('.btn-whatsapp')) {
                this.trackEvent('whatsapp_click', {
                    context: 'contact_section'
                });
            }
        });

        // Track tempo na página
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Date.now() - this.startTime;
            this.trackEvent('session_end', {
                duration: timeOnPage,
                eventsCount: this.events.length
            });
        });
    }

    saveEvents() {
        try {
            const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            const allEvents = [...existingEvents, ...this.events];
            
            // Manter apenas os últimos 1000 eventos
            const recentEvents = allEvents.slice(-1000);
            localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
            
            this.events = []; // Limpa eventos locais após salvar
        } catch (error) {
            console.warn('Erro ao salvar eventos de analytics:', error);
        }
    }

    getStats() {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            const pageViews = events.filter(e => e.name === 'page_view').length;
            const productClicks = events.filter(e => e.name === 'product_buy_click').length;
            const cartAdds = events.filter(e => e.name === 'add_to_cart_click').length;
            
            return {
                totalEvents: events.length,
                pageViews,
                productClicks,
                cartAdds,
                lastVisit: events.length > 0 ? new Date(events[events.length - 1].timestamp) : null
            };
        } catch (error) {
            console.warn('Erro ao obter estatísticas:', error);
            return {};
        }
    }
}

// ============================================
// SISTEMA DE NOTIFICAÇÕES
// ============================================
class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.init();
    }

    async init() {
        if (!CONFIG.enableNotifications || !('Notification' in window)) return;
        
        this.permission = await Notification.requestPermission();
    }

    show(title, options = {}) {
        if (!CONFIG.enableNotifications || this.permission !== 'granted') return;

        const defaultOptions = {
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌺</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍫</text></svg>',
            tag: 'flor-chocolate',
            renotify: false,
            ...options
        };

        try {
            const notification = new Notification(title, defaultOptions);
            
            notification.onclick = () => {
                window.focus();
                notification.close();
                if (options.onClick) options.onClick();
            };

            // Auto close após 5 segundos
            setTimeout(() => notification.close(), 5000);
            
            return notification;
        } catch (error) {
            console.warn('Erro ao mostrar notificação:', error);
        }
    }

    showOrderConfirmation(productName) {
        this.show('Pedido Enviado! 🎉', {
            body: `Seu pedido de ${productName} foi enviado para o WhatsApp. Aguarde nosso contato!`,
            onClick: () => analytics.trackEvent('notification_click', { type: 'order_confirmation' })
        });
    }

    showCartUpdate(productName) {
        this.show('Produto Adicionado! 🛒', {
            body: `${productName} foi adicionado ao seu carrinho`,
            onClick: () => abrirModalCarrinho()
        });
    }
}

// ============================================
// INSTÂNCIAS GLOBAIS
// ============================================
const cacheManager = new CacheManager();
const analytics = new Analytics();
const notifications = new NotificationManager();

// ============================================
// ARRAY DE PRODUTOS
// Contém todos os produtos disponíveis na doceria
// Cada produto possui: nome, descricao, preco, imagem e sabores
// ============================================
const produtos = [
    {
        nome: "Brigadeiro Dourado",
        descricao: "O clássico brasileiro elevado à perfeição! Feito com chocolate belga premium e leite condensado selecionado, enrolado à mão com muito carinho. Coberto com granulados dourados que brilham como pequenas joias. Cada mordida é uma explosão de sabor que derrete na boca e aquece o coração.",
        preco: 3.50,
        imagem: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Tradicional", "Chocolate Belga", "Chocolate Branco", "Café", "Coco"]
    },
    {
        nome: "Brownie do Céu",
        descricao: "Uma tentação irresistível de chocolate! Macio e cremoso por dentro, com uma crosta crocante e dourada por fora. Feito com chocolate belga premium e muito amor. Cada pedaço é uma experiência única que você não vai conseguir esquecer.",
        preco: 9.00,
        imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Chocolate Tradicional", "Chocolate com Nozes", "Chocolate Branco", "Doce de Leite"]
    },
    {
        nome: "Cupcake Surpresa",
        descricao: "Pequenos bolos recheados com surpresas deliciosas! Massa fofinha, recheio cremoso e cobertura especial. Cada cupcake é uma obra de arte doce, perfeita para celebrar momentos especiais ou simplesmente se mimar.",
        preco: 7.50,
        imagem: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Baunilha", "Chocolate", "Morango", "Limão", "Red Velvet", "Cenoura"]
    },
    {
        nome: "Bolo da Vovó",
        descricao: "O sabor caseiro que aquece a alma! Feito com receita tradicional e ingredientes selecionados. Macio, fofinho e cheio de carinho. Perfeito para aniversários, comemorações ou qualquer momento que mereça ser celebrado com doçura.",
        preco: 75.00,
        imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Chocolate", "Baunilha", "Morango", "Cenoura", "Coco", "Limão", "Prestígio"]
    },
    {
        nome: "Trufa dos Sonhos",
        descricao: "Pequenas esferas de puro prazer! Recheio cremoso de chocolate premium envolto em uma casca delicada. Cada trufa é uma experiência sofisticada que derrete na boca e deixa um sabor inesquecível. Elegância e sabor em cada mordida.",
        preco: 4.00,
        imagem: "https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Maracujá", "Brigadeiro", "Limão", "Morango", "Café", "Coco", "Chocolate Belga", "Doce de Leite"],
        personalizavel: true,
        precosPorSabor: {
            "Maracujá": 4.50,
            "Brigadeiro": 4.00,
            "Limão": 4.20,
            "Morango": 4.30,
            "Café": 4.40,
            "Coco": 4.10,
            "Chocolate Belga": 5.00,
            "Doce de Leite": 4.60
        }
    },
    {
        nome: "Beijinho de Coco",
        descricao: "A doçura do coco em sua forma mais pura! Preparado com coco fresco e leite condensado selecionado. Enrolado à mão e coberto com açúcar cristal que brilha como pérolas. Um carinho doce que derrete na boca.",
        preco: 3.00,
        imagem: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Coco Tradicional", "Coco Queimado", "Coco com Leite Condensado"]
    },
    {
        nome: "Cookie Crocante",
        descricao: "A combinação perfeita de texturas! Crocante por fora, macio por dentro, recheado com pedaços generosos de chocolate. Feito com receita especial e muito carinho. Perfeito para acompanhar um café ou chá especial.",
        preco: 5.00,
        imagem: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Chocolate Chip", "Aveia e Passas", "Chocolate Branco", "Amendoim", "Coco"]
    },
    {
        nome: "Copo da Felicidade",
        descricao: "Felicidade em camadas especialmente para você! Bolo macio, recheio cremoso e cobertura especial em um copo individual. Cada colherada é uma surpresa deliciosa. Perfeito para presentear ou se mimar!",
        preco: 12.00,
        imagem: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: ["Chocolate com Morango", "Baunilha com Frutas", "Prestígio", "Limão", "Ninho com Nutella"],
        personalizavel: true,
        precosPorSabor: {
            "Chocolate com Morango": 12.50,
            "Baunilha com Frutas": 12.00,
            "Prestígio": 13.00,
            "Limão": 11.50,
            "Ninho com Nutella": 14.00
        }
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
 * Escapa caracteres especiais para uso em HTML
 * @param {string} texto - Texto a ser escapado
 * @returns {string} - Texto escapado
 */
function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// Variável global para armazenar o produto selecionado
let produtoSelecionado = null;

// ============================================
// SISTEMA DE CARRINHO DE COMPRAS
// ============================================

// Array para armazenar produtos no carrinho
let carrinho = [];

// ============================================
// SISTEMA DE AUTENTICAÇÃO
// ============================================

// Credenciais do administrador (padrão)
const ADMIN_CREDENTIALS = {
    usuario: 'admin',
    senha: 'FlorChocolate2026!'
};

// Estado de autenticação
let usuarioLogado = null;
let adminLogado = false;
let visitantes = [];

/**
 * Inicializa o sistema de autenticação
 */
function inicializarAuth() {
    // Verifica se admin está logado
    const adminSalvo = sessionStorage.getItem('adminLogado');
    if (adminSalvo === 'true') {
        adminLogado = true;
        mostrarPainelAdmin();
    }
    
    // Carrega visitantes
    carregarVisitantes();
    
    // Registra nova visita
    registrarVisita();
}

/**
 * Registra uma visita ao site
 */
function registrarVisita() {
    const visitas = JSON.parse(localStorage.getItem('visitas') || '[]');
    const agora = new Date();
    const visita = {
        data: agora.toISOString(),
        hora: agora.toLocaleTimeString('pt-BR'),
        dataFormatada: agora.toLocaleDateString('pt-BR')
    };
    visitas.push(visita);
    localStorage.setItem('visitas', JSON.stringify(visitas));
    visitantes = visitas;
    
    if (adminLogado) {
        atualizarEstatisticasAdmin();
    }
}

/**
 * Carrega visitantes do localStorage
 */
function carregarVisitantes() {
    const visitas = localStorage.getItem('visitas');
    if (visitas) {
        visitantes = JSON.parse(visitas);
    }
}

/**
 * Login do administrador
 */
function fazerLoginAdmin(usuario, senha) {
    if (usuario === ADMIN_CREDENTIALS.usuario && senha === ADMIN_CREDENTIALS.senha) {
        adminLogado = true;
        sessionStorage.setItem('adminLogado', 'true');
        mostrarPainelAdmin();
        fecharModalAdminLogin();
        mostrarMensagemCarrinho('Login realizado com sucesso! ✅');
        return true;
    }
    return false;
}

/**
 * Logout do administrador
 */
function sairAdmin() {
    adminLogado = false;
    sessionStorage.removeItem('adminLogado');
    const painel = document.getElementById('painelAdmin');
    if (painel) {
        painel.style.display = 'none';
    }
    mostrarMensagemCarrinho('Sessão encerrada');
}

/**
 * Abre modal de login do admin
 */
function abrirModalAdminLogin() {
    const modal = document.getElementById('modalAdminLogin');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Fecha modal de login do admin
 */
function fecharModalAdminLogin() {
    const modal = document.getElementById('modalAdminLogin');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Mostra o painel administrativo
 */
function mostrarPainelAdmin() {
    const painel = document.getElementById('painelAdmin');
    if (painel) {
        painel.style.display = 'block';
        atualizarEstatisticasAdmin();
        atualizarListaProdutosAdmin();
        atualizarListaVisitantes();
    }
}

/**
 * Atualiza estatísticas do admin
 */
function atualizarEstatisticasAdmin() {
    const totalVisitantes = visitantes.length;
    const totalVisitantesEl = document.getElementById('totalVisitantes');
    if (totalVisitantesEl) {
        totalVisitantesEl.textContent = totalVisitantes;
    }
}

/**
 * Atualiza lista de produtos no painel admin
 */
function atualizarListaProdutosAdmin() {
    const lista = document.getElementById('listaProdutosAdmin');
    if (!lista) return;
    
    if (produtos.length === 0) {
        lista.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--dark-soft);">Nenhum produto cadastrado</p>';
        return;
    }
    
    lista.innerHTML = produtos.map((produto, index) => {
        const precoFormatado = produto.preco.toFixed(2).replace('.', ',');
        return `
            <div class="produto-admin-item">
                <div class="produto-admin-info">
                    <h4>${produto.nome}</h4>
                    <p>${produto.descricao.substring(0, 100)}...</p>
                    <strong>R$ ${precoFormatado}</strong>
                </div>
                <div class="produto-admin-acoes">
                    <button class="btn-editar" onclick="editarProduto(${index})">✏️ Editar</button>
                    <button class="btn-excluir" onclick="excluirProduto(${index})">🗑️ Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Edita um produto
 */
function editarProduto(index) {
    const produto = produtos[index];
    
    // Cria um modal para edição
    const modal = document.createElement('div');
    modal.className = 'modal-login show';
    modal.style.display = 'flex';
    modal.id = 'modalEditarProduto';
    
    // Prepara preview da imagem atual
    let imagemAtualHTML = '';
    if (produto.imagem) {
        imagemAtualHTML = `
            <div class="imagem-atual" style="margin-top: 10px;">
                <p style="font-weight: 600; color: var(--chocolate-dark); margin-bottom: 10px;">Imagem Atual:</p>
                <img src="${produto.imagem}" alt="Imagem atual" style="max-width: 200px; max-height: 200px; border-radius: 10px; border: 2px solid var(--chocolate-light);">
            </div>
        `;
    }
    
    // Prepara sabores atuais
    const saboresAtuais = produto.sabores ? produto.sabores.join(', ') : '';
    const isPersonalizavel = produto.personalizavel || false;
    
    modal.innerHTML = `
        <div class="modal-login-content" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <button class="modal-login-close" onclick="fecharModalEditar()">&times;</button>
            <div class="modal-login-header">
                <h2>✏️ Editar Produto</h2>
            </div>
            <form id="formEditarProduto" class="form-admin">
                <div class="form-group">
                    <label>Nome do Produto *</label>
                    <input type="text" id="editNome" value="${escaparHTML(produto.nome)}" required>
                </div>
                <div class="form-row-admin">
                    <div class="form-group">
                        <label>Preço (R$) *</label>
                        <input type="number" id="editPreco" step="0.01" min="0" value="${produto.preco}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrição *</label>
                    <textarea id="editDescricao" rows="4" required>${escaparHTML(produto.descricao)}</textarea>
                </div>
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="editPersonalizavel" ${isPersonalizavel ? 'checked' : ''} style="margin-right: 8px;">
                        Produto Personalizável (cliente pode escolher múltiplos sabores)
                    </label>
                    <small class="form-help">
                        Marque esta opção se o cliente puder escolher vários sabores para montar seu produto personalizado.
                    </small>
                </div>
                <div class="form-group">
                    <label>Sabores/Variedades</label>
                    <textarea 
                        id="editSabores" 
                        rows="3" 
                        placeholder="Digite os sabores separados por vírgula. Ex: Maracujá, Brigadeiro, Limão"
                    >${escaparHTML(saboresAtuais)}</textarea>
                    <small class="form-help">
                        Digite cada sabor separado por vírgula. Se marcou "Personalizável", o cliente poderá escolher múltiplos sabores.
                    </small>
                </div>
                <div class="form-group">
                    <label>Nova Imagem do Produto (opcional)</label>
                    <input type="file" id="editImagem" accept="image/*" onchange="previewImagem(this, 'previewEditImagem')">
                    <div id="previewEditImagem" class="imagem-preview" style="display: none; margin-top: 10px;">
                        <p style="font-weight: 600; color: var(--chocolate-dark); margin-bottom: 10px;">Nova Imagem:</p>
                        <img id="imgPreviewEdit" src="" alt="Preview" style="max-width: 200px; max-height: 200px; border-radius: 10px; border: 2px solid var(--chocolate-light);">
                        <button type="button" onclick="removerPreview('previewEditImagem', 'editImagem')" style="margin-top: 10px; padding: 5px 15px; background: #E53935; color: white; border: none; border-radius: 5px; cursor: pointer;">Remover Nova Imagem</button>
                    </div>
                    ${imagemAtualHTML}
                </div>
                <div class="form-actions">
                    <button type="button" class="btn-cancelar" onclick="fecharModalEditar()">Cancelar</button>
                    <button type="submit" class="btn-admin">Salvar Alterações</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fecha ao clicar fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            fecharModalEditar();
        }
    });
    
    // Submete o formulário
    const form = modal.querySelector('#formEditarProduto');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const novoNome = document.getElementById('editNome').value.trim();
        const novoPreco = parseFloat(document.getElementById('editPreco').value);
        const novaDescricao = document.getElementById('editDescricao').value.trim();
        const novosSabores = document.getElementById('editSabores').value.trim();
        const novoPersonalizavel = document.getElementById('editPersonalizavel').checked;
        const fileInput = document.getElementById('editImagem');
        
        if (!novoNome || !novaDescricao || isNaN(novoPreco) || novoPreco <= 0) {
            mostrarMensagem('Por favor, preencha todos os campos corretamente!', 'error');
            return;
        }
        
        // Processa os sabores
        let saboresArray = [];
        if (novosSabores) {
            saboresArray = novosSabores.split(',').map(sabor => sabor.trim()).filter(sabor => sabor.length > 0);
        }
        
        // Processa a imagem se houver uma nova
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                produtos[index] = {
                    nome: novoNome,
                    preco: novoPreco,
                    descricao: novaDescricao,
                    sabores: saboresArray,
                    personalizavel: novoPersonalizavel,
                    imagem: e.target.result // Salva como data URL (base64)
                };
                
                salvarProdutos();
                renderizarProdutos();
                atualizarListaProdutosAdmin();
                fecharModalEditar();
                mostrarMensagemCarrinho('Produto atualizado com sucesso! ✅');
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Mantém a imagem atual se não houver nova
            produtos[index] = {
                nome: novoNome,
                preco: novoPreco,
                descricao: novaDescricao,
                sabores: saboresArray,
                personalizavel: novoPersonalizavel,
                imagem: produto.imagem // Mantém a imagem atual
            };
            
            salvarProdutos();
            renderizarProdutos();
            atualizarListaProdutosAdmin();
            fecharModalEditar();
            mostrarMensagemCarrinho('Produto atualizado com sucesso! ✅');
        }
    });
}

/**
 * Fecha o modal de edição
 */
function fecharModalEditar() {
    const modal = document.getElementById('modalEditarProduto');
    if (modal) {
        modal.remove();
    }
}

/**
 * Preview da imagem antes de salvar
 */
function previewImagem(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(previewId);
            const img = preview.querySelector('img');
            if (img) {
                img.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

/**
 * Remove o preview da imagem
 */
function removerPreview(previewId, inputId) {
    const preview = document.getElementById(previewId);
    const input = document.getElementById(inputId);
    if (preview) {
        preview.style.display = 'none';
        const img = preview.querySelector('img');
        if (img) {
            img.src = '';
        }
    }
    if (input) {
        input.value = '';
    }
}

/**
 * Exclui um produto
 */
function excluirProduto(index) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
        produtos.splice(index, 1);
        salvarProdutos();
        renderizarProdutos();
        atualizarListaProdutosAdmin();
        mostrarMensagemCarrinho('Produto excluído! ✅');
    }
}

/**
 * Carrega produtos do localStorage
 */
function carregarProdutos() {
    // Primeiro tenta carregar do cache
    const produtosCache = cacheManager.getFromCache('produtos');
    if (produtosCache && Array.isArray(produtosCache)) {
        produtos.length = 0;
        produtos.push(...produtosCache);
        return;
    }

    // Se não tem cache, carrega do localStorage
    const produtosSalvos = localStorage.getItem('produtosFlorChocolate');
    if (produtosSalvos) {
        try {
            const produtosCarregados = JSON.parse(produtosSalvos);
            produtos.length = 0;
            produtos.push(...produtosCarregados);
            
            // Salva no cache para próximas cargas
            cacheManager.saveToCache('produtos', produtos);
        } catch (e) {
            console.error('Erro ao carregar produtos:', e);
        }
    }
}

/**
 * Salva produtos no localStorage e cache
 */
function salvarProdutos() {
    localStorage.setItem('produtosFlorChocolate', JSON.stringify(produtos));
    cacheManager.saveToCache('produtos', produtos);
}

/**
 * Carrega o carrinho do localStorage e cache
 */
function carregarCarrinho() {
    // Primeiro tenta carregar do cache
    const carrinhoCache = cacheManager.getFromCache('carrinho');
    if (carrinhoCache && Array.isArray(carrinhoCache)) {
        carrinho = carrinhoCache;
        atualizarContadorCarrinho();
        return;
    }

    // Se não tem cache, carrega do localStorage
    const carrinhoSalvo = localStorage.getItem('carrinhoFlorChocolate');
    if (carrinhoSalvo) {
        try {
            carrinho = JSON.parse(carrinhoSalvo);
            atualizarContadorCarrinho();
            
            // Salva no cache para próximas cargas
            cacheManager.saveToCache('carrinho', carrinho);
        } catch (e) {
            console.error('Erro ao carregar carrinho:', e);
            carrinho = [];
        }
    }
}

/**
 * Salva o carrinho no localStorage e cache
 */
function salvarCarrinho() {
    localStorage.setItem('carrinhoFlorChocolate', JSON.stringify(carrinho));
    cacheManager.saveToCache('carrinho', carrinho);
}

/**
 * Atualiza lista de visitantes
 */
function atualizarListaVisitantes() {
    const lista = document.getElementById('listaVisitantes');
    if (!lista) return;
    
    if (visitantes.length === 0) {
        lista.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--dark-soft);">Nenhuma visita registrada</p>';
        return;
    }
    
    // Agrupa visitas por data
    const visitasPorData = {};
    visitantes.forEach(v => {
        const data = v.dataFormatada || new Date(v.data).toLocaleDateString('pt-BR');
        if (!visitasPorData[data]) {
            visitasPorData[data] = [];
        }
        visitasPorData[data].push(v);
    });
    
    lista.innerHTML = Object.keys(visitasPorData).reverse().slice(0, 30).map(data => {
        const visitas = visitasPorData[data];
        return `
            <div class="visita-item">
                <div class="visita-data">📅 ${data}</div>
                <div class="visita-count">${visitas.length} visita(s)</div>
                <div class="visita-horas">
                    ${visitas.slice(-5).map(v => v.hora || new Date(v.data).toLocaleTimeString('pt-BR')).join(', ')}
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Mostra tab do painel admin
 */
function mostrarTabAdmin(tab) {
    document.querySelectorAll('.painel-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.querySelectorAll('.painel-tab').forEach(t => {
        t.classList.remove('active');
    });
    
    document.getElementById(`tab${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
    event.target.classList.add('active');
    
    if (tab === 'visitantes') {
        atualizarListaVisitantes();
    }
}

// ============================================
// SISTEMA DE SABORES
// ============================================

// Armazena os sabores selecionados para cada produto
let saboresSelecionados = {};

/**
 * Atualiza o sabor selecionado para um produto (dropdown tradicional)
 * @param {string} produtoNome - Nome do produto
 * @param {string} sabor - Sabor selecionado
 */
function atualizarSaborSelecionado(produtoNome, sabor) {
    saboresSelecionados[produtoNome] = [sabor];
    
    // Track analytics
    analytics.trackEvent('flavor_selected', {
        product_name: produtoNome,
        flavor: sabor
    });
}

/**
 * Toggle de sabor para produtos personalizáveis (sistema de bolhas)
 * @param {string} produtoNome - Nome do produto
 * @param {string} sabor - Sabor a ser toggleado
 * @param {HTMLElement} elemento - Elemento da bolha clicada
 */
function toggleSaborBolha(produtoNome, sabor, elemento) {
    if (!saboresSelecionados[produtoNome]) {
        saboresSelecionados[produtoNome] = [];
    }
    
    const sabores = saboresSelecionados[produtoNome];
    const index = sabores.indexOf(sabor);
    
    if (index > -1) {
        // Remove o sabor se já estiver selecionado
        sabores.splice(index, 1);
        elemento.classList.remove('selecionado');
    } else {
        // Adiciona o sabor se não estiver selecionado
        sabores.push(sabor);
        elemento.classList.add('selecionado');
    }
    
    // Adiciona feedback visual para dispositivos touch
    if (isTouch) {
        elemento.style.transform = 'scale(0.95)';
        setTimeout(() => {
            elemento.style.transform = '';
        }, 150);
    }
    
    // Atualiza a visualização dos sabores escolhidos
    atualizarSaboresEscolhidos(produtoNome);
    
    // Atualiza o preço exibido
    atualizarPrecoExibido(produtoNome);
    
    // Track analytics
    analytics.trackEvent('flavor_toggled', {
        product_name: produtoNome,
        flavor: sabor,
        action: index > -1 ? 'removed' : 'added',
        total_flavors: sabores.length,
        calculated_price: calcularPrecoComSabores(produtoNome, sabores),
        is_mobile: isMobile,
        is_touch: isTouch
    });
}

/**
 * Calcula o preço total baseado nos sabores selecionados
 * @param {string} produtoNome - Nome do produto
 * @param {Array} saboresSelecionados - Array de sabores selecionados
 * @returns {number} - Preço total calculado
 */
function calcularPrecoComSabores(produtoNome, saboresSelecionados) {
    const produto = produtos.find(p => p.nome === produtoNome);
    
    if (!produto) {
        return 0;
    }
    
    // Se não é personalizável ou não tem sabores selecionados, retorna preço base
    if (!produto.personalizavel || !saboresSelecionados || saboresSelecionados.length === 0) {
        return produto.preco;
    }
    
    // Se tem preços por sabor definidos, calcula a soma
    if (produto.precosPorSabor) {
        let precoTotal = 0;
        saboresSelecionados.forEach(sabor => {
            const precoSabor = produto.precosPorSabor[sabor];
            if (precoSabor) {
                precoTotal += precoSabor;
            } else {
                // Se não tem preço específico, usa o preço base
                precoTotal += produto.preco;
            }
        });
        return precoTotal;
    }
    
    // Se não tem preços específicos, multiplica o preço base pela quantidade de sabores
    return produto.preco * saboresSelecionados.length;
}

/**
 * Atualiza a exibição do preço no card do produto
 * @param {string} produtoNome - Nome do produto
 */
function atualizarPrecoExibido(produtoNome) {
    const sabores = obterSaboresSelecionados(produtoNome);
    const precoCalculado = calcularPrecoComSabores(produtoNome, sabores);
    
    // Encontra o elemento de preço no card
    const produtoCards = document.querySelectorAll('.produto-card');
    produtoCards.forEach(card => {
        const nomeElement = card.querySelector('.produto-nome');
        if (nomeElement && nomeElement.textContent === produtoNome) {
            const precoElement = card.querySelector('.produto-preco');
            if (precoElement) {
                const precoFormatado = precoCalculado.toFixed(2).replace('.', ',');
                precoElement.textContent = precoFormatado;
                
                // Adiciona efeito visual de atualização
                precoElement.style.transform = 'scale(1.1)';
                precoElement.style.color = 'var(--gold-dark)';
                setTimeout(() => {
                    precoElement.style.transform = 'scale(1)';
                    precoElement.style.color = '';
                }, 300);
            }
        }
    });
}
/**
 * Atualiza a visualização dos sabores escolhidos
 * @param {string} produtoNome - Nome do produto
 */
function atualizarSaboresEscolhidos(produtoNome) {
    const containerSelecionados = document.getElementById(`selecionados-${produtoNome.replace(/\s+/g, '-').toLowerCase()}`);
    const listaSabores = containerSelecionados?.querySelector('.sabores-escolhidos-lista');
    
    if (!containerSelecionados || !listaSabores) return;
    
    const sabores = saboresSelecionados[produtoNome] || [];
    
    if (sabores.length === 0) {
        containerSelecionados.style.display = 'none';
        return;
    }
    
    containerSelecionados.style.display = 'block';
    
    // Calcula o preço total
    const precoTotal = calcularPrecoComSabores(produtoNome, sabores);
    const produto = produtos.find(p => p.nome === produtoNome);
    
    // Cria HTML dos sabores com preços individuais se disponível
    let saboresHTML = '';
    if (produto && produto.precosPorSabor) {
        saboresHTML = sabores.map(sabor => {
            const precoSabor = produto.precosPorSabor[sabor] || produto.preco;
            return `<span class="sabor-escolhido" data-preco="${precoSabor}">
                ${escaparHTML(sabor)} 
                <small class="sabor-preco">R$ ${precoSabor.toFixed(2).replace('.', ',')}</small>
            </span>`;
        }).join('');
    } else {
        saboresHTML = sabores.map(sabor => 
            `<span class="sabor-escolhido">${escaparHTML(sabor)}</span>`
        ).join('');
    }
    
    listaSabores.innerHTML = saboresHTML;
    
    // Adiciona o total se há múltiplos sabores
    if (sabores.length > 1) {
        const totalElement = containerSelecionados.querySelector('.sabores-total') || 
            document.createElement('div');
        totalElement.className = 'sabores-total';
        totalElement.innerHTML = `
            <strong>Total: R$ ${precoTotal.toFixed(2).replace('.', ',')}</strong>
        `;
        
        if (!containerSelecionados.querySelector('.sabores-total')) {
            containerSelecionados.appendChild(totalElement);
        }
    } else {
        // Remove o total se há apenas um sabor
        const totalElement = containerSelecionados.querySelector('.sabores-total');
        if (totalElement) {
            totalElement.remove();
        }
    }
}

/**
 * Obtém os sabores selecionados para um produto
 * @param {string} produtoNome - Nome do produto
 * @returns {Array} - Array de sabores selecionados
 */
function obterSaboresSelecionados(produtoNome) {
    const produto = produtos.find(p => p.nome === produtoNome);
    
    // Se tem sabores selecionados, retorna eles
    if (saboresSelecionados[produtoNome] && saboresSelecionados[produtoNome].length > 0) {
        return saboresSelecionados[produtoNome];
    }
    
    // Se o produto tem sabores, retorna o primeiro como padrão
    if (produto && produto.sabores && produto.sabores.length > 0) {
        return [produto.sabores[0]];
    }
    
    // Se não tem sabores, retorna array vazio
    return [];
}

/**
 * Obtém o sabor selecionado para um produto (compatibilidade com sistema antigo)
 * @param {string} produtoNome - Nome do produto
 * @returns {string} - Primeiro sabor selecionado ou null
 */
function obterSaborSelecionado(produtoNome) {
    const sabores = obterSaboresSelecionados(produtoNome);
    return sabores.length > 0 ? sabores[0] : null;
}

/**
 * Adiciona produto ao carrinho com sabores selecionados
 * @param {string} produtoNome - Nome do produto
 * @param {number} produtoPreco - Preço base do produto (será recalculado se necessário)
 */
function adicionarAoCarrinhoComSabor(produtoNome, produtoPreco) {
    const produto = produtos.find(p => p.nome === produtoNome);
    const sabores = obterSaboresSelecionados(produtoNome);
    
    if (produto && produto.personalizavel && sabores.length === 0) {
        mostrarMensagemCarrinho('⚠️ Escolha pelo menos um sabor para este produto!');
        return;
    }
    
    // Calcula o preço real baseado nos sabores selecionados
    const precoCalculado = calcularPrecoComSabores(produtoNome, sabores);
    
    let nomeCompleto;
    if (sabores.length === 0) {
        nomeCompleto = produtoNome;
    } else if (sabores.length === 1) {
        nomeCompleto = `${produtoNome} - ${sabores[0]}`;
    } else {
        nomeCompleto = `${produtoNome} - Mix (${sabores.join(', ')})`;
    }
    
    // Verifica se o produto com essa combinação já está no carrinho
    const produtoExistente = carrinho.find(item => item.nome === nomeCompleto);
    
    if (produtoExistente) {
        // Se já existe, aumenta a quantidade
        produtoExistente.quantidade += 1;
    } else {
        // Se não existe, adiciona novo item com preço calculado
        carrinho.push({
            nome: nomeCompleto,
            nomeProduto: produtoNome,
            sabores: [...sabores],
            preco: precoCalculado, // Usa o preço calculado
            quantidade: 1,
            id: Date.now() + Math.random()
        });
    }
    
    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();
    
    // Mostra mensagem de confirmação com preço
    const mensagem = sabores.length > 0 ? 
        `${produtoNome} (${sabores.join(', ')}) - R$ ${precoCalculado.toFixed(2).replace('.', ',')} adicionado ao carrinho! 🛒` : 
        `${produtoNome} - R$ ${precoCalculado.toFixed(2).replace('.', ',')} adicionado ao carrinho! 🛒`;
    mostrarMensagemCarrinho(mensagem);
    
    // Mostra notificação se disponível
    notifications.showCartUpdate(nomeCompleto);
    
    // Track analytics
    analytics.trackEvent('add_to_cart', {
        product_name: produtoNome,
        flavors: sabores,
        is_customizable: produto?.personalizavel || false,
        base_price: produtoPreco,
        calculated_price: precoCalculado,
        cart_size: carrinho.length
    });
    
    // Salva no localStorage e cache
    salvarCarrinho();
    cacheManager.saveToCache('carrinho', carrinho);
}

/**
 * Abre modal de compra com sabores selecionados
 * @param {string} produtoNome - Nome do produto
 * @param {number} produtoPreco - Preço base do produto (será recalculado se necessário)
 */
function abrirModalCompraComSabor(produtoNome, produtoPreco) {
    const produto = produtos.find(p => p.nome === produtoNome);
    const sabores = obterSaboresSelecionados(produtoNome);
    
    if (produto && produto.personalizavel && sabores.length === 0) {
        mostrarMensagemCarrinho('⚠️ Escolha pelo menos um sabor para este produto!');
        return;
    }
    
    // Calcula o preço real baseado nos sabores selecionados
    const precoCalculado = calcularPrecoComSabores(produtoNome, sabores);
    
    let nomeCompleto;
    if (sabores.length === 0) {
        nomeCompleto = produtoNome;
    } else if (sabores.length === 1) {
        nomeCompleto = `${produtoNome} - ${sabores[0]}`;
    } else {
        nomeCompleto = `${produtoNome} - Mix (${sabores.join(', ')})`;
    }
    
    produtoSelecionado = {
        nome: nomeCompleto,
        nomeProduto: produtoNome,
        sabores: [...sabores],
        preco: precoCalculado // Usa o preço calculado
    };
    
    // Atualiza informações do produto no modal
    const modalProdutoInfo = document.getElementById('modalProdutoInfo');
    if (modalProdutoInfo) {
        let infoHTML = `<strong>${nomeCompleto}</strong> - R$ ${precoCalculado.toFixed(2).replace('.', ',')}`;
        
        // Se há múltiplos sabores, mostra o detalhamento
        if (sabores.length > 1 && produto && produto.precosPorSabor) {
            infoHTML += `<div style="margin-top: 10px; font-size: 0.9rem; color: var(--dark-soft);">`;
            infoHTML += `<strong>Detalhamento:</strong><br>`;
            sabores.forEach(sabor => {
                const precoSabor = produto.precosPorSabor[sabor] || produto.preco;
                infoHTML += `• ${sabor}: R$ ${precoSabor.toFixed(2).replace('.', ',')}<br>`;
            });
            infoHTML += `</div>`;
        }
        
        modalProdutoInfo.innerHTML = infoHTML;
    }
    
    // Limpa o formulário
    const form = document.getElementById('formCompra');
    if (form) {
        form.reset();
        const mensagens = form.querySelectorAll('.form-message');
        mensagens.forEach(msg => msg.remove());
    }
    
    // Abre o modal
    const modal = document.getElementById('modalCompra');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            const cepInput = document.getElementById('cep');
            if (cepInput) {
                cepInput.focus();
            }
        }, 300);
    }
}

/**
 * Remove um produto do carrinho
 * @param {string} produtoNome - Nome do produto a ser removido
 */
function removerDoCarrinho(produtoNome) {
    carrinho = carrinho.filter(item => item.nome !== produtoNome);
    atualizarContadorCarrinho();
    atualizarModalCarrinho();
    salvarCarrinho();
}

/**
 * Atualiza a quantidade de um produto no carrinho
 * @param {string} produtoNome - Nome do produto
 * @param {number} quantidade - Nova quantidade
 */
function atualizarQuantidadeCarrinho(produtoNome, quantidade) {
    const item = carrinho.find(item => item.nome === produtoNome);
    if (item) {
        if (quantidade <= 0) {
            removerDoCarrinho(produtoNome);
        } else {
            item.quantidade = quantidade;
            atualizarModalCarrinho();
            salvarCarrinho();
        }
    }
}

/**
 * Atualiza o contador de itens no ícone do carrinho
 */
function atualizarContadorCarrinho() {
    const contador = document.getElementById('carrinhoContador');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    if (contador) {
        if (totalItens > 0) {
            contador.textContent = totalItens;
            contador.style.display = 'flex';
        } else {
            contador.style.display = 'none';
        }
    }
}

/**
 * Calcula o total do carrinho
 * @returns {number} - Valor total do carrinho
 */
function calcularTotalCarrinho() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

/**
 * Abre o modal do carrinho
 */
function abrirModalCarrinho() {
    console.log('🛒 Abrindo modal do carrinho...');
    const modal = document.getElementById('modalCarrinho');
    
    if (modal) {
        // Força a atualização do conteúdo
        atualizarModalCarrinho();
        
        // Adiciona a classe show
        modal.classList.add('show');
        
        // Bloqueia o scroll do body
        document.body.style.overflow = 'hidden';
        
        // Otimizações para mobile
        if (isMobile) {
            // Previne scroll do background em mobile
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
            document.body.style.top = `-${window.scrollY}px`;
            
            // Foca no modal para acessibilidade
            setTimeout(() => {
                modal.focus();
            }, 100);
        }
        
        console.log('✅ Modal do carrinho aberto!');
    } else {
        console.error('❌ Modal do carrinho não encontrado!');
    }
}

/**
 * Fecha o modal do carrinho
 */
function fecharModalCarrinho() {
    const modal = document.getElementById('modalCarrinho');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

/**
 * Atualiza o conteúdo do modal do carrinho
 */
function atualizarModalCarrinho() {
    console.log('🔄 Atualizando conteúdo do modal do carrinho...');
    const carrinhoItens = document.getElementById('carrinhoItens');
    const carrinhoTotal = document.getElementById('carrinhoTotal');
    const btnFinalizarCarrinho = document.getElementById('btnFinalizarCarrinho');
    
    console.log('Elementos encontrados:', {
        carrinhoItens: !!carrinhoItens,
        carrinhoTotal: !!carrinhoTotal,
        btnFinalizarCarrinho: !!btnFinalizarCarrinho
    });
    
    if (!carrinhoItens) {
        console.error('❌ Elemento carrinhoItens não encontrado!');
        return;
    }
    
    if (carrinho.length === 0) {
        carrinhoItens.innerHTML = `
            <div class="carrinho-vazio">
                <span class="carrinho-emoji">🛒</span>
                <p>Seu carrinho está vazio</p>
                <p class="carrinho-vazio-texto">Adicione produtos deliciosos ao seu carrinho!</p>
            </div>
        `;
        if (carrinhoTotal) carrinhoTotal.textContent = 'R$ 0,00';
        if (btnFinalizarCarrinho) btnFinalizarCarrinho.disabled = true;
        return;
    }
    
    // Renderiza os itens do carrinho
    carrinhoItens.innerHTML = carrinho.map(item => {
        const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
        const nomeEscapado = escaparHTML(item.nome).replace(/'/g, "\\'");
        
        // Trata tanto o sistema antigo (sabor) quanto o novo (sabores)
        let saboresDisplay = '';
        if (item.sabores && Array.isArray(item.sabores) && item.sabores.length > 0) {
            // Sistema novo com múltiplos sabores
            saboresDisplay = `<div class="item-sabores">${item.sabores.map(sabor => 
                `<span class="item-sabor-tag">${escaparHTML(sabor)}</span>`
            ).join('')}</div>`;
        } else if (item.sabor) {
            // Sistema antigo com um sabor
            saboresDisplay = `<div class="item-sabores"><span class="item-sabor-tag">${escaparHTML(item.sabor)}</span></div>`;
        }
        
        return `
            <div class="carrinho-item">
                <div class="carrinho-item-info">
                    <h4 class="carrinho-item-nome">${escaparHTML(item.nomeProduto || item.nome)}</h4>
                    ${saboresDisplay}
                    <p class="carrinho-item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
                </div>
                <div class="carrinho-item-controles">
                    <button class="btn-quantidade" onclick="atualizarQuantidadeCarrinho('${nomeEscapado}', ${item.quantidade - 1})">-</button>
                    <span class="carrinho-item-quantidade">${item.quantidade}</span>
                    <button class="btn-quantidade" onclick="atualizarQuantidadeCarrinho('${nomeEscapado}', ${item.quantidade + 1})">+</button>
                </div>
                <div class="carrinho-item-subtotal">
                    <strong>R$ ${subtotal}</strong>
                </div>
                <button class="btn-remover-item" onclick="removerDoCarrinho('${nomeEscapado}')" title="Remover">
                    🗑️
                </button>
            </div>
        `;
    }).join('');
    
    // Atualiza o total
    const total = calcularTotalCarrinho();
    if (carrinhoTotal) {
        carrinhoTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
    
    if (btnFinalizarCarrinho) {
        btnFinalizarCarrinho.disabled = false;
    }
}

/**
 * Mostra mensagem de confirmação ao adicionar ao carrinho
 */
function mostrarMensagemCarrinho(mensagem) {
    // Remove mensagem anterior se existir
    const mensagemAnterior = document.querySelector('.mensagem-carrinho');
    if (mensagemAnterior) {
        mensagemAnterior.remove();
    }
    
    // Cria nova mensagem
    const mensagemEl = document.createElement('div');
    mensagemEl.className = 'mensagem-carrinho';
    mensagemEl.textContent = mensagem;
    document.body.appendChild(mensagemEl);
    
    // Mostra a mensagem
    setTimeout(() => {
        mensagemEl.classList.add('show');
    }, 10);
    
    // Remove após 3 segundos
    setTimeout(() => {
        mensagemEl.classList.remove('show');
        setTimeout(() => {
            mensagemEl.remove();
        }, 300);
    }, 3000);
}

/**
 * Limpa o carrinho
 */
function limparCarrinho() {
    carrinho = [];
    atualizarContadorCarrinho();
    atualizarModalCarrinho();
    salvarCarrinho();
}

/**
 * Finaliza a compra do carrinho
 */
function finalizarCompraCarrinho() {
    if (carrinho.length === 0) {
        mostrarMensagem('Carrinho vazio!', 'error');
        return;
    }
    
    // Fecha o modal do carrinho
    fecharModalCarrinho();
    
    // Abre o modal de compra com os produtos do carrinho
    abrirModalCompraCarrinho();
}

/**
 * Abre o modal de compra para o carrinho
 */
function abrirModalCompraCarrinho() {
    // Atualiza informações do carrinho no modal
    const modalProdutoInfo = document.getElementById('modalProdutoInfo');
    if (modalProdutoInfo) {
        const produtosTexto = carrinho.map(item => 
            `${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}`
        ).join('\n');
        
        modalProdutoInfo.innerHTML = `
            <strong>Carrinho de Compras</strong><br>
            <div style="margin-top: 10px; text-align: left; font-size: 0.95rem;">
                ${produtosTexto.split('\n').map(p => `<div>${p}</div>`).join('')}
            </div>
            <div style="margin-top: 10px; font-size: 1.1rem; font-weight: 700; color: var(--chocolate-dark);">
                Total: R$ ${calcularTotalCarrinho().toFixed(2).replace('.', ',')}
            </div>
        `;
    }
    
    // Marca que é uma compra do carrinho
    produtoSelecionado = {
        nome: 'Carrinho',
        preco: calcularTotalCarrinho(),
        isCarrinho: true
    };
    
    // Limpa o formulário
    const form = document.getElementById('formCompra');
    if (form) {
        form.reset();
        const mensagens = form.querySelectorAll('.form-message');
        mensagens.forEach(msg => msg.remove());
    }
    
    // Abre o modal
    const modal = document.getElementById('modalCompra');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            const cepInput = document.getElementById('cep');
            if (cepInput) {
                cepInput.focus();
            }
        }, 300);
    }
}

/**
 * Abre o modal de compra com informações do produto
 * @param {string} produtoNome - Nome do produto
 * @param {number} produtoPreco - Preço do produto
 */
function abrirModalCompra(produtoNome, produtoPreco) {
    produtoSelecionado = {
        nome: produtoNome,
        preco: produtoPreco
    };
    
    // Atualiza informações do produto no modal
    const modalProdutoInfo = document.getElementById('modalProdutoInfo');
    if (modalProdutoInfo) {
        modalProdutoInfo.innerHTML = `
            <strong>${produtoNome}</strong> - R$ ${produtoPreco.toFixed(2).replace('.', ',')}
        `;
    }
    
    // Limpa o formulário
    const form = document.getElementById('formCompra');
    if (form) {
        form.reset();
        // Remove mensagens de erro anteriores
        const mensagens = form.querySelectorAll('.form-message');
        mensagens.forEach(msg => msg.remove());
    }
    
    // Abre o modal
    const modal = document.getElementById('modalCompra');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Foca no campo CEP
        setTimeout(() => {
            const cepInput = document.getElementById('cep');
            if (cepInput) {
                cepInput.focus();
            }
        }, 300);
    }
}

/**
 * Fecha o modal de compra
 */
function fecharModalCompra() {
    const modal = document.getElementById('modalCompra');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        produtoSelecionado = null;
    }
}

/**
 * Busca informações do CEP via API
 */
async function buscarCEP() {
    const cepInput = document.getElementById('cep');
    const btnBuscar = document.querySelector('.btn-buscar-cep');
    const enderecoInput = document.getElementById('endereco');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    
    if (!cepInput) return;
    
    let cep = cepInput.value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        mostrarMensagem('CEP inválido. Digite um CEP com 8 dígitos.', 'error');
        return;
    }
    
    // Adiciona loading ao botão
    if (btnBuscar) {
        btnBuscar.classList.add('loading');
        btnBuscar.disabled = true;
    }
    
    try {
        // Tenta buscar na API ViaCEP
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            throw new Error('CEP não encontrado');
        }
        
        // Preenche os campos automaticamente
        if (enderecoInput && data.logradouro) {
            enderecoInput.value = `${data.logradouro}${data.complemento ? ', ' + data.complemento : ''}`;
        }
        
        if (cidadeInput && data.localidade) {
            cidadeInput.value = data.localidade;
        }
        
        if (estadoInput && data.uf) {
            estadoInput.value = data.uf.toUpperCase();
        }
        
        mostrarMensagem('Endereço encontrado! Complete com o número e complemento.', 'success');
        
    } catch (error) {
        mostrarMensagem('CEP não encontrado. Por favor, preencha o endereço manualmente.', 'error');
    } finally {
        // Remove loading do botão
        if (btnBuscar) {
            btnBuscar.classList.remove('loading');
            btnBuscar.disabled = false;
        }
    }
}

/**
 * Mostra mensagem de erro ou sucesso
 */
function mostrarMensagem(texto, tipo) {
    const form = document.getElementById('formCompra');
    if (!form) return;
    
    // Remove mensagens anteriores
    const mensagensAntigas = form.querySelectorAll('.form-message');
    mensagensAntigas.forEach(msg => msg.remove());
    
    // Cria nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `form-message ${tipo}`;
    mensagem.textContent = texto;
    
    // Insere após o primeiro campo
    const primeiroCampo = form.querySelector('.form-group');
    if (primeiroCampo) {
        primeiroCampo.parentNode.insertBefore(mensagem, primeiroCampo.nextSibling);
    }
    
    // Remove após 5 segundos
    setTimeout(() => {
        mensagem.remove();
    }, 5000);
}

/**
 * Formata CEP enquanto o usuário digita
 */
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    input.value = value;
}

/**
 * Envia pedido para WhatsApp com todas as informações
 */
function enviarParaWhatsApp(event) {
    event.preventDefault();
    
    if (!produtoSelecionado) {
        mostrarMensagem('Erro: Produto não selecionado.', 'error');
        return;
    }
    
    const form = document.getElementById('formCompra');
    if (!form) return;
    
    // Valida campos obrigatórios
    const cep = document.getElementById('cep').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();
    
    if (!cep || !endereco || !cidade || !estado) {
        mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Valida CEP
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
        mostrarMensagem('CEP inválido. Digite um CEP com 8 dígitos.', 'error');
        return;
    }
    
    // Monta mensagem para WhatsApp
    let mensagem = `🌺 *PEDIDO - ${CONFIG.businessName}*\n\n`;
    
    // Se for compra do carrinho, lista todos os produtos
    if (produtoSelecionado.isCarrinho) {
        mensagem += `*Produtos:*\n`;
        carrinho.forEach((item, index) => {
            const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
            const nomeProduto = item.nomeProduto || item.nome;
            
            // Trata sabores (novo sistema com array ou antigo com string)
            let saboresTexto = '';
            if (item.sabores && Array.isArray(item.sabores) && item.sabores.length > 0) {
                if (item.sabores.length === 1) {
                    saboresTexto = ` - ${item.sabores[0]}`;
                } else {
                    saboresTexto = ` - Mix (${item.sabores.join(', ')})`;
                }
            } else if (item.sabor) {
                saboresTexto = ` - ${item.sabor}`;
            }
            
            mensagem += `${index + 1}. ${nomeProduto}${saboresTexto} (${item.quantidade}x)\n`;
            mensagem += `   R$ ${item.preco.toFixed(2).replace('.', ',')} cada = R$ ${subtotal}\n\n`;
        });
        mensagem += `*Total:* R$ ${produtoSelecionado.preco.toFixed(2).replace('.', ',')}\n\n`;
        
        // Track analytics para carrinho
        analytics.trackEvent('checkout_cart', {
            total_items: carrinho.length,
            total_value: produtoSelecionado.preco,
            products: carrinho.map(item => ({
                name: item.nomeProduto || item.nome,
                flavors: item.sabores || (item.sabor ? [item.sabor] : [])
            }))
        });
    } else {
        // Compra de produto único
        const nomeProduto = produtoSelecionado.nomeProduto || produtoSelecionado.nome;
        let saboresTexto = '';
        
        if (produtoSelecionado.sabores && Array.isArray(produtoSelecionado.sabores) && produtoSelecionado.sabores.length > 0) {
            if (produtoSelecionado.sabores.length === 1) {
                saboresTexto = ` - ${produtoSelecionado.sabores[0]}`;
            } else {
                saboresTexto = ` - Mix (${produtoSelecionado.sabores.join(', ')})`;
            }
        } else if (produtoSelecionado.sabor) {
            saboresTexto = ` - ${produtoSelecionado.sabor}`;
        }
        
        mensagem += `*Produto:*\n${nomeProduto}${saboresTexto}\n`;
        mensagem += `*Preço:* R$ ${produtoSelecionado.preco.toFixed(2).replace('.', ',')}\n\n`;
        
        // Track analytics para produto único
        analytics.trackEvent('checkout_single', {
            product_name: nomeProduto,
            flavors: produtoSelecionado.sabores || (produtoSelecionado.sabor ? [produtoSelecionado.sabor] : []),
            product_price: produtoSelecionado.preco
        });
    }
    
    mensagem += `*Endereço de Entrega:*\n`;
    mensagem += `📍 ${endereco}\n`;
    mensagem += `${cidade} - ${estado}\n`;
    mensagem += `CEP: ${cep}\n\n`;
    
    if (observacoes) {
        mensagem += `*Observações:*\n${observacoes}\n\n`;
    }
    
    mensagem += `Gostaria de confirmar este pedido! 🍫🌺\n\n`;
    mensagem += `_Pedido feito através do site ${CONFIG.businessName}_`;

    // Formata número do WhatsApp
    const whatsappNumero = formatarWhatsApp(CONFIG.whatsappNumber);
    const mensagemEncoded = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/${whatsappNumero}?text=${mensagemEncoded}`;
    
    // Track analytics
    analytics.trackEvent('whatsapp_redirect', {
        context: 'checkout',
        product_type: produtoSelecionado.isCarrinho ? 'cart' : 'single'
    });
    
    // Abre WhatsApp
    window.open(linkWhatsApp, '_blank');
    
    // Mostra notificação de confirmação
    const productName = produtoSelecionado.isCarrinho ? 'Carrinho' : produtoSelecionado.nome;
    notifications.showOrderConfirmation(productName);
    
    // Limpa o carrinho se foi compra do carrinho
    if (produtoSelecionado.isCarrinho) {
        limparCarrinho();
    }
    
    // Fecha o modal após um pequeno delay
    setTimeout(() => {
        fecharModalCompra();
    }, 500);
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
                loading="lazy"
            />
            <span class="produto-emoji" style="display:none;">${produto.emoji || '🍰'}</span>
        `;
    } else {
        // Se não tiver imagem, usa emoji
        imagemHTML = `<span class="produto-emoji">${produto.emoji || '🍰'}</span>`;
    }
    
    // Formata preço para exibição brasileira
    const precoFormatado = produto.preco.toFixed(2).replace('.', ',');
    
    // Escapa o nome do produto para uso seguro em HTML
    const nomeEscapado = escaparHTML(produto.nome).replace(/'/g, "\\'");
    const descricaoEscapada = escaparHTML(produto.descricao);
    
    // Cria seletor de sabores se o produto tiver sabores
    let seletorSaboresHTML = '';
    if (produto.sabores && produto.sabores.length > 0) {
        if (produto.personalizavel) {
            // Sistema de bolhas para produtos personalizáveis
            const saboresBolhas = produto.sabores.map(sabor => {
                const precoSabor = produto.precosPorSabor ? produto.precosPorSabor[sabor] : produto.preco;
                const precoFormatado = precoSabor ? precoSabor.toFixed(2).replace('.', ',') : produto.preco.toFixed(2).replace('.', ',');
                
                return `<button type="button" class="sabor-bolha" data-sabor="${escaparHTML(sabor)}" data-preco="${precoSabor || produto.preco}" onclick="toggleSaborBolha('${nomeEscapado}', '${escaparHTML(sabor)}', this)" ${isTouch ? 'ontouchstart=""' : ''}>
                    <span class="sabor-nome">${escaparHTML(sabor)}</span>
                    <span class="sabor-bolha-preco">R$ ${precoFormatado}</span>
                </button>`;
            }).join('');
            
            seletorSaboresHTML = `
                <div class="seletor-sabores-container personalizavel">
                    <label class="sabor-label">
                        🎨 Monte sua combinação perfeita:
                    </label>
                    <div class="sabores-instrucao">
                        <small>${isMobile ? 'Toque nos sabores para criar sua mistura única!' : 'Clique nos sabores que desejar para criar sua mistura única!'} O preço será calculado automaticamente.</small>
                    </div>
                    <div class="sabores-bolhas" id="sabores-${nomeEscapado.replace(/\s+/g, '-').toLowerCase()}">
                        ${saboresBolhas}
                    </div>
                    <div class="sabores-selecionados" id="selecionados-${nomeEscapado.replace(/\s+/g, '-').toLowerCase()}" style="display: none;">
                  <div class="sabores-escolhidos-lista"></div>
                    </div>
                </div>
            `;
        } else {
            // Sistema de dropdown tradicional
            const saboresOptions = produto.sabores.map(sabor => 
                `<option                     <small class="sabores-escolhidos-label">✨ Sua combinação escolhida:</small>
          value="${escaparHTML(sabor)}">${escaparHTML(sabor)}</option>`
            ).join('');
            
            seletorSaboresHTML = `
                <div class="seletor-sabores-container">
                    <label for="sabor-${nomeEscapado.replace(/\s+/g, '-').toLowerCase()}" class="sabor-label">
                        Escolha o sabor:
                    </label>
                    <select 
                        id="sabor-${nomeEscapado.replace(/\s+/g, '-').toLowerCase()}" 
                        class="select-sabor"
                        onchange="atualizarSaborSelecionado('${nomeEscapado}', this.value)"
                    >
                        ${saboresOptions}
                    </select>
                </div>
            `;
        }
    }
    
    // Monta o HTML completo do card
    card.innerHTML = `
        <div class="produto-imagem">
            ${imagemHTML}
            <div class="produto-overlay"></div>
        </div>
        <div class="produto-info">
            <h3 class="produto-nome">${produto.nome}</h3>
            <p class="produto-descricao">${produto.descricao}</p>
            ${seletorSaboresHTML}
            <div class="produto-preco">${precoFormatado}</div>
            <div class="produto-botoes">
                <button class="btn-comprar" onclick="abrirModalCompraComSabor('${nomeEscapado}', ${produto.preco})">
                    Comprar Agora
                </button>
                <button class="btn-carrinho" onclick="adicionarAoCarrinhoComSabor('${nomeEscapado}', ${produto.preco})">
                    🛒 Adicionar ao Carrinho
                </button>
            </div>
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
 * Esconde o menu de navegação e mantém apenas logo e Instagram
 */
function configurarHeaderScroll() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    // Ajusta o threshold baseado no dispositivo
    const scrollThreshold = isMobile ? 50 : 100;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
            header.classList.add('compact');
            if (nav) {
                nav.style.display = 'none';
            }
        } else {
            header.classList.remove('scrolled');
            header.classList.remove('compact');
            if (nav) {
                nav.style.display = 'flex';
            }
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
    // Carrega produtos do localStorage
    carregarProdutos();
    
    // Inicializa sistema de autenticação
    inicializarAuth();
    
    // Carrega o carrinho do localStorage
    carregarCarrinho();
    
    // Renderiza os produtos
    renderizarProdutos();
    
    // Configura botão do carrinho com event listener alternativo
    const btnCarrinho = document.getElementById('btnCarrinho');
    if (btnCarrinho) {
        console.log('✅ Botão do carrinho encontrado, adicionando event listener...');
        
        // Remove qualquer event listener anterior
        btnCarrinho.replaceWith(btnCarrinho.cloneNode(true));
        const newBtnCarrinho = document.getElementById('btnCarrinho');
        
        // Adiciona event listener para click
        newBtnCarrinho.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Event listener do carrinho ativado!');
            abrirModalCarrinho();
        });
        
        // Adiciona suporte para touch em dispositivos móveis
        if (isTouch) {
            newBtnCarrinho.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('👆 Touch do carrinho ativado!');
                abrirModalCarrinho();
            }, { passive: false });
        }
        
        // Adiciona suporte para teclado
        newBtnCarrinho.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                console.log('⌨️ Teclado do carrinho ativado!');
                abrirModalCarrinho();
            }
        });
    } else {
        console.error('❌ Botão do carrinho não encontrado!');
    }
    
    // Otimizações para dispositivos móveis
    if (isMobile) {
        // Reduz animações em dispositivos móveis para melhor performance
        document.documentElement.style.setProperty('--transition-fast', '0.1s ease');
        document.documentElement.style.setProperty('--transition-normal', '0.2s ease');
        document.documentElement.style.setProperty('--transition-slow', '0.3s ease');
        
        // Desabilita hover effects em dispositivos touch
        document.body.classList.add('touch-device');
        
        // Otimiza scroll em mobile
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Previne zoom em inputs
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
            metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // Melhora performance removendo animações complexas
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '0.3';
        });
        
        // Otimiza modais para mobile
        const modals = document.querySelectorAll('.modal-compra, .modal-login, .modal-carrinho');
        modals.forEach(modal => {
            modal.style.padding = '10px';
        });
    }
    
    // Configura animações ao scroll
    setTimeout(() => {
        configurarAnimacoesScroll();
    }, 300);
    
    // Configura header com scroll
    configurarHeaderScroll();
    
    // Configura botões de WhatsApp
    configurarBotoesWhatsApp();
    
    // Configura formulário de compra
    const formCompra = document.getElementById('formCompra');
    if (formCompra) {
        formCompra.addEventListener('submit', enviarParaWhatsApp);
    }
    
    // Formata CEP enquanto digita
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function() {
            formatarCEP(this);
        });
        
        // Busca CEP ao pressionar Enter
        cepInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                buscarCEP();
            }
        });
    }
    
    // Fecha modal ao clicar fora
    const modalCompra = document.getElementById('modalCompra');
    if (modalCompra) {
        modalCompra.addEventListener('click', function(e) {
            if (e.target === modalCompra) {
                fecharModalCompra();
            }
        });
    }
    
    // Fecha modal do carrinho ao clicar fora
    const modalCarrinho = document.getElementById('modalCarrinho');
    if (modalCarrinho) {
        modalCarrinho.addEventListener('click', function(e) {
            if (e.target === modalCarrinho) {
                fecharModalCarrinho();
            }
        });
    }
    
    // Fecha modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModalCompra();
            fecharModalCarrinho();
        }
    });
    
    // Exibe modal de boas-vindas
    setTimeout(() => {
        criarModalBoasVindas();
    }, 1000);
    
    // Formulário de login do admin
    const formAdminLogin = document.getElementById('formAdminLogin');
    if (formAdminLogin) {
        formAdminLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const usuario = document.getElementById('adminUsuario').value.trim();
            const senha = document.getElementById('adminSenha').value;
            
            if (!usuario || !senha) {
                mostrarMensagem('Por favor, preencha todos os campos!', 'error');
                return;
            }
            
            if (fazerLoginAdmin(usuario, senha)) {
                // Sucesso já tratado na função
            } else {
                mostrarMensagem('Usuário ou senha incorretos!', 'error');
                // Limpa os campos
                document.getElementById('adminUsuario').value = '';
                document.getElementById('adminSenha').value = '';
            }
        });
    }
    
    // Formulário de adicionar produto (admin)
    const formAdicionarProduto = document.getElementById('formAdicionarProduto');
    if (formAdicionarProduto) {
        formAdicionarProduto.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('produtoNome').value.trim();
            const preco = parseFloat(document.getElementById('produtoPreco').value);
            const descricao = document.getElementById('produtoDescricao').value.trim();
            const sabores = document.getElementById('produtoSabores').value.trim();
            const personalizavel = document.getElementById('produtoPersonalizavel').checked;
            const fileInput = document.getElementById('produtoImagem');
            
            if (!nome || !descricao || isNaN(preco) || preco <= 0) {
                mostrarMensagem('Por favor, preencha todos os campos obrigatórios!', 'error');
                return;
            }
            
            // Processa os sabores
            let saboresArray = [];
            if (sabores) {
                saboresArray = sabores.split(',').map(sabor => sabor.trim()).filter(sabor => sabor.length > 0);
            }
            
            // Processa a imagem se houver
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    produtos.push({
                        nome,
                        preco,
                        descricao,
                        sabores: saboresArray,
                        personalizavel: personalizavel,
                        imagem: e.target.result // Salva como data URL (base64)
                    });
                    
                    salvarProdutos();
                    renderizarProdutos();
                    atualizarListaProdutosAdmin();
                    formAdicionarProduto.reset();
                    // Limpa o preview
                    const preview = document.getElementById('previewNovaImagem');
                    if (preview) {
                        preview.style.display = 'none';
                        const img = preview.querySelector('img');
                        if (img) img.src = '';
                    }
                    mostrarMensagemCarrinho('Produto adicionado com sucesso! ✅');
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                // Adiciona sem imagem
                produtos.push({
                    nome,
                    preco,
                    descricao,
                    sabores: saboresArray,
                    personalizavel: personalizavel,
                    imagem: null
                });
                
                salvarProdutos();
                renderizarProdutos();
                atualizarListaProdutosAdmin();
                formAdicionarProduto.reset();
                mostrarMensagemCarrinho('Produto adicionado com sucesso! ✅');
            }
        });
    }
    
    // Fecha modal de login admin ao clicar fora
    const modalAdminLogin = document.getElementById('modalAdminLogin');
    if (modalAdminLogin) {
        modalAdminLogin.addEventListener('click', function(e) {
            if (e.target === modalAdminLogin) {
                fecharModalAdminLogin();
            }
        });
    }
    
    // Fecha modal de login admin com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            fecharModalAdminLogin();
        }
    });
});

// ============================================
// EXPOSIÇÃO GLOBAL DE FUNÇÕES
// Permite uso via console do navegador para testes
// ============================================
window.adicionarProduto = adicionarProduto;
window.removerProduto = removerProduto;
window.limparProdutos = limparProdutos;
window.produtos = produtos;
window.abrirModalCompra = abrirModalCompra;
window.fecharModalCompra = fecharModalCompra;
window.buscarCEP = buscarCEP;
window.fecharModalBoasVindas = fecharModalBoasVindas;
// Funções do carrinho
window.adicionarAoCarrinho = adicionarAoCarrinhoComSabor; // Compatibilidade com HTML
window.adicionarAoCarrinhoComSabor = adicionarAoCarrinhoComSabor;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidadeCarrinho = atualizarQuantidadeCarrinho;
window.abrirModalCarrinho = abrirModalCarrinho;
window.fecharModalCarrinho = fecharModalCarrinho;
window.finalizarCompraCarrinho = finalizarCompraCarrinho;
window.limparCarrinho = limparCarrinho;
// Funções de autenticação admin
window.abrirModalAdminLogin = abrirModalAdminLogin;
window.fecharModalAdminLogin = fecharModalAdminLogin;
window.sairAdmin = sairAdmin;
window.mostrarTabAdmin = mostrarTabAdmin;
window.editarProduto = editarProduto;
window.excluirProduto = excluirProduto;
window.fecharModalEditar = fecharModalEditar;
window.previewImagem = previewImagem;
window.removerPreview = removerPreview;
const formAdicionarProduto = document.getElementById('formAdicionarProduto');

if (formAdicionarProduto) {
    formAdicionarProduto.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = produtoNome.value.trim();
        const preco = parseFloat(produtoPreco.value);
        const descricao = produtoDescricao.value.trim();
        const sabores = produtoSabores.value.trim();
        const personalizavel = produtoPersonalizavel.checked;
        const imagemInput = produtoImagem;

        if (!nome || !descricao || isNaN(preco) || preco <= 0) {
            mostrarMensagem('Preencha todos os campos obrigatórios!', 'error');
            return;
        }

        const saboresArray = sabores
            ? sabores.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const salvar = (imagem = null) => {
            produtos.push({
                nome,
                preco,
                descricao,
                sabores: saboresArray,
                personalizavel,
                imagem
            });

            salvarProdutos();        // ✅ salva no localStorage correto
            renderizarProdutos();    // ✅ atualiza a vitrine
            atualizarListaProdutosAdmin(); // ✅ atualiza admin

            formAdicionarProduto.reset();
            mostrarMensagemCarrinho('Produto adicionado com sucesso! ✅');
        };

        if (imagemInput.files && imagemInput.files[0]) {
            const reader = new FileReader();
            reader.onload = e => salvar(e.target.result);
            reader.readAsDataURL(imagemInput.files[0]);
        } else {
            salvar(null);
        }
    });
}
