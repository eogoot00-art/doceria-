API Flor de Chocolate - Banco de dados online (SQLite no servidor)

O arquivo dados.php usa SQLite no servidor. Quando alguém acessa ou altera
produtos/promoções, os dados vêm e vão para o arquivo flor.sqlite (criado
automaticamente na primeira requisição).

Requisitos:
- Servidor com PHP (XAMPP, hospedagem com PHP, etc.)
- Extensão PDO SQLite habilitada no PHP (geralmente já vem)
- Pasta "api" com permissão de escrita (para criar flor.sqlite)

Como usar:
1. Coloque todo o site (incluindo a pasta api) no servidor (XAMPP: htdocs;
   hospedagem: public_html ou pasta do domínio).
2. Acesse o site pelo navegador (ex: http://localhost/doceria/ ou sua URL).
3. Ao abrir a página, o site carrega produtos e promoções da API.
4. Ao adicionar/editar/excluir produto ou promoção no painel admin, os dados
   são enviados para a API e salvos no SQLite no servidor.
5. Qualquer pessoa que acessar o site verá as alterações (dados online).

Se a API não estiver disponível (ex: abrindo o HTML direto no disco), o site
usa localStorage como fallback (dados só neste aparelho).
