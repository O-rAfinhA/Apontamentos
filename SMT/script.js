// Dados estáticos para códigos, operações e tipos
const ocorrencias = [
    { codigo: "1", operacao: "PRODUÇÃO", tipo: "PROGRAMADA" },
    { codigo: "2", operacao: "CONFERÊNCIA PRIMEIRA PLACA", tipo: "PROGRAMADA" },
    { codigo: "3", operacao: "DESABASTECIAMENTO DE SETUP", tipo: "PROGRAMADA" },
    { codigo: "4", operacao: "DIVERGÊNCIA ALMOX", tipo: "IMPREVISTA" },
    { codigo: "5", operacao: "ENGENHARIA", tipo: "IMPREVISTA" },
    { codigo: "6", operacao: "ESPERANDO CLIENTE", tipo: "IMPREVISTA" },
    { codigo: "7", operacao: "FALTA DE RECURSO OPERACIONAL", tipo: "IMPREVISTA" },
    { codigo: "8", operacao: "FALTA DE AR COMPRIMIDO", tipo: "IMPREVISTA" },
    { codigo: "9", operacao: "INSERÇÃO MANUAL COMPONENTE", tipo: "IMPREVISTA" },
    { codigo: "10", operacao: "LIMPEZA", tipo: "PROGRAMADA" },
    { codigo: "11", operacao: "MANUTENÇÃO PREVENTIVA", tipo: "IMPREVISTA" },
    { codigo: "12", operacao: "MANUTENÇÃO CORRETIVA", tipo: "PROGRAMADA" },
    { codigo: "13", operacao: "MATERIA PRIMA NÃO CONFORME", tipo: "IMPREVISTA" },
    { codigo: "14", operacao: "NÃO TRABALHADO", tipo: "IMPREVISTA" },
    { codigo: "15", operacao: "PARADA PARA TREINAMENTO", tipo: "PROGRAMADA" },
    { codigo: "16", operacao: "QUALIDADE", tipo: "IMPREVISTA" },
    { codigo: "17", operacao: "QUEDA DE TENSÃO", tipo: "IMPREVISTA" },
    { codigo: "18", operacao: "REFEIÇÃO", tipo: "PROGRAMADA" },
    { codigo: "19", operacao: "SEM DEMANDA", tipo: "IMPREVISTA" },
    { codigo: "20", operacao: "SETUP", tipo: "PROGRAMADA" },
    { codigo: "21", operacao: "TROCA DE FEEDER", tipo: "PROGRAMADA" },
    { codigo: "22", operacao: "OUTROS", tipo: "IMPREVISTA" }
];

// Inicialização de variáveis
let apontamentos = localStorage.getItem('apontamentos') 
    ? JSON.parse(localStorage.getItem('apontamentos')) 
    : [];
    
// Armazenar valores únicos usados
let clientesUsados = localStorage.getItem('clientesUsados') 
    ? JSON.parse(localStorage.getItem('clientesUsados')) 
    : [];
let operadoresUsados = localStorage.getItem('operadoresUsados') 
    ? JSON.parse(localStorage.getItem('operadoresUsados')) 
    : [];
let conferentesUsados = localStorage.getItem('conferentesUsados') 
    ? JSON.parse(localStorage.getItem('conferentesUsados')) 
    : [];
    
let editIndex = -1;

// Configuração de paginação
const itensPorPagina = 10;
let paginaAtual = 1;

// Funções para manipulação do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Carregar códigos de ocorrência no select
    carregarCodigos();
    
    // Carregar apontamentos da tabela
    atualizarTabelaApontamentos();
    
    // Carregar sugestões para campos de autocompletar
    carregarSugestoes();
    
    // Configurar eventos
    configurarEventos();
    
    // Exibir a tela de apontamentos por padrão
    mostrarTelaApontamentos();
});

// Função para formatar data como YYYY-MM-DD para input date
function formatarDataInput(data) {
    const d = new Date(data);
    let mes = '' + (d.getMonth() + 1);
    let dia = '' + d.getDate();
    const ano = d.getFullYear();

    if (mes.length < 2) 
        mes = '0' + mes;
    if (dia.length < 2) 
        dia = '0' + dia;

    return [ano, mes, dia].join('-');
}

