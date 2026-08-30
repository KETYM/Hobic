document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. LÓGICA DE LA BARRA DE NAVEGACIÓN (Se ejecuta en todas las páginas)
  // ==========================================
  const usuarioGuardado = sessionStorage.getItem("usuarioActual");
  const userNavContainer = document.getElementById("user-nav-container");

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
            <button id="btn-logout" title="Cerrar sesión" style="background: none; border: none; color: #ff6b6b; cursor: pointer; font-size: 13px; margin-left: 6px; text-decoration: underline; padding: 0;">(Salir)</button>
            `;
    } else {
      // Aquí extraemos el nombre del usuario
      const nombreMostrar = usuario.nombre ? usuario.nombre : "Usuario";

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
        window.location.href = "index.html"; // Limpia y regresa a la página principal
      });
  }

  // ==========================================
  // 2. LÓGICA DEL CHAT
  // ==========================================
  const btnEnviar = document.getElementById("btn-enviar-chat");
  const inputChat = document.getElementById("chat-input");
  const cajaMensajes = document.getElementById("chat-messages");

  if (btnEnviar && inputChat && cajaMensajes) {
    function enviarMensaje() {
      const texto = inputChat.value.trim();
      if (texto === "") return;

      let nombreUsuario = "Invitado";
      let colorBadge = "bg-secondary";

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        if (usuario.rol === "admin") {
          nombreUsuario = "Admin";
          colorBadge = "bg-danger";
        } else {
          // Extraemos el nombre dinámicamente desde el Session Storage
          nombreUsuario = usuario.nombre ? usuario.nombre : "Usuario";
          colorBadge = "bg-primary";
        }
      }

      const nuevoMensaje = document.createElement("div");
      nuevoMensaje.className = "mb-2";
      nuevoMensaje.innerHTML = `
                <span class="badge ${colorBadge} me-1">${nombreUsuario}</span>
                <span class="text-dark">${texto}</span>
            `;

      cajaMensajes.appendChild(nuevoMensaje);
      inputChat.value = "";
      cajaMensajes.scrollTop = cajaMensajes.scrollHeight;
    }

    btnEnviar.addEventListener("click", enviarMensaje);
    inputChat.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        enviarMensaje();
      }
    });
  }

  // ==========================================
  // 3. LÓGICA DE INICIAR SESIÓN (Se ejecuta SOLO en inicioSesion.html)
  // ==========================================
  const formLogin = document.getElementById("form-login");

  if (formLogin) {
    formLogin.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const mensajeError = document.getElementById("mensaje-error");

      // 1. Revisar los hardcodeados primero (Admin)
      if (email === "admin@hobic.cl" && password === "admin123") {
        sessionStorage.setItem(
          "usuarioActual",
          JSON.stringify({ rol: "admin", correo: email, nombre: "Admin" }),
        );
        alert("¡Bienvenido Administrador!");
        window.location.href = "admin.html";
        return;
      }

      // 2. Revisar usuarios registrados dinámicamente en localStorage
      let usuarios = JSON.parse(localStorage.getItem("usuariosHobic")) || [];
      let usuarioValido = usuarios.find(
        (u) => u.correo === email && u.password === password,
      );

      if (usuarioValido) {
        sessionStorage.setItem(
          "usuarioActual",
          JSON.stringify({
            rol: "cliente",
            correo: email,
            nombre: usuarioValido.nombre,
          }),
        );
        alert(`¡Bienvenido ${usuarioValido.nombre}!`);
        window.location.href = "index.html";
        return;
      }

      // 3. Fallback del usuario de prueba original
      if (email === "usuario@hobic.cl" && password === "123456") {
        sessionStorage.setItem(
          "usuarioActual",
          JSON.stringify({ rol: "cliente", correo: email, nombre: "Usuario" }),
        );
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
  // ==========================================
  // 5. LÓGICA DEL CARRITO DINÁMICO (LocalStorage)
  // ==========================================

  // A. Función para guardar cosas en la memoria del navegador
  function agregarAlCarrito(nombre, precio, imagen) {
    // Lee el carrito actual o crea uno vacío si no existe
    let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];

    // Revisa si el producto ya está en el carrito
    let productoExistente = carrito.find((item) => item.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad++; // Si ya está, suma 1
    } else {
      // Si es nuevo, lo agrega a la lista
      carrito.push({
        nombre: nombre,
        precio: precio,
        imagen: imagen,
        cantidad: 1,
      });
    }

    // Guarda la lista actualizada en la memoria
    localStorage.setItem("carritoHobic", JSON.stringify(carrito));
    alert(`¡Se agregó "${nombre}" a tu carrito!`);
  }

  // B. Lógica cuando se hace clic en "Agregar al carrito" en la página del producto
  const btnAgregarDetalle = document.getElementById("btn-agregar-carrito");
  if (btnAgregarDetalle) {
    btnAgregarDetalle.addEventListener("click", function (e) {
      e.preventDefault();

      const tituloProducto = document.getElementById("titulo-producto");
      const precioElemento = document.querySelector(".display-6"); // El H2 con el precio
      const imagenElemento = document.querySelector(".col-lg-8 img"); // La imagen

      let nombre = tituloProducto
        ? tituloProducto.textContent.trim()
        : "Producto";

      // Limpiamos el texto del precio (quitamos $, puntos y espacios)
      let precioTexto = precioElemento
        ? precioElemento.textContent.replace("$", "").replace(".", "").trim()
        : "19990";
      let precio = parseInt(precioTexto);

      let imagen = imagenElemento
        ? imagenElemento.getAttribute("src")
        : "imagenes/default.jpg";

      agregarAlCarrito(nombre, precio, imagen);
    });
  }

  // C. Dibujar el carrito en la página carrito.html
  const contenedorCarrito = document.getElementById(
    "contenedor-productos-carrito",
  );
  if (contenedorCarrito) {
    function renderizarCarrito() {
      let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
      contenedorCarrito.innerHTML = ""; // Limpiar la pantalla

      // Si el carrito está vacío
      if (carrito.length === 0) {
        contenedorCarrito.innerHTML =
          '<p class="text-center text-muted my-5">Tu carrito está vacío. ¡Ve a comprar algo genial!</p>';
        document.getElementById("resumen-subtotal").textContent = "$0";
        document.getElementById("resumen-total").textContent = "$0";
        document.getElementById("resumen-cantidad").textContent =
          `Subtotal (0 productos)`;
        return;
      }

      let totalPlata = 0;
      let totalArticulos = 0;

      // Dibuja cada producto en la pantalla
      carrito.forEach((producto, index) => {
        let subtotal = producto.precio * producto.cantidad;
        totalPlata += subtotal;
        totalArticulos += producto.cantidad;

        contenedorCarrito.innerHTML += `
                <div class="row align-items-center mb-4 pb-4 border-bottom item-carrito">
                    <div class="col-3 col-md-2">
                        <img src="${producto.imagen}" alt="Producto" class="img-fluid rounded" style="object-fit: contain; max-height: 100px;">
                    </div>
                    <div class="col-9 col-md-4 mb-3 mb-md-0">
                        <h6 class="mb-1 text-dark fw-bold">${producto.nombre}</h6>
                    </div>
                    <div class="col-6 col-md-3 d-flex align-items-center justify-content-md-center">
                        <button class="btn btn-outline-secondary btn-sm px-2 py-1" onclick="cambiarCantidad(${index}, -1)">-</button>
                        <input type="text" class="form-control form-control-sm text-center mx-2 shadow-none" value="${producto.cantidad}" style="width: 45px;" readonly>
                        <button class="btn btn-outline-secondary btn-sm px-2 py-1" onclick="cambiarCantidad(${index}, 1)">+</button>
                    </div>
                    <div class="col-6 col-md-3 d-flex align-items-center justify-content-between justify-content-md-end gap-3">
                        <span class="fw-bold fs-5">$${subtotal.toLocaleString("es-CL")}</span>
                        <button class="btn text-danger p-0 shadow-none" onclick="eliminarDelCarrito(${index})" title="Eliminar producto">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                    </div>
                </div>`;
      });

      // Actualiza la boleta de la derecha
      document.getElementById("resumen-subtotal").textContent =
        "$" + totalPlata.toLocaleString("es-CL");
      document.getElementById("resumen-total").textContent =
        "$" + totalPlata.toLocaleString("es-CL");
      document.getElementById("resumen-cantidad").textContent =
        `Subtotal (${totalArticulos} productos)`;
    }

    // Funciones conectadas a los botones + , - y basurero
    window.cambiarCantidad = function (index, cambio) {
      let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
      carrito[index].cantidad += cambio;
      if (carrito[index].cantidad < 1) carrito[index].cantidad = 1; // El mínimo es 1
      localStorage.setItem("carritoHobic", JSON.stringify(carrito));
      renderizarCarrito(); // Vuelve a dibujar
    };

    window.eliminarDelCarrito = function (index) {
      if (confirm("¿Seguro que deseas eliminar este producto?")) {
        let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
        carrito.splice(index, 1); // Saca el producto de la lista
        localStorage.setItem("carritoHobic", JSON.stringify(carrito));
        renderizarCarrito(); // Vuelve a dibujar
      }
    };

    // Ejecuta la función principal al entrar a la página
    renderizarCarrito();
  }
  // ==========================================
  // 6. LÓGICA DE LA PÁGINA DE PAGO (Solo en pago.html)
  // ==========================================
  const formPago = document.getElementById("form-pago");

  if (formPago) {
    formPago.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita que la página se recargue

      // Aquí en el futuro enviarías los datos a Spring Boot

      // Por ahora simulamos que la compra fue exitosa
      alert(
        "¡Pago exitoso! Tu pedido está siendo procesado.\nGracias por comprar en Hobic.",
      );

      // Redirigimos al usuario a la página de inicio
      window.location.href = "index.html";
    });
  }
  // ==========================================
  // 7. LÓGICA DE ICONOS GRISES EN CATÁLOGOS
  // ==========================================
  const botonesAgregarCatalogo = document.querySelectorAll(
    ".card .btn-dark.rounded-circle",
  );

  if (botonesAgregarCatalogo.length > 0) {
    botonesAgregarCatalogo.forEach((boton) => {
      boton.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que la página salte

        const tarjeta = this.closest(".card");
        if (tarjeta) {
          // Busca los datos dentro de la tarjeta
          const tituloEl = tarjeta.querySelector(".card-title");
          const precioEl = tarjeta.querySelector(".fs-5.fw-bold.text-dark");
          const imgEl = tarjeta.querySelector("img");

          let nombre = tituloEl ? tituloEl.textContent.trim() : "Producto";

          // Limpia el precio (quita $ y puntos)
          let precioTexto = precioEl
            ? precioEl.textContent.replace("$", "").replace(".", "").trim()
            : "0";
          let precio = parseInt(precioTexto);

          let imagen = imgEl
            ? imgEl.getAttribute("src")
            : "imagenes/default.jpg";

          // Llama a la memoria del carrito
          agregarAlCarrito(nombre, precio, imagen);
        }
      });
    });
  }
  // ==========================================
  // 8. LÓGICA DE BOTONES "COMPRAR" EN PROMOS (index.html)
  // ==========================================
  const botonesPromos = document.querySelectorAll(".btn-comprar-promo");

  if (botonesPromos.length > 0) {
    botonesPromos.forEach((boton) => {
      boton.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que la página salte

        // Buscar la tarjeta completa donde está el botón
        const tarjeta = this.closest(".tarjeta");

        if (tarjeta) {
          // Extraer los datos del HTML
          const tituloEl = tarjeta.querySelector("h3");
          const precioEl = tarjeta.querySelector("p"); // Donde dice "Precio: $15.990"
          const imgEl = tarjeta.querySelector("img");

          let nombre = tituloEl
            ? tituloEl.textContent.trim()
            : "Producto Promo";

          // Limpiar el precio (quitamos "Precio:", el "$" y el punto)
          let precioTexto = "0";
          if (precioEl) {
            precioTexto = precioEl.textContent
              .replace("Precio:", "")
              .replace("$", "")
              .replace(".", "")
              .trim();
          }
          let precio = parseInt(precioTexto);

          let imagen = imgEl
            ? imgEl.getAttribute("src")
            : "imagenes/default.jpg";

          // Llamamos a la función mágica que creamos antes para guardar en memoria
          if (typeof agregarAlCarrito === "function") {
            agregarAlCarrito(nombre, precio, imagen);
          } else {
            alert(`¡Se agregó "${nombre}" a tu carrito!`);
          }
        }
      });
    });
  }
  // ==========================================
  // 9. LÓGICA DE BOTÓN "COMPRAR AHORA" (Detalle de producto)
  // ==========================================
  const btnComprarAhora = document.getElementById("btn-comprar-ahora");

  if (btnComprarAhora) {
    btnComprarAhora.addEventListener("click", function (e) {
      e.preventDefault(); // Evita que la página salte

      // Atrapamos los mismos datos que usa el botón de agregar al carrito
      const tituloProducto = document.getElementById("titulo-producto");
      const precioElemento = document.querySelector(".display-6"); // El H2 con el precio
      const imagenElemento = document.querySelector(".col-lg-8 img"); // La imagen

      let nombre = tituloProducto
        ? tituloProducto.textContent.trim()
        : "Producto";

      // Limpiamos el texto del precio
      let precioTexto = precioElemento
        ? precioElemento.textContent.replace("$", "").replace(".", "").trim()
        : "19990";
      let precio = parseInt(precioTexto);

      let imagen = imagenElemento
        ? imagenElemento.getAttribute("src")
        : "imagenes/default.jpg";

      // Guardamos el producto en la memoria del navegador
      if (typeof agregarAlCarrito === "function") {
        agregarAlCarrito(nombre, precio, imagen);
      }

      // ¡La magia!: Redirigimos al usuario inmediatamente a pagar
      window.location.href = "pago.html";
    });
  }
  // ==========================================
  // 10. LÓGICA DE REGISTRO DE USUARIOS
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

      // Obtener usuarios guardados o crear un arreglo vacío
      let usuarios = JSON.parse(localStorage.getItem("usuariosHobic")) || [];

      // Verificar si el correo ya existe
      let usuarioExiste = usuarios.find((u) => u.correo === email);
      if (usuarioExiste) {
        alert("Este correo ya está registrado.");
        return;
      }

      // Guardar el nuevo usuario
      usuarios.push({
        nombre: nombre,
        correo: email,
        password: password,
        rol: "cliente",
      });
      localStorage.setItem("usuariosHobic", JSON.stringify(usuarios));

      alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
      window.location.href = "inicioSesion.html";
    });
  }

  //11. lógica de filtrado y búsqueda (catalogo.html)
  const buscador = document.getElementById("buscador-catalogo");
  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  const itemsCatalogo = document.querySelectorAll(".item-catalogo");

  if (buscador && itemsCatalogo.length > 0) {
    botonesFiltro.forEach((boton) => {
      boton.addEventListener("click", function () {
        botonesFiltro.forEach((b) => {
          b.classList.remove("btn-primary");
          b.classList.add("btn-outline-secondary");
        });
        this.classList.remove("btn-outline-secondary");
        this.classList.add("btn-primary");

        const categoria = this.getAttribute("data-filtro");
        itemsCatalogo.forEach((item) => {
          const itemCat = item.getAttribute("data-categoria");
          if (categoria === "todos" || itemCat === categoria) {
            item.style.display = "block";
          } else {
            item.style.display = "none";
          }
        });
      });
    });

    //filtrar escribiendo en el buscador
    buscador.addEventListener("input", function () {
      const texto = this.value.toLowerCase().trim();
      itemsCatalogo.forEach((item) => {
        const titulo = item
          .querySelector(".card-title")
          .textContent.toLowerCase();
        const categoria = item.getAttribute("data-categoria").toLowerCase();
        if (titulo.includes(texto) || categoria.includes(texto)) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  }
});
