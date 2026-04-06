function saveSession(token, userId) {
  sessionStorage.setItem('jwt_token', token);
  sessionStorage.setItem('user_id', userId);
}

function getToken() {
  return sessionStorage.getItem('jwt_token');
}

function getUserId() {
  return sessionStorage.getItem('user_id');
}

function isAuthenticated() {
  return !!getToken();
}

function clearSession() {
  sessionStorage.removeItem('jwt_token');
  sessionStorage.removeItem('user_id');
}

function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}
