// Diccionario oficial de Regiones y Comunas de Chile
const datosChile = {
    "Arica y Parinacota": ["Arica", "Camarones", "Putre", "General Lagos"],
    "Tarapacá": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Pica", "Huara"],
    "Antofagasta": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
    "Atacama": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
    "Coquimbo": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paihuano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
    "Valparaíso": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "San Esteban", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Antonio", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
    "Metropolitana de Santiago": ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
    "Libertador General Bernardo O'Higgins": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
    "Maule": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
    "Biobío": ["Concepción", "Coronel", "Chiguayante", "Hualpén", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel"]
};

// Función global reutilizable para inicializar los selects
function inicializarSelectsRegionComuna(idRegion, idComuna, regionSeleccionada = "", comunaSeleccionada = "") {
    const selectRegion = document.getElementById(idRegion);
    const selectComuna = document.getElementById(idComuna);

    if (!selectRegion || !selectComuna) return;

    // 1. Llenar Regiones
    selectRegion.innerHTML = '<option value="">Seleccione una región</option>';
    Object.keys(datosChile).forEach(region => {
        const selected = region === regionSeleccionada ? "selected" : "";
        selectRegion.innerHTML += `<option value="${region}" ${selected}>${region}</option>`;
    });

    // Función para actualizar comunas según la región elegida
    function cargarComunas(region, comunaSel = "") {
        selectComuna.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (datosChile[region]) {
            datosChile[region].forEach(comuna => {
                const selected = comuna === comunaSel ? "selected" : "";
                selectComuna.innerHTML += `<option value="${comuna}" ${selected}>${comuna}</option>`;
            });
        }
    }

    // Si ya viene con una región (modo edición), cargamos sus comunas de inmediato
    if (regionSeleccionada) {
        cargarComunas(regionSeleccionada, comunaSeleccionada);
    }

    // Evento al cambiar de región
    selectRegion.addEventListener("change", function () {
        cargarComunas(this.value);
    });
}