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
    const response = await getTuits(50, 0);

    console.log("Respuesta completa /tuits:", response);

    const tuits = response.tuits || [];

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
 */
function renderTuits(tuits) {
  const container = document.getElementById("timeline");

  if (!container) {
    console.error("No existe el elemento con id='timeline'");
    return;
  }

  container.innerHTML = "";

  if (!tuits.length) {
    container.innerHTML = `<p class="info-message">No hay tuits para mostrar.</p>`;
    return;
  }

  tuits.forEach(function (tuit) {
    console.log("Tuit individual:", tuit);

    const id = tuit.id_tuit;
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
     */
    html += `
      <div class="tweet-actions">
        <button type="button" data-id="${id}" class="like-btn">🤍 Like</button>
        <button type="button" data-id="${id}" class="retuit-btn">🔁 RT</button>
        <button type="button" class="reply-btn" disabled> Próximamente </button>
      </div>

      <div class="tweet-footer">
        <small>${fecha}</small>
      </div>
    `;

    article.innerHTML = html;

    /**
     * =========================================================
     * EVENTO: LIKE
     * =========================================================
     * Cuando el usuario pulsa Like:
     * - bloqueo el botón para evitar doble click
     * - muestro feedback visual
     * - llamo a la API
     * - recargo el timeline para sincronizar con backend
     */
    const likeButton = article.querySelector(".like-btn");

    if (likeButton) {
      likeButton.addEventListener("click", async function () {
      const idTuit = this.dataset.id;

      this.disabled = true;
      this.textContent = "⏳...";
      this.classList.add("processing");

      try {
        const isLiked = this.classList.contains("liked");

        if (isLiked) {
          await unlikeTuit(idTuit);

          this.textContent = "🤍 Like";
          this.classList.remove("liked");

        } else {
          await likeTuit(idTuit);

          this.textContent = "❤️ Liked";
          this.classList.add("liked");
        }

        setTimeout(function () {
          loadTuits();
        }, 500);

      } catch (error) {
        console.error("Error en like:", error);

        alert(error.message || "No se pudo cambiar el like.");

        likeButton.disabled = false;
        likeButton.textContent = "🤍 Like";

        likeButton.classList.remove("liked");
        likeButton.classList.remove("processing");
      }
  });
}

    /**
     * =========================================================
     * EVENTO: RETUIT
     * =========================================================
     * Cuando el usuario pulsa RT:
     * - bloqueo el botón para evitar doble click
     * - muestro feedback visual
     * - llamo a la API
     * - recargo el timeline para sincronizar con backend
     */
    const retuitButton = article.querySelector(".retuit-btn");

  if (retuitButton) {
    retuitButton.addEventListener("click", async function () {
    const idTuit = this.dataset.id;

    this.disabled = true;
    this.textContent = "⏳...";
    this.classList.add("processing");

    try {
      const isRetuit = this.classList.contains("retweeted");

      if (isRetuit) {
        await unretuit(idTuit);

        this.textContent = "🔁 RT";
        this.classList.remove("retweeted");

      } else {
        await retuit(idTuit);

        this.textContent = "✅ Retuiteado";
        this.classList.add("retweeted");
      }

      setTimeout(function () {
        loadTuits();
      }, 500);

    } catch (error) {
      console.error("Error en retuit:", error);

      alert(error.message || "No se pudo cambiar el retuit.");

      retuitButton.disabled = false;
      retuitButton.textContent = "🔁 RT";

      retuitButton.classList.remove("retweeted");
      retuitButton.classList.remove("processing");
      }
    });
  }

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
 * Cuando se carga index.html:
 * - compruebo que haya token
 * - engancho botones de navegación
 * - cargo el timeline
 */
document.addEventListener("DOMContentLoaded", function () {
  requireAuth();

  const homeButton = document.getElementById("homeButton");
  const newTuitButton = document.getElementById("newTuitButton");
  const logoutButton = document.getElementById("logoutButton");

  if (homeButton) {
    homeButton.addEventListener("click", function () {
      window.location.href = "index.html";
    });
  }

  if (newTuitButton) {
    newTuitButton.addEventListener("click", function () {
      window.location.href = "create.html";
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      logout();
    });
  }

  loadTuits();
});