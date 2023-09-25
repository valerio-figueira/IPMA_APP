# IPMA Server Application - API RESTful

API para o Instituto de Previdência Municipal de Monte Alegre de Minas

Bem-vindo ao repositório da API desenvolvida para o Instituto de Previdência Municipal de Monte Alegre de Minas. Esta aplicação foi criada para facilitar o cadastro de usuários (titulares, dependentes e administradores), gerenciar convênios médicos e odontológicos, bem como controlar pagamentos e mensalidades. Este README fornecerá informações essenciais sobre o projeto, sua estrutura e como começar a usá-lo.

## Tecnologias Utilizadas:

A aplicação foi desenvolvida utilizando as seguintes tecnologias:

- Node.js
- Express.js
- MySQL
- Sequelize (ORM)
- TypeScript

## Dependências

Aqui está a lista das principais dependências utilizadas no projeto:

- body-parser: ^1.20.2
- cors: ^2.8.5
- dotenv: ^16.0.3
- express: ^4.18.2
- express-session: ^1.17.3
- mysql2: ^3.3.3
- sequelize: ^6.33.0
- sequelize-cli: ^6.6.1
- typescript: ^5.0.4

## Estrutura de Diretórios

A estrutura de diretórios do projeto está organizada da seguinte forma:

- classes: Classes reutilizáveis e utilitárias.
- config: Configurações da aplicação, como configuração de CORS, Session (autenticação), etc.
- controllers: Controladores da aplicação, que lidam com a lógica de negócios.
- db: Arquivos relacionados ao banco de dados.
- helpers: Funções auxiliares e utilitárias.
- interfaces: Interfaces TypeScript para manter a tipagem consistente.
- models: Modelos Sequelize para representar as tabelas do banco de dados.
- repositories: Repositórios que abstraem as operações de banco de dados.
- routes: Definição das rotas da API.
- services: Lógica de serviço para executar operações de negócios complexas.
- app.ts: Arquivo de entrada da aplicação Express.
- server.ts: Configuração do servidor e inicialização.

## Funcionalidades

A aplicação está em desenvolvimento e atualmente oferece as seguintes funcionalidades:

- Cadastro de usuários (titulares, dependentes e administradores).
- Gerenciamento de convênios médicos e odontológicos.
- Controle de pagamentos e mensalidades.

## Modelagem de Dados

![Data Model](https://github.com/valerio-figueira/IPMA_EXPRESS_SERVER/blob/master/src/db/data_model_sql.png)

## Como Começar

Para executar a aplicação em seu ambiente local, siga estas etapas:

### Instale as dependências:

#### `npm install`

### Inicie o servidor de desenvolvimento:

#### `npm run dev`

Agora a aplicação estará disponível em http://localhost:9292.

## Contribuição

Contribuições para o desenvolvimento deste projeto são bem-vindas! Sinta-se à vontade para criar problemas (issues) ou enviar solicitações de pull (pull requests) para melhorar a aplicação.

## Contato

Para entrar em contato, envie um email para [j.valerio.figueira@gmail.com].