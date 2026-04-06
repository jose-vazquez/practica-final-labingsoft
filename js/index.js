/**
 * =========================================================
 * CONTROL DE ACCESO
 * =========================================================
 * Esta página solo debe ser accesible si el usuario ya se ha
 * autenticado correctamente.
 *
 * Si no existe token en sessionStorage, la función requireAuth()
 * redirige automáticamente a login.html.
 *
 * Esta comprobación cumple con el requisito de la práctica:
 * cualquier página de contenido debe verificar que exista el token.
 */
requireAuth();

/**
 * =========================================================
 * REFERENCIAS A ELEMENTOS DEL DOM
 * =========================================================
 * Guardamos en constantes los elementos de la página que vamos
 * a utilizar desde JavaScript.
 *
 * Esto mejora la legibilidad y evita buscar varias veces los
 * mismos elementos en el DOM.
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
 * Botón "Inicio"
 * Recarga la página principal.
 */
homeButton.addEventListener('click', function () {
  window.location.href = 'index.html';
});

/**
 * Botón "Escribir tuit"
 * De momento todavía no está implementada la creación de tuits,
 * así que dejamos un aviso temporal.
 *
 * Más adelante este botón abrirá un diálogo o modal.
 */
newTuitButton.addEventListener('click', function () {
  alert('La creación de tuits se implementará más adelante.');
});

/**
 * Botón "Cerrar sesión"
 *
 * Flujo:
 * 1. Se intenta cerrar sesión también en el servidor
 * 2. Se borra la sesión local del navegador
 * 3. Se redirige a login.html
 *
 * Aunque falle la petición al backend, en el bloque finally
 * se limpia igualmente la sesión local para no dejar al usuario
 * atrapado dentro de la aplicación.
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
 * Cuando el DOM de la página ya está cargado, llamamos a la
 * función que obtiene y muestra los últimos tuits.
 */
document.addEventListener('DOMContentLoaded', function () {
  loadTuits();
});

/**
 * =========================================================
 * FUNCIÓN: loadTuits
 * =========================================================
 * OBJETIVO:
 * Obtener los últimos tuits desde la API REST y mostrarlos
 * dinámicamente en la página principal.
 *
 * PASOS:
 * 1. Llamar al endpoint /tuits
 * 2. Comprobar el formato de respuesta
 * 3. Limpiar el contenedor actual
 * 4. Crear un bloque HTML por cada tuit
 * 5. Insertarlo en el timeline
 */
async function loadTuits() {
  try {
    /**
     * Llamada a la API.
     * Solicitamos los 50 últimos tuits comenzando desde offset 0.
     */
    const data = await getTuits(50, 0);

    /**
     * Mostramos la respuesta en consola para depuración.
     * Esto permite ver fácilmente la estructura real del JSON
     * que devuelve el servidor.
     */
    console.log(data);

    /**
     * La API puede devolver:
     * - directamente un array de tuits
     * - o un objeto que contenga una propiedad con ese array
     *
     * Por eso se comprueban ambas posibilidades.
     */
    const tuits = Array.isArray(data) ? data : (data.tuits || data.items || []);

    /**
     * Si no hay tuits, mostramos un mensaje informativo
     * en lugar de dejar el contenedor vacío.
     */
    if (!tuits.length) {
      timeline.innerHTML = '<p class="info-message">No hay tuits para mostrar.</p>';
      return;
    }

    /**
     * Limpiamos el contenido anterior antes de pintar los nuevos tuits.
     */
    timeline.innerHTML = '';

    /**
     * Recorremos el array de tuits y generamos un bloque HTML por cada uno.
     */
    tuits.forEach(function (tuit) {
      /**
       * Como la estructura exacta del JSON puede variar,
       * se contemplan varios nombres posibles para cada campo.
       *
       * username:
       * - username
       * - user
       * - autor
       *
       * text:
       * - text
       * - content
       * - message
       * - mensaje
       * - texto
       *
       * Si no existe ningún campo compatible, se muestra un valor por defecto.
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
       * Creamos el elemento <article> que contendrá un tuit.
       * Usamos la clase "tuit" para aplicar estilos CSS específicos.
       */
      const article = document.createElement('article');
      article.classList.add('tuit');

      /**
       * Insertamos el HTML del tuit:
       * - cabecera con el nombre de usuario
       * - cuerpo con el texto del mensaje
       */
      article.innerHTML = `
        <div class="tuit-header">
          <strong>@${username}</strong>
        </div>
        <div class="tuit-body">
          <p>${text}</p>
        </div>
      `;

      /**
       * Finalmente añadimos el tuit al contenedor principal.
       */
      timeline.appendChild(article);
    });

  } catch (error) {
    /**
     * Si algo falla (token inválido, error de red, respuesta incorrecta...),
     * mostramos el error dentro del timeline.
     */
    timeline.innerHTML = `<p class="error-message">${error.message}</p>`;
  }
}