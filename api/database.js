const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Certifique-se que o diretório db existe
const dbDir = path.join(__dirname, 'db');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Caminho para o banco de dados
const dbPath = path.join(dbDir, 'apontamentos.db');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
        initDatabase();
    }
});

// Inicializar as tabelas do banco de dados
function initDatabase() {
    // Habilitar chaves estrangeiras
    db.run('PRAGMA foreign_keys = ON', (err) => {
        if (err) {
            console.error('Erro ao habilitar chaves estrangeiras:', err.message);
        }
    });

    // Criar tabela para clientes
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela clientes:', err.message);
        }
    });

    // Criar tabela para operadores
    db.run(`CREATE TABLE IF NOT EXISTS operadores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela operadores:', err.message);
        }
    });

    // Criar tabela para líderes
    db.run(`CREATE TABLE IF NOT EXISTS lideres (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela lideres:', err.message);
        }
    });

    // Criar tabela para conferentes
    db.run(`CREATE TABLE IF NOT EXISTS conferentes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela conferentes:', err.message);
        }
    });

    // Criar tabela para inspetores
    db.run(`CREATE TABLE IF NOT EXISTS inspetores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela inspetores:', err.message);
        }
    });

    // Criar tabela de ocorrências
    db.run(`CREATE TABLE IF NOT EXISTS ocorrencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigo TEXT NOT NULL,
        operacao TEXT NOT NULL,
        tipo TEXT NOT NULL,
        modulo TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela ocorrencias:', err.message);
        } else {
            // Inserir ocorrências padrão para o módulo THT se ainda não existirem
            db.get('SELECT COUNT(*) as count FROM ocorrencias WHERE modulo = "THT"', (err, row) => {
                if (err) {
                    console.error('Erro ao verificar ocorrências THT:', err.message);
                } else if (row.count === 0) {
                    insertDefaultOcorrenciasTHT();
                }
            });
            
            // Inserir ocorrências padrão para o módulo SMT se ainda não existirem
            db.get('SELECT COUNT(*) as count FROM ocorrencias WHERE modulo = "SMT"', (err, row) => {
                if (err) {
                    console.error('Erro ao verificar ocorrências SMT:', err.message);
                } else if (row.count === 0) {
                    insertDefaultOcorrenciasSMT();
                }
            });
        }
    });

    // Criar tabela para apontamentos THT
    db.run(`CREATE TABLE IF NOT EXISTS apontamentos_tht (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        cliente_id INTEGER NOT NULL,
        codigo_placa TEXT NOT NULL,
        ocorrencia_id INTEGER NOT NULL,
        odf TEXT NOT NULL,
        inicio TEXT NOT NULL,
        termino TEXT NOT NULL,
        qtd_pcs INTEGER NOT NULL,
        qtd_oper INTEGER NOT NULL,
        operador1_id INTEGER NOT NULL,
        operador2_id INTEGER,
        operador3_id INTEGER,
        operador4_id INTEGER,
        operador5_id INTEGER,
        operador6_id INTEGER,
        lider_id INTEGER NOT NULL,
        observacao TEXT,
        acoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencias(id),
        FOREIGN KEY (operador1_id) REFERENCES operadores(id),
        FOREIGN KEY (operador2_id) REFERENCES operadores(id),
        FOREIGN KEY (operador3_id) REFERENCES operadores(id),
        FOREIGN KEY (operador4_id) REFERENCES operadores(id),
        FOREIGN KEY (operador5_id) REFERENCES operadores(id),
        FOREIGN KEY (operador6_id) REFERENCES operadores(id),
        FOREIGN KEY (lider_id) REFERENCES lideres(id)
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela apontamentos_tht:', err.message);
        }
    });

    // Criar tabela para apontamentos SMT
    db.run(`CREATE TABLE IF NOT EXISTS apontamentos_smt (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        cliente_id INTEGER NOT NULL,
        codigo_placa TEXT NOT NULL,
        ocorrencia_id INTEGER NOT NULL,
        posicao_feeder TEXT,
        odf TEXT NOT NULL,
        inicio TEXT NOT NULL,
        termino TEXT NOT NULL,
        tempo_placa REAL,
        qtd_pcs INTEGER NOT NULL,
        pcas_danif INTEGER NOT NULL,
        operador_id INTEGER NOT NULL,
        conferente_id INTEGER NOT NULL,
        observacao TEXT,
        acoes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (ocorrencia_id) REFERENCES ocorrencias(id),
        FOREIGN KEY (operador_id) REFERENCES operadores(id),
        FOREIGN KEY (conferente_id) REFERENCES conferentes(id)
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela apontamentos_smt:', err.message);
        }
    });

    // Criar tabela para apontamentos Qualidade
    db.run(`CREATE TABLE IF NOT EXISTS apontamentos_qualidade (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data TEXT NOT NULL,
        codigo TEXT NOT NULL,
        odf TEXT NOT NULL,
        qtd_pcs INTEGER NOT NULL,
        qtd_comp INTEGER NOT NULL,
        qtd_pcs_rej INTEGER NOT NULL,
        qtd_comp_rej INTEGER NOT NULL,
        inspetor_id INTEGER NOT NULL,
        excesso_solda INTEGER DEFAULT 0,
        comp_alto INTEGER DEFAULT 0,
        curto INTEGER DEFAULT 0,
        deslocado INTEGER DEFAULT 0,
        oxidado INTEGER DEFAULT 0,
        falta_comp INTEGER DEFAULT 0,
        solder_ball INTEGER DEFAULT 0,
        tombstone INTEGER DEFAULT 0,
        comp_errado INTEGER DEFAULT 0,
        sobresolda INTEGER DEFAULT 0,
        comp_danificado INTEGER DEFAULT 0,
        comp_jogado INTEGER DEFAULT 0,
        pads_contam INTEGER DEFAULT 0,
        furo_solda INTEGER DEFAULT 0,
        falta_solda INTEGER DEFAULT 0,
        placa_suja INTEGER DEFAULT 0,
        repuxo INTEGER DEFAULT 0,
        solda_fria INTEGER DEFAULT 0,
        outros INTEGER DEFAULT 0,
        outros_observacao TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (inspetor_id) REFERENCES inspetores(id)
    )`, (err) => {
        if (err) {
            console.error('Erro ao criar tabela apontamentos_qualidade:', err.message);
        }
    });
}

// Inserir ocorrências padrão para THT
function insertDefaultOcorrenciasTHT() {
    const ocorrencias = [
        { codigo: "1", operacao: "PRODUÇÃO", tipo: "PROGRAMADA", modulo: "THT" },
        { codigo: "2", operacao: "DIVERGENCIA ALMOX", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "3", operacao: "ENGENHARIA", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "4", operacao: "FALTA DE AR COMPRIMIDO", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "5", operacao: "LIMPEZA", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "6", operacao: "MATERIA PRIMA NÃO CONFORME", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "7", operacao: "NÃO TRABALHADO", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "8", operacao: "PARADA PARA TREINAMENTO", tipo: "PROGRAMADA", modulo: "THT" },
        { codigo: "9", operacao: "QUEDA DE TENSÃO", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "10", operacao: "REFEIÇÃO", tipo: "PROGRAMADA", modulo: "THT" },
        { codigo: "11", operacao: "RETRABALHO", tipo: "PROGRAMADA", modulo: "THT" },
        { codigo: "12", operacao: "SEM DEMANDA", tipo: "IMPREVISTA", modulo: "THT" },
        { codigo: "13", operacao: "SETUP", tipo: "PROGRAMADA", modulo: "THT" },
        { codigo: "14", operacao: "OUTROS", tipo: "IMPREVISTA", modulo: "THT" }
    ];

    const stmt = db.prepare('INSERT INTO ocorrencias (codigo, operacao, tipo, modulo) VALUES (?, ?, ?, ?)');
    
    ocorrencias.forEach(ocorrencia => {
        stmt.run(ocorrencia.codigo, ocorrencia.operacao, ocorrencia.tipo, ocorrencia.modulo);
    });
    
    stmt.finalize();
}

// Inserir ocorrências padrão para SMT
function insertDefaultOcorrenciasSMT() {
    const ocorrencias = [
        { codigo: "1", operacao: "PRODUÇÃO", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "2", operacao: "CONFERÊNCIA PRIMEIRA PLACA", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "3", operacao: "DESABASTECIAMENTO DE SETUP", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "4", operacao: "DIVERGENCIA ALMOX", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "5", operacao: "ENGENHARIA", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "6", operacao: "ESPERANDO CLIENTE", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "7", operacao: "FALTA DE RECURSO OPERACIONAL", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "8", operacao: "FALTA DE AR COMPRIMIDO", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "9", operacao: "INSERÇÃO MANUAL COMPONENTE", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "10", operacao: "LIMPEZA", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "11", operacao: "MANUTENÇÃO PREVENTIVA", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "12", operacao: "MANUTENÇÃO CORRETIVA", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "13", operacao: "MATERIA PRIMA NÃO CONFORME", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "14", operacao: "NÃO TRABALHADO", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "15", operacao: "PARADA PARA TREINAMENTO", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "16", operacao: "QUALIDADE", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "17", operacao: "QUEDA DE TENSÃO", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "18", operacao: "REFEIÇÃO", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "19", operacao: "SEM DEMANDA", tipo: "IMPREVISTA", modulo: "SMT" },
        { codigo: "20", operacao: "SETUP", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "21", operacao: "TROCA DE FEEDER", tipo: "PROGRAMADA", modulo: "SMT" },
        { codigo: "22", operacao: "OUTROS", tipo: "IMPREVISTA", modulo: "SMT" }
    ];

    const stmt = db.prepare('INSERT INTO ocorrencias (codigo, operacao, tipo, modulo) VALUES (?, ?, ?, ?)');
    
    ocorrencias.forEach(ocorrencia => {
        stmt.run(ocorrencia.codigo, ocorrencia.operacao, ocorrencia.tipo, ocorrencia.modulo);
    });
    
    stmt.finalize();
}

// Funções para manipulação de dados - THT

// Obter todas as ocorrências do módulo THT
function getOcorrenciasTHT() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ocorrencias WHERE modulo = "THT" ORDER BY codigo', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Obter id ou inserir novo cliente
async function getOrCreateCliente(nome) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM clientes WHERE nome = ?', [nome], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.id);
            } else {
                db.run('INSERT INTO clientes (nome) VALUES (?)', [nome], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
}

// Obter id ou inserir novo operador
async function getOrCreateOperador(nome) {
    if (!nome) return null;
    
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM operadores WHERE nome = ?', [nome], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.id);
            } else {
                db.run('INSERT INTO operadores (nome) VALUES (?)', [nome], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
}

// Obter id ou inserir novo líder
async function getOrCreateLider(nome) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM lideres WHERE nome = ?', [nome], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.id);
            } else {
                db.run('INSERT INTO lideres (nome) VALUES (?)', [nome], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
}

// Inserir novo apontamento THT
async function createApontamentoTHT(apontamento) {
    try {
        // Obter ou criar IDs para os relacionamentos
        const clienteId = await getOrCreateCliente(apontamento.cliente);
        const operador1Id = await getOrCreateOperador(apontamento.operador1);
        const operador2Id = apontamento.operador2 ? await getOrCreateOperador(apontamento.operador2) : null;
        const operador3Id = apontamento.operador3 ? await getOrCreateOperador(apontamento.operador3) : null;
        const operador4Id = apontamento.operador4 ? await getOrCreateOperador(apontamento.operador4) : null;
        const operador5Id = apontamento.operador5 ? await getOrCreateOperador(apontamento.operador5) : null;
        const operador6Id = apontamento.operador6 ? await getOrCreateOperador(apontamento.operador6) : null;
        const liderId = await getOrCreateLider(apontamento.lider);

        // Obter ID da ocorrência
        const ocorrencia = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM ocorrencias WHERE codigo = ? AND modulo = "THT"', [apontamento.codOcorrencia], (err, row) => {
                if (err) reject(err);
                else if (row) resolve(row);
                else reject(new Error('Ocorrência não encontrada'));
            });
        });

        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO apontamentos_tht (
                    data, cliente_id, codigo_placa, ocorrencia_id, odf, inicio, 
                    termino, qtd_pcs, qtd_oper, operador1_id, operador2_id, operador3_id,
                    operador4_id, operador5_id, operador6_id, lider_id, observacao, acoes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(sql, [
                apontamento.data, 
                clienteId, 
                apontamento.codigoPlaca, 
                ocorrencia.id, 
                apontamento.odf, 
                apontamento.inicio,
                apontamento.termino, 
                apontamento.qtdPcs, 
                apontamento.qtdOper, 
                operador1Id, 
                operador2Id, 
                operador3Id,
                operador4Id, 
                operador5Id, 
                operador6Id, 
                liderId, 
                apontamento.observacao || null, 
                apontamento.acoes || null
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

// Obter todos os apontamentos THT com dados relacionados
async function getAllApontamentosTHT() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                a.id, a.data, c.nome as cliente, a.codigo_placa, o.codigo as cod_ocorrencia, 
                o.operacao, o.tipo, a.odf, a.inicio, a.termino, a.qtd_pcs, a.qtd_oper,
                op1.nome as operador1, op2.nome as operador2, op3.nome as operador3,
                op4.nome as operador4, op5.nome as operador5, op6.nome as operador6,
                l.nome as lider, a.observacao, a.acoes, a.created_at, a.updated_at
            FROM apontamentos_tht a
            JOIN clientes c ON a.cliente_id = c.id
            JOIN ocorrencias o ON a.ocorrencia_id = o.id
            JOIN operadores op1 ON a.operador1_id = op1.id
            LEFT JOIN operadores op2 ON a.operador2_id = op2.id
            LEFT JOIN operadores op3 ON a.operador3_id = op3.id
            LEFT JOIN operadores op4 ON a.operador4_id = op4.id
            LEFT JOIN operadores op5 ON a.operador5_id = op5.id
            LEFT JOIN operadores op6 ON a.operador6_id = op6.id
            JOIN lideres l ON a.lider_id = l.id
            ORDER BY a.data DESC, a.inicio DESC
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Funções para manipulação de dados - SMT

// Obter todas as ocorrências do módulo SMT
function getOcorrenciasSMT() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM ocorrencias WHERE modulo = "SMT" ORDER BY codigo', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Obter id ou inserir novo conferente
async function getOrCreateConferente(nome) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM conferentes WHERE nome = ?', [nome], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.id);
            } else {
                db.run('INSERT INTO conferentes (nome) VALUES (?)', [nome], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
}

// Inserir novo apontamento SMT
async function createApontamentoSMT(apontamento) {
    try {
        // Obter ou criar IDs para os relacionamentos
        const clienteId = await getOrCreateCliente(apontamento.cliente);
        const operadorId = await getOrCreateOperador(apontamento.operador);
        const conferenteId = await getOrCreateConferente(apontamento.conferente);

        // Obter ID da ocorrência
        const ocorrencia = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM ocorrencias WHERE codigo = ? AND modulo = "SMT"', [apontamento.codOcorrencia], (err, row) => {
                if (err) reject(err);
                else if (row) resolve(row);
                else reject(new Error('Ocorrência não encontrada'));
            });
        });

        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO apontamentos_smt (
                    data, cliente_id, codigo_placa, ocorrencia_id, posicao_feeder, odf, inicio, 
                    termino, tempo_placa, qtd_pcs, pcas_danif, operador_id, conferente_id,
                    observacao, acoes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(sql, [
                apontamento.data, 
                clienteId, 
                apontamento.codigoPlaca, 
                ocorrencia.id, 
                apontamento.posicaoFeeder || null, 
                apontamento.odf, 
                apontamento.inicio,
                apontamento.termino, 
                apontamento.tempoPlaca || null, 
                apontamento.qtdPcs, 
                apontamento.pcasDanif, 
                operadorId, 
                conferenteId,
                apontamento.observacao || null, 
                apontamento.acoes || null
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

// Obter todos os apontamentos SMT com dados relacionados
async function getAllApontamentosSMT() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                a.id, a.data, c.nome as cliente, a.codigo_placa, o.codigo as cod_ocorrencia, 
                o.operacao, o.tipo, a.posicao_feeder, a.odf, a.inicio, a.termino, 
                a.tempo_placa, a.qtd_pcs, a.pcas_danif, op.nome as operador, 
                conf.nome as conferente, a.observacao, a.acoes, a.created_at, a.updated_at
            FROM apontamentos_smt a
            JOIN clientes c ON a.cliente_id = c.id
            JOIN ocorrencias o ON a.ocorrencia_id = o.id
            JOIN operadores op ON a.operador_id = op.id
            JOIN conferentes conf ON a.conferente_id = conf.id
            ORDER BY a.data DESC, a.inicio DESC
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Funções para manipulação de dados - Qualidade

// Obter id ou inserir novo inspetor
async function getOrCreateInspetor(nome) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM inspetores WHERE nome = ?', [nome], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row.id);
            } else {
                db.run('INSERT INTO inspetores (nome) VALUES (?)', [nome], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.lastID);
                    }
                });
            }
        });
    });
}

// Inserir novo apontamento Qualidade
async function createApontamentoQualidade(registro) {
    try {
        // Obter ou criar ID para o inspetor
        const inspetorId = await getOrCreateInspetor(registro.inspetor);

        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO apontamentos_qualidade (
                    data, codigo, odf, qtd_pcs, qtd_comp, qtd_pcs_rej, qtd_comp_rej,
                    inspetor_id, excesso_solda, comp_alto, curto, deslocado, oxidado,
                    falta_comp, solder_ball, tombstone, comp_errado, sobresolda,
                    comp_danificado, comp_jogado, pads_contam, furo_solda, falta_solda,
                    placa_suja, repuxo, solda_fria, outros, outros_observacao
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.run(sql, [
                registro.data, 
                registro.codigo, 
                registro.odf, 
                registro.qtdPcs, 
                registro.qtdComp, 
                registro.qtdPcsRej, 
                registro.qtdCompRej,
                inspetorId, 
                registro.defeitos.excessoSolda || 0, 
                registro.defeitos.compAlto || 0, 
                registro.defeitos.curto || 0, 
                registro.defeitos.deslocado || 0, 
                registro.defeitos.oxidado || 0,
                registro.defeitos.faltaComp || 0, 
                registro.defeitos.solderBall || 0, 
                registro.defeitos.tombstone || 0, 
                registro.defeitos.compErrado || 0, 
                registro.defeitos.sobresolda || 0,
                registro.defeitos.compDanificado || 0, 
                registro.defeitos.compJogado || 0, 
                registro.defeitos.padsContam || 0, 
                registro.defeitos.furoSolda || 0, 
                registro.defeitos.faltaSolda || 0,
                registro.defeitos.placaSuja || 0, 
                registro.defeitos.repuxo || 0, 
                registro.defeitos.soldaFria || 0, 
                registro.defeitos.outros || 0,
                registro.outrosObservacao || null
            ], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    } catch (error) {
        throw error;
    }
}

// Obter todos os apontamentos Qualidade com dados relacionados
async function getAllApontamentosQualidade() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                a.*, i.nome as inspetor
            FROM apontamentos_qualidade a
            JOIN inspetores i ON a.inspetor_id = i.id
            ORDER BY a.data DESC
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

// Limpar todas as tabelas de dados, mas manter tabelas de referência
async function clearAllData() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Desativar as chaves estrangeiras temporariamente
            db.run('PRAGMA foreign_keys = OFF');
            
            // Limpar tabelas de apontamentos
            db.run('DELETE FROM apontamentos_tht');
            db.run('DELETE FROM apontamentos_smt');
            db.run('DELETE FROM apontamentos_qualidade');
            
            // Limpar entidades
            db.run('DELETE FROM clientes');
            db.run('DELETE FROM operadores');
            db.run('DELETE FROM lideres');
            db.run('DELETE FROM conferentes');
            db.run('DELETE FROM inspetores');
            
            // Reiniciar os contadores de autoincremento
            db.run('DELETE FROM sqlite_sequence WHERE name IN ("apontamentos_tht", "apontamentos_smt", "apontamentos_qualidade", "clientes", "operadores", "lideres", "conferentes", "inspetores")');
            
            // Reativar as chaves estrangeiras
            db.run('PRAGMA foreign_keys = ON', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

// Exportar funções
module.exports = {
    db,
    getOcorrenciasTHT,
    getOcorrenciasSMT,
    getOrCreateCliente,
    getOrCreateOperador,
    getOrCreateLider,
    getOrCreateConferente,
    getOrCreateInspetor,
    createApontamentoTHT,
    createApontamentoSMT,
    createApontamentoQualidade,
    getAllApontamentosTHT,
    getAllApontamentosSMT,
    getAllApontamentosQualidade,
    clearAllData
}; 