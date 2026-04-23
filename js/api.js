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
 * Genera las cabeceras necesarias para peticiones autenticadas.
 *
 * Incluye:
 * - Content-Type JSON
 * - Authorization con Bearer token
 * - x-access-token (compatibilidad)
 
function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, // estándar JWT
    "x-access-token": token             // fallback
  };
}*/

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
 * Crea un nuevo tuit enviando:
 * - texto
 * - media_type
 * - media_url
 *
 * IMPORTANTE:
 * El token debe ir en formato:
 *              Authorization: Bearer <token>
 */
async function createTuit(text, mediaType, mediaUrl) {

  const token = getToken();

  const payload = {
    texto: text,
    media_type: mediaType || "",
    media_url: mediaUrl || ""
  };

  const response = await fetch(`${API_BASE}/tuit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`   // 🔴 AQUÍ ESTÁ EL FIX
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
 * Envía una petición PUT para dar like a un tuit.
 */
async function likeTuit(id) {

  const response = await fetch(`${API_BASE}/tuit/${id}/like`, {
    method: "PUT",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al dar like");
  }
}


/**
 * =========================================================
 * FUNCIÓN: unlikeTuit
 * =========================================================
 * Envía una petición DELETE para quitar el like.
 */
async function unlikeTuit(id) {

  const response = await fetch(`${API_BASE}/tuit/${id}/like`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al quitar like");
  }
}


/**
 * =========================================================
 * FUNCIÓN: retuit
 * =========================================================
 * Realiza un retuit mediante petición PUT.
 */
async function retuit(id) {

  const response = await fetch(`${API_BASE}/tuit/${id}/retuit`, {
    method: "PUT",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al hacer retuit");
  }
}


/**
 * =========================================================
 * FUNCIÓN: unretuit
 * =========================================================
 * Elimina un retuit mediante petición DELETE.
 */
async function unretuit(id) {

  const response = await fetch(`${API_BASE}/tuit/${id}/retuit`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("Error al quitar retuit");
  }
}