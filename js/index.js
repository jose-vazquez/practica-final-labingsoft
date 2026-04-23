/**
 * =========================================================
 * FUNCIÓN: loadTuits
 * =========================================================
 * Esta función llama al endpoint /tuits para obtener los
 * últimos tuits y luego los manda a pintar en pantalla.
 *
 * IMPORTANTE:
 * La API no devuelve un array directo, sino un objeto con
 * una propiedad llamada "tuits".
 */
async function loadTuits() {
  try {
    // Pido los últimos 50 tuits
    const response = await getTuits(50, 0);

    // Lo dejo en consola para depuración
    console.log("Respuesta completa /tuits:", response);

    // Extraigo el array real de tuits
    const tuits = response.tuits || [];

    // Llamo al renderizado
    renderTuits(tuits);

  } catch (error) {
    console.error("Error en loadTuits:", error);

    const container = document.getElementById("timeline");
    if (container) {
      container.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
  }
}


/**
 * =========================================================
 * FUNCIÓN: renderTuits
 * =========================================================
 * Esta función recorre el array de tuits recibido y genera
 * el HTML de cada uno.
 *
 * Aquí uso los nombres reales que devuelve la API:
 * - id_tuit
 * - username
 * - display_name
 * - texto
 * - fecha_creacion
 * - media_type
 * - media_url
 */
function renderTuits(tuits) {
  const container = document.getElementById("timeline");

  // Si no existe el contenedor, paro y aviso
  if (!container) {
    console.error("No existe el elemento con id='timeline'");
    return;
  }

  // Limpio el contenido inicial del HTML
  container.innerHTML = "";

  // Si no hay tuits, muestro mensaje
  if (!tuits.length) {
    container.innerHTML = `<p class="info-message">No hay tuits para mostrar.</p>`;
    return;
  }

  // Recorro el array de tuits
  tuits.forEach(function (tuit) {
    console.log("Tuit individual:", tuit);

    // Campos reales de la API
    const id = tuit.id_tuit;
    const username = tuit.username || "usuario";
    const displayName = tuit.display_name || username;
    const texto = tuit.texto || "";
    const fecha = tuit.fecha_creacion || "";
    const mediaType = tuit.media_type || "";
    const mediaUrl = tuit.media_url || "";

    // Creo el article del tuit
    const article = document.createElement("article");
    article.className = "tweet-card";

    // Construyo el HTML base
    let html = `
      <div class="tweet-header">
        <strong class="user-link" data-username="${username}">${displayName}</strong>
        <span>@${username}</span>
      </div>

      <div class="tweet-body">
        ${texto}
      </div>
    `;

    /**
     * =========================================================
     * BLOQUE: render multimedia
     * =========================================================
     * Si el tuit tiene multimedia, la añado según el tipo:
     * - image   -> img
     * - video   -> video mp4
     * - youtube -> iframe embebido
     */
    if (mediaType && mediaUrl) {
      if (mediaType === "image") {
        html += `
          <div class="tweet-media">
            <img src="${mediaUrl}" alt="Imagen del tuit" class="tweet-image">
          </div>
        `;
      }

      if (mediaType === "video") {
        html += `
          <div class="tweet-media">
            <video controls class="tweet-video">
              <source src="${mediaUrl}" type="video/mp4">
            </video>
          </div>
        `;
      }

      if (mediaType === "youtube") {
        const embedUrl = getYoutubeEmbedUrl(mediaUrl);

        if (embedUrl) {
          html += `
            <div class="tweet-media">
              <iframe
                src="${embedUrl}"
                class="tweet-youtube"
                frameborder="0"
                allowfullscreen>
              </iframe>
            </div>
          `;
        }
      }
    }

    /**
     * =========================================================
     * BLOQUE: acciones del tuit
     * =========================================================
     * Dejo los botones básicos preparados.
     * Luego se les puede conectar la lógica real de like,
     * retuit y responder.
     */
    html += `
      <div class="tweet-actions">
        <button type="button" data-id="${id}" class="like-btn">Like</button>
        <button type="button" data-id="${id}" class="retuit-btn">RT</button>
        <button type="button" data-id="${id}" class="reply-btn">Responder</button>
      </div>

      <div class="tweet-footer">
        <small>${fecha}</small>
      </div>
    `;

    // Inserto el HTML generado en el article
    article.innerHTML = html;

    /**
     * Hago clickable el nombre de usuario para ir al perfil.
     */
    const userLink = article.querySelector(".user-link");
    if (userLink) {
      userLink.addEventListener("click", function () {
        const clickedUsername = this.dataset.username;
        window.location.href = `user.html?username=${clickedUsername}`;
      });
    }

    // Añado el tuit al timeline
    container.appendChild(article);
  });
}


/**
 * =========================================================
 * FUNCIÓN: getYoutubeEmbedUrl
 * =========================================================
 * Convierte una URL normal de YouTube en una URL embebida
 * para poder mostrarla dentro de un iframe.
 */
function getYoutubeEmbedUrl(url) {
  const match = url.match(/[?&]v=([^&]+)/);

  if (!match) {
    return null;
  }

  return `https://www.youtube.com/embed/${match[1]}`;
}


/**
 * =========================================================
 * EVENTO: DOMContentLoaded
 * =========================================================
 * Cuando se carga index.html:
 * - compruebo que haya token
 * - engancho botones de navegación
 * - cargo el timeline
 */
document.addEventListener("DOMContentLoaded", function () {
  // Verifico autenticación
  requireAuth();

  // Referencias a botones
  const homeButton = document.getElementById("homeButton");
  const newTuitButton = document.getElementById("newTuitButton");
  const logoutButton = document.getElementById("logoutButton");

  // Botón inicio
  if (homeButton) {
    homeButton.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  // Botón escribir tuit
  if (newTuitButton) {
    newTuitButton.addEventListener("click", function () {
      window.location.href = "create.html";
    });
  }

  // Botón cerrar sesión
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      logout();
    });
  }

  // Cargo tuits
  loadTuits();
});