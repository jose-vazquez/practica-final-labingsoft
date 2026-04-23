/**
 * En esta vista vuelvo a comprobar que haya una sesión válida.
 * Si el usuario no está autenticado, no tiene sentido que pueda
 * acceder al formulario de creación.
 */
requireAuth();

/**
 * Aquí guardo las referencias a los elementos principales del formulario.
 * Lo hago al principio para tener el código más ordenado y más fácil
 * de leer.
 */
const createTuitForm = document.getElementById('createTuitForm');
const backButton = document.getElementById('backButton');
const formMessage = document.getElementById('formMessage');

/**
 * Con este botón permito volver fácilmente al timeline principal.
 */
backButton.addEventListener('click', function () {
  window.location.href = 'index.html';
});

/**
 * Aquí controlo el envío del formulario.
 *
 * El flujo que sigo es:
 * 1. Evitar el envío HTML por defecto
 * 2. Leer los valores introducidos
 * 3. Validar lo mínimo necesario
 * 4. Llamar a la API REST
 * 5. Si todo va bien, volver a la página principal
 */
createTuitForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  formMessage.textContent = '';

  /**
   * Recupero los datos del formulario.
   * Uso trim() para limpiar espacios innecesarios.
   */
  const text = document.getElementById('text').value.trim();
  const mediaType = document.getElementById('mediaType').value;
  const mediaUrl = document.getElementById('mediaUrl').value.trim();

  /**
   * El texto del tuit es obligatorio, así que lo valido primero.
   */
  if (!text) {
    formMessage.textContent = 'Debes escribir el texto del tuit.';
    return;
  }

  /**
   * Si el usuario selecciona un tipo multimedia, tiene sentido
   * exigir también una URL asociada.
   */
  if (mediaType && !mediaUrl) {
    formMessage.textContent = 'Debes indicar una URL multimedia.';
    return;
  }

  try {
    /**
     * Aquí llamo a la función que envía el tuit al servidor.
     */
    await createTuit(text, mediaType, mediaUrl);

    /**
     * Si todo ha ido bien, vuelvo al timeline principal para que
     * el usuario vea de nuevo la aplicación y pueda comprobar
     * el resultado.
     */
    window.location.href = 'index.html';

  } catch (error) {
    /**
     * Si algo falla, muestro el error dentro de la propia vista.
     */
    formMessage.textContent = error.message;
  }
});

