# Fazer o banco de dados funcionar (PHP + MySQL)

Quando você **edita no site** (adicionar, editar ou excluir produto/promoção), os dados vão **automaticamente** para o MySQL. Não precisa cadastrar nada direto no banco.

---

## Passo 1: Criar o banco no MySQL

1. Abra o **phpMyAdmin** (XAMPP) ou o painel da sua hospedagem.
2. Crie um banco chamado: **`flor_chocolate`**
   - Collation: **utf8mb4_unicode_ci**

---

## Passo 2: Criar as tabelas

1. Selecione o banco **flor_chocolate**.
2. Vá em **Importar** (ou **SQL**).
3. Copie todo o conteúdo do arquivo **`sql/schema.sql`** do projeto e execute.

Ou no terminal:

```bash
mysql -u root -p flor_chocolate < sql/schema.sql
```

---

## Passo 3: Configuração do PHP (já feita para XAMPP)

O arquivo **`api/config/config.php`** já está configurado para XAMPP:

- **Servidor:** localhost  
- **Banco:** flor_chocolate  
- **Usuário:** root  
- **Senha:** (vazia)

Se o seu MySQL tiver senha ou outro usuário, edite **`api/config/config.php`** e altere `db_user` e `db_pass`.

---

## Passo 4: Testar a conexão

Abra no navegador:

- **http://localhost/nome-da-pasta/api/check.php**

Se estiver tudo certo, deve aparecer algo como:

```json
{
  "php": true,
  "mysql": true,
  "tabelas": true,
  "erro": null
}
```

Se aparecer `"mysql": false` ou `"tabelas": false`, veja a mensagem em `"erro"` e ajuste o banco ou o `config.php`.

---

## Como funciona o “editar no site → banco”

1. Você abre o site e entra no **painel admin**.
2. **Adiciona**, **edita** ou **exclui** um produto ou promoção.
3. O site envia os dados para **api/dados.php** (PHP).
4. O PHP grava no **MySQL**.
5. Aparece a mensagem **“Salvo no banco!”** quando deu certo.
6. Qualquer pessoa que abrir o site (inclusive no celular) vê os dados que estão no banco.

Ou seja: **tudo que você altera no site já vai direto para o banco**; não precisa cadastrar nada manualmente no MySQL.
