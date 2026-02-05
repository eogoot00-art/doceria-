/* ============================================
   FLOR DE CHOCOLATE - JAVASCRIPT
   Sistema de gerenciamento de produtos
   Integração com WhatsApp para pedidos
   Animações ao rolar a página
   Mensagem de boas-vindas
   Sistema de autenticação (Admin e Cliente)
   Painel administrativo
   ============================================ */

// ============================================
// ARRAY DE PRODUTOS
// Contém todos os produtos disponíveis na doceria
// Cada produto possui: nome, descricao, preco e imagem
// ============================================
const produtos = [
    {
        nome: "Brigadeiros",
        descricao: "O clássico brasileiro que conquistou o mundo! Feitos com ingredientes premium e enrolados à mão com muito carinho. Escolha seu sabor favorito ou experimente todos!",
        imagem: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Tradicional", preco: 3.00, descricao: "Chocolate em pó premium com granulado tradicional" },
            { nome: "Dourado", preco: 3.50, descricao: "Chocolate belga com granulado dourado especial" },
            { nome: "Nutella", preco: 4.00, descricao: "Cremoso sabor Nutella com granulado especial" },
            { nome: "Ninho", preco: 3.50, descricao: "Suave sabor leite Ninho coberto com leite em pó" },
            { nome: "Maracujá", preco: 3.50, descricao: "Refrescante sabor tropical com açúcar cristal" },
            { nome: "Oreo", preco: 4.00, descricao: "Cremoso com pedaços de biscoito Oreo" }
        ]
    },
    {
        nome: "Beijinhos",
        descricao: "A doçura do coco em suas mais deliciosas variações! Preparados com coco fresco e leite condensado selecionado. Cada beijinho é um carinho doce que derrete na boca.",
        imagem: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Tradicional", preco: 3.00, descricao: "Coco fresco com cobertura de coco ralado" },
            { nome: "Limão", preco: 3.50, descricao: "Cítrico refrescante com raspas de limão" },
            { nome: "Chocolate Branco", preco: 4.00, descricao: "Cremosidade do chocolate branco com coco" },
            { nome: "Maracujá", preco: 3.50, descricao: "Tropical e refrescante com polpa natural" }
        ]
    },
    {
        nome: "Trufas Gourmet",
        descricao: "Pequenas esferas de puro prazer! Recheios cremosos envoltos em cascas delicadas. Cada trufa é uma experiência sofisticada que derrete na boca e deixa um sabor inesquecível.",
        imagem: "https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Chocolate Belga", preco: 4.50, descricao: "Recheio cremoso de chocolate belga premium" },
            { nome: "Café", preco: 5.00, descricao: "Sabor intenso de café premium com cacau" },
            { nome: "Morango", preco: 5.00, descricao: "Recheio frutado com chocolate branco" },
            { nome: "Pistache", preco: 6.00, descricao: "Sofisticado sabor de pistache importado" },
            { nome: "Doce de Leite", preco: 5.50, descricao: "Cremoso doce de leite argentino" },
            { nome: "Limão", preco: 5.00, descricao: "Refrescante sabor cítrico com chocolate branco" }
        ]
    },
    {
        nome: "Brownies",
        descricao: "Tentação irresistível de chocolate! Macios e cremosos por dentro, com crosta crocante por fora. Feitos com chocolate belga premium e muito amor. Escolha sua variação favorita!",
        imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Tradicional", preco: 8.00, descricao: "Clássico brownie de chocolate belga" },
            { nome: "Com Nozes", preco: 9.50, descricao: "Com pedaços crocantes de nozes selecionadas" },
            { nome: "Doce de Leite", preco: 10.00, descricao: "Recheio cremoso de doce de leite argentino" },
            { nome: "Cookies & Cream", preco: 10.50, descricao: "Com pedaços de biscoito Oreo" }
        ]
    },
    {
        nome: "Cupcakes",
        descricao: "Pequenos bolos com coberturas especiais! Massas fofinhas e úmidas, cobertas com buttercream cremoso. Decorados com carinho e finalizados com detalhes especiais.",
        imagem: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Chocolate", preco: 6.50, descricao: "Massa de chocolate com buttercream de chocolate" },
            { nome: "Baunilha", preco: 6.00, descricao: "Massa delicada com buttercream colorido" },
            { nome: "Red Velvet", preco: 7.50, descricao: "Massa aveludada vermelha com cream cheese" },
            { nome: "Limão", preco: 6.50, descricao: "Massa cítrica com cream cheese e raspas de limão" },
            { nome: "Morango", preco: 7.00, descricao: "Massa de baunilha com buttercream de morango" },
            { nome: "Cenoura", preco: 6.50, descricao: "Massa de cenoura com cobertura de chocolate" }
        ]
    },
    {
        nome: "Bolos",
        descricao: "Bolos especiais para celebrações! Massas fofinhas e úmidas, recheios cremosos e coberturas especiais. Feitos com ingredientes premium e muito carinho. Perfeitos para ocasiões especiais.",
        imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Chocolate", preco: 65.00, descricao: "Massa de chocolate com recheio e cobertura de chocolate" },
            { nome: "Bolo da Vovó", preco: 70.00, descricao: "Receita tradicional com doce de leite e chocolate" },
            { nome: "Morango", preco: 75.00, descricao: "Massa de baunilha com creme e morangos frescos" },
            { nome: "Cenoura", preco: 60.00, descricao: "Clássico brasileiro com cobertura de chocolate" },
            { nome: "Red Velvet", preco: 80.00, descricao: "Massa vermelha aveludada com cream cheese" },
            { nome: "Limão", preco: 65.00, descricao: "Massa cítrica com recheio de limão e merengue" }
        ]
    },
    {
        nome: "Cookies",
        descricao: "Combinação perfeita de texturas! Crocantes por fora, macios por dentro. Feitos com receitas especiais e ingredientes selecionados. Perfeitos para acompanhar um café ou chá.",
        imagem: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Chocolate", preco: 4.50, descricao: "Com pedaços generosos de chocolate belga" },
            { nome: "Aveia e Passas", preco: 4.00, descricao: "Nutritivo com aveia em flocos e passas" },
            { nome: "Red Velvet", preco: 5.00, descricao: "Massa vermelha com chocolate branco" },
            { nome: "Limão", preco: 4.50, descricao: "Cítrico refrescante com raspas de limão" },
            { nome: "Amendoim", preco: 4.50, descricao: "Crocante com pasta de amendoim" }
        ]
    },
    {
        nome: "Copos da Felicidade",
        descricao: "Felicidade em camadas! Bolos macios, recheios cremosos e coberturas especiais em copos individuais. Cada colherada é uma surpresa deliciosa. Perfeitos para presentear ou se mimar!",
        imagem: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        sabores: [
            { nome: "Chocolate", preco: 12.00, descricao: "Camadas de bolo e mousse de chocolate" },
            { nome: "Morango", preco: 13.00, descricao: "Bolo de baunilha com creme e morangos frescos" },
            { nome: "Doce de Leite", preco: 13.50, descricao: "Bolo de baunilha com doce de leite argentino" },
            { nome: "Limão", preco: 12.50, descricao: "Refrescante com creme de limão siciliano" },
            { nome: "Red Velvet", preco: 14.00, descricao: "Massa vermelha com cream cheese" }
        ]
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
    senha: 'florchocolate2026!'
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

// Abre ou fecha a lista de sabores
document.querySelectorAll("adicionar-sabores").forEach(btn => {
  btn.addEventListener("click", (add) => {
    const container = btn.nextElementSibling; // pega a div .sabores-opcoes
    container.style.display = container.style.display === "none" ? "block" : "none";
  });
});

// Confirma sabores selecionados e adiciona ao carrinho
document.querySelectorAll(".btn-confirmar-sabores").forEach(btn => {
  btn.addEventListener("click", () => {
    const container = btn.parentElement;
    const produto = container.closest(".produto");
    const produtoNome = produto.querySelector("h3").innerText;

    // Pega todos os sabores selecionados
    const saboresSelecionados = Array.from(container.querySelectorAll("input[type=checkbox]:checked"))
      .map(checkbox => checkbox.value);

    if (saboresSelecionados.length === 0) {
      alert("Escolha pelo menos um sabor!");
      return;
    }

    // Aqui você envia para o carrinho (substitua se tiver carrinho real)
    console.log(`Produto: ${produtoNome}, Sabores: ${saboresSelecionados.join(", ")}`);
    alert(`Produto adicionado ao carrinho: ${produtoNome} - ${saboresSelecionados.join(", ")}`);

    // Fecha a lista e limpa seleção
    container.style.display = "none";
    container.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
  });
});

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
        
        // Garante que o botão de adicionar produto esteja habilitado
        const btnAdicionarProduto = document.querySelector('#formAdicionarProduto button[type="submit"]');
        if (btnAdicionarProduto) {
            btnAdicionarProduto.disabled = false;
            btnAdicionarProduto.style.opacity = '1';
            btnAdicionarProduto.style.cursor = 'pointer';
        }
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
        const fileInput = document.getElementById('editImagem');
        
        if (!novoNome || !novaDescricao || isNaN(novoPreco) || novoPreco <= 0) {
            mostrarMensagem('Por favor, preencha todos os campos corretamente!', 'error');
            return;
        }
        
        // Processa a imagem se houver uma nova
        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                produtos[index] = {
                    nome: novoNome,
                    preco: novoPreco,
                    descricao: novaDescricao,
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
 * Salva produtos no localStorage
 */
function salvarProdutos() {
    localStorage.setItem('produtosFlorChocolate', JSON.stringify(produtos));
}

/**
 * Carrega produtos do localStorage
 */
function carregarProdutos() {
    const produtosSalvos = localStorage.getItem('produtosFlorChocolate');
    if (produtosSalvos) {
        try {
            const produtosCarregados = JSON.parse(produtosSalvos);
            produtos.length = 0;
            produtos.push(...produtosCarregados);
        } catch (e) {
            console.error('Erro ao carregar produtos:', e);
        }
    }
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

/**
 * Adiciona um produto ao carrinho
 * @param {string} produtoNome - Nome do produto
 * @param {number} produtoPreco - Preço do produto
 */
function adicionarAoCarrinho(produtoNome, produtoPreco) {
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.nome === produtoNome);
    
    if (produtoExistente) {
        // Se já existe, aumenta a quantidade
        produtoExistente.quantidade += 1;
    } else {
        // Se não existe, adiciona novo item
        carrinho.push({
            nome: produtoNome,
            preco: produtoPreco,
            quantidade: 1
        });
    }
    
    // Atualiza o contador do carrinho
    atualizarContadorCarrinho();
    
    // Mostra mensagem de confirmação
    mostrarMensagemCarrinho(`${produtoNome} adicionado ao carrinho! 🛒`);
    
    // Salva no localStorage
    salvarCarrinho();
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
    const modal = document.getElementById('modalCarrinho');
    if (modal) {
        atualizarModalCarrinho();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
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
    const carrinhoItens = document.getElementById('carrinhoItens');
    const carrinhoTotal = document.getElementById('carrinhoTotal');
    const btnFinalizarCarrinho = document.getElementById('btnFinalizarCarrinho');
    
    if (!carrinhoItens) return;
    
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
        return `
            <div class="carrinho-item">
                <div class="carrinho-item-info">
                    <h4 class="carrinho-item-nome">${escaparHTML(item.nome)}</h4>
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
 * Salva o carrinho no localStorage
 */
function salvarCarrinho() {
    localStorage.setItem('carrinhoFlorChocolate', JSON.stringify(carrinho));
}

/**
 * Carrega o carrinho do localStorage
 */
function carregarCarrinho() {
    const carrinhoSalvo = localStorage.getItem('carrinhoFlorChocolate');
    if (carrinhoSalvo) {
        try {
            carrinho = JSON.parse(carrinhoSalvo);
            atualizarContadorCarrinho();
        } catch (e) {
            console.error('Erro ao carregar carrinho:', e);
            carrinho = [];
        }
    }
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
    let mensagem = `🌺 *PEDIDO - Flor de Chocolate*\n\n`;
    
    // Se for compra do carrinho, lista todos os produtos
    if (produtoSelecionado.isCarrinho) {
        mensagem += `*Produtos:*\n`;
        carrinho.forEach((item, index) => {
            const subtotal = (item.preco * item.quantidade).toFixed(2).replace('.', ',');
            mensagem += `${index + 1}. ${item.nome} (${item.quantidade}x)\n`;
            mensagem += `   R$ ${item.preco.toFixed(2).replace('.', ',')} cada = R$ ${subtotal}\n\n`;
        });
        mensagem += `*Total:* R$ ${produtoSelecionado.preco.toFixed(2).replace('.', ',')}\n\n`;
    } else {
        // Compra de produto único
        mensagem += `*Produto:*\n${produtoSelecionado.nome}\n`;
        mensagem += `*Preço:* R$ ${produtoSelecionado.preco.toFixed(2).replace('.', ',')}\n\n`;
    }
    
    mensagem += `*Endereço de Entrega:*\n`;
    mensagem += `📍 ${endereco}\n`;
    mensagem += `${cidade} - ${estado}\n`;
    mensagem += `CEP: ${cep}\n\n`;
    
    if (observacoes) {
        mensagem += `*Observações:*\n${observacoes}\n\n`;
    }
    
    mensagem += `Gostaria de confirmar este pedido! 🍫🌺`;

    // Formata número do WhatsApp
    const whatsappNumero = formatarWhatsApp('+55 12 99221-6807');
    const mensagemEncoded = encodeURIComponent(mensagem);
    const linkWhatsApp = `https://wa.me/${whatsappNumero}?text=${mensagemEncoded}`;
    
    // Abre WhatsApp
    window.open(linkWhatsApp, '_blank');
    
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
            <div class="produto-botoes">
                <button class="btn-comprar" onclick="abrirModalCompra('${nomeEscapado}', ${produto.preco})">
                    Comprar Agora
                </button>
                <button class="btn-carrinho" onclick="adicionarAoCarrinho('${nomeEscapado}', ${produto.preco})">
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
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
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
            
            // Verifica se o admin está logado
            if (!adminLogado) {
                mostrarMensagemCarrinho('Você precisa estar logado como administrador! 🔐');
                return;
            }
            
            const nome = document.getElementById('produtoNome').value.trim();
            const preco = parseFloat(document.getElementById('produtoPreco').value);
            const descricao = document.getElementById('produtoDescricao').value.trim();
            const fileInput = document.getElementById('produtoImagem');
            
            if (!nome || !descricao || isNaN(preco) || preco <= 0) {
                mostrarMensagemCarrinho('Por favor, preencha todos os campos obrigatórios! ❌');
                return;
            }
            
            // Processa a imagem se houver
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    produtos.push({
                        nome,
                        preco,
                        descricao,
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
window.adicionarAoCarrinho = adicionarAoCarrinho;
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