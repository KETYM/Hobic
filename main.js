document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. LÓGICA DEL CHAT EN VIVO
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
      const usuarioGuardado = sessionStorage.getItem("usuarioActual");

      if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        if (usuario.rol === "admin") {
          nombreUsuario = "Admin";
          colorBadge = "bg-danger";
        } else {
          nombreUsuario = usuario.nombre ? usuario.nombre : "Usuario";
          colorBadge = "bg-primary";
        }
      }

      const nuevoMensaje = document.createElement("div");
      nuevoMensaje.className = "mb-2";
      nuevoMensaje.innerHTML = `
                <span class="badge ${colorBadge} me-1">${nombreUsuario}</span>
                <span class="text-white">${texto}</span>
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
  // 2. LÓGICA DE FILTRADO Y BÚSQUEDA (Catálogo)
  // ==========================================
  const buscador = document.getElementById("buscador-catalogo");
  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  const itemsCatalogo = document.querySelectorAll(".item-catalogo");

  if (buscador && itemsCatalogo.length > 0) {
    botonesFiltro.forEach((boton) => {
      boton.addEventListener("click", function () {
        botonesFiltro.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

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

    // Filtrar escribiendo en el buscador
    buscador.addEventListener("input", function () {
      const texto = this.value.toLowerCase().trim();
      let elementosVisibles = 0;

      itemsCatalogo.forEach((item) => {
        const titulo = item.querySelector(".card-title").textContent.toLowerCase();
        const categoria = item.getAttribute("data-categoria") ? item.getAttribute("data-categoria").toLowerCase() : "";

        if (titulo.includes(texto) || categoria.includes(texto)) {
          item.style.display = "block";
          elementosVisibles++;
        } else {
          item.style.display = "none";
        }
      });

      // Mensaje de "Sin resultados"
      const contenedorGrilla = document.getElementById("grilla-catalogo");
      let msjVacio = document.getElementById("mensaje-sin-resultados");

      if (elementosVisibles === 0) {
        if (!msjVacio && contenedorGrilla) {
          msjVacio = document.createElement("div");
          msjVacio.id = "mensaje-sin-resultados";
          msjVacio.className = "col-12 text-center text-muted my-5";
          msjVacio.innerHTML = `<h4 class="fw-bold text-white">No se encontraron productos para "${texto}"</h4><p class="text-muted">Intenta con otra palabra clave.</p>`;
          contenedorGrilla.appendChild(msjVacio);
        } else if (msjVacio) {
          msjVacio.innerHTML = `<h4 class="fw-bold text-white">No se encontraron productos para "${texto}"</h4><p class="text-muted">Intenta con otra palabra clave.</p>`;
          msjVacio.style.display = "block";
        }
      } else {
        if (msjVacio) msjVacio.style.display = "none";
      }
    });
  }

  // ==========================================
  // 3. CAPTURA DE BÚSQUEDA DESDE LA BARRA NAVBAR
  // ==========================================
  const searchForm = document.querySelector(".nav-search-box");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = searchForm.querySelector(".nav-search-input");
      const termino = input ? input.value.trim() : "";

      if (termino !== "") {
        sessionStorage.setItem("busquedaPendiente", termino);
        window.location.href = "catalogo.html";
      }
    });
  }

  // ==========================================
  // 4. AUTO-FILTRADO AL LLEGAR AL CATÁLOGO
  // ==========================================
  const buscadorCatalogo = document.getElementById("buscador-catalogo");
  const busquedaPendiente = sessionStorage.getItem("busquedaPendiente");

  if (buscadorCatalogo && busquedaPendiente) {
    buscadorCatalogo.value = busquedaPendiente;
    buscadorCatalogo.dispatchEvent(new Event("input"));
    sessionStorage.removeItem("busquedaPendiente");
  }
 // ==========================================
  // 5. RENDERIZAR PROMOS DINÁMICAS Y CARRUSEL
  // ==========================================
  const contenedorPromos = document.getElementById("contenedor-promos-inicio");
  
  if (contenedorPromos) {
      let inventario = JSON.parse(localStorage.getItem("inventarioHobic")) || [];
      const promos = inventario.filter(p => p.promo === true);

      // Inyectar tarjetas dinámicas usando el diseño original
      promos.forEach(prod => {
          contenedorPromos.innerHTML += `
              <div class="tarjeta-promo" style="flex: 0 0 auto; width: 220px;">
                  <span class="tag-promo" style="background-color: #043b7a;">¡DESTACADO!</span>
                  <a href="catalogo.html" style="text-decoration: none; color: inherit;">
                      <div class="img-contenedor">
                          <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 100%; height: 180px; object-fit: contain;">
                      </div>
                      <h3>${prod.nombre}</h3>
                  </a>
                  <p class="precio-promo">$${prod.precio.toLocaleString("es-CL")}</p>
                  <button class="btn-comprar-promo" data-nombre="${prod.nombre}" data-precio="${prod.precio}" data-imagen="${prod.imagen}">Añadir al carrito</button>
              </div>
          `;
      });

      // Lógica de compra
      document.querySelectorAll(".btn-comprar-promo").forEach(boton => {
          boton.addEventListener("click", function(e) {
              e.preventDefault();
              
              // Ahora lee directamente los valores ocultos del botón
              let nombre = this.getAttribute("data-nombre");
              let precio = parseInt(this.getAttribute("data-precio"));
              let imagen = this.getAttribute("data-imagen");
              
              if (typeof window.agregarAlCarrito === "function") {
                  window.agregarAlCarrito(nombre, precio, imagen);
              }
          });
      });

      // Lógica de las Flechas del Carrusel
      const btnPrev = document.getElementById("btn-prev-promo");
      const btnNext = document.getElementById("btn-next-promo");

      if (btnPrev && btnNext) {
          btnNext.addEventListener("click", () => {
              contenedorPromos.scrollBy({ left: 240, behavior: 'smooth' });
          });
          btnPrev.addEventListener("click", () => {
              contenedorPromos.scrollBy({ left: -240, behavior: 'smooth' });
          });
      }
  }
});