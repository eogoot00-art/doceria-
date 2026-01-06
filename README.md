# 🍰 Doces Dourados - Site de Divulgação

Site elegante e moderno para divulgação de doces artesanais com design dourado e detalhes em rosa.

## 🎨 Características

- Design dourado/ouro com detalhes em rosa
- Totalmente responsivo (funciona em celular, tablet e desktop)
- Integração com WhatsApp para pedidos
- Animações suaves e elegantes
- Interface moderna e profissional

## 📦 Como Adicionar Produtos

### Método 1: Via Console do Navegador

1. Abra o site no navegador
2. Pressione F12 para abrir o console
3. Use o seguinte comando:

```javascript
adicionarProduto("Nome do Produto", "Descrição do produto", 15.90, "🍰");
```

**Exemplo:**
```javascript
adicionarProduto("Brigadeiro Gourmet", "Brigadeiro artesanal com chocolate belga e cobertura dourada", 2.50, "🍫");
adicionarProduto("Bolo de Chocolate", "Bolo fofinho com cobertura de chocolate e decoração dourada", 45.00, "🎂");
adicionarProduto("Trufas", "Trufas recheadas com sabores especiais", 3.00, "🍪");
```

### Método 2: Editando o arquivo script.js

Abra o arquivo `script.js` e adicione produtos no array `produtos`:

```javascript
const produtos = [
    {
        nome: "Brigadeiro Gourmet",
        descricao: "Brigadeiro artesanal com chocolate belga e cobertura dourada",
        preco: 2.50,
        emoji: "🍫"
    },
    {
        nome: "Bolo de Chocolate",
        descricao: "Bolo fofinho com cobertura de chocolate e decoração dourada",
        preco: 45.00,
        emoji: "🎂"
    },
    // Adicione mais produtos aqui...
];
```

## 📱 WhatsApp

Todos os produtos têm um botão "Comprar Agora" que redireciona para o WhatsApp:
- **Número:** +55 12 99221-6807
- A mensagem já vem pré-formatada com o nome e preço do produto

## 🚀 Como Usar

1. Abra o arquivo `index.html` no seu navegador
2. Adicione seus produtos usando um dos métodos acima
3. Personalize conforme necessário

## 🎯 Estrutura de Arquivos

- `index.html` - Estrutura do site
- `style.css` - Estilos e design
- `script.js` - Funcionalidades e produtos

## 💡 Dicas

- Use emojis diferentes para cada produto para deixar mais visual
- Os preços devem ser números (ex: 15.90, não "R$ 15,90")
- A descrição ajuda os clientes a entenderem melhor o produto
