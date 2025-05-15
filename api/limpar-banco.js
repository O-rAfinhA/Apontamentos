// Script para limpar o banco de dados
const db = require('./database.js');

console.log('Iniciando limpeza do banco de dados...');

// Limpar o banco de dados
db.clearAllData()
  .then(() => {
    console.log('Banco de dados limpo com sucesso!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro ao limpar o banco de dados:', err);
    process.exit(1);
  }); 