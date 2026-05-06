# 2026g4

Grupo 4 - Prácticas de Laboratorio de Ingeniería del Software

---

# Usuario de prueba

```text
usuario: jose
password: jose5
```

---

# MiniTwitter

Aplicación web cliente desarrollada con HTML, CSS y JavaScript para consumir la API REST de MiniTwitter de la UPCT.

---

# Funcionalidades implementadas

- Autenticación de usuario mediante API REST.
- Gestión de sesión usando JWT y `sessionStorage`.
- Protección de rutas privadas.
- Visualización del timeline principal.
- Creación de nuevos tuits.
- Publicación de tuits:
  - solo texto
  - imagen
  - vídeo
  - YouTube
- Renderizado multimedia dentro del timeline.
- Sistema de likes.
- Sistema de retuits.
- Navegación al perfil de usuario.
- Visualización de tuits por usuario.
- Botón de retorno al inicio.
- Logout de usuario.

---

# Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- API REST
- JWT
- Git
- GitHub

---

# Estructura del proyecto

```text
html/
  login.html
  index.html
  create.html
  user.html

css/
  styles.css

js/
  api.js
  login.js
  index.js
  create.js
  user.js
```

---

# Endpoints utilizados

- `POST /login`
- `GET /tuits`
- `POST /tuit`
- `PUT /tuit/{id_tuit}/like`
- `DELETE /tuit/{id_tuit}/like`
- `PUT /tuit/{id_tuit}/retuit`
- `DELETE /tuit/{id_tuit}/retuit`
- `GET /usuario/{username}/tuits`

---

# Uso de Git

El desarrollo se ha realizado mediante commits incrementales utilizando:

- `feat` 		→ nuevas funcionalidades
- `fix` 		→ correcciones
- `style` 		→ mejoras visuales
- `refactor`	→ limpieza de código
- `docs` 		→ documentación