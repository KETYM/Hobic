document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("admin.html")) return;

    // 1. CONFIGURACIÓN DE ESQUEMA POR CATEGORÍA
    const esquemasPorCategoria = {
        Libros: {
            attr1: { label: "Autor", placeholder: "ej: J.R.R. Tolkien" },
            attr2: { label: "Editorial", placeholder: "ej: Minotauro" },
            attr3: { label: "Páginas", placeholder: "ej: 576" },
            attr4: { label: "Idioma", placeholder: "ej: Español" }
        },
        Mangas: {
            attr1: { label: "Autor", placeholder: "ej: Tatsuya Endo" },
            attr2: { label: "Editorial", placeholder: "ej: Ivrea / Norma" },
            attr3: { label: "Capítulos / Tomos", placeholder: "ej: 12 tomos" },
            attr4: { label: "Idioma", placeholder: "ej: Español" }
        },
        Series: {
            attr1: { label: "Director / Creador", placeholder: "ej: Hideaki Anno" },
            attr2: { label: "Estudio / Distribuidor", placeholder: "ej: Gainax" },
            attr3: { label: "Capítulos", placeholder: "ej: 26 episodios" },
            attr4: { label: "Idioma", placeholder: "ej: Japonés / Español" }
        },
        Videojuegos: {
            attr1: { label: "Desarrollador", placeholder: "ej: 343 Industries" },
            attr2: { label: "Distribuidor", placeholder: "ej: Xbox Game Studios" },
            attr3: { label: "Plataforma", placeholder: "ej: Xbox One / PC" },
            attr4: { label: "Idioma", placeholder: "ej: Español latino" }
        }
    };

    // 2. INICIALIZAR INVENTARIO BASE (CON PROMOS Y ATRIBUTOS)
    let inventario = JSON.parse(localStorage.getItem("inventarioHobic"));
    
    if (!inventario || inventario.length <= 3 || !inventario[0].hasOwnProperty("promo")) {
        inventario = [
            { 
                id: 1, nombre: "Dune (Edición Especial)", categoria: "Libros", precio: 15990, stock: 15, imagen: "imagenes/dune.jpg", promo: false,
                detalles: { attr1: "Frank Herbert", attr2: "Debolsillo", attr3: "704 págs.", attr4: "Español" }
            },
            { 
                id: 2, nombre: "El Señor de los Anillos", categoria: "Libros", precio: 19990, stock: 10, imagen: "imagenes/sdla.jpg", promo: false,
                detalles: { attr1: "J.R.R. Tolkien", attr2: "Minotauro", attr3: "576 págs.", attr4: "Español" }
            },
            { 
                id: 3, nombre: "Spy x Family Vol. 1", categoria: "Mangas", precio: 19790, stock: 20, imagen: "imagenes/Spy.jpg", promo: false,
                detalles: { attr1: "Tatsuya Endo", attr2: "Editorial Ivrea", attr3: "9 capítulos", attr4: "Español" }
            },
            { 
                id: 4, nombre: "Your Name Vol. 3", categoria: "Mangas", precio: 15990, stock: 12, imagen: "imagenes/YourName.jpg", promo: true,
                detalles: { attr1: "Makoto Shinkai", attr2: "Planeta Cómic", attr3: "Tomo único", attr4: "Español" }
            },
            { 
                id: 5, nombre: "Samurai X", categoria: "Series", precio: 19790, stock: 8, imagen: "imagenes/samurai.jpg", promo: false,
                detalles: { attr1: "Nobuhiro Watsuki", attr2: "Studio Gallop", attr3: "95 capítulos", attr4: "Español latino" }
            },
            { 
                id: 6, nombre: "Neon Genesis Evangelion", categoria: "Series", precio: 15990, stock: 5, imagen: "imagenes/evangelion.jpg", promo: false,
                detalles: { attr1: "Hideaki Anno", attr2: "Gainax", attr3: "26 capítulos", attr4: "Español latino" }
            },
            { 
                id: 7, nombre: "Need for Speed Unbound", categoria: "Videojuegos", precio: 19790, stock: 18, imagen: "imagenes/nfs.jpg", promo: false,
                detalles: { attr1: "Criterion Games", attr2: "Electronic Arts", attr3: "PS5 / Xbox Series / PC", attr4: "Español" }
            },
            { 
                id: 8, nombre: "Halo Infinite", categoria: "Videojuegos", precio: 15990, stock: 15, imagen: "imagenes/halo.jpg", promo: true,
                detalles: { attr1: "343 Industries", attr2: "Xbox Game Studios", attr3: "Xbox One / Series / PC", attr4: "Español" }
            }
        ];
        localStorage.setItem("inventarioHobic", JSON.stringify(inventario));
    }

    // 3. REFERENCIAS AL DOM
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

    // Referencias dinámicas
    const labelTipo = document.getElementById("label-tipo-categoria");
    const lblAttr1 = document.getElementById("lbl-attr1");
    const lblAttr2 = document.getElementById("lbl-attr2");
    const lblAttr3 = document.getElementById("lbl-attr3");
    const lblAttr4 = document.getElementById("lbl-attr4");
    const inputAttr1 = document.getElementById("crud-attr1");
    const inputAttr2 = document.getElementById("crud-attr2");
    const inputAttr3 = document.getElementById("crud-attr3");
    const inputAttr4 = document.getElementById("crud-attr4");

    let imagenBase64 = "";

    // Manejar subida de archivo (si es input type="file")
    if (inputImagen && inputImagen.type === "file") {
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
    }

    // 4. ACTUALIZAR CAMPOS SEGÚN CATEGORÍA SELECCIONADA
    function actualizarCamposDinamicos(categoria) {
        const esquema = esquemasPorCategoria[categoria] || esquemasPorCategoria["Libros"];
        if (labelTipo) labelTipo.textContent = categoria;

        if (lblAttr1) lblAttr1.textContent = esquema.attr1.label;
        if (inputAttr1) inputAttr1.placeholder = esquema.attr1.placeholder;

        if (lblAttr2) lblAttr2.textContent = esquema.attr2.label;
        if (inputAttr2) inputAttr2.placeholder = esquema.attr2.placeholder;

        if (lblAttr3) lblAttr3.textContent = esquema.attr3.label;
        if (inputAttr3) inputAttr3.placeholder = esquema.attr3.placeholder;

        if (lblAttr4) lblAttr4.textContent = esquema.attr4.label;
        if (inputAttr4) inputAttr4.placeholder = esquema.attr4.placeholder;
    }

    if (selectCategoria) {
        selectCategoria.addEventListener("change", (e) => {
            actualizarCamposDinamicos(e.target.value);
        });
    }

    // 5. RENDERIZAR TABLA CON BADGES
    function renderizarTabla() {
        if (!tablaInventario) return;
        tablaInventario.innerHTML = "";
        inventario.forEach((prod) => {
            const stockBadge = prod.stock <= 5 ? 'bg-danger' : 'bg-success';
            const promoBadge = prod.promo ? `<span class="badge bg-warning text-dark ms-2">Promo</span>` : '';
            
            tablaInventario.innerHTML += `
                <tr>
                    <td class="ps-4 d-flex align-items-center gap-3">
                        <img src="${prod.imagen}" alt="${prod.nombre}">
                        <div>
                            <span class="fw-bold text-white">${prod.nombre}</span>
                            ${promoBadge}
                        </div>
                    </td>
                    <td><span class="badge bg-secondary">${prod.categoria}</span></td>
                    <td>$${prod.precio.toLocaleString("es-CL")}</td>
                    <td><span class="badge ${stockBadge}">${prod.stock} un.</span></td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-primary me-1" onclick="editarProducto(${prod.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${prod.id})">Borrar</button>
                    </td>
                </tr>
            `;
        });
    }

    // 6. CREAR O ACTUALIZAR PRODUCTO
    if (formCrud) {
        formCrud.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const idActual = inputId.value;
            let imagenFinal = "imagenes/default.jpg";

            if (inputImagen && inputImagen.type === "file") {
                imagenFinal = imagenBase64 || (idActual ? inventario.find(p => p.id === parseInt(idActual))?.imagen : "imagenes/default.jpg");
            } else if (inputImagen) {
                imagenFinal = inputImagen.value.trim();
            }

            const nuevoProducto = {
                id: idActual ? parseInt(idActual) : Date.now(),
                nombre: inputNombre.value.trim(),
                categoria: selectCategoria.value,
                precio: parseInt(inputPrecio.value),
                stock: parseInt(inputStock.value),
                imagen: imagenFinal,
                promo: checkPromo ? checkPromo.checked : false,
                detalles: {
                    attr1: inputAttr1 ? inputAttr1.value.trim() : "",
                    attr2: inputAttr2 ? inputAttr2.value.trim() : "",
                    attr3: inputAttr3 ? inputAttr3.value.trim() : "",
                    attr4: inputAttr4 ? inputAttr4.value.trim() : ""
                }
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
    }

    // 7. FUNCIONES GLOBALES (Editar, Borrar, Cancelar)
    window.eliminarProducto = function(id) {
        if (confirm("¿Estás seguro de eliminar este producto del inventario?")) {
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
            actualizarCamposDinamicos(producto.categoria);

            inputPrecio.value = producto.precio;
            inputStock.value = producto.stock;

            if (checkPromo) checkPromo.checked = producto.promo || false;

            if (inputImagen && inputImagen.type !== "file") {
                inputImagen.value = producto.imagen;
            } else if (textoImagenActual) {
                textoImagenActual.textContent = "Imagen cargada. Sube una nueva si deseas reemplazarla.";
                if (inputImagen) inputImagen.removeAttribute("required");
                imagenBase64 = producto.imagen;
            }

            if (producto.detalles) {
                if (inputAttr1) inputAttr1.value = producto.detalles.attr1 || "";
                if (inputAttr2) inputAttr2.value = producto.detalles.attr2 || "";
                if (inputAttr3) inputAttr3.value = producto.detalles.attr3 || "";
                if (inputAttr4) inputAttr4.value = producto.detalles.attr4 || "";
            } else {
                limpiarAtributos();
            }

            tituloForm.textContent = "Editar Producto";
            btnCancelar.classList.remove("d-none");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    function limpiarAtributos() {
        if (inputAttr1) inputAttr1.value = "";
        if (inputAttr2) inputAttr2.value = "";
        if (inputAttr3) inputAttr3.value = "";
        if (inputAttr4) inputAttr4.value = "";
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            formCrud.reset();
            inputId.value = "";
            imagenBase64 = "";
            if (checkPromo) checkPromo.checked = false;
            if (textoImagenActual) textoImagenActual.textContent = "";
            if (inputImagen && inputImagen.type === "file") inputImagen.setAttribute("required", "true");
            limpiarAtributos();
            actualizarCamposDinamicos(selectCategoria.value);
            tituloForm.textContent = "Agregar Producto";
            btnCancelar.classList.add("d-none");
        });
    }

    function guardarYRecargar() {
        localStorage.setItem("inventarioHobic", JSON.stringify(inventario));
        renderizarTabla();
        if (btnCancelar) btnCancelar.click(); 
    }

    // Inicialización al cargar la página
    if (selectCategoria) actualizarCamposDinamicos(selectCategoria.value);
    renderizarTabla();
});