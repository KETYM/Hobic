document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("admin.html")) return;

    let inventario = JSON.parse(localStorage.getItem("inventarioHobic"));
    
    // Si no existe la variable "promo" en el inventario actual, lo reseteamos
    if (!inventario || inventario.length <= 3 || !inventario[0].hasOwnProperty("promo")) {
        inventario = [
            { id: 1, nombre: "Dune (Edición Especial)", categoria: "Libros", precio: 15990, stock: 15, imagen: "imagenes/dune.jpg", promo: false },
            { id: 2, nombre: "El Señor de los Anillos", categoria: "Libros", precio: 19990, stock: 10, imagen: "imagenes/sdla.jpg", promo: false },
            { id: 3, nombre: "Spy x Family Vol. 1", categoria: "Mangas", precio: 19790, stock: 20, imagen: "imagenes/Spy.jpg", promo: false },
            { id: 4, nombre: "Your Name Vol. 3", categoria: "Mangas", precio: 15990, stock: 12, imagen: "imagenes/YourName.jpg", promo: true },
            { id: 5, nombre: "Samurai X", categoria: "Series", precio: 19790, stock: 8, imagen: "imagenes/samurai.jpg", promo: false },
            { id: 6, nombre: "Neon Genesis Evangelion", categoria: "Series", precio: 15990, stock: 5, imagen: "imagenes/evangelion.jpg", promo: false },
            { id: 7, nombre: "Need for Speed Unbound", categoria: "Videojuegos", precio: 19790, stock: 18, imagen: "imagenes/nfs.jpg", promo: false },
            { id: 8, nombre: "Halo Infinite", categoria: "Videojuegos", precio: 15990, stock: 15, imagen: "imagenes/halo.jpg", promo: true }
        ];
        localStorage.setItem("inventarioHobic", JSON.stringify(inventario));
    }

    const tablaInventario = document.getElementById("tabla-inventario");
    const formCrud = document.getElementById("form-crud");
    const inputId = document.getElementById("crud-id");
    const inputNombre = document.getElementById("crud-nombre");
    const selectCategoria = document.getElementById("crud-categoria");
    const inputPrecio = document.getElementById("crud-precio");
    const inputStock = document.getElementById("crud-stock");
    const inputImagen = document.getElementById("crud-imagen");
    const checkPromo = document.getElementById("crud-promo");
    const textoImagenActual = document.getElementById("texto-imagen-actual");
    const btnCancelar = document.getElementById("btn-cancelar-crud");
    const tituloForm = document.getElementById("form-titulo");

    let imagenBase64 = "";

    // Convertir imagen local a formato de texto para guardarla en memoria
    inputImagen.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagenBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    function renderizarTabla() {
        tablaInventario.innerHTML = "";
        inventario.forEach((prod) => {
            const stockBadge = prod.stock <= 5 ? 'bg-danger' : 'bg-success';
            const promoBadge = prod.promo ? '<span class="badge bg-warning text-dark ms-2">Promo</span>' : '';
            
            tablaInventario.innerHTML += `
                <tr>
                    <td class="ps-4 d-flex align-items-center gap-3">
                        <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                        <span class="fw-bold text-dark">${prod.nombre} ${promoBadge}</span>
                    </td>
                    <td><span class="badge bg-secondary">${prod.categoria}</span></td>
                    <td>$${prod.precio.toLocaleString("es-CL")}</td>
                    <td><span class="badge ${stockBadge}">${prod.stock} un.</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-primary me-1" onclick="editarProducto(${prod.id})">Editar</button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${prod.id})">Borrar</button>
                    </td>
                </tr>
            `;
        });
    }

    formCrud.addEventListener("submit", (e) => {
        e.preventDefault();
        const idActual = inputId.value;
        const nuevoProducto = {
            id: idActual ? parseInt(idActual) : Date.now(),
            nombre: inputNombre.value.trim(),
            categoria: selectCategoria.value,
            precio: parseInt(inputPrecio.value),
            stock: parseInt(inputStock.value),
            imagen: imagenBase64 || "imagenes/default.jpg",
            promo: checkPromo.checked
        };

        if (idActual) {
            const index = inventario.findIndex(p => p.id === parseInt(idActual));
            inventario[index] = nuevoProducto;
            alert("Producto actualizado.");
        } else {
            if(!imagenBase64) { alert("Por favor selecciona una imagen."); return; }
            inventario.push(nuevoProducto);
            alert("Producto agregado.");
        }
        guardarYRecargar();
    });

    window.eliminarProducto = function(id) {
        if (confirm("¿Seguro que deseas borrar este producto del sistema?")) {
            inventario = inventario.filter(p => p.id !== id);
            guardarYRecargar();
        }
    };

    window.editarProducto = function(id) {
        const producto = inventario.find(p => p.id === id);
        if (producto) {
            inputId.value = producto.id;
            inputNombre.value = producto.nombre;
            selectCategoria.value = producto.categoria;
            inputPrecio.value = producto.precio;
            inputStock.value = producto.stock;
            checkPromo.checked = producto.promo || false;
            
            imagenBase64 = producto.imagen;
            textoImagenActual.textContent = "Imagen cargada. Sube una nueva solo para reemplazarla.";
            inputImagen.removeAttribute("required");

            tituloForm.textContent = "Editar Producto";
            btnCancelar.classList.remove("d-none");
            window.scrollTo(0, 0); 
        }
    };

    btnCancelar.addEventListener("click", () => {
        formCrud.reset();
        inputId.value = "";
        imagenBase64 = "";
        textoImagenActual.textContent = "";
        inputImagen.setAttribute("required", "true");
        tituloForm.textContent = "Agregar Producto";
        btnCancelar.classList.add("d-none");
    });

    function guardarYRecargar() {
        localStorage.setItem("inventarioHobic", JSON.stringify(inventario));
        renderizarTabla();
        btnCancelar.click(); 
    }

    renderizarTabla();
});