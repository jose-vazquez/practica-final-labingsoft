/**
 * =========================================================
 * CONTROL DE ACCESO
 * =========================================================
 * En esta página necesito comprobar desde el principio que el
 * usuario ya está autenticado.
 *
 * Si no hay token guardado en sessionStorage, con requireAuth()
 * lo redirijo automáticamente a login.html.
 *
 * Lo hago así porque en la práctica se pide que cualquier página
 * de contenido verifique que exista una sesión válida.
 */
requireAuth();

/**
 * =========================================================
 * REFERENCIAS A ELEMENTOS DEL DOM
 * =========================================================
 * Aquí guardo en constantes los elementos de la página que voy
 * a usar después desde JavaScript.
 *
 * Lo hago así para que el código quede más claro y para no tener
 * que estar buscando varias veces los mismos elementos en el DOM.
 */
const homeButton = document.getElementById('homeButton');
const newTuitButton = document.getElementById('newTuitButton');
const logoutButton = document.getElementById('logoutButton');
const timeline = document.getElementById('timeline');

/**
 * =========================================================
 * EVENTOS DE NAVEGACIÓN
 * =========================================================
 */

/**
 * En el botón "Inicio" simplemente recargo la página principal.
 */
homeButton.addEventListener('click', function () {
  window.location.href = 'index.html';
});

/**
 * De momento todavía no he implementado la creación de tuits,
 * así que dejo este botón preparado con un aviso temporal.
 *
 * Más adelante mi idea es que aquí se abra un diálogo o un modal
 * para escribir y publicar un nuevo tuit.
 */
newTuitButton.addEventListener('click', function () {
  alert('La creación de tuits se implementará más adelante.');
});

/**
 * En el botón "Cerrar sesión" sigo este flujo:
 * 1. Intento cerrar también la sesión en el servidor
 * 2. Borro la sesión local del navegador
 * 3. Redirijo al usuario a login.html
 *
 * He decidido hacerlo así porque, aunque falle la llamada al backend,
 * me interesa limpiar igualmente la sesión local para no dejar al
 * usuario dentro de la aplicación sin control.
 */
logoutButton.addEventListener('click', async function () {
  try {
    await logoutRequest();
  } catch (error) {
    console.error(error.message);
  } finally {
    clearSession();
    window.location.href = 'login.html';
  }
});

/**
 * =========================================================
 * EVENTO PRINCIPAL DE CARGA
 * =========================================================
 * Cuando el DOM ya está cargado, llamo a la función que se
 * encarga de obtener y pintar los últimos tuits.
 */
document.addEventListener('DOMContentLoaded', function () {
  loadTuits();
});

/**
 * =========================================================
 * FUNCIÓN: loadTuits
 * =========================================================
 * Aquí lo que hago es obtener los últimos tuits desde la API REST
 * y mostrarlos dinámicamente en la página principal.
 *
 * El flujo que sigo es este:
 * 1. Llamo al endpoint /tuits
 * 2. Compruebo qué formato tiene la respuesta
 * 3. Limpio el contenedor actual
 * 4. Creo un bloque HTML por cada tuit
 * 5. Lo inserto en el timeline
 */
async function loadTuits() {
  try {
    /**
     * Aquí hago la llamada a la API.
     * En este caso pido los 50 últimos tuits empezando en offset 0.
     */
    const data = await getTuits(50, 0);

    /**
     * Dejo la respuesta en consola porque me viene bien para ver
     * la estructura real del JSON que devuelve el servidor y poder
     * ajustar el render si hace falta.
     */
    console.log(data);

    /**
     * Aquí contemplo las dos posibilidades más probables:
     * - que la API devuelva directamente un array de tuits
     * - o que devuelva un objeto con una propiedad que contenga ese array
     *
     * Lo hago así para que el código no dependa de un único formato cerrado.
     */
    const tuits = Array.isArray(data) ? data : (data.tuits || data.items || []);

    /**
     * Si no hay tuits, muestro un mensaje informativo en lugar de
     * dejar la zona del timeline vacía.
     */
    if (!tuits.length) {
      timeline.innerHTML = '<p class="info-message">No hay tuits para mostrar.</p>';
      return;
    }

    /**
     * Antes de pintar los nuevos tuits, limpio el contenido que hubiera
     * ya en pantalla.
     */
    timeline.innerHTML = '';

    /**
     * Recorro el array de tuits y voy generando un bloque HTML por cada uno.
     */
    tuits.forEach(function (tuit) {
      /**
       * Como la estructura exacta del JSON puede variar, aquí compruebo
       * varios nombres posibles para cada campo.
       *
       * Para el usuario pruebo con:
       * - username
       * - user
       * - autor
       *
       * Para el texto pruebo con:
       * - text
       * - content
       * - message
       * - mensaje
       * - texto
       *
       * Si no encuentro nada compatible, dejo un valor por defecto.
       */
      const username = tuit.username || tuit.user || tuit.autor || 'usuario';

      const text =
        tuit.text ||
        tuit.content ||
        tuit.message ||
        tuit.mensaje ||
        tuit.texto ||
        'Sin contenido';

      /**
       * Aquí creo el elemento <article> que va a contener un tuit.
       * Le añado la clase "tuit" para poder aplicarle después el estilo CSS.
       */
      const article = document.createElement('article');
      article.classList.add('tuit');

      /**
       * Aquí inserto el HTML del tuit:
       * - en la cabecera muestro el nombre de usuario
       * - en el cuerpo muestro el texto del mensaje
       *
       * Además, al username le añado:
       * - una clase ("user-link")
       * - un atributo data-username
       *
       * Lo hago así porque luego me interesa detectar fácilmente
       * sobre qué usuario se ha hecho click.
       */
      article.innerHTML = `
        <div class="tuit-header">
          <strong class="user-link" data-username="${username}">
            @${username}
          </strong>
        </div>
        <div class="tuit-body">
          <p>${text}</p>
        </div>
      `;

      /**
       * Aquí hago que el nombre del usuario no sea solo texto,
       * sino que también sirva para navegar.
       *
       * Lo que hago es recuperar el username desde el atributo
       * data-username y redirigir a user.html pasándolo en la URL.
       *
       * Con esto consigo una navegación básica entre vistas sin usar
       * frameworks, que es justo el enfoque que pide la práctica.
       */
      article.querySelector('.user-link').addEventListener('click', function () {
        const username = this.dataset.username;
        window.location.href = `user.html?username=${username}`;
      });

      /**
       * Por último, añado el tuit ya construido al contenedor principal.
       */
      timeline.appendChild(article);
    });

  } catch (error) {
    /**
     * Si falla algo (por ejemplo token inválido, error de red
     * o respuesta incorrecta), muestro el error directamente
     * dentro del timeline.
     */
    timeline.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}