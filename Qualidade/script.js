// Dados iniciais
let registros = [];
let registroEmEdicao = null;
let paginaAtual = 1;
const itensPorPagina = 10;
const CHAVE_DADOS = 'registrosQualidade';
const CHAVE_BACKUP = 'backupRegistrosQualidade';

// Listas de inspetor
const inspetores = [
    'Ana Silva',
    'Carlos Ferreira',
    'Bruno Oliveira',
    'Mariana Santos',
    'Rafael Gomes',
    'Juliana Costa'
];

// Elementos do DOM
const btnIniciarRegistro = document.getElementById('btnIniciarRegistro');
const btnCancelarRegistro = document.getElementById('btnCancelarRegistro');
const telaRegistros = document.getElementById('telaRegistros');
const formCard = document.getElementById('formCard');
const registroForm = document.getElementById('registroForm');
const tabelaApontamentos = document.getElementById('tabelaApontamentos');
const paginacao = document.getElementById('paginacao');

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Carregar dados existentes
    carregarDados();
    preencherDatalistInspetores();
    
    btnIniciarRegistro.addEventListener('click', mostrarFormulario);
    btnCancelarRegistro.addEventListener('click', ocultarFormulario);
    registroForm.addEventListener('submit', salvarRegistro);
    
    // Configura a data atual como padrão
    document.getElementById('data').valueAsDate = new Date();
    
    // Inicializar tooltips do Bootstrap
    inicializarTooltips();
    
    // Adicionar evento ao campo "outros" para mostrar/esconder o campo de observações
    const outrosInput = document.getElementById('outros');
    const outrosObservacaoContainer = document.getElementById('outrosObservacaoContainer');
    const outrosObservacao = document.getElementById('outrosObservacao');
    
    outrosInput.addEventListener('input', function() {
        const valor = parseInt(this.value) || 0;
        if (valor > 0) {
            outrosObservacaoContainer.style.display = 'block';
            outrosObservacao.required = true;
        } else {
            outrosObservacaoContainer.style.display = 'none';
            outrosObservacao.required = false;
            outrosObservacao.value = '';
        }
        atualizarTotalComponentesRejeitados();
    });
    
    // Adicionar evento para cada campo de defeito para atualizar o total automaticamente
    const camposDefeitos = [
        'excessoSolda', 'compAlto', 'curto', 'deslocado', 'oxidado', 
        'faltaComp', 'solderBall', 'tombstone', 'compErrado', 'sobresolda', 
        'compDanificado', 'compJogado', 'padsContam', 'furoSolda', 'faltaSolda',
        'placaSuja', 'repuxo', 'soldaFria', 'outros'
    ];
    
    camposDefeitos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', atualizarTotalComponentesRejeitados);
        }
    });
    
    // Inicializar o campo total com 0
    atualizarTotalComponentesRejeitados();
});

