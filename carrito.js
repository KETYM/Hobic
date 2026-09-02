document.addEventListener("DOMContentLoaded", function () {
  // ==========================================
  // 1. LÓGICA DEL CARRITO DINÁMICO (LocalStorage)
  // ==========================================
  function agregarAlCarrito(nombre, precio, imagen) {
    let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
    let productoExistente = carrito.find((item) => item.nombre === nombre);

    if (productoExistente) {
      productoExistente.cantidad++;
    } else {
      carrito.push({ nombre: nombre, precio: precio, imagen: imagen, cantidad: 1 });
    }
    localStorage.setItem("carritoHobic", JSON.stringify(carrito));
    alert(`¡Se agregó "${nombre}" a tu carrito!`);
  }

  const btnAgregarDetalle = document.getElementById("btn-agregar-carrito");
  if (btnAgregarDetalle) {
    btnAgregarDetalle.addEventListener("click", function (e) {
      e.preventDefault();
      const tituloProducto = document.getElementById("titulo-producto");
      const precioElemento = document.querySelector(".display-6");
      const imagenElemento = document.querySelector(".col-lg-8 img");

      let nombre = tituloProducto ? tituloProducto.textContent.trim() : "Producto";
      let precioTexto = precioElemento ? precioElemento.textContent.replace("$", "").replace(".", "").trim() : "19990";
      let precio = parseInt(precioTexto);
      let imagen = imagenElemento ? imagenElemento.getAttribute("src") : "imagenes/default.jpg";

      agregarAlCarrito(nombre, precio, imagen);
    });
  }

  const contenedorCarrito = document.getElementById("contenedor-productos-carrito");
  if (contenedorCarrito) {
    function renderizarCarrito() {
      let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
      contenedorCarrito.innerHTML = ""; 

      if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="text-center text-muted my-5">Tu carrito está vacío. ¡Ve a comprar algo genial!</p>';
        document.getElementById("resumen-subtotal").textContent = "$0";
        document.getElementById("resumen-total").textContent = "$0";
        document.getElementById("resumen-cantidad").textContent = `Subtotal (0 productos)`;
        return;
      }

      let totalPlata = 0;
      let totalArticulos = 0;

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

      document.getElementById("resumen-subtotal").textContent = "$" + totalPlata.toLocaleString("es-CL");
      document.getElementById("resumen-total").textContent = "$" + totalPlata.toLocaleString("es-CL");
      document.getElementById("resumen-cantidad").textContent = `Subtotal (${totalArticulos} productos)`;
    }

    window.cambiarCantidad = function (index, cambio) {
      let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
      carrito[index].cantidad += cambio;
      if (carrito[index].cantidad < 1) carrito[index].cantidad = 1; 
      localStorage.setItem("carritoHobic", JSON.stringify(carrito));
      renderizarCarrito(); 
    };

    window.eliminarDelCarrito = function (index) {
      if (confirm("¿Seguro que deseas eliminar este producto?")) {
        let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
        carrito.splice(index, 1); 
        localStorage.setItem("carritoHobic", JSON.stringify(carrito));
        renderizarCarrito(); 
      }
    };

    renderizarCarrito();
  }

 // ==========================================
  // 2. LÓGICA DE LA PÁGINA DE PAGO
  // ==========================================
  const formPago = document.getElementById("form-pago");
  const totalPagoElement = document.getElementById("total-pago");

  // Si estamos en la página de pago, calcular el total real
  if (totalPagoElement) {
    let carrito = JSON.parse(localStorage.getItem("carritoHobic")) || [];
    let totalPlata = 0;
    
    // Sumar el precio * cantidad de cada producto
    carrito.forEach((producto) => {
      totalPlata += producto.precio * producto.cantidad;
    });

    // Actualizar el HTML con el formato de moneda chilena
    totalPagoElement.textContent = "$" + totalPlata.toLocaleString("es-CL");

    // Opcional: Redirigir si el carrito está vacío para que no compren nada por $0
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. Serás redirigido para que agregues productos.");
        window.location.href = "index.html";
    }
  }

  // Lógica al hacer clic en "Confirmar y Pagar"
  if (formPago) {
    formPago.addEventListener("submit", function (e) {
      e.preventDefault(); 
      alert("¡Pago exitoso! Tu pedido está siendo procesado.\nGracias por comprar en Hobic.");
      
      // Vaciar el carrito después de comprar
      localStorage.removeItem("carritoHobic");
      
      window.location.href = "index.html";
    });
  }

  // ==========================================
  // 3. ICONOS GRISES EN CATÁLOGOS Y PROMOS
  // ==========================================
  const botonesAgregarCatalogo = document.querySelectorAll(".card .btn-dark.rounded-circle");
  if (botonesAgregarCatalogo.length > 0) {
    botonesAgregarCatalogo.forEach((boton) => {
      boton.addEventListener("click", function (e) {
        e.preventDefault(); 
        const tarjeta = this.closest(".card");
        if (tarjeta) {
          const tituloEl = tarjeta.querySelector(".card-title");
          const precioEl = tarjeta.querySelector(".fs-5.fw-bold.text-dark");
          const imgEl = tarjeta.querySelector("img");
          let nombre = tituloEl ? tituloEl.textContent.trim() : "Producto";
          let precioTexto = precioEl ? precioEl.textContent.replace("$", "").replace(".", "").trim() : "0";
          let precio = parseInt(precioTexto);
          let imagen = imgEl ? imgEl.getAttribute("src") : "imagenes/default.jpg";
          agregarAlCarrito(nombre, precio, imagen);
        }
      });
    });
  }

  const botonesPromos = document.querySelectorAll(".btn-comprar-promo");
  if (botonesPromos.length > 0) {
    botonesPromos.forEach((boton) => {
      boton.addEventListener("click", function (e) {
        e.preventDefault(); 
        const tarjeta = this.closest(".tarjeta");
        if (tarjeta) {
          const tituloEl = tarjeta.querySelector("h3");
          const precioEl = tarjeta.querySelector("p"); 
          const imgEl = tarjeta.querySelector("img");
          let nombre = tituloEl ? tituloEl.textContent.trim() : "Producto Promo";
          let precioTexto = "0";
          if (precioEl) {
            precioTexto = precioEl.textContent.replace("Precio:", "").replace("$", "").replace(".", "").trim();
          }
          let precio = parseInt(precioTexto);
          let imagen = imgEl ? imgEl.getAttribute("src") : "imagenes/default.jpg";
          
          agregarAlCarrito(nombre, precio, imagen);
        }
      });
    });
  }

  const btnComprarAhora = document.getElementById("btn-comprar-ahora");
  if (btnComprarAhora) {
    btnComprarAhora.addEventListener("click", function (e) {
      e.preventDefault(); 
      const tituloProducto = document.getElementById("titulo-producto");
      const precioElemento = document.querySelector(".display-6"); 
      const imagenElemento = document.querySelector(".col-lg-8 img"); 
      let nombre = tituloProducto ? tituloProducto.textContent.trim() : "Producto";
      let precioTexto = precioElemento ? precioElemento.textContent.replace("$", "").replace(".", "").trim() : "19990";
      let precio = parseInt(precioTexto);
      let imagen = imagenElemento ? imagenElemento.getAttribute("src") : "imagenes/default.jpg";

      agregarAlCarrito(nombre, precio, imagen);
      window.location.href = "pago.html";
    });
  }
});