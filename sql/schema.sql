-- ============================================
-- Flor de Chocolate - Banco de dados online (MySQL)
-- Execute este script no MySQL para criar as tabelas.
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Tabela de produtos (banco central do site)
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL DEFAULT 0,
    descricao TEXT,
    sabores TEXT COMMENT 'JSON: array de sabores, ex: ["Chocolate", "Morango"]',
    personalizavel TINYINT(1) NOT NULL DEFAULT 0,
    imagem LONGTEXT COMMENT 'URL ou base64 da imagem',
    destaque TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_destaque (destaque)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de promoções e destaques
CREATE TABLE IF NOT EXISTS promocoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    badge VARCHAR(100) DEFAULT NULL,
    emoji VARCHAR(20) DEFAULT '🍰',
    preco_original DECIMAL(10, 2) NOT NULL DEFAULT 0,
    preco_promocao DECIMAL(10, 2) NOT NULL DEFAULT 0,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Exemplo de inserção (opcional):
-- INSERT INTO produtos (nome, preco, descricao, sabores, personalizavel, imagem, destaque)
-- VALUES ('Brigadeiro', 3.50, 'Brigadeiro artesanal', '["Tradicional", "Coco"]', 1, NULL, 1);