// Função para inicializar os tooltips
function inicializarTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Função para exibir tooltip personalizado
function showTooltip(content, x, y) {
    // Remover qualquer tooltip existente
    const oldTooltip = document.querySelector('.tooltip-custom');
    if (oldTooltip) {
        document.body.removeChild(oldTooltip);
    }
    
    // Criar novo tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-custom';
    tooltip.innerHTML = content;
    
    // Adicionar ao documento
    document.body.appendChild(tooltip);
    
    // Posicionar o tooltip
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y - 20}px`;
    
    // Ativar
    tooltip.classList.add('active');
    
    // Adicionar evento para fechar ao clicar fora
    document.addEventListener('click', function closeTooltip(e) {
        if (!tooltip.contains(e.target) && !e.target.classList.contains('obs-indicator')) {
            document.body.removeChild(tooltip);
            document.removeEventListener('click', closeTooltip);
        }
    });
    
    // Adicionar evento para fechar com ESC
    document.addEventListener('keydown', function escKeyHandler(e) {
        if (e.key === 'Escape') {
            document.body.removeChild(tooltip);
            document.removeEventListener('keydown', escKeyHandler);
        }
    });
}

// Funções
function carregarDados() {
    const dadosLocalStorage = localStorage.getItem(CHAVE_DADOS);
    if (dadosLocalStorage) {
        try {
            registros = JSON.parse(dadosLocalStorage);
            // Criar backup após carregar com sucesso
            criarBackupDados();
        } catch (e) {
            console.error('Erro ao carregar dados:', e);
            registros = [];
        }
    } else {
        registros = [];
    }
    renderizarTabela();
}

function preencherDatalistInspetores() {
    const datalist = document.getElementById('inspetores-list');
    
    inspetores.forEach(nome => {
        const option = document.createElement('option');
        option.value = nome;
        datalist.appendChild(option);
    });
}

function mostrarFormulario() {
    telaRegistros.style.display = 'none';
    formCard.style.display = 'block';
    btnIniciarRegistro.style.display = 'none';
    
    // Técnica mais agressiva para ocultar os botões
    const botoesNavegacao = document.getElementById('botoesNavegacao');
    if (botoesNavegacao) {
        botoesNavegacao.style.cssText = 'display: none !important; visibility: hidden !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;';
    }
    
    registroEmEdicao = null;
    registroForm.reset();
    document.getElementById('data').valueAsDate = new Date();
}

function ocultarFormulario() {
    telaRegistros.style.display = 'block';
    formCard.style.display = 'none';
    btnIniciarRegistro.style.display = 'block';
    
    // Restaurar todos os estilos dos botões
    const botoesNavegacao = document.getElementById('botoesNavegacao');
    if (botoesNavegacao) {
        botoesNavegacao.style.cssText = 'display: flex !important; visibility: visible !important; height: auto !important; opacity: 1 !important; pointer-events: auto !important;';
    }
    
    registroEmEdicao = null;
}

function salvarRegistro(e) {
    e.preventDefault();
    
    // Verificar se "Outros" tem valor e se o campo de observação está preenchido
    const outrosValue = parseInt(document.getElementById('outros').value) || 0;
    if (outrosValue > 0 && !document.getElementById('outrosObservacao').value.trim()) {
        alert('Por favor, preencha as observações sobre outros defeitos.');
        return;
    }
    
    // Obter todos os dados do formulário
    const novoRegistro = {
        id: registroEmEdicao ? registroEmEdicao.id : Date.now(),
        data: document.getElementById('data').value,
        codigo: document.getElementById('codigo').value,
        odf: document.getElementById('odf').value,
        qtdPcs: document.getElementById('qtdPcs').value,
        qtdComp: document.getElementById('qtdComp').value,
        qtdPcsRej: document.getElementById('qtdPcsRej').value,
        qtdCompRej: document.getElementById('qtdCompRej').value,
        inspetor: document.getElementById('inspetor').value,
        defeitos: {
            excessoSolda: parseInt(document.getElementById('excessoSolda').value) || 0,
            compAlto: parseInt(document.getElementById('compAlto').value) || 0,
            curto: parseInt(document.getElementById('curto').value) || 0,
            deslocado: parseInt(document.getElementById('deslocado').value) || 0,
            oxidado: parseInt(document.getElementById('oxidado').value) || 0,
            faltaComp: parseInt(document.getElementById('faltaComp').value) || 0,
            solderBall: parseInt(document.getElementById('solderBall').value) || 0,
            tombstone: parseInt(document.getElementById('tombstone').value) || 0,
            compErrado: parseInt(document.getElementById('compErrado').value) || 0,
            sobresolda: parseInt(document.getElementById('sobresolda').value) || 0,
            compDanificado: parseInt(document.getElementById('compDanificado').value) || 0,
            compJogado: parseInt(document.getElementById('compJogado').value) || 0,
            padsContam: parseInt(document.getElementById('padsContam').value) || 0,
            furoSolda: parseInt(document.getElementById('furoSolda').value) || 0,
            faltaSolda: parseInt(document.getElementById('faltaSolda').value) || 0,
            placaSuja: parseInt(document.getElementById('placaSuja').value) || 0,
            repuxo: parseInt(document.getElementById('repuxo').value) || 0,
            soldaFria: parseInt(document.getElementById('soldaFria').value) || 0,
            outros: outrosValue
        }
    };
    
    // Adicionar observações sobre outros defeitos, se houver
    if (outrosValue > 0) {
        novoRegistro.outrosObservacao = document.getElementById('outrosObservacao').value.trim();
    }
    
    // Não é mais necessário verificar se a soma dos defeitos bate com a quantidade
    // pois o campo qtdCompRej é calculado automaticamente
    
    if (registroEmEdicao) {
        // Atualizando registro existente
        const index = registros.findIndex(reg => reg.id === registroEmEdicao.id);
        if (index !== -1) {
            registros[index] = novoRegistro;
        }
    } else {
        // Adicionando novo registro
        registros.push(novoRegistro);
    }
    
    salvarLocalStorage();
    
    // Mostrar popup de confirmação
    const mensagem = registroEmEdicao ? 'Registro atualizado com sucesso!' : 'Registro salvo com sucesso!';
    mostrarPopup(mensagem);
    
    ocultarFormulario();
    renderizarTabela();
}

function renderizarTabela() {
    const tbody = tabelaApontamentos.querySelector('tbody');
    tbody.innerHTML = '';
    
    if (registros.length === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'Nenhum registro encontrado';
        td.colSpan = 28; // Total de colunas
        td.className = 'text-center';
        tr.appendChild(td);
        tbody.appendChild(tr);
        
        paginacao.innerHTML = '';
        return;
    }
    
    // Ordenar registros por data (mais recente primeiro)
    const registrosOrdenados = [...registros].sort((a, b) => {
        return new Date(b.data) - new Date(a.data);
    });
    
    // Paginação
    const totalPaginas = Math.ceil(registrosOrdenados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = Math.min(inicio + itensPorPagina, registrosOrdenados.length);
    
    for (let i = inicio; i < fim; i++) {
        const registro = registrosOrdenados[i];
        const tr = document.createElement('tr');
        
        // Formatação da data
        const dataObj = new Date(registro.data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        
        // Células com dados
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${registro.codigo}</td>
            <td>${registro.odf}</td>
            <td>${registro.qtdPcs}</td>
            <td>${registro.qtdComp}</td>
            <td>${registro.qtdPcsRej}</td>
            <td>${registro.qtdCompRej}</td>
            <td>${registro.inspetor}</td>
            <td>${registro.defeitos.excessoSolda}</td>
            <td>${registro.defeitos.compAlto}</td>
            <td>${registro.defeitos.curto}</td>
            <td>${registro.defeitos.deslocado}</td>
            <td>${registro.defeitos.oxidado}</td>
            <td>${registro.defeitos.faltaComp}</td>
            <td>${registro.defeitos.solderBall}</td>
            <td>${registro.defeitos.tombstone}</td>
            <td>${registro.defeitos.compErrado}</td>
            <td>${registro.defeitos.sobresolda}</td>
            <td>${registro.defeitos.compDanificado}</td>
            <td>${registro.defeitos.compJogado}</td>
            <td>${registro.defeitos.padsContam}</td>
            <td>${registro.defeitos.furoSolda}</td>
            <td>${registro.defeitos.faltaSolda}</td>
            <td>${registro.defeitos.placaSuja}</td>
            <td>${registro.defeitos.repuxo}</td>
            <td>${registro.defeitos.soldaFria}</td>
            <td class="obs-cell">
                ${registro.defeitos.outros > 0 
                  ? `<div class="obs-indicator" data-tooltip="${encodeURIComponent(`
                    <div class="tooltip-header">Detalhes de Outros Defeitos</div>
                    <div class="tooltip-body">
                        <span class="tooltip-label">Quantidade:</span>
                        <span class="tooltip-value">${registro.defeitos.outros}</span>
                        
                        <span class="tooltip-label">Observação:</span>
                        <span class="tooltip-value">${registro.outrosObservacao || 'Sem detalhes'}</span>
                    </div>`)}">
                       <i class="bi bi-info-circle"></i>
                     </div>` 
                  : '<div class="obs-empty">-</div>'}
            </td>
            <td>
                <div class="controls-buttons">
                    <button type="button" class="btn btn-sm btn-primary" onclick="editarRegistro(${registro.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="confirmarExclusao(${registro.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(tr);
    }
    
    renderizarPaginacao(totalPaginas);
    
    // Adicionar eventos para tooltip personalizado
    document.querySelectorAll('.obs-indicator').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            const tooltipContent = decodeURIComponent(this.getAttribute('data-tooltip'));
            showTooltip(tooltipContent, e.clientX, e.clientY);
        });
    });
}

