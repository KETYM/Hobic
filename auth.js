document.addEventListener("DOMContentLoaded", function () {
    if (typeof inicializarSelectsRegionComuna === "function") {
        inicializarSelectsRegionComuna("region", "comuna");
    }
  // ==========================================
  // FORMATEO AUTOMÁTICO DE RUN
  // ==========================================
  const inputRun = document.getElementById("run");
  if (inputRun) {
    inputRun.addEventListener("input", function () {
      let valor = this.value
        .replace(/[^0-9kK]/g, "")
        .toUpperCase()
        .slice(0, 9);
      if (valor.length <= 1) {
        this.value = valor;
        return;
      }
      let cuerpo = valor.slice(0, -1);
      let dv = valor.slice(-1);
      cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      this.value = `${cuerpo}-${dv}`;
    });
  }

  // ==========================================
  // 1. BASE DE DATOS SIMULADA (Admin y Vendedor)
  // ==========================================
  let usuarios = JSON.parse(localStorage.getItem("usuariosHobic")) || [];

  // Inyectar perfiles si no existen
  if (!usuarios.find((u) => u.correo === "admin@hobic.cl")) {
    usuarios.push({
      nombre: "Admin",
      correo: "admin@hobic.cl",
      password: "admin123",
      rol: "admin",
    });
  }
  if (!usuarios.find((u) => u.correo === "vendedor@hobic.cl")) {
    usuarios.push({
      nombre: "Vendedor",
      correo: "vendedor@hobic.cl",
      password: "vend123",
      rol: "vendedor",
    });
  }
  localStorage.setItem("usuariosHobic", JSON.stringify(usuarios));

  const usuarioGuardado = sessionStorage.getItem("usuarioActual");
  const userNavContainer = document.getElementById("user-nav-container");

  // ==========================================
  // 2. NAVBAR: SALUDO Y CERRAR SESIÓN
  // ==========================================
  if (usuarioGuardado && userNavContainer) {
    const usuario = JSON.parse(usuarioGuardado);
    userNavContainer.removeAttribute("href");

    const nombreMostrar = usuario.nombre ? usuario.nombre : "Usuario";

    // Si es admin o vendedor, muestra el enlace al Panel
    if (usuario.rol === "admin" || usuario.rol === "vendedor") {
      userNavContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5z"></path>
                </svg>
                <span>Hola, ${nombreMostrar}</span>
                <a href="admin.html" style="color: #60a5fa; margin-left: 8px; font-size: 13px; text-decoration: underline;">(Panel)</a>
                <button id="btn-logout" title="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 6px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
    } else {
      // Vista de Cliente normal
      userNavContainer.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Hola, ${nombreMostrar}</span>
                <button id="btn-logout" title="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 8px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
    }

    // Evento para cerrar sesión
    document
      .getElementById("btn-logout")
      .addEventListener("click", function (e) {
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

      mensajeError.style.color = "#dc2626";
      let usuarioValido = usuarios.find(
        (u) => u.correo === email && u.password === password,
      );

      if (usuarioValido) {
        sessionStorage.setItem(
          "usuarioActual",
          JSON.stringify({
            rol: usuarioValido.rol,
            correo: email,
            nombre: usuarioValido.nombre,
          }),
        );
        alert(`¡Bienvenido ${usuarioValido.nombre}!`);
        // Redirige al panel si es staff, si no, al inicio
        window.location.href =
          usuarioValido.rol === "admin" || usuarioValido.rol === "vendedor"
            ? "admin.html"
            : "index.html";
      } else {
        mensajeError.textContent = "Correo o contraseña incorrectos.";
        mensajeError.style.display = "block";
      }
    });
  }

  // Botones de Ayuda para Login (Sin autocompletado por seguridad)
  const btnLoginAdmin = document.getElementById("btn-login-admin");
  if (btnLoginAdmin) {
    btnLoginAdmin.addEventListener("click", function () {
      document.getElementById("email").value = ""; // Vaciamos el campo
      document.getElementById("password").value = "";
      document.getElementById("email").focus(); // Enfocamos el correo para que empiece a teclear

      const mensajeError = document.getElementById("mensaje-error");
      mensajeError.style.color = "#6366f1";
      mensajeError.textContent =
        "Modo Administrador: Ingresa tus credenciales.";
      mensajeError.style.display = "block";
    });
  }

  const btnLoginVendedor = document.getElementById("btn-login-vendedor");
  if (btnLoginVendedor) {
    btnLoginVendedor.addEventListener("click", function () {
      document.getElementById("email").value = ""; // Vaciamos el campo
      document.getElementById("password").value = "";
      document.getElementById("email").focus();

      const mensajeError = document.getElementById("mensaje-error");
      mensajeError.style.color = "#10b981";
      mensajeError.textContent = "Modo Vendedor: Ingresa tus credenciales.";
      mensajeError.style.display = "block";
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
      const run = document.getElementById("run").value.trim();
      const direccion = document.getElementById("direccion").value.trim();
      const region = document.getElementById("region").value.trim();
      const comuna = document.getElementById("comuna").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      const errorRun = document.getElementById("error-run");
      const errorEmail = document.getElementById("error-email");
      const errorPassword = document.getElementById("error-password");

      if (errorRun) errorRun.classList.add("d-none");
      if (errorEmail) errorEmail.classList.add("d-none");
      if (errorPassword) errorPassword.classList.add("d-none");

      let isValid = true;

      const runRegex = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]{1}$/;
      if (!runRegex.test(run)) {
        if (errorRun) {
          errorRun.textContent = "Formato inválido. Ejemplo: 12.345.678-9";
          errorRun.classList.remove("d-none");
        }
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (errorEmail) {
          errorEmail.textContent = "Formato de correo inválido.";
          errorEmail.classList.remove("d-none");
        }
        isValid = false;
      }

      if (password.length < 6) {
        if (errorPassword) {
          errorPassword.textContent =
            "La contraseña debe tener al menos 6 caracteres.";
          errorPassword.classList.remove("d-none");
        }
        isValid = false;
      } else if (password !== confirmPassword) {
        if (errorPassword) {
          errorPassword.textContent = "Las contraseñas no coinciden.";
          errorPassword.classList.remove("d-none");
        }
        isValid = false;
      }

      if (!isValid) return;

      let usuarioExiste = usuarios.find((u) => u.correo === email);
      if (usuarioExiste) {
        if (errorEmail) {
          errorEmail.textContent =
            "Este correo ya está registrado. Por favor, ingresa otro.";
          errorEmail.classList.remove("d-none");
        }
        return;
      }

      usuarios.push({
        nombre: nombre,
        run: run,
        direccion: direccion,
        region: region,
        comuna: comuna,
        correo: email,
        password: password,
        rol: "cliente",
      });

      localStorage.setItem("usuariosHobic", JSON.stringify(usuarios));

      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      window.location.href = "inicioSesion.html";
    });
  }

  // ==========================================
  // 5. PROTECCIÓN DEL PANEL DE ADMINISTRADOR/VENDEDOR
  // ==========================================
  if (window.location.pathname.includes("admin.html")) {
    if (!usuarioGuardado) {
      alert("Debes iniciar sesión para acceder al panel.");
      window.location.href = "inicioSesion.html";
    } else {
      const usuario = JSON.parse(usuarioGuardado);
      // Ahora permitimos el paso tanto a admin como a vendedor
      if (usuario.rol !== "admin" && usuario.rol !== "vendedor") {
        alert("No tienes permisos para ver esta página.");
        window.location.href = "index.html";
      }
    }
  }

  // ==========================================
  // 6. PROTECCIÓN DE LA PÁGINA DE LOGIN
  // ==========================================
  if (
    window.location.pathname.includes("inicioSesion.html") &&
    usuarioGuardado
  ) {
    const usuario = JSON.parse(usuarioGuardado);
    window.location.href =
      usuario.rol === "admin" || usuario.rol === "vendedor"
        ? "admin.html"
        : "index.html";
  }
});
