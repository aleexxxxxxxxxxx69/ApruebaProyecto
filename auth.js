function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (email && password.length >= 6) {
        const user = {
            email: email,
            name: email.split('@')[0],
            loginTime: new Date().toISOString()
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        alert('¡Login exitoso! Bienvenido ' + user.name);
        window.location.href = 'index.html';
    } else {
        alert('Por favor, introduce un email válido y una contraseña de al menos 6 caracteres');
    }
    
    return false;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user !== null;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
}

document.addEventListener('DOMContentLoaded', () => {
    const user = getCurrentUser();
    const loginBtn = document.querySelector('.btn-login');
    
    if (user && loginBtn) {
        loginBtn.innerHTML = '<span class="icon">👤</span>' + user.name + '<button onclick="logout()" style="margin-left: 0.5rem; padding: 0.3rem 0.8rem; border: none; background: rgba(255,255,255,0.2); border-radius: 15px; cursor: pointer;">Salir</button>';
    }
});
