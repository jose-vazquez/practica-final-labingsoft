/**
 * En esta vista vuelvo a comprobar que el usuario esté autenticado.
 * Si no hay token en sessionStorage, no tiene sentido mostrar esta página,
 * así que redirijo automáticamente al login.
 */
requireAuth();

/**
 * Cuando la página termina de cargar, lo primero que hago es
 * recuperar el username desde la URL.
 *
 * Por ejemplo:
 * user.html?username=JoseVelasco
 *
 * Después uso ese valor para:
 * - mostrarlo en el título
 * - cargar sus tuits
 */
document.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const username = params.get('username');

  /**
   * Aquí simplemente muestro en pantalla de quién son los tuits.
   */
  document.getElementById('usernameTitle').textContent = `Tuits de @${username}`;

  /**
   * Llamo a la función que se encarga de obtener y pintar los tuits
   * de ese usuario.
   */
  loadUserTuits(username);
});

/**
 * =========================================================
 * FUNCIÓN: loadUserTuits
 * =========================================================
 * Aquí lo que hago es cargar los tuits del usuario seleccionado.
 *
 * De momento lo resuelvo de forma sencilla:
 * - pido los tuits generales a la API
 * - y luego filtro en el cliente los que pertenecen a ese usuario
 *
 * No es lo más eficiente, pero es suficiente para la práctica
 * y evita complicar más la parte del backend.
 */
async function loadUserTuits(username) {
  const container = document.getElementById('userTimeline');

  try {
    /**
     * Hago la llamada a la API para obtener los tuits.
     */
    const data = await getTuits(50, 0);

    /**
     * Igual que en index.js, aquí contemplo que la API pueda devolver:
     * - un array directamente
     * - o un objeto con una propiedad que contiene ese array
     */
    const tuits = Array.isArray(data) ? data : (data.tuits || data.items || []);

    /**
     * Aquí filtro los tuits para quedarme solo con los del usuario
     * que he recibido por parámetro.
     */
    const filtered = tuits.filter(function (tuit) {
      return tuit.username === username || tuit.user === username;
    });

    /**
     * Limpio el contenedor antes de pintar los resultados.
     */
    container.innerHTML = '';

    /**
     * Si el usuario no tiene tuits, muestro un mensaje informativo.
     */
    if (!filtered.length) {
      container.innerHTML = '<p class="info-message">Este usuario no tiene tuits para mostrar.</p>';
      return;
    }

    /**
     * Recorro los tuits filtrados y genero el HTML de cada uno.
     */
    filtered.forEach(function (tuit) {
      const article = document.createElement('article');
      article.classList.add('tuit');

      /**
       * Igual que antes, contemplo varios nombres posibles en el JSON
       * para evitar depender de una única estructura.
       */
      const user = tuit.username || tuit.user || 'usuario';

      const text =
        tuit.text ||
        tuit.content ||
        tuit.message ||
        tuit.mensaje ||
        tuit.texto ||
        'Sin contenido';

      /**
       * Construyo el HTML del tuit.
       */
      article.innerHTML = `
        <div class="tuit-header">
          <strong>@${user}</strong>
        </div>
        <div class="tuit-body">
          <p>${text}</p>
        </div>
      `;

      /**
       * Añado el tuit al contenedor.
       */
      container.appendChild(article);
    });

  } catch (error) {
    /**
     * Si ocurre algún error (por ejemplo problema de red o token inválido),
     * lo muestro directamente en la página.
     */
    container.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}