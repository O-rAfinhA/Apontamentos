// Script para gerenciar funcionalidades de login, registro e recuperação de senha

document.addEventListener('DOMContentLoaded', function() {
    // Funções para mostrar/ocultar senha
    setupPasswordToggle();
    
    // Configurar formulário de login
    setupLoginForm();
    
    // Configurar formulário de registro
    setupRegisterForm();
    
    // Configurar formulário de recuperação de senha
    setupRecoveryForm();
    
    // Verificar se há usuários cadastrados
    checkForFirstUser();
});

// Configurar o botão de mostrar/ocultar senha
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            }
        });
    });
}

// Configurar formulário de login
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Verificar credenciais no localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            // Verificar se o usuário está aprovado
            if (!user.approved && user.role !== 'admin') {
                showAlert('login-alert', 'Sua conta está aguardando aprovação pelo administrador.', 'warning');
                return;
            }
            
            // Armazenar usuário logado
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // Redirecionar para a página de seleção de sistema
            window.location.href = 'select-system.html';
        } else {
            showAlert('login-alert', 'Usuário ou senha incorretos!', 'danger');
        }
    });
}

// Configurar formulário de registro
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('newUsername').value;
        const password = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validações
        if (username.length < 4) {
            showAlert('register-alert', 'O nome de usuário deve ter pelo menos 4 caracteres!', 'warning');
            return;
        }
        
        if (password.length < 6) {
            showAlert('register-alert', 'A senha deve ter pelo menos 6 caracteres!', 'warning');
            return;
        }
        
        if (password !== confirmPassword) {
            showAlert('register-alert', 'As senhas não coincidem!', 'warning');
            return;
        }
        
        // Verificar se o usuário já existe
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(u => u.username === username)) {
            showAlert('register-alert', 'Este nome de usuário já está em uso!', 'warning');
            return;
        }
        
        // Verificar se é o primeiro usuário (será admin)
        const isFirstUser = users.length === 0;
        
        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            username,
            password,
            role: isFirstUser ? 'admin' : 'user',
            approved: isFirstUser, // O primeiro usuário já é aprovado (admin)
            createdAt: new Date().toISOString()
        };
        
        // Salvar usuário
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Mostrar mensagem de sucesso
        if (isFirstUser) {
            showAlert('register-alert', 'Conta de administrador criada com sucesso! Você pode fazer login agora.', 'success');
        } else {
            showAlert('register-alert', 'Conta criada com sucesso! Aguarde a aprovação do administrador.', 'success');
        }
        
        // Limpar formulário
        registerForm.reset();
        
        // Redirecionar após 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
}

// Configurar formulário de recuperação de senha
function setupRecoveryForm() {
    const recoveryForm = document.getElementById('recoveryForm');
    if (!recoveryForm) return;
    
    recoveryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('recoveryUsername').value;
        
        // Verificar se o usuário existe
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userExists = users.some(u => u.username === username);
        
        if (userExists) {
            showAlert('recovery-alert', 'Uma notificação foi enviada ao administrador. Aguarde o contato.', 'success');
            
            // Em um sistema real, aqui enviaríamos um e-mail ou notificação
            // Para este exemplo, apenas simularemos o sucesso
            
            // Limpar formulário
            recoveryForm.reset();
        } else {
            showAlert('recovery-alert', 'Usuário não encontrado!', 'danger');
        }
    });
}

// Verificar se há usuários cadastrados
function checkForFirstUser() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Se não houver usuários, exibir mensagem na página de login
    if (users.length === 0 && window.location.pathname.includes('index.html')) {
        showAlert('login-alert', 'Nenhum usuário cadastrado. Crie o primeiro usuário (administrador) para começar.', 'info');
    }
}

// Função auxiliar para exibir alertas
function showAlert(elementId, message, type) {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) return;
    
    alertElement.textContent = message;
    alertElement.className = `alert alert-${type}`;
    alertElement.classList.remove('d-none');
    
    // Esconder o alerta após 5 segundos para mensagens de sucesso
    if (type === 'success') {
        setTimeout(() => {
            alertElement.classList.add('d-none');
        }, 5000);
    }
} 