// Função para formatar hora como HH:MM para input time
function formatarHoraInput(data) {
    const d = new Date(data);
    let horas = '' + d.getHours();
    let minutos = '' + d.getMinutes();

    if (horas.length < 2) 
        horas = '0' + horas;
    if (minutos.length < 2) 
        minutos = '0' + minutos;

    return [horas, minutos].join(':');
}

// Função para mostrar a tela de apontamentos
function mostrarTelaApontamentos() {
    document.getElementById('telaApontamentos').style.display = 'block';
    document.getElementById('formCard').style.display = 'none';
    
    // Restaurar todos os estilos dos botões
    const botoesNavegacao = document.getElementById('botoesNavegacao');
    if (botoesNavegacao) {
        botoesNavegacao.style.cssText = 'display: flex !important; visibility: visible !important; height: auto !important; opacity: 1 !important; pointer-events: auto !important;';
    }
    
    atualizarTabelaApontamentos();
}

// Função para mostrar a tela de formulário
function mostrarTelaFormulario() {
    document.getElementById('telaApontamentos').style.display = 'none';
    document.getElementById('formCard').style.display = 'block';
    
    // Técnica mais agressiva para ocultar os botões
    const botoesNavegacao = document.getElementById('botoesNavegacao');
    if (botoesNavegacao) {
        botoesNavegacao.style.cssText = 'display: none !important; visibility: hidden !important; height: 0 !important; opacity: 0 !important; pointer-events: none !important;';
    }
}

function carregarCodigos() {
    const selectCodigo = document.getElementById('codOcorrencia');
    selectCodigo.innerHTML = '<option value="">Selecione...</option>';
    
    ocorrencias.forEach(item => {
        const option = document.createElement('option');
        option.value = item.codigo;
        option.textContent = `${item.codigo} - ${item.operacao}`;
        selectCodigo.appendChild(option);
    });
}

// Função para carregar sugestões de clientes, operadores e conferentes
function carregarSugestoes() {
    // Carregar sugestões para Cliente
    const clientesList = document.getElementById('clientes-list');
    clientesList.innerHTML = '';
    clientesUsados.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente;
        clientesList.appendChild(option);
    });
    
    // Carregar sugestões para Operador
    const operadoresList = document.getElementById('operadores-list');
    operadoresList.innerHTML = '';
    operadoresUsados.forEach(operador => {
        const option = document.createElement('option');
        option.value = operador;
        operadoresList.appendChild(option);
    });
    
    // Carregar sugestões para Conferente
    const conferentesList = document.getElementById('conferentes-list');
    conferentesList.innerHTML = '';
    conferentesUsados.forEach(conferente => {
        const option = document.createElement('option');
        option.value = conferente;
        conferentesList.appendChild(option);
    });
}

// Função para adicionar um valor único à lista de sugestões
function adicionarValorUnico(valor, lista) {
    if (valor && !lista.includes(valor)) {
        lista.push(valor);
        return true;
    }
    return false;
}

function configurarEventos() {
    // Evento para o botão "Iniciar Apontamento"
    document.getElementById('btnIniciarApontamento').addEventListener('click', function() {
        // Mostrar o formulário
        mostrarTelaFormulario();
        
        // Limpar o formulário e os dados de edição
        document.getElementById('apontamentoForm').reset();
        document.getElementById('tipo').value = '';
        editIndex = -1;
        
        // Configurar data atual
        const dataAtual = new Date();
        document.getElementById('data').value = formatarDataInput(dataAtual);
        
        // Configurar hora atual no campo início
        document.getElementById('inicio').value = formatarHoraInput(dataAtual);
        
        // Limpar o campo de término
        document.getElementById('termino').value = '';
    });
    
    // Evento para o botão "Cancelar Apontamento"
    document.getElementById('btnCancelarApontamento').addEventListener('click', function() {
        mostrarTelaApontamentos();
    });
    
    // Evento para vincular código com operação e tipo
    document.getElementById('codOcorrencia').addEventListener('change', function() {
        const codigo = this.value;
        const ocorrencia = ocorrencias.find(item => item.codigo === codigo);
        
        if (ocorrencia) {
            document.getElementById('tipo').value = ocorrencia.tipo;
            
            // Verificar se é troca de feeder (código 21)
            const posicaoFeederInput = document.getElementById('posicaoFeeder');
            if (codigo === "21") {
                // Tornar o campo obrigatório
                posicaoFeederInput.required = true;
                posicaoFeederInput.closest('.col-md-3').querySelector('label').classList.add('required');
            } else {
                // Tornar o campo opcional
                posicaoFeederInput.required = false;
                posicaoFeederInput.closest('.col-md-3').querySelector('label').classList.remove('required');
            }
        } else {
            document.getElementById('tipo').value = '';
        }
    });
    
    // Evento de submissão do formulário
    document.getElementById('apontamentoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarApontamento();
    });
}

