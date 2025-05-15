const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '..', 'THT')));
app.use('/SMT', express.static(path.join(__dirname, '..', 'SMT')));
app.use('/Qualidade', express.static(path.join(__dirname, '..', 'Qualidade')));
app.use('/login', express.static(path.join(__dirname, '..', 'login')));

// Rotas para THT
app.get('/api/tht/ocorrencias', async (req, res) => {
    try {
        const ocorrencias = await db.getOcorrenciasTHT();
        res.json(ocorrencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tht/apontamentos', async (req, res) => {
    try {
        const apontamentos = await db.getAllApontamentosTHT();
        res.json(apontamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tht/apontamentos', async (req, res) => {
    try {
        const apontamentoId = await db.createApontamentoTHT(req.body);
        res.status(201).json({ id: apontamentoId, message: "Apontamento registrado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para SMT
app.get('/api/smt/ocorrencias', async (req, res) => {
    try {
        const ocorrencias = await db.getOcorrenciasSMT();
        res.json(ocorrencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/smt/apontamentos', async (req, res) => {
    try {
        const apontamentos = await db.getAllApontamentosSMT();
        res.json(apontamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/smt/apontamentos', async (req, res) => {
    try {
        const apontamentoId = await db.createApontamentoSMT(req.body);
        res.status(201).json({ id: apontamentoId, message: "Apontamento registrado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para Qualidade
app.get('/api/qualidade/apontamentos', async (req, res) => {
    try {
        const apontamentos = await db.getAllApontamentosQualidade();
        res.json(apontamentos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/qualidade/apontamentos', async (req, res) => {
    try {
        const apontamentoId = await db.createApontamentoQualidade(req.body);
        res.status(201).json({ id: apontamentoId, message: "Apontamento registrado com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rotas para obter listas
app.get('/api/clientes', async (req, res) => {
    try {
        const clientes = await new Promise((resolve, reject) => {
            db.db.all('SELECT nome FROM clientes ORDER BY nome', (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.nome));
            });
        });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/operadores', async (req, res) => {
    try {
        const operadores = await new Promise((resolve, reject) => {
            db.db.all('SELECT nome FROM operadores ORDER BY nome', (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.nome));
            });
        });
        res.json(operadores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/lideres', async (req, res) => {
    try {
        const lideres = await new Promise((resolve, reject) => {
            db.db.all('SELECT nome FROM lideres ORDER BY nome', (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.nome));
            });
        });
        res.json(lideres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/conferentes', async (req, res) => {
    try {
        const conferentes = await new Promise((resolve, reject) => {
            db.db.all('SELECT nome FROM conferentes ORDER BY nome', (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.nome));
            });
        });
        res.json(conferentes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/inspetores', async (req, res) => {
    try {
        const inspetores = await new Promise((resolve, reject) => {
            db.db.all('SELECT nome FROM inspetores ORDER BY nome', (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.nome));
            });
        });
        res.json(inspetores);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para limpar o banco de dados
app.post('/api/admin/clear-database', async (req, res) => {
    try {
        await db.clearAllData();
        res.json({ success: true, message: "Banco de dados limpo com sucesso" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 