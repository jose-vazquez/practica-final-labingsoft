// URL base de la API REST proporcionada por el profesor
const API_BASE = 'https://lablsi1.upct.es:8080/minitwitter';

/**
 * FUNCIÓN: loginRequest
 * OBJETIVO: autenticar al usuario contra el backend
 * 
 * ENVÍA:
 *  - username
 *  - password
 * 
 * RECIBE:
 *  - token JWT (necesario para el resto de peticiones)
 */
async function loginRequest(username, password) {
  // Realizamos petición POST al endpoint /login
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: {
      // Indicamos que enviamos JSON
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  let data = null;

  try {
    // Intento parsear la respuesta como JSON
    data = await response.json();
  } catch (error) {
    // Si falla ... 
    throw new Error('La respuesta del servidor no es válida.');
  }

  // Si el servidor devuelve error (401, 500, etc.)
  if (!response.ok) {
    throw new Error(data.message || data.error || 'Error de autenticación.');
  }

  // Si todo va bien, devuels los datos (incluye token)
  return data;
}

/**
 * FUNCIÓN: logoutRequest
 * OBJETIVO: cerrar sesión en el servidor
 * 
 * IMPORTANTE:
 *  - Se envía el token en la cabecera Authorization
 */
async function logoutRequest() {
  const token = getToken(); // función de auth.js

  const response = await fetch(`${API_BASE}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Token JWT necesario para identificar al usuario
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('No se pudo cerrar la sesión en el servidor.');
  }

  return true;
}

/**
 * FUNCIÓN: getTuits
 * OBJETIVO: obtener los últimos tuits del sistema
 * 
 * PARÁMETROS:
 *  - limit: número de tuits
 *  - offset: desplazamiento (paginación)
 * 
 * IMPORTANTE:
 *  - requiere token JWT
 */
async function getTuits(limit = 50, offset = 0) {
  const token = getToken();

  const response = await fetch(`${API_BASE}/tuits?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      // Autenticación obligatoria
      'Authorization': `Bearer ${token}`
    }
  });

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error('La respuesta de /tuits no es válida.');
  }

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Error al obtener los tuits.');
  }

  return data;
}