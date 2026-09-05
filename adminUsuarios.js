document.addEventListener("DOMContentLoaded", () => {
    // Solo ejecutar si estamos en la página correcta
    if (!window.location.pathname.includes("adminUsuarios.html")) return;
    
    // ==========================================
    // SEGURIDAD Y RESTRICCIÓN ESTRICTA (USUARIOS)
    // ==========================================
    const sesion = JSON.parse(sessionStorage.getItem("usuarioActual"));

    // Solo el rol "admin" puede pasar
    if (!sesion || sesion.rol !== "admin") {
        window.location.href = (sesion && sesion.rol === "vendedor") ? "admin.html" : "index.html";
        return;
    }

    // 1. OBTENER USUARIOS DE LOCALSTORAGE
    let usuarios = JSON.parse(localStorage.getItem("usuariosHobic")) || [];

    // 2. REFERENCIAS AL DOM
    const tablaUsuarios = document.getElementById("tabla-usuarios");
    const formUsuario = document.getElementById("form-crud-usuario");
    const inputCorreoOriginal = document.getElementById("crud-user-correo-original");

    const inputNombre = document.getElementById("crud-user-nombre");
    const inputRun = document.getElementById("crud-user-run");
    const selectRol = document.getElementById("crud-user-rol");
    const inputDireccion = document.getElementById("crud-user-direccion");
    const inputRegion = document.getElementById("crud-user-region");
    const inputComuna = document.getElementById("crud-user-comuna");
    const inputCorreo = document.getElementById("crud-user-correo");
    const inputPass = document.getElementById("crud-user-pass");

    const btnCancelar = document.getElementById("btn-cancelar-user");
    const tituloForm = document.getElementById("form-titulo-user");
    const errorCorreo = document.getElementById("error-user-correo");

    // ==========================================
    // INICIALIZAR SELECTS DE REGIÓN Y COMUNA
    // ==========================================
    if (typeof inicializarSelectsRegionComuna === "function") {
        inicializarSelectsRegionComuna("crud-user-region", "crud-user-comuna");
    }

    // ==========================================
    // FORMATEO AUTOMÁTICO DE RUN
    // ==========================================
    if (inputRun) {
        inputRun.addEventListener("input", function () {
            let valor = this.value.replace(/[^0-9kK]/g, "").toUpperCase().slice(0, 9);
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

    // 3. RENDERIZAR LA TABLA DE USUARIOS
    function renderizarTablaUsuarios() {
        if (!tablaUsuarios) return;
        tablaUsuarios.innerHTML = "";

        usuarios.forEach((user) => {
            const badgeRol = user.rol === "admin" ? "bg-danger" : "bg-primary";
            const textoRol = user.rol === "admin" ? "Admin" : "Cliente";

            tablaUsuarios.innerHTML += `
                <tr>
                    <td class="ps-4">
                        <div class="fw-bold text-white">${user.nombre}</div>
                        <small class="text-muted">${user.correo}</small>
                    </td>
                    <td class="text-white">${user.run}</td>
                    <td><span class="badge ${badgeRol}">${textoRol}</span></td>
                    <td class="text-white">
                        <small>${user.direccion}</small><br>
                        <small class="text-muted">${user.comuna || "Sin comuna"}, ${user.region || "Sin región"}</small>
                    </td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-primary me-1" onclick="editarUsuario('${user.correo}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarUsuario('${user.correo}')">Borrar</button>
                    </td>
                </tr>
            `;
        });
    }

    // 4. CREAR O ACTUALIZAR USUARIO
    if (formUsuario) {
        formUsuario.addEventListener("submit", (e) => {
            e.preventDefault();
            errorCorreo.classList.add("d-none");

            const correoOriginal = inputCorreoOriginal.value;
            const nuevoCorreo = inputCorreo.value.trim();
            const pass = inputPass.value;
            const run = inputRun.value.trim();

            const runRegex = /^\d{1,2}\.\d{3}\.\d{3}-[0-9kK]{1}$/;
            if (!runRegex.test(run)) {
                alert("El formato del RUN es inválido. Recuerda escribirlo completo.");
                return;
            }

            if (pass.length < 6) {
                alert("La contraseña debe tener al menos 6 caracteres.");
                return;
            }

            const correoExiste = usuarios.find((u) => u.correo === nuevoCorreo && u.correo !== correoOriginal);
            if (correoExiste) {
                errorCorreo.classList.remove("d-none");
                return;
            }

            const datosUsuario = {
                nombre: inputNombre.value.trim(),
                run: run,
                direccion: inputDireccion.value.trim(),
                region: inputRegion.value.trim(),
                comuna: inputComuna.value.trim(),
                correo: nuevoCorreo,
                password: pass,
                rol: selectRol.value,
            };

            if (correoOriginal) {
                const index = usuarios.findIndex((u) => u.correo === correoOriginal);
                if (index !== -1) {
                    usuarios[index] = datosUsuario;
                    alert("Usuario actualizado correctamente.");
                }
            } else {
                usuarios.push(datosUsuario);
                alert("Usuario creado exitosamente.");
            }

            guardarYRecargarUsuarios();
        });
    }

    // 5. FUNCIONES GLOBALES (Editar, Borrar)
    window.eliminarUsuario = function (correo) {
        if (confirm(`¿Estás seguro de eliminar al usuario con correo: ${correo}?`)) {
            usuarios = usuarios.filter((u) => u.correo !== correo);
            guardarYRecargarUsuarios();
        }
    };

    window.editarUsuario = function (correo) {
        const user = usuarios.find((u) => u.correo === correo);
        if (user) {
            inputCorreoOriginal.value = user.correo;
            inputNombre.value = user.nombre;
            inputRun.value = user.run;
            inputDireccion.value = user.direccion;
            
            // Carga la región y activa automáticamente sus comunas correspondientes
            if (typeof inicializarSelectsRegionComuna === "function") {
                inicializarSelectsRegionComuna("crud-user-region", "crud-user-comuna", user.region || "", user.comuna || "");
            } else {
                inputRegion.value = user.region || "";
                inputComuna.value = user.comuna || "";
            }

            inputCorreo.value = user.correo;
            inputPass.value = user.password;
            selectRol.value = user.rol;

            tituloForm.textContent = "Editar Usuario";
            btnCancelar.classList.remove("d-none");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Cancelar Edición
    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            formUsuario.reset();
            inputCorreoOriginal.value = "";
            tituloForm.textContent = "Agregar Usuario";
            btnCancelar.classList.add("d-none");
            errorCorreo.classList.add("d-none");
            // Reinicia los selects a su estado inicial vacío
            if (typeof inicializarSelectsRegionComuna === "function") {
                inicializarSelectsRegionComuna("crud-user-region", "crud-user-comuna");
            }
        });
    }

    // Guardar cambios en LocalStorage y refrescar tabla
    function guardarYRecargarUsuarios() {
        localStorage.setItem("usuariosHobic", JSON.stringify(usuarios));
        renderizarTablaUsuarios();
        if (btnCancelar) btnCancelar.click();
    }

    // Inicializar la tabla al entrar a la página
    renderizarTablaUsuarios();
});