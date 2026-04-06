if (isAuthenticated()) {
  window.location.href = 'index.html';
}

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');


loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  errorMessage.textContent = '';

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    errorMessage.textContent = 'Debes introducir usuario y contraseña.';
    return;
  }

//*****************************************************
// SOLO PARA PRUEBAS (quitar luego)
//if (username === "test" && password === "1234") {
//  saveSession("fake-token", "1");
//  window.location.href = "index.html";
//  return;
//}
//*****************************************************

  try {
    const result = await loginRequest(username, password);

    const token = result.token || result.jwt || result.jwt_token;
    const userId = result.id || result.user_id || result.id_user;

    if (!token) {
      errorMessage.textContent = 'No se recibió token de autenticación.';
      return;
    }

    saveSession(token, userId || '');
    window.location.href = 'index.html';
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});