function renderizarPaginacao(totalPaginas) {
    paginacao.innerHTML = '';
    
    if (totalPaginas <= 1) return;
    
    // Botão Anterior
    const btnAnterior = document.createElement('li');
    btnAnterior.className = `page-item ${paginaAtual === 1 ? 'disabled' : ''}`;
    btnAnterior.innerHTML = `<a class="page-link" href="#">«</a>`;
    if (paginaAtual > 1) {
        btnAnterior.addEventListener('click', function(e) {
            e.preventDefault();
            mudarPagina(paginaAtual - 1);
        });
    }
    paginacao.appendChild(btnAnterior);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('li');
        btnPagina.className = `page-item ${paginaAtual === i ? 'active' : ''}`;
        btnPagina.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        btnPagina.addEventListener('click', function(e) {
            e.preventDefault();
            mudarPagina(i);
        });
        paginacao.appendChild(btnPagina);
    }
    
    // Botão Próximo
    const btnProximo = document.createElement('li');
    btnProximo.className = `page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`;
    btnProximo.innerHTML = `<a class="page-link" href="#">»</a>`;
    if (paginaAtual < totalPaginas) {
        btnProximo.addEventListener('click', function(e) {
            e.preventDefault();
            mudarPagina(paginaAtual + 1);
        });
    }
    paginacao.appendChild(btnProximo);
}

