// Função para gerar o HTML do cabeçalho padronizado
function createHeader(pageTitle, isLoginPage = false) {
    // Determinar o link da logo baseado na localização atual (subdiretório)
    const basePath = isLoginPage ? '' : '../';
    const logoLink = isLoginPage ? 'select-system.html' : `${basePath}login/select-system.html`;
    const logoSrc = isLoginPage ? 'logo.png' : `${basePath}login/logo.png`;
    
    // Criar o HTML do cabeçalho
    const headerHTML = `
    <header class="header-container">
        <div class="container">
            <div class="d-flex align-items-center position-relative">
                <a href="${logoLink}" class="logo-container"><img src="${logoSrc}" alt="Logo do Sistema" class="header-logo" id="headerLogo"></a>
                <h1 class="header-title">Sistema de Apontamento - ${pageTitle}</h1>
            </div>
        </div>
    </header>
    `;
    
    return headerHTML;
}

// Função para injetar o cabeçalho no documento
function injectHeader(pageTitle, isLoginPage = false) {
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        headerContainer.innerHTML = createHeader(pageTitle, isLoginPage);
    }
}

// Função para inicializar o cabeçalho quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Obter o título da página a partir do atributo data-title
    const headerContainer = document.getElementById('headerContainer');
    if (headerContainer) {
        const pageTitle = headerContainer.getAttribute('data-title') || document.title.replace('Sistema de Apontamento - ', '');
        const isLoginPage = headerContainer.getAttribute('data-login') === 'true';
        injectHeader(pageTitle, isLoginPage);
    }
}); 