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
  // 2. LÓGICA DE FILTRADO Y BÚSQUEDA (Catálogo)
  // ==========================================
  const buscador = document.getElementById("buscador-catalogo");
  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  const itemsCatalogo = document.querySelectorAll(".item-catalogo");

  if (buscador && itemsCatalogo.length > 0) {
    botonesFiltro.forEach((boton) => {
      boton.addEventListener("click", function () {
        botonesFiltro.forEach((b) => {
          b.classList.remove("active");
          this.classList.add("active");
        });

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
        const categoria = item.getAttribute("data-categoria").toLowerCase();
        
        if (titulo.includes(texto) || categoria.includes(texto)) {
          item.style.display = "block";
          elementosVisibles++; // Contamos cuántos se muestran
        } else {
          item.style.display = "none";
        }
      });

      // Manejar el mensaje de "Sin resultados"
      const contenedorGrilla = document.getElementById("grilla-catalogo");
      let msjVacio = document.getElementById("mensaje-sin-resultados");

      if (elementosVisibles === 0) {
        // Si no hay productos y el mensaje no existe, lo creamos
        if (!msjVacio) {
          msjVacio = document.createElement("div");
          msjVacio.id = "mensaje-sin-resultados";
          msjVacio.className = "col-12 text-center text-muted my-5";
          msjVacio.innerHTML = `<h4 class="fw-bold">No se encontraron productos para "${texto}"</h4><p>Intenta con otra palabra clave.</p>`;
          contenedorGrilla.appendChild(msjVacio);
        } else {
          // Si ya existe, solo actualizamos el texto y lo mostramos
          msjVacio.innerHTML = `<h4 class="fw-bold">No se encontraron productos para "${texto}"</h4><p>Intenta con otra palabra clave.</p>`;
          msjVacio.style.display = "block";
        }
      } else {
        // Si hay productos visibles, ocultamos el mensaje
        if (msjVacio) msjVacio.style.display = "none";
      }
    });
  }

  // ==========================================
  // 3. BÚSQUEDA GLOBAL EN NAVBAR (Estilo Xbox)
  // ==========================================
  const btnAbrirSearch = document.getElementById("btn-abrir-search-nav");
  const btnCerrarSearch = document.getElementById("btn-cerrar-search-nav");
  const searchOverlay = document.getElementById("search-overlay-nav");
  const inputSearchNav = document.getElementById("input-busqueda-nav");
  const formSearchNav = document.getElementById("form-busqueda-nav");

  if (btnAbrirSearch && btnCerrarSearch && searchOverlay) {
      btnAbrirSearch.addEventListener("click", function(e) {
          e.preventDefault();
          searchOverlay.classList.add("activo");
          inputSearchNav.focus(); 
      });

      btnCerrarSearch.addEventListener("click", function() {
          searchOverlay.classList.remove("activo");
          inputSearchNav.value = ""; 
      });

      formSearchNav.addEventListener("submit", function(e) {
          e.preventDefault();
          const termino = inputSearchNav.value.trim();
          
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
      const eventoInput = new Event("input");
      buscadorCatalogo.dispatchEvent(eventoInput);
      sessionStorage.removeItem("busquedaPendiente");
  }
});