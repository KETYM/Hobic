document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. BASE DE DATOS SIMULADA (Para desarrollo)
    // ==========================================
    let usuarios = JSON.parse(localStorage.getItem("usuariosHobic")) || [];
    
    // Inyectar el admin de forma invisible si no existe, evitando quemar la clave en la validación
    if (!usuarios.find(u => u.correo === "admin@hobic.cl")) {
        usuarios.push({ nombre: "Admin", correo: "admin@hobic.cl", password: "admin123", rol: "admin" });
        localStorage.setItem("usuariosHobic", JSON.stringify(usuarios));
    }

    const usuarioGuardado = sessionStorage.getItem("usuarioActual");
    const userNavContainer = document.getElementById("user-nav-container");

    // ==========================================
    // 2. NAVBAR: SALUDO Y CERRAR SESIÓN
    // ==========================================
    if (usuarioGuardado && userNavContainer) {
        const usuario = JSON.parse(usuarioGuardado);
        userNavContainer.removeAttribute("href"); // Deshabilita el enlace al login

        if (usuario.rol === "admin") {
            userNavContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z"></path>
                </svg>
                <span>Hola, Admin</span>
                <a href="admin.html" style="color: #60a5fa; margin-left: 8px; font-size: 13px; text-decoration: underline;">(Panel)</a>
                <button id="btn-logout" title="Cerrar sesión" aria-label="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 6px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
        } else {
            const nombreMostrar = usuario.nombre ? usuario.nombre : "Usuario";
            userNavContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Hola, ${nombreMostrar}</span>
                <button id="btn-logout" title="Cerrar sesión" aria-label="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 8px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
        }

        // Evento para cerrar sesión
        document.getElementById("btn-logout").addEventListener("click", function (e) {
            e.stopPropagation();
            sessionStorage.removeItem("usuarioActual");
            window.location.href = "index.html"; 
        });
    }

    // ==========================================
    // 3. LÓGICA DE INICIO DE SESIÓN
    // ==========================================
    const formLogin = document.getElementById("form-login");
    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            e.preventDefault();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const mensajeError = document.getElementById("mensaje-error");

            // Validar contra la base de datos simulada en lugar de datos quemados
            let usuarioValido = usuarios.find(u => u.correo === email && u.password === password);

            if (usuarioValido) {
                sessionStorage.setItem("usuarioActual", JSON.stringify({ 
                    rol: usuarioValido.rol, 
                    correo: email, 
                    nombre: usuarioValido.nombre 
                }));
                alert(`¡Bienvenido ${usuarioValido.nombre}!`);
                window.location.href = usuarioValido.rol === "admin" ? "admin.html" : "index.html";
            } else {
                mensajeError.textContent = "Correo o contraseña incorrectos.";
                mensajeError.style.display = "block";
            }
            
        });
    }
// Acceso rápido para el Administrador (Botón demo)
    const btnLoginAdmin = document.getElementById("btn-login-admin");
    if (btnLoginAdmin) {
        btnLoginAdmin.addEventListener("click", function () {
            sessionStorage.setItem("usuarioActual", JSON.stringify({ 
                rol: "admin", 
                correo: "admin@hobic.cl", 
                nombre: "Admin" 
            }));
            window.location.href = "admin.html";
        });
    }
    // ==========================================
    // 4. LÓGICA DE REGISTRO
    // ==========================================
    const formRegistro = document.getElementById("form-registro");
    if (formRegistro) {
        formRegistro.addEventListener("submit", function (e) {
            e.preventDefault();
            const nombre = document.getElementById("nombre").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden. Inténtalo de nuevo.");
                return;
            }

            let usuarioExiste = usuarios.find((u) => u.correo === email);
            if (usuarioExiste) {
                alert("Este correo ya está registrado.");
                return;
            }

            usuarios.push({ nombre: nombre, correo: email, password: password, rol: "cliente" });
            localStorage.setItem("usuariosHobic", JSON.stringify(usuarios));
            alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
            window.location.href = "inicioSesion.html";
        });
    }

    // ==========================================
    // 5. PROTECCIÓN DEL PANEL DE ADMINISTRADOR
    // ==========================================
    if (window.location.pathname.includes("admin.html")) {
        if (!usuarioGuardado) {
            alert("Debes iniciar sesión como administrador.");
            window.location.href = "inicioSesion.html";
        } else {
            const usuario = JSON.parse(usuarioGuardado);
            if (usuario.rol !== "admin") {
                alert("No tienes permisos para ver esta página.");
                window.location.href = "index.html";
            }
        }
    }
});