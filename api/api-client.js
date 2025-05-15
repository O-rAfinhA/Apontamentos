/**
 * Cliente de API para os módulos do sistema de apontamento
 */

// URL base da API
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Funções de utilidade para o cliente da API
const ApiClient = {
    /**
     * Realiza uma requisição fetch para a API
     * @param {string} endpoint - Endpoint da API
     * @param {Object} options - Opções da requisição
     * @returns {Promise<any>} - Resposta da API
     */
    async fetchApi(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            
            // Configurações padrão
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            };
            
            // Mesclar opções
            const fetchOptions = { ...defaultOptions, ...options };
            
            // Realizar a requisição
            const response = await fetch(url, fetchOptions);
            
            // Verificar se a resposta é ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
            }
            
            // Retornar os dados
            return await response.json();
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    },
    
    /**
     * Obtém dados da API
     * @param {string} endpoint - Endpoint da API
     * @returns {Promise<any>} - Dados retornados pela API
     */
    async get(endpoint) {
        return this.fetchApi(endpoint, { method: 'GET' });
    },
    
    /**
     * Envia dados para a API
     * @param {string} endpoint - Endpoint da API
     * @param {Object} data - Dados a serem enviados
     * @returns {Promise<any>} - Resposta da API
     */
    async post(endpoint, data) {
        return this.fetchApi(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Atualiza dados na API
     * @param {string} endpoint - Endpoint da API
     * @param {Object} data - Dados a serem atualizados
     * @returns {Promise<any>} - Resposta da API
     */
    async put(endpoint, data) {
        return this.fetchApi(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    /**
     * Remove dados da API
     * @param {string} endpoint - Endpoint da API
     * @returns {Promise<any>} - Resposta da API
     */
    async delete(endpoint) {
        return this.fetchApi(endpoint, { method: 'DELETE' });
    }
};

// Funções específicas para o módulo THT
const ThtApi = {
    /**
     * Obtém todas as ocorrências do módulo THT
     * @returns {Promise<Array>} - Lista de ocorrências
     */
    async getOcorrencias() {
        return ApiClient.get('/tht/ocorrencias');
    },
    
    /**
     * Obtém todos os apontamentos do módulo THT
     * @returns {Promise<Array>} - Lista de apontamentos
     */
    async getApontamentos() {
        return ApiClient.get('/tht/apontamentos');
    },
    
    /**
     * Cria um novo apontamento no módulo THT
     * @param {Object} apontamento - Dados do apontamento
     * @returns {Promise<Object>} - Resposta da API
     */
    async createApontamento(apontamento) {
        return ApiClient.post('/tht/apontamentos', apontamento);
    }
};

// Funções específicas para o módulo SMT
const SmtApi = {
    /**
     * Obtém todas as ocorrências do módulo SMT
     * @returns {Promise<Array>} - Lista de ocorrências
     */
    async getOcorrencias() {
        return ApiClient.get('/smt/ocorrencias');
    },
    
    /**
     * Obtém todos os apontamentos do módulo SMT
     * @returns {Promise<Array>} - Lista de apontamentos
     */
    async getApontamentos() {
        return ApiClient.get('/smt/apontamentos');
    },
    
    /**
     * Cria um novo apontamento no módulo SMT
     * @param {Object} apontamento - Dados do apontamento
     * @returns {Promise<Object>} - Resposta da API
     */
    async createApontamento(apontamento) {
        return ApiClient.post('/smt/apontamentos', apontamento);
    }
};

// Funções específicas para o módulo Qualidade
const QualidadeApi = {
    /**
     * Obtém todos os apontamentos do módulo Qualidade
     * @returns {Promise<Array>} - Lista de apontamentos
     */
    async getApontamentos() {
        return ApiClient.get('/qualidade/apontamentos');
    },
    
    /**
     * Cria um novo apontamento no módulo Qualidade
     * @param {Object} apontamento - Dados do apontamento
     * @returns {Promise<Object>} - Resposta da API
     */
    async createApontamento(apontamento) {
        return ApiClient.post('/qualidade/apontamentos', apontamento);
    }
};

// Funções para obter listas
const ListasApi = {
    /**
     * Obtém a lista de clientes
     * @returns {Promise<Array>} - Lista de clientes
     */
    async getClientes() {
        return ApiClient.get('/clientes');
    },
    
    /**
     * Obtém a lista de operadores
     * @returns {Promise<Array>} - Lista de operadores
     */
    async getOperadores() {
        return ApiClient.get('/operadores');
    },
    
    /**
     * Obtém a lista de líderes
     * @returns {Promise<Array>} - Lista de líderes
     */
    async getLideres() {
        return ApiClient.get('/lideres');
    },
    
    /**
     * Obtém a lista de conferentes
     * @returns {Promise<Array>} - Lista de conferentes
     */
    async getConferentes() {
        return ApiClient.get('/conferentes');
    },
    
    /**
     * Obtém a lista de inspetores
     * @returns {Promise<Array>} - Lista de inspetores
     */
    async getInspetores() {
        return ApiClient.get('/inspetores');
    }
}; 