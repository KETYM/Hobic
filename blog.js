//espera que cargue el html antes de ejecutar codigo
document.addEventListener("DOMContentLoaded", function () {
  //0. leer la sesión
  const sesion = sessionStorage.getItem("usuarioActual");
  const profileNameEl = document.querySelector(".profile-name");
  const bannerTitleEl = document.querySelector(".pixel-title");
  const userNavContainer = document.getElementById("user-nav-container");

  if (sesion) {
    const datosUsuario = JSON.parse(sesion);

    let nombre =
      localStorage.getItem("usuario_nombre") ||
      datosUsuario.correo.split("@")[0];
    nombre = nombre.charAt(0).toUpperCase() + nombre.slice(1);

    // 1. Cambia el nombre en la tarjeta "Sobre Mí"
    if (profileNameEl) {
      profileNameEl.textContent = nombre;
    }

    // 2. Personaliza el banner
    if (bannerTitleEl) {
      bannerTitleEl.innerHTML = `&starf; BLOG DE ${nombre.toUpperCase()} &starf;`;
    }

    // 3. Muestra "Hola, [Nombre] (Salir)" arriba
    if (userNavContainer) {
      userNavContainer.removeAttribute("href");
      userNavContainer.innerHTML = `
                <span style="font-size:0.85rem; font-weight:bold; color:var(--text-accent);">Hola, ${nombre}</span>
                <button id="btn-logout-blog" style="background:none; border:none; color:#ff6b6b; font-size:12px; cursor:pointer; margin-left:6px; text-decoration:underline;">(Salir)</button>
            `;

      document
        .getElementById("btn-logout-blog")
        .addEventListener("click", function (e) {
          e.stopPropagation();
          sessionStorage.removeItem("usuarioActual");
          localStorage.removeItem("usuario_nombre");
          window.location.reload();
        });
    }
  }

  //1.saludo aleatorio
  const greetings = [
    "¿Qué libro o manga estás leyendo esta semana?",
    "Pasa a dejar tu firma en el libro de visitas",
    "Pase a mirar sin compromiso",
    "Bienvenido!! que bacan que estes aquí ^^",
  ];

  const greetingEl = document.getElementById("greeting-dynamic");
  if (greetingEl) {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    greetingEl.textContent = greetings[randomIndex];
  }

  //2.reloj en vivo
  const clockEl = document.getElementById("live-clock");
  function updateClock() {
    if (clockEl) {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString("es-CL");
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // 3. CAMBIO DE PATRÓN DE FONDO (Con guardado en localStorage)
  const patternSelect = document.getElementById("patternSelect");
  // Revisa si ya había un patrón guardado; si no, usa 'pattern-grid'
  const savedPattern = localStorage.getItem("hobic_pattern") || "pattern-grid";
  document.body.className = savedPattern;

  if (patternSelect) {
    patternSelect.value = savedPattern;
    patternSelect.addEventListener("change", function () {
      document.body.className = this.value;
      localStorage.setItem("hobic_pattern", this.value);
    });
  }

  //4. modo noche/dia
  const themeBtn = document.getElementById("btn-theme-toggle");
  const savedTheme = localStorage.getItem("hobic_theme") || "light";

  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (themeBtn) themeBtn.textContent = "Modo Día";
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("hobic_theme", "light");
        themeBtn.textContent = "Modo Noche";
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("hobic_theme", "dark");
        themeBtn.textContent = "Modo Día";
      }
    });
  }

  //5. Libro de visitas
  const formGuest = document.getElementById("form-guestbook");
  const nameInput = document.getElementById("guest-name");
  const msgInput = document.getElementById("guest-msg");
  const guestMessagesContainer = document.getElementById("guestbook-messages");

  // Carga mensajes previos guardados o crea uno de prueba
  let comentarios = JSON.parse(localStorage.getItem("hobic_guestbook")) || [
    {
      nombre: "Churrasquin",
      mensaje: "¡Me encanta el diseño de este blog!",
      hora: "15:30",
    },
    { nombre: "Jane", mensaje: "Bienvenidos a mi blogsito", hora: "16:05" },
  ];

  function renderGuestbook() {
    if (!guestMessagesContainer) return;
    guestMessagesContainer.innerHTML = "";
    comentarios.forEach((item) => {
      const bubble = document.createElement("div");
      bubble.className = "comment-bubble";
      bubble.innerHTML = `
                <div class="comment-header">
                    <strong>${item.nombre}</strong>
                    <span class="comment-time">[${item.hora || "Reciente"}]</span>
                </div>
                <span>${item.mensaje}</span>
            `;
      guestMessagesContainer.appendChild(bubble);
    });
    // Auto-scroll al último mensaje publicado
    guestMessagesContainer.scrollTop = guestMessagesContainer.scrollHeight;
  }
  renderGuestbook();

  if (formGuest) {
    formGuest.addEventListener("submit", function (e) {
      e.preventDefault(); // Evita que la página se recargue al enviar el formulario
      const nombre = nameInput.value.trim();
      const mensaje = msgInput.value.trim();

      if (nombre === "" || mensaje === "") return;

      // Genera la hora actual
      const ahora = new Date();
      const horaStr = ahora.toLocaleTimeString("es-CL", {
        hour: "2-digit",
        minute: "2-digit",
      });

      comentarios.push({ nombre, mensaje, hora: horaStr });
      localStorage.setItem("hobic_guestbook", JSON.stringify(comentarios));

      renderGuestbook();
      formGuest.reset();
    });
  }

  //6.Mascota
  const petAvatar = document.getElementById("pet-avatar");
  const btnPet = document.getElementById("btn-pet");
  const petCountEl = document.getElementById("pet-count");
  const catMoodEl = document.getElementById("cat-mood");

  let pets = parseInt(localStorage.getItem("hobic_cat_pets")) || 0;
  if (petCountEl) petCountEl.textContent = pets;
  actualizarHumor(pets);

  function acariciar() {
    pets++;
    localStorage.setItem("hobic_cat_pets", pets);
    if (petCountEl) petCountEl.textContent = pets;
    actualizarHumor(pets);
  }

  function actualizarHumor(total) {
    if (!catMoodEl) return;
    if (total >= 20) {
      catMoodEl.textContent = "¡Gato súper feliz!";
    } else if (total >= 10) {
      catMoodEl.textContent = "purrrrrr... ";
    } else if (total > 0) {
      catMoodEl.textContent = "miau~";
    } else {
      catMoodEl.textContent = "esperando cariño...";
    }
  }

  if (petAvatar) petAvatar.addEventListener("click", acariciar);
  if (btnPet) btnPet.addEventListener("click", acariciar);

  // 7. Contador de Visitas Clásico
  const hitCounterEl = document.getElementById("hit-counter");
  if (hitCounterEl) {
    let visits = parseInt(localStorage.getItem("hobic_blog_visits")) || 1042;
    visits++;
    localStorage.setItem("hobic_blog_visits", visits);
    hitCounterEl.textContent = visits.toString().padStart(6, "0");
  }

  // 8. Reproductor de Música
  const btnPlayMusic = document.getElementById("btn-play-music");
  const playerDisc = document.getElementById("player-disc");
  const progressBar = document.getElementById("progress-bar");
  const audioLofi = document.getElementById("audio-lofi");
  let isPlaying = false;

  if (btnPlayMusic) {
    btnPlayMusic.addEventListener("click", function () {
      isPlaying = !isPlaying;

      if (isPlaying) {
        btnPlayMusic.textContent = "⏸ Pausar";
        if (playerDisc) playerDisc.classList.add("spinning");
        if (progressBar) progressBar.classList.add("active");
        if (audioLofi) audioLofi.play();
      } else {
        btnPlayMusic.textContent = "▶ Reproducir";
        if (playerDisc) playerDisc.classList.remove("spinning");
        if (progressBar) progressBar.classList.remove("active");
        if (audioLofi) audioLofi.pause();
      }
    });
  }
});
