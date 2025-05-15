// Script para resetar completamente o banco de dados
const fs = require('fs');
const path = require('path');

console.log('Iniciando reset completo do banco de dados...');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'db', 'apontamentos.db');

// Verificar se o arquivo existe
if (fs.existsSync(dbPath)) {
    // Remover o arquivo do banco de dados
    try {
        fs.unlinkSync(dbPath);
        console.log('Arquivo do banco de dados removido com sucesso.');
    } catch (err) {
        console.error('Erro ao remover arquivo do banco de dados:', err);
        process.exit(1);
    }
} else {
    console.log('Arquivo do banco de dados não encontrado. Será criado um novo.');
}

// Carregar o módulo de banco de dados para recriar as tabelas
try {
    const db = require('./database.js');
    console.log('Banco de dados recriado com sucesso com tabelas vazias!');
} catch (err) {
    console.error('Erro ao recriar o banco de dados:', err);
    process.exit(1);
}

console.log('Reset completo do banco de dados finalizado!'); 