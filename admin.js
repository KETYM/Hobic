document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("admin.html")) return;

    // 1. INICIALIZAR INVENTARIO BASE (CON TODOS TUS PRODUCTOS)
    let inventario = JSON.parse(localStorage.getItem("inventarioHobic"));
    
    // Si no existe o tiene la versión vieja de 3 productos, lo recargamos con el real
    if (!inventario || inventario.length <= 3) {
        inventario = [
            { id: 1, nombre: "Dune (Edición Especial)", categoria: "Libros", precio: 15990, stock: 15, imagen: "imagenes/dune.jpg" },
            { id: 2, nombre: "El Señor de los Anillos", categoria: "Libros", precio: 19990, stock: 10, imagen: "imagenes/sdla.jpg" },
            { id: 3, nombre: "Spy x Family Vol. 1", categoria: "Mangas", precio: 19790, stock: 20, imagen: "imagenes/Spy.jpg" },
            { id: 4, nombre: "Your Name Vol. 3", categoria: "Mangas", precio: 15990, stock: 12, imagen: "imagenes/YourName.jpg" },
            { id: 5, nombre: "Samurai X", categoria: "Series", precio: 19790, stock: 8, imagen: "imagenes/samurai.jpg" },
            { id: 6, nombre: "Neon Genesis Evangelion", categoria: "Series", precio: 15990, stock: 5, imagen: "imagenes/evangelion.jpg" },
            { id: 7, nombre: "Need for Speed Unbound", categoria: "Videojuegos", precio: 19790, stock: 18, imagen: "imagenes/nfs.jpg" },
            { id: 8, nombre: "Halo Infinite", categoria: "Videojuegos", precio: 15990, stock: 15, imagen: "imagenes/halo.jpg" }
        ];
        localStorage.setItem("inventarioHobic", JSON.stringify(inventario));
    }

    // 2. REFERENCIAS AL DOM
    const tablaInventario = document.getElementById("tabla-inventario");
    const formCrud = document.getElementById("form-crud");
    const inputId = document.getElementById("crud-id");
    const inputNombre = document.getElementById("crud-nombre");
    const selectCategoria = document.getElementById("crud-categoria");
    const inputPrecio = document.getElementById("crud-precio");
    const inputStock = document.getElementById("crud-stock");
    const inputImagen = document.getElementById("crud-imagen"); // Nueva referencia
    const btnCancelar = document.getElementById("btn-cancelar-crud");
    const tituloForm = document.getElementById("form-titulo");

    // 3. RENDERIZAR LA TABLA
    function renderizarTabla() {
        tablaInventario.innerHTML = "";
        inventario.forEach((prod) => {
            const stockBadge = prod.stock <= 5 ? 'bg-danger' : 'bg-success';
            
            tablaInventario.innerHTML += `
                <tr>
                    <td class="ps-4 d-flex align-items-center gap-3">
                        <img src="${prod.imagen}" alt="${prod.nombre}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
                        <span class="fw-bold text-dark">${prod.nombre}</span>
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

    // 4. CREAR O ACTUALIZAR PRODUCTO
    formCrud.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const idActual = inputId.value;
        const nuevoProducto = {
            id: idActual ? parseInt(idActual) : Date.now(),
            nombre: inputNombre.value.trim(),
            categoria: selectCategoria.value,
            precio: parseInt(inputPrecio.value),
            stock: parseInt(inputStock.value),
            imagen: inputImagen.value.trim() // Guarda la imagen
        };

        if (idActual) {
            const index = inventario.findIndex(p => p.id === parseInt(idActual));
            inventario[index] = nuevoProducto;
            alert("Producto actualizado correctamente.");
        } else {
            inventario.push(nuevoProducto);
            alert("Producto agregado al inventario.");
        }

        guardarYRecargar();
    });

    // 5. FUNCIONES GLOBALES (Editar, Borrar, Resetear)
    window.eliminarProducto = function(id) {
        if (confirm("¿Estás seguro de eliminar este producto del stock?")) {
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
            inputImagen.value = producto.imagen; // Carga la imagen

            tituloForm.textContent = "Editar Producto";
            btnCancelar.classList.remove("d-none");
            window.scrollTo(0, 0); 
        }
    };

    btnCancelar.addEventListener("click", () => {
        formCrud.reset();
        inputId.value = "";
        tituloForm.textContent = "Agregar Producto";
        btnCancelar.classList.add("d-none");
    });

    function guardarYRecargar() {
        localStorage.setItem("inventarioHobic", JSON.stringify(inventario));
        renderizarTabla();
        btnCancelar.click(); 
    }

    // Iniciar
    renderizarTabla();
});