function mudarPagina(pagina) {
    paginaAtual = pagina;
    renderizarTabela();
}

function editarRegistro(id) {
    registroEmEdicao = registros.find(reg => reg.id === id);
    if (!registroEmEdicao) return;
    
    // Preencher o formulário com os dados do registro
    document.getElementById('data').value = registroEmEdicao.data;
    document.getElementById('codigo').value = registroEmEdicao.codigo;
    document.getElementById('odf').value = registroEmEdicao.odf;
    document.getElementById('qtdPcs').value = registroEmEdicao.qtdPcs;
    document.getElementById('qtdComp').value = registroEmEdicao.qtdComp;
    document.getElementById('qtdPcsRej').value = registroEmEdicao.qtdPcsRej;
    document.getElementById('inspetor').value = registroEmEdicao.inspetor;
    
    // Preencher os campos de defeitos
    document.getElementById('excessoSolda').value = registroEmEdicao.defeitos.excessoSolda;
    document.getElementById('compAlto').value = registroEmEdicao.defeitos.compAlto;
    document.getElementById('curto').value = registroEmEdicao.defeitos.curto;
    document.getElementById('deslocado').value = registroEmEdicao.defeitos.deslocado;
    document.getElementById('oxidado').value = registroEmEdicao.defeitos.oxidado;
    document.getElementById('faltaComp').value = registroEmEdicao.defeitos.faltaComp;
    document.getElementById('solderBall').value = registroEmEdicao.defeitos.solderBall;
    document.getElementById('tombstone').value = registroEmEdicao.defeitos.tombstone;
    document.getElementById('compErrado').value = registroEmEdicao.defeitos.compErrado;
    document.getElementById('sobresolda').value = registroEmEdicao.defeitos.sobresolda;
    document.getElementById('compDanificado').value = registroEmEdicao.defeitos.compDanificado;
    document.getElementById('compJogado').value = registroEmEdicao.defeitos.compJogado;
    document.getElementById('padsContam').value = registroEmEdicao.defeitos.padsContam;
    document.getElementById('furoSolda').value = registroEmEdicao.defeitos.furoSolda;
    document.getElementById('faltaSolda').value = registroEmEdicao.defeitos.faltaSolda;
    document.getElementById('placaSuja').value = registroEmEdicao.defeitos.placaSuja;
    document.getElementById('repuxo').value = registroEmEdicao.defeitos.repuxo;
    document.getElementById('soldaFria').value = registroEmEdicao.defeitos.soldaFria;
    document.getElementById('outros').value = registroEmEdicao.defeitos.outros;
    
    // Atualizar o total de componentes rejeitados após preencher os campos
    atualizarTotalComponentesRejeitados();
    
    // Verificar se há observações sobre "outros" defeitos
    const outrosValue = parseInt(registroEmEdicao.defeitos.outros) || 0;
    const outrosObservacaoContainer = document.getElementById('outrosObservacaoContainer');
    const outrosObservacao = document.getElementById('outrosObservacao');
    
    if (outrosValue > 0) {
        outrosObservacaoContainer.style.display = 'block';
        outrosObservacao.required = true;
        outrosObservacao.value = registroEmEdicao.outrosObservacao || '';
    } else {
        outrosObservacaoContainer.style.display = 'none';
        outrosObservacao.required = false;
        outrosObservacao.value = '';
    }
    
    // Mostrar formulário
    telaRegistros.style.display = 'none';
    formCard.style.display = 'block';
    btnIniciarRegistro.style.display = 'none';
}