function salvarApontamento() {
    // Preencher o horário de término automaticamente
    const dataAtual = new Date();
    document.getElementById('termino').value = formatarHoraInput(dataAtual);
    
    // Calcular tempo gasto (opcional para uso futuro)
    calcularTempoGasto();
    
    // Obter valores do formulário
    const apontamento = {
        data: document.getElementById('data').value,
        cliente: document.getElementById('cliente').value,
        codigoPlaca: document.getElementById('codigoPlaca').value,
        codOcorrencia: document.getElementById('codOcorrencia').value,
        posicaoFeeder: document.getElementById('posicaoFeeder').value,
        odf: document.getElementById('odf').value,
        inicio: document.getElementById('inicio').value,
        termino: document.getElementById('termino').value,
        qtdPcs: document.getElementById('qtdPcs').value,
        pcasDanif: document.getElementById('pcasDanif').value,
        tempoPlaca: document.getElementById('tempoPlaca').value,
        operador: document.getElementById('operador').value,
        conferente: document.getElementById('conferente').value,
        observacao: document.getElementById('observacao').value,
        acoes: document.getElementById('acoes').value
    };
    
    // Buscar o tipo e operacao baseado no código
    const ocorrencia = ocorrencias.find(item => item.codigo === apontamento.codOcorrencia);
    if (ocorrencia) {
        apontamento.tipo = ocorrencia.tipo;
        apontamento.operacao = ocorrencia.operacao;
    }
    
    // Validação básica
    for (const key in apontamento) {
        // Posição do feeder só é obrigatório para código 21
        if (key === 'posicaoFeeder' && apontamento.codOcorrencia !== "21") {
            continue; // Ignorar validação para este campo
        }
        
        if (key !== 'observacao' && key !== 'acoes' && !apontamento[key]) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    }
    
    // Salvar e atualizar listas de valores usados
    let mudancasListas = false;
    
    // Adicionar cliente, operador e conferente às listas de sugestões
    if (adicionarValorUnico(apontamento.cliente, clientesUsados)) {
        localStorage.setItem('clientesUsados', JSON.stringify(clientesUsados));
        mudancasListas = true;
    }
    
    if (adicionarValorUnico(apontamento.operador, operadoresUsados)) {
        localStorage.setItem('operadoresUsados', JSON.stringify(operadoresUsados));
        mudancasListas = true;
    }
    
    if (adicionarValorUnico(apontamento.conferente, conferentesUsados)) {
        localStorage.setItem('conferentesUsados', JSON.stringify(conferentesUsados));
        mudancasListas = true;
    }
    
    // Recarregar sugestões se houver mudanças
    if (mudancasListas) {
        carregarSugestoes();
    }
    
    if (editIndex === -1) {
        // Adicionar novo apontamento
        apontamentos.push(apontamento);
    } else {
        // Atualizar apontamento existente
        apontamentos[editIndex] = apontamento;
        editIndex = -1;
    }
    
    // Salvar no localStorage
    localStorage.setItem('apontamentos', JSON.stringify(apontamentos));
    
    // Mostrar a tela de apontamentos
    mostrarTelaApontamentos();
    
    // Atualizar tabela
    atualizarTabelaApontamentos();
    
    // Mostrar popup de confirmação
    const mensagem = editIndex === -1 ? 'Registro salvo com sucesso!' : 'Registro atualizado com sucesso!';
    mostrarPopup(mensagem);
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

// Função para mostrar tooltip customizado
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
    
    // Ativar com delay para permitir animação
    setTimeout(() => {
        tooltip.classList.add('active');
    }, 10);
    
    // Adicionar evento para fechar ao clicar fora
    document.addEventListener('click', function closeTooltip(e) {
        if (!tooltip.contains(e.target) && !e.target.classList.contains('truncate-text')) {
            tooltip.classList.remove('active');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    document.body.removeChild(tooltip);
                }
            }, 300);
            document.removeEventListener('click', closeTooltip);
        }
    });
    
    // Adicionar evento para fechar ao pressionar ESC
    document.addEventListener('keydown', function escKeyHandler(e) {
        if (e.key === 'Escape') {
            tooltip.classList.remove('active');
            setTimeout(() => {
                if (tooltip.parentNode) {
                    document.body.removeChild(tooltip);
                }
            }, 300);
            document.removeEventListener('keydown', escKeyHandler);
        }
    });
}

