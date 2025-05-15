# Sistema de Apontamentos com Banco de Dados SQLite

Este projeto implementa uma versão do Sistema de Apontamentos utilizando um banco de dados SQLite, adequado para implantação em um ambiente VPS.

## Estrutura do Projeto

O sistema consiste em três módulos principais:

- **THT**: Módulo para registro de apontamentos de produção THT.
- **SMT**: Módulo para registro de apontamentos de produção SMT.
- **Qualidade**: Módulo para registro de apontamentos de qualidade.

A API fornece endpoints para cada módulo, permitindo o armazenamento persistente dos dados em um banco de dados SQLite.

## Requisitos

- Node.js 12.x ou superior
- NPM ou Yarn

## Instalação

1. Clone o repositório ou faça upload dos arquivos para sua VPS
2. Navegue até a pasta da API:

```bash
cd api
```

3. Instale as dependências:

```bash
npm install
# ou
yarn install
```

4. Inicie o servidor:

```bash
npm start
# ou
yarn start
```

## Configuração para VPS

Para configurar o sistema em uma VPS, você pode usar o PM2 para manter o servidor rodando:

1. Instale o PM2 globalmente:

```bash
npm install -g pm2
```

2. Inicie a aplicação com PM2:

```bash
cd api
pm2 start server.js --name apontamentos-api
```

3. Configure o PM2 para iniciar na inicialização do sistema:

```bash
pm2 startup
pm2 save
```

## Configuração de Proxy Reverso (Nginx)

Para configurar um proxy reverso com Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Estrutura do Banco de Dados

O banco de dados SQLite é criado automaticamente na pasta `api/db` com as seguintes tabelas:

- **clientes**: Armazena os dados dos clientes
- **operadores**: Armazena os dados dos operadores
- **lideres**: Armazena os dados dos líderes
- **conferentes**: Armazena os dados dos conferentes
- **inspetores**: Armazena os dados dos inspetores
- **ocorrencias**: Armazena os tipos de ocorrências para cada módulo
- **apontamentos_tht**: Armazena os apontamentos do módulo THT
- **apontamentos_smt**: Armazena os apontamentos do módulo SMT
- **apontamentos_qualidade**: Armazena os apontamentos do módulo Qualidade

## API Endpoints

### THT
- GET `/api/tht/ocorrencias`: Retorna todas as ocorrências do módulo THT
- GET `/api/tht/apontamentos`: Retorna todos os apontamentos do módulo THT
- POST `/api/tht/apontamentos`: Cria um novo apontamento no módulo THT

### SMT
- GET `/api/smt/ocorrencias`: Retorna todas as ocorrências do módulo SMT
- GET `/api/smt/apontamentos`: Retorna todos os apontamentos do módulo SMT
- POST `/api/smt/apontamentos`: Cria um novo apontamento no módulo SMT

### Qualidade
- GET `/api/qualidade/apontamentos`: Retorna todos os apontamentos do módulo Qualidade
- POST `/api/qualidade/apontamentos`: Cria um novo apontamento no módulo Qualidade

### Listas
- GET `/api/clientes`: Retorna a lista de clientes
- GET `/api/operadores`: Retorna a lista de operadores
- GET `/api/lideres`: Retorna a lista de líderes
- GET `/api/conferentes`: Retorna a lista de conferentes
- GET `/api/inspetores`: Retorna a lista de inspetores

## Backup do Banco de Dados

É recomendável configurar backups periódicos do arquivo do banco de dados localizado em `api/db/apontamentos.db`. Você pode usar uma tarefa cron para isso:

```bash
# Exemplo de tarefa cron para backup diário às 3 da manhã
0 3 * * * cp /caminho/para/api/db/apontamentos.db /caminho/para/backups/apontamentos_$(date +\%Y\%m\%d).db
```

## Suporte

Para suporte ou dúvidas, entre em contato com o desenvolvedor: Rafa Correia. 