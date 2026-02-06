# Como as alterações aparecem em todos os aparelhos

## Obrigatório: acessar o site por um servidor

- **Certo:** abrir no navegador **http://localhost/nome-da-pasta/** (XAMPP) ou **https://seusite.com/**
- **Errado:** abrir o arquivo **index.html** direto do disco (file://)

Se abrir por file://, as alterações ficam só no seu navegador e **não** vão para outros aparelhos.

---

## O que acontece quando você edita no site

1. Você adiciona, edita ou exclui um produto ou promoção no painel admin.
2. O site envia os dados para **api/dados.php** (no mesmo servidor).
3. O PHP grava no banco:
   - Se o **MySQL** estiver configurado (api/config/config.php e banco criado), usa MySQL.
   - Se não, usa **SQLite** (arquivo api/flor.sqlite) — criado automaticamente.
4. Outros aparelhos que estiverem com o site aberto recebem a atualização em até **5 segundos** (sincronização automática).
5. Quem abrir o site depois já vê os dados atualizados do servidor.

---

## Passos para funcionar (XAMPP)

1. Coloque a pasta do projeto dentro de **htdocs** (ex: **C:\xampp\htdocs\doceria**).
2. Inicie o **Apache** (e o **MySQL**, se for usar MySQL) no XAMPP.
3. No navegador, acesse: **http://localhost/doceria/**
4. Entre no painel admin e faça uma alteração. Deve aparecer a mensagem **"Salvo! Atualiza em todos os aparelhos"**.
5. No celular (ou outro PC), abra o **mesmo endereço** (ex: **http://IP-DO-PC:80/doceria/**). Em até 5 segundos a lista deve atualizar, ou recarregue a página.

---

## Se não atualizar em outros aparelhos

- Confirme que está acessando por **http://** (ou **https://**), não por file://.
- Confirme que a pasta **api** está no servidor e que o PHP está ativo.
- Se usar MySQL: crie o banco, execute **sql/schema.sql** e preencha **api/config/config.php**.
- Se não usar MySQL: deixe o PHP criar o **api/flor.sqlite** sozinho (a pasta api precisa ter permissão de escrita).
