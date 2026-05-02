// URL base de la API
const API_BASE = "https://lablsi1.upct.es:8080/minitwitter";


/**
 * =========================================================
 * FUNCIÓN: saveSession
 * =========================================================
 * Guarda en sessionStorage los datos de sesión:
 * - token JWT
 * - id del usuario autenticado
 */
function saveSession(token, userId) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("userId", userId);
}


/**
 * =========================================================
 * FUNCIÓN: getToken
 * =========================================================
 * Recupera el token almacenado en sessionStorage.
 * Se usa para enviar autenticación en cada petición.
 */
function getToken() {
  return sessionStorage.getItem("token");
}


/**
 * =========================================================
 * FUNCIÓN: logout
 * =========================================================
 * Cierra la sesión del usuario:
 * - borra los datos almacenados
 * - redirige al login
 */
function logout() {
  sessionStorage.clear();              // elimina sesión
  window.location.href = "login.html"; // redirección
}


/**
 * =========================================================
 * FUNCIÓN: requireAuth
 * =========================================================
 * Comprueba que exista token.
 * Si no existe → redirige al login.
 */
function requireAuth() {
  const token = getToken();

  if (!token) {
    window.location.href = "login.html";
  }
}

/**
 * =========================================================
 * FUNCIÓN: loginRequest
 * =========================================================
 * Realiza la autenticación del usuario contra el endpoint /login.
 *
 * Esta API espera exactamente en el body:
 * - username
 * - password
 *
 * Si el login es correcto:
 * - recibe un token JWT
 * - recibe el id del usuario
 * - guarda ambos en sessionStorage
 */
async function loginRequest(username, password) {

  // Hago la petición POST al endpoint de login
  const response = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json" // indico que envío JSON
    },
    body: JSON.stringify({
      username: username, // nombre exacto que pide la API
      password: password  // nombre exacto que pide la API
    })
  });

  // Convierto la respuesta a JSON
  const data = await response.json();

  // Si el servidor responde con error, lo lanzo para mostrarlo en pantalla
  if (!response.ok) {
    throw new Error(data.error || data.message || "Error en login");
  }

  // Guardo token e id del usuario en sessionStorage
  // Ajusta estas claves si la API devuelve otros nombres
  saveSession(data.token, data.id);

  return data;
}


/**
 * =========================================================
 * FUNCIÓN: getAuthHeaders
 * =========================================================
 * Genera las cabeceras para las peticiones autenticadas.
 *
 * Importante:
 * Aquí SOLO envío la cabecera Authorization.
 *
 * Antes también enviábamos x-access-token, pero eso estaba
 * provocando un preflight CORS que el servidor no acepta
 * correctamente en /tuits.
 */
function getAuthHeaders() {
  const token = getToken();

  return {
    "Authorization": `Bearer ${token}`
  };
}


/**
 * =========================================================
 * FUNCIÓN: getTuits
 * =========================================================
 * Obtiene los últimos tuits con paginación.
 *
 * Parámetros:
 * - limit  -> número de tuits
 * - offset -> desplazamiento
 */
async function getTuits(limit = 50, offset = 0) {

  const response = await fetch(
    `${API_BASE}/tuits?limit=${limit}&offset=${offset}`, {
      method: "GET",
      headers: getAuthHeaders() // requiere token
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al obtener tuits");
  }

  return data;
}


/**
 * =========================================================
 * FUNCIÓN: createTuit
 * =========================================================
 * Crea un nuevo tuit.
 *
 * Siempre envío:
 * - texto
 *
 * Solo envío multimedia si el usuario ha elegido un tipo
 * y ha escrito una URL.
 */
async function createTuit(text, mediaType, mediaUrl) {

  const token = getToken();

  // Objeto base: solo texto obligatorio
  const payload = {
    texto: text
  };

  // Solo añado multimedia si ambos campos tienen valor
  if (mediaType && mediaUrl) {
    payload.media_type = mediaType;
    payload.media_url = mediaUrl;
  }

  const response = await fetch(`${API_BASE}/tuit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error al crear el tuit");
  }

  return data;
}

/**
 * =========================================================
 * FUNCIÓN: likeTuit
 * =========================================================
 * Envía una petición PUT al endpoint:
 * /tuit/{id_tuit}/like
 *
 * Sirve para dar like a un tuit.
 */
async function likeTuit(idTuit) {
  const response = await fetch(`${API_BASE}/tuit/${idTuit}/like`, {
    method: "PUT",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error al dar like");
  }

  return data;
}


/**
 * =========================================================
 * FUNCIÓN: unlikeTuit
 * =========================================================
 * Envía una petición DELETE al endpoint:
 * /tuit/{id_tuit}/like
 *
 * Sirve para quitar el like de un tuit.
 */
async function unlikeTuit(idTuit) {
  const response = await fetch(`${API_BASE}/tuit/${idTuit}/like`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error al quitar like");
  }

  return data;
}


/**
 * =========================================================
 * FUNCIÓN: retuit
 * =========================================================
 * Envía una petición PUT al endpoint:
 * /tuit/{id_tuit}/retuit
 *
 * Sirve para hacer retuit de un tuit.
 */
async function retuit(idTuit) {
  const response = await fetch(`${API_BASE}/tuit/${idTuit}/retuit`, {
    method: "PUT",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error al hacer retuit");
  }

  return data;
}


/**
 * =========================================================
 * FUNCIÓN: unretuit
 * =========================================================
 * Envía una petición DELETE al endpoint:
 * /tuit/{id_tuit}/retuit
 *
 * Sirve para quitar el retuit.
 */
async function unretuit(idTuit) {
  const response = await fetch(`${API_BASE}/tuit/${idTuit}/retuit`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error al quitar retuit");
  }

  return data;
}