function confirmarExclusao(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        excluirRegistro(id);
    }
}

function excluirRegistro(id) {
    registros = registros.filter(registro => registro.id !== id);
    salvarLocalStorage();
    renderizarTabela();
}

// Função para formatar data no formato DD/MM/YYYY para visualização
function formatarDataVisual(dataStr) {
    const data = new Date(dataStr);
    let dia = data.getDate().toString().padStart(2, '0');
    let mes = (data.getMonth() + 1).toString().padStart(2, '0');
    let ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;
}

// Função para exportar dados em formato XLSX (Excel)
window.exportarXLSX = function() {
    if (registros.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }
    
    // Preparar os dados para formatação
    const dados = registros.map(item => {
        // Formatar a data para visualização
        const dataFormatada = item.data ? formatarDataVisual(item.data) : '';
        
        return {
            'Data': dataFormatada,
            'Código': item.codigo || '',
            'ODF': item.odf || '',
            'Qtd. / Pçs': item.qtdPcs || '',
            'Qtd. / Comp.': item.qtdComp || '',
            'Pçs Rej.': item.qtdPcsRej || '',
            'Comp. Rej.': item.qtdCompRej || '',
            'Inspetor': item.inspetor || '',
            'Excesso Solda': item.defeitos?.excessoSolda || 0,
            'Comp. Alto': item.defeitos?.compAlto || 0,
            'Curto': item.defeitos?.curto || 0,
            'Deslocado': item.defeitos?.deslocado || 0,
            'Oxidado': item.defeitos?.oxidado || 0,
            'Falta Comp.': item.defeitos?.faltaComp || 0,
            'Solder ball': item.defeitos?.solderBall || 0,
            'Tombstone': item.defeitos?.tombstone || 0,
            'Comp. Errado': item.defeitos?.compErrado || 0,
            'Sobresolda': item.defeitos?.sobresolda || 0,
            'Comp. Danif.': item.defeitos?.compDanificado || 0,
            'Comp. Jogado': item.defeitos?.compJogado || 0,
            'Pads Contam.': item.defeitos?.padsContam || 0,
            'Furo Solda': item.defeitos?.furoSolda || 0,
            'Falta Solda': item.defeitos?.faltaSolda || 0,
            'Placa Suja': item.defeitos?.placaSuja || 0,
            'Repuxo': item.defeitos?.repuxo || 0,
            'Solda Fria': item.defeitos?.soldaFria || 0,
            'Outros': item.defeitos?.outros || 0,
            'Obs. Outros': item.defeitos?.outrosObservacao || ''
        };
    });
    
    // Criar uma planilha com os dados
    const worksheet = XLSX.utils.json_to_sheet(dados);
    
    // Ajustar a largura das colunas
    const colunas = Object.keys(dados[0]);
    const largurasColunas = {};
    
    colunas.forEach(col => {
        // Calcular a largura máxima para cada coluna
        largurasColunas[col] = Math.max(
            col.length,
            ...dados.map(row => String(row[col] || '').length)
        );
    });
    
    // Definir larguras de coluna
    worksheet['!cols'] = colunas.map(col => ({ wch: largurasColunas[col] }));
    
    // Aplicar estilo ao cabeçalho (primeira linha)
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    const corFundo = { fgColor: { rgb: "808080" } }; // Cinza mais escuro
    
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;
        
        // Garantir que o objeto de estilo seja inicializado corretamente
        worksheet[cellAddress].s = {
            fill: {
                patternType: "solid",
                fgColor: { rgb: "808080" } // Cinza mais escuro
            },
            font: {
                bold: true,
                color: { rgb: "FFFFFF" } // Texto branco para contraste
            }
        };
    }
    
    // Criar um workbook e adicionar a planilha
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Apontamentos Qualidade');
    
    // Obter data atual para o nome do arquivo
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().split('T')[0].replace(/-/g, '');
    const horaFormatada = dataAtual.toTimeString().split(' ')[0].replace(/:/g, '');
    
    // Exportar o arquivo
    XLSX.writeFile(workbook, `apontamentos_qualidade_${dataFormatada}_${horaFormatada}.xlsx`);
};

