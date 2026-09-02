const headerHTML = `
<nav style="display: flex; justify-content: space-between; align-items: center; flex-wrap: nowrap; width: 100%; gap: 15px;">
    <!-- Logo -->
    <a href="index.html" style="text-decoration: none; display: flex; align-items: center; flex-shrink: 0;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 50" width="180" height="50">
            <path d="M12,10 Q15,10 15,5 Q15,10 18,10 Q15,10 15,15 Q15,10 12,10 Z" fill="#ff7eb3"/>
            <path d="M25,12 C18,12 12,18 12,28 C12,38 18,42 25,42 L25,25 Z" fill="#ffffff"/>
            <path d="M28,25 L28,42 C35,42 41,38 41,28 C41,18 35,12 28,12 Z" fill="#e0006c"/>
            <path d="M18,26 h-2 v2 h2 v2 h2 v-2 h2 v-2 h-2 v-2 h-2 v2 z" fill="#043b7a"/>
            <circle cx="34" cy="24" r="1.5" fill="#043b7a"/>
            <circle cx="37" cy="28" r="1.5" fill="#043b7a"/>
            <text x="50" y="36" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="28" font-weight="900" fill="#ffffff" letter-spacing="-1">HOBI<tspan fill="#e0006c">C</tspan></text>
        </svg>
    </a>
    
    <!-- Enlaces del centro -->
    <div class="nav-links" style="display: flex; align-items: center; gap: 10px; white-space: nowrap; flex-shrink: 1; overflow: hidden;">
        <a href="index.html">Inicio</a> |
        <a href="libros.html">Libros</a> |
        <a href="series.html">Series</a> |
        <a href="videojuegos.html">Videojuegos</a> |
        <a href="mangas.html">Mangas</a> |
        <a href="catalogo.html">Catálogo</a> |
        <a href="blogs.html">Blogs</a>
    </div>

    <!-- Buscador, Login y Carrito (Derecha) -->
    <div class="nav-derecha" style="display: flex; align-items: center; gap: 15px; flex-shrink: 0; white-space: nowrap; flex-wrap: nowrap;">
        <form action="catalogo.html" method="GET" class="nav-search-box" style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="nav-search-icon">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" name="buscar" placeholder="Buscar en Hobic..." class="nav-search-input" autocomplete="off" style="max-width: 150px;">
        </form>

        <a href="inicioSesion.html" class="nav-user-btn" id="user-nav-container" style="display: flex; align-items: center; gap: 5px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Inicio de sesión</span>
        </a>

        <a href="carrito.html" class="nav-cart-btn" title="Ir al carrito" aria-label="Ver el carrito de compras con tus productos" style="display: flex; align-items: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
        </a>
    </div>
</nav>
`;

document.addEventListener("DOMContentLoaded", () => {
    const headerElement = document.getElementById("main-header");
    if (headerElement) {
        headerElement.innerHTML = headerHTML;
    }
});