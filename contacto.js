document.addEventListener("DOMContentLoaded", function () {
    const formContacto = document.getElementById("form-contacto");

    if (formContacto) {
        formContacto.addEventListener("submit", function (e) {
            e.preventDefault();

            // 1. Obtener los valores de los 4 inputs
            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const motivo = document.getElementById("motivo").value.trim();
            const comentario = document.getElementById("comentario").value.trim();

            // 2. Elementos donde se muestran los errores
            const errorNombre = document.getElementById("error-nombre");
            const errorCorreo = document.getElementById("error-correo");
            const errorMotivo = document.getElementById("error-motivo");
            const errorComentario = document.getElementById("error-comentario");
            const mensajeExito = document.getElementById("mensaje-exito");

            // Limpiar errores previos en cada intento
            errorNombre.classList.add("d-none");
            errorCorreo.classList.add("d-none");
            errorMotivo.classList.add("d-none");
            errorComentario.classList.add("d-none");
            mensajeExito.classList.add("d-none");

            let esValido = true;

            // Validación: Nombre no vacío
            if (nombre === "") {
                errorNombre.classList.remove("d-none");
                esValido = false;
            }

            // Validación: Correo no vacío y con formato válido
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (correo === "") {
                errorCorreo.textContent = "El correo electrónico es obligatorio.";
                errorCorreo.classList.remove("d-none");
                esValido = false;
            } else if (!emailRegex.test(correo)) {
                errorCorreo.textContent = "Formato de correo inválido (ej: usuario@correo.com).";
                errorCorreo.classList.remove("d-none");
                esValido = false;
            }

            // Validación: Motivo seleccionado
            if (motivo === "") {
                errorMotivo.classList.remove("d-none");
                esValido = false;
            }

            // Validación: Comentario no vacío
            if (comentario === "") {
                errorComentario.classList.remove("d-none");
                esValido = false;
            }

            // Si falla cualquier validación, detenemos aquí
            if (!esValido) {
                return;
            }

            // 3. Simulación de envío exitoso
            mensajeExito.classList.remove("d-none");
            formContacto.reset();

            // Desaparecer el mensaje verde después de 5 segundos
            setTimeout(() => {
                mensajeExito.classList.add("d-none");
            }, 5000);
        });
    }
});