// Função removida - exportarCSV

// Função para calcular o total de componentes rejeitados
function atualizarTotalComponentesRejeitados() {
    const camposDefeitos = [
        'excessoSolda', 'compAlto', 'curto', 'deslocado', 'oxidado', 
        'faltaComp', 'solderBall', 'tombstone', 'compErrado', 'sobresolda', 
        'compDanificado', 'compJogado', 'padsContam', 'furoSolda', 'faltaSolda',
        'placaSuja', 'repuxo', 'soldaFria', 'outros'
    ];
    
    let total = 0;
    
    camposDefeitos.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            total += parseInt(campo.value) || 0;
        }
    });
    
    const campoTotal = document.getElementById('qtdCompRej');
    if (campoTotal) {
        campoTotal.value = total;
    }
}

// Criar backup dos dados
function criarBackupDados() {
    if (registros.length > 0) {
        localStorage.setItem(CHAVE_BACKUP, JSON.stringify(registros));
    }
}

// Função para salvar dados no localStorage
function salvarLocalStorage() {
    try {
        localStorage.setItem(CHAVE_DADOS, JSON.stringify(registros));
        console.log("Dados salvos com sucesso:", registros.length, "registros");
        // Criar backup após salvar com sucesso
        criarBackupDados();
    } catch (e) {
        console.error('Erro ao salvar dados:', e);
        alert('Erro ao salvar dados. O armazenamento local pode estar cheio.');
    }
}

// Função para mostrar popup de confirmação
function mostrarPopup(mensagem) {
    // Criar elementos do popup
    const popupContainer = document.createElement('div');
    popupContainer.className = 'popup-notification';
    popupContainer.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">
                <i class="bi bi-check-circle-fill"></i>
            </div>
            <div class="popup-message">${mensagem}</div>
        </div>
    `;
    
    // Adicionar estilos inline para garantir que o popup seja exibido corretamente
    popupContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #198754;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 0.3s, transform 0.3s;
    `;
    
    // Estilos para o conteúdo
    const popupContent = popupContainer.querySelector('.popup-content');
    popupContent.style.cssText = `
        display: flex;
        align-items: center;
    `;
    
    // Estilos para o ícone
    const popupIcon = popupContainer.querySelector('.popup-icon');
    popupIcon.style.cssText = `
        font-size: 24px;
        margin-right: 10px;
    `;
    
    // Adicionar ao corpo do documento
    document.body.appendChild(popupContainer);
    
    // Animar entrada
    setTimeout(() => {
        popupContainer.style.opacity = '1';
        popupContainer.style.transform = 'translateY(0)';
    }, 10);
    
    // Configurar para desaparecer após 3 segundos
    setTimeout(() => {
        popupContainer.style.opacity = '0';
        popupContainer.style.transform = 'translateY(-20px)';
        
        // Remover do DOM após a animação
        setTimeout(() => {
            document.body.removeChild(popupContainer);
        }, 300);
    }, 3000);
}