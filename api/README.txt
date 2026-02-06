API Flor de Chocolate - Banco de dados online (MySQL)

Backend em PHP com MySQL. Produtos e promoções ficam no banco central;
qualquer alteração reflete automaticamente para todos os usuários (site e celular).

Requisitos:
- Servidor com PHP (XAMPP, hospedagem, etc.)
- MySQL (ou MariaDB) com banco criado
- Extensão PDO MySQL habilitada no PHP

Como usar:
1. Crie o banco MySQL e execute o script sql/schema.sql (veja API-DOCS.md).
2. Copie api/config/config.example.php para api/config/config.php e preencha
   db_host, db_name, db_user, db_pass.
3. Coloque o site (incluindo api/ e sql/) no servidor.
4. O frontend chama api/dados.php (GET = carregar tudo, POST = salvar tudo).
   Para API REST por recurso use api/produtos.php e api/promocoes.php.

Documentação completa: API-DOCS.md (raiz do projeto).
