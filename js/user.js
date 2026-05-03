/**
 * =========================================================
 * FUNCIÓN: getUsernameFromURL
 * =========================================================
 * Obtiene el username desde la URL.
 *
 * Ejemplo:
 * user.html?username=jose
 *
 * Devuelve:
 * jose
 */
function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("username");
}


/**
 * =========================================================
 * FUNCIÓN: loadUserTuits
 * =========================================================
 * Carga los tuits del usuario seleccionado.
 *
 * Primero intenta usar el endpoint:
 * GET /usuario/{username}/tuits
 *
 * Si no devuelve tuits, usa plan B:
 * - carga /tuits
 * - filtra por username
 */
async function loadUserTuits() {
  const container = document.getElementById("userTimeline");
  const usernameTitle = document.getElementById("usernameTitle");

  try {
    const username = getUsernameFromURL();

    if (!username) {
      throw new Error("No se ha indicado ningún usuario.");
    }

    usernameTitle.textContent = `Tuits de @${username}`;

    let tuits = [];

    // Intento 1: endpoint específico de usuario
    try {
      const response = await getUserTuits(username, 50, 0);

      console.log("Respuesta REAL del endpoint usuario:", response);

      if (Array.isArray(response)) {
        tuits = response;
      } else if (response.tuits) {
        tuits = response.tuits;
      } else if (response.data) {
        tuits = response.data;
      } else if (response.items) {
        tuits = response.items;
      }

    } catch (error) {
      console.warn("Fallo endpoint usuario. Uso fallback con /tuits:", error);
    }

    // Intento 2: si no hay tuits, cargo timeline general y filtro
    if (!tuits.length) {
      const responseGeneral = await getTuits(50, 0);

      console.log("Respuesta general /tuits para fallback:", responseGeneral);

      const allTuits = responseGeneral.tuits || [];

      tuits = allTuits.filter(function (tuit) {
        return tuit.username === username;
      });
    }

    renderUserTuits(tuits);

  } catch (error) {
    console.error("Error en loadUserTuits:", error);
    container.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}


/**
 * =========================================================
 * FUNCIÓN: renderUserTuits
 * =========================================================
 * Pinta en pantalla los tuits del usuario seleccionado.
 *
 * Usa los nombres reales de la API:
 * - id_tuit
 * - username
 * - display_name
 * - texto
 * - fecha_creacion
 * - media_type
 * - media_url
 */
function renderUserTuits(tuits) {
  const container = document.getElementById("userTimeline");

  container.innerHTML = "";

  if (!tuits.length) {
    container.innerHTML = `<p class="info-message">Este usuario no tiene tuits para mostrar.</p>`;
    return;
  }

  tuits.forEach(function (tuit) {
    const username = tuit.username || "usuario";
    const displayName = tuit.display_name || username;
    const texto = tuit.texto || "";
    const fecha = tuit.fecha_creacion || "";
    const mediaType = tuit.media_type || "";
    const mediaUrl = tuit.media_url || "";

    const article = document.createElement("article");
    article.className = "tweet-card";

    let html = `
      <div class="tweet-header">
        <strong>${displayName}</strong>
        <span>@${username}</span>
      </div>

      <div class="tweet-body">
        ${texto}
      </div>
    `;

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

    html += `
      <div class="tweet-footer">
        <small>${fecha}</small>
      </div>
    `;

    article.innerHTML = html;
    container.appendChild(article);
  });
}


/**
 * =========================================================
 * FUNCIÓN: getYoutubeEmbedUrl
 * =========================================================
 * Convierte una URL normal de YouTube en una URL embebida.
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
 * Cuando se carga la página:
 * - compruebo autenticación
 * - conecto el botón de Inicio
 * - cargo los tuits del usuario
 */
document.addEventListener("DOMContentLoaded", function () {
  requireAuth();

  const homeButton = document.getElementById("homeButton");

  if (homeButton) {
    homeButton.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  loadUserTuits();
});