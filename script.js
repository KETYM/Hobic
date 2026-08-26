document.addEventListener('DOMContentLoaded', function () {
    
    // ==========================================
    // 1. LÓGICA DE LA BARRA DE NAVEGACIÓN (Se ejecuta en todas las páginas)
    // ==========================================
    const usuarioGuardado = sessionStorage.getItem('usuarioActual');
    const userNavContainer = document.getElementById('user-nav-container');

    if (usuarioGuardado && userNavContainer) {
        const usuario = JSON.parse(usuarioGuardado);
        userNavContainer.removeAttribute('href'); // Deshabilita el enlace al login

        if (usuario.rol === 'admin') {
            userNavContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z"></path>
            </svg>
            <span>Hola, Admin</span>
            <a href="admin.html" style="color: #60a5fa; margin-left: 8px; font-size: 13px; text-decoration: underline;">(Panel)</a>
            <button id="btn-logout" title="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 6px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
        } else {
            userNavContainer.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Hola, Usuario</span>
            <button id="btn-logout" title="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 8px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
        }

        // Evento para cerrar sesión
        document.getElementById('btn-logout').addEventListener('click', function (e) {
            e.stopPropagation();
            sessionStorage.removeItem('usuarioActual');
            window.location.href = "index.html"; // Limpia y regresa a la página principal
        });
    }

    // ==========================================
    // 2. LÓGICA DEL CHAT (Se ejecuta SOLO en páginas de producto)
    // ==========================================
    const btnEnviar = document.getElementById('btn-enviar-chat');
    const inputChat = document.getElementById('chat-input');
    const cajaMensajes = document.getElementById('chat-messages');

    if (btnEnviar && inputChat && cajaMensajes) { 
        function enviarMensaje() {
            const texto = inputChat.value.trim();
            if (texto === '') return; 

            let nombreUsuario = "Invitado";
            let colorBadge = "bg-secondary"; 

            if (usuarioGuardado) {
                const usuario = JSON.parse(usuarioGuardado);
                if (usuario.rol === 'admin') {
                    nombreUsuario = "Admin";
                    colorBadge = "bg-danger"; 
                } else {
                    nombreUsuario = "Usuario";
                    colorBadge = "bg-primary"; 
                }
            }

            const nuevoMensaje = document.createElement('div');
            nuevoMensaje.className = 'mb-2';
            nuevoMensaje.innerHTML = `
                <span class="badge ${colorBadge} me-1">${nombreUsuario}</span>
                <span class="text-dark">${texto}</span>
            `;

            cajaMensajes.appendChild(nuevoMensaje);
            inputChat.value = '';
            cajaMensajes.scrollTop = cajaMensajes.scrollHeight; 
        }

        btnEnviar.addEventListener('click', enviarMensaje);
        inputChat.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                enviarMensaje();
            }
        });
    }

    // ==========================================
    // 3. LÓGICA DE INICIAR SESIÓN (Se ejecuta SOLO en inicioSesion.html)
    // ==========================================
    const formLogin = document.getElementById('form-login');
    
    if (formLogin) {
        formLogin.addEventListener('submit', function (e) {
            e.preventDefault(); 
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const mensajeError = document.getElementById('mensaje-error');

            if (email === "admin@hobic.cl" && password === "admin123") {
                sessionStorage.setItem('usuarioActual', JSON.stringify({ rol: 'admin', correo: email }));
                alert("¡Bienvenido Administrador!");
                window.location.href = "admin.html";
                return;
            }

            if (email === "usuario@hobic.cl" && password === "123456") {
                sessionStorage.setItem('usuarioActual', JSON.stringify({ rol: 'cliente', correo: email }));
                alert("¡Sesión iniciada con éxito!");
                window.location.href = "index.html";
                return;
            }

            mensajeError.textContent = "Correo o contraseña incorrectos.";
            mensajeError.style.display = "block";
        });
    }

    // ==========================================
    // 4. SEGURIDAD DEL PANEL DE ADMIN (Se ejecuta SOLO en admin.html)
    // ==========================================
    // Verificamos si estamos en la página admin.html (revisando la URL)
    if (window.location.pathname.includes('admin.html')) {
        if (!usuarioGuardado) {
            alert("Debes iniciar sesión como administrador.");
            window.location.href = "inicioSesion.html";
        } else {
            const usuario = JSON.parse(usuarioGuardado);
            if (usuario.rol !== 'admin') {
                alert("No tienes permisos para ver esta página.");
                window.location.href = "index.html";
            }
        }
    }

});