function truncarTexto(texto, limite = 20) {
    if (!texto || texto === '-') return '-';
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + '...';
}

function atualizarTabelaApontamentos() {
    const tbody = document.querySelector('#tabelaApontamentos tbody');
    tbody.innerHTML = '';
    
    if (apontamentos.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td colspan="17" class="text-center">Nenhum apontamento registrado</td>';
        tbody.appendChild(tr);
        
        // Limpar paginação
        document.getElementById('paginacao').innerHTML = '';
        return;
    }
    
    // Calcular índices para paginação
    const totalPaginas = Math.ceil(apontamentos.length / itensPorPagina);
    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }
    
    const indiceInicio = (paginaAtual - 1) * itensPorPagina;
    const indiceFim = Math.min(indiceInicio + itensPorPagina, apontamentos.length);
    
    // Ordenar apontamentos por data (mais recentes primeiro)
    const apontamentosOrdenados = [...apontamentos].sort((a, b) => {
        return new Date(b.data + 'T' + b.inicio) - new Date(a.data + 'T' + a.inicio);
    });
    
    // Exibir apenas os apontamentos da página atual
    for (let i = indiceInicio; i < indiceFim; i++) {
        const apontamento = apontamentosOrdenados[i];
        const index = apontamentos.indexOf(apontamento); // Índice original para edição/exclusão
        
        const tr = document.createElement('tr');
        
        // Formatar data para exibição
        const dataObj = new Date(apontamento.data);
        const dataFormatada = dataObj.toLocaleDateString('pt-BR');
        
        // Encontrar a ocorrência correspondente para mostrar código e nome
        const ocorrencia = ocorrencias.find(item => item.codigo === apontamento.codOcorrencia);
        const codOcorrenciaDisplay = ocorrencia ? 
            `${apontamento.codOcorrencia} - ${ocorrencia.operacao}` : 
            apontamento.codOcorrencia;
            
        // Preparar dados para observações e ações
        const observacao = apontamento.observacao || '-';
        const acoes = apontamento.acoes || '-';
        const temObservacao = observacao !== '-';
        const temAcoes = acoes !== '-';
        
        // Conteúdo do tooltip para observações
        const tooltipObservacao = `
            <div class="tooltip-header">Detalhes da Observação</div>
            <div class="tooltip-body">
                <span class="tooltip-label">Observação:</span>
                <span class="tooltip-value">${observacao}</span>
            </div>
        `;
        
        // Conteúdo do tooltip para ações
        const tooltipAcoes = `
            <div class="tooltip-header">Detalhes das Ações</div>
            <div class="tooltip-body">
                <span class="tooltip-label">Ações:</span>
                <span class="tooltip-value">${acoes}</span>
            </div>
        `;
        
        tr.innerHTML = `
            <td>${dataFormatada}</td>
            <td>${apontamento.cliente}</td>
            <td>${apontamento.codigoPlaca}</td>
            <td>${ocorrencia ? ocorrencia.operacao : apontamento.codOcorrencia}</td>
            <td>
                <span class="badge-tipo ${apontamento.tipo === 'PROGRAMADA' ? 'badge-programada' : 'badge-imprevista'}">
                    ${apontamento.tipo || ''}
                </span>
            </td>
            <td>${apontamento.posicaoFeeder}</td>
            <td>${apontamento.odf}</td>
            <td>${apontamento.inicio}</td>
            <td>${apontamento.termino}</td>
            <td>${apontamento.tempoPlaca}</td>
            <td>${apontamento.qtdPcs}</td>
            <td>${apontamento.pcasDanif}</td>
            <td>${apontamento.operador}</td>
            <td>${apontamento.conferente}</td>
            <td class="obs-cell">
                ${temObservacao ? 
                    `<div class="obs-indicator" data-tooltip="${encodeURIComponent(tooltipObservacao)}">
                        <i class="bi bi-info-circle" title="Clique para ver observações"></i>
                    </div>` : 
                    `<div class="obs-empty">-</div>`
                }
            </td>
            <td class="obs-cell">
                ${temAcoes ? 
                    `<div class="obs-indicator" data-tooltip="${encodeURIComponent(tooltipAcoes)}">
                        <i class="bi bi-info-circle" title="Clique para ver ações"></i>
                    </div>` : 
                    `<div class="obs-empty">-</div>`
                }
            </td>
            <td class="controls-buttons">
                <button type="button" class="btn btn-sm btn-primary" onclick="carregarApontamentoParaEdicao(${index})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger excluir" data-index="${index}" title="Excluir">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(tr);
    }
    
    // Adicionar eventos para tooltip
    document.querySelectorAll('.obs-indicator').forEach(el => {
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            const tooltipContent = decodeURIComponent(this.getAttribute('data-tooltip'));
            showTooltip(tooltipContent, e.clientX, e.clientY);
        });
    });
    
    // Atualizar paginação
    atualizarPaginacao(totalPaginas);
    
        // Eventos para botões de exclusão (edição agora usa onclick)
    
    document.querySelectorAll('.excluir').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            if (confirm('Tem certeza que deseja excluir este apontamento?')) {
                excluirApontamento(index);
            }
        });
    });
}

// Função para atualizar a paginação
function atualizarPaginacao(totalPaginas) {
    const paginacao = document.getElementById('paginacao');
    paginacao.innerHTML = '';
    
    if (totalPaginas <= 1) {
        return;
    }
    
    // Botão Anterior
    const btnAnterior = document.createElement('li');
    btnAnterior.className = `page-item ${paginaAtual === 1 ? 'disabled' : ''}`;
    btnAnterior.innerHTML = `<a class="page-link" href="#">«</a>`;
    btnAnterior.addEventListener('click', function(e) {
        e.preventDefault();
        if (paginaAtual > 1) {
            paginaAtual--;
            atualizarTabelaApontamentos();
        }
    });
    paginacao.appendChild(btnAnterior);
    
    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btnPagina = document.createElement('li');
        btnPagina.className = `page-item ${paginaAtual === i ? 'active' : ''}`;
        btnPagina.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        btnPagina.addEventListener('click', function(e) {
            e.preventDefault();
            paginaAtual = i;
            atualizarTabelaApontamentos();
        });
        paginacao.appendChild(btnPagina);
    }
    
    // Botão Próximo
    const btnProximo = document.createElement('li');
    btnProximo.className = `page-item ${paginaAtual === totalPaginas ? 'disabled' : ''}`;
    btnProximo.innerHTML = `<a class="page-link" href="#">»</a>`;
    btnProximo.addEventListener('click', function(e) {
        e.preventDefault();
        if (paginaAtual < totalPaginas) {
            paginaAtual++;
            atualizarTabelaApontamentos();
        }
    });
    paginacao.appendChild(btnProximo);
}

function carregarApontamentoParaEdicao(index) {
    const apontamento = apontamentos[index];
    
    // Preparar o formulário para edição
    mostrarTelaFormulario();
    
    document.getElementById('data').value = apontamento.data;
    document.getElementById('cliente').value = apontamento.cliente;
    document.getElementById('codigoPlaca').value = apontamento.codigoPlaca;
    document.getElementById('codOcorrencia').value = apontamento.codOcorrencia;
    document.getElementById('tipo').value = apontamento.tipo || '';
    document.getElementById('posicaoFeeder').value = apontamento.posicaoFeeder;
    document.getElementById('odf').value = apontamento.odf;
    
    // Definir valores para os campos somente leitura
    document.getElementById('inicio').value = apontamento.inicio;
    document.getElementById('termino').value = apontamento.termino;
    
    document.getElementById('qtdPcs').value = apontamento.qtdPcs;
    document.getElementById('pcasDanif').value = apontamento.pcasDanif;
    document.getElementById('tempoPlaca').value = apontamento.tempoPlaca;
    document.getElementById('operador').value = apontamento.operador;
    document.getElementById('conferente').value = apontamento.conferente;
    document.getElementById('observacao').value = apontamento.observacao || '';
    document.getElementById('acoes').value = apontamento.acoes || '';
    
    editIndex = index;
}

function excluirApontamento(index) {
    apontamentos.splice(index, 1);
    localStorage.setItem('apontamentos', JSON.stringify(apontamentos));
    atualizarTabelaApontamentos();
}

// Função para calcular o tempo gasto entre início e término
function calcularTempoGasto() {
    const inicio = document.getElementById('inicio').value;
    const termino = document.getElementById('termino').value;
    
    if (inicio && termino) {
        // Converter os horários para objetos Date
        const [horaInicio, minInicio] = inicio.split(':').map(Number);
        const [horaTermino, minTermino] = termino.split(':').map(Number);
        
        // Calcular a diferença em minutos
        let diferencaMinutos = (horaTermino * 60 + minTermino) - (horaInicio * 60 + minInicio);
        
        // Ajustar se o término for no dia seguinte
        if (diferencaMinutos < 0) {
            diferencaMinutos += 24 * 60; // Adicionar 24 horas em minutos
        }
        
        // Formatar como HH:MM
        const horas = Math.floor(diferencaMinutos / 60);
        const minutos = diferencaMinutos % 60;
        const tempoFormatado = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
        
        // Opcionalmente, pode preencher automaticamente o campo de tempo por placa
        // document.getElementById('tempoPlaca').value = tempoFormatado;
    }
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
    if (apontamentos.length === 0) {
        alert('Não há dados para exportar.');
        return;
    }
    
    // Preparar os dados para formatação
    const dados = apontamentos.map(item => {
        // Obter a descrição da operação
        const ocorrenciaObj = ocorrencias.find(o => o.codigo === item.codOcorrencia);
        const operacaoDesc = ocorrenciaObj ? ocorrenciaObj.operacao : '';
        
        // Formatar a data para visualização
        const dataFormatada = item.data ? formatarDataVisual(item.data) : '';
        
        return {
            'Data': dataFormatada,
            'Cliente': item.cliente || '',
            'Código': item.codigoPlaca || '',
            'Cód. Ocorrência': item.codOcorrencia || '',
            'Operação': operacaoDesc,
            'Tipo': item.tipo || '',
            'Pos. Feeder': item.posicaoFeeder || '',
            'ODF': item.odf || '',
            'Início': item.inicio || '',
            'Término': item.termino || '',
            'Placa (min)': item.tempoPlaca || '',
            'Qtd. / Pçs': item.qtdPcs || '',
            'Peças Danif.': item.pcasDanif || '',
            'Operador': item.operador || '',
            'Conferente': item.conferente || '',
            'Observação': item.observacao || '',
            'Ações': item.acoes || ''
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Apontamentos SMT');
    
    // Obter data atual para o nome do arquivo
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().split('T')[0].replace(/-/g, '');
    const horaFormatada = dataAtual.toTimeString().split(' ')[0].replace(/:/g, '');
    
    // Exportar o arquivo
    XLSX.writeFile(workbook, `apontamentos_smt_${dataFormatada}_${horaFormatada}.xlsx`);
}; 