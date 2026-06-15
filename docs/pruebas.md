# Pruebas manuales

## Objetivo

Documentar las pruebas realizadas sobre la práctica final para comprobar que la aplicación funciona correctamente.

## Pruebas previstas

| ID | Funcionalidad | Usuario | Resultado esperado | Estado |
|---|---|---|---|---|
| P-01 | Login administrador | joseva | Acceso al panel de administración | Superada |
| P-02 | Login usuario normal | usuario | Acceso a la vista de vídeos | Pendiente |
| P-03 | Token de sesión | joseva | El token se guarda en el navegador | Superada |
| P-04 | Listar usuarios | joseva | Se muestran los usuarios existentes | Pendiente |
| P-05 | Crear usuario | joseva | Se crea un nuevo usuario | Pendiente |
| P-06 | Modificar usuario | joseva | Se modifican los datos del usuario | Pendiente |
| P-07 | Eliminar usuario | joseva | Se elimina el usuario seleccionado | Pendiente |
| P-08 | Listar categorías | joseva | Se muestran las categorías existentes | Pendiente |
| P-09 | Crear categoría | joseva | Se crea una nueva categoría | Pendiente |
| P-10 | Modificar categoría | joseva | Se modifica la categoría seleccionada | Pendiente |
| P-11 | Eliminar categoría | joseva | Se elimina la categoría seleccionada | Pendiente |
| P-12 | Listar vídeos | joseva | Se muestran los vídeos existentes | Pendiente |
| P-13 | Crear vídeo | joseva | Se crea un nuevo vídeo asociado a una categoría | Pendiente |
| P-14 | Modificar vídeo | joseva | Se modifica el vídeo seleccionado | Pendiente |
| P-15 | Eliminar vídeo | joseva | Se elimina el vídeo seleccionado | Pendiente |
| P-16 | Vídeos por categoría | usuario | Los vídeos aparecen agrupados por categoría | Pendiente |

## Prueba realizada en Sprint 1

### P-01 - Login administrador

Fecha de prueba: 13/06/2026

Credenciales utilizadas:

- Usuario: joseva
- Contraseña: joseva_password

Resultado obtenido:

- El servidor NodeJS arranca correctamente en `http://localhost:8080`.
- La aplicación AngularJS carga correctamente.
- El formulario de login permite introducir usuario y contraseña.
- Tras autenticarse correctamente, la aplicación redirige al panel de administración.
- El panel muestra el nombre del usuario autenticado y el rol `admin`.

Estado: Superada.

### P-03 - Token de sesión temporal

Resultado obtenido:

- El servidor devuelve un token tras el login.
- El cliente guarda el token en `localStorage`.
- El panel de administración solo se muestra si existe token y usuario guardado.

Estado: Superada en la primera versión temporal.

## Prueba realizada en Sprint 2

### P-03 - Token de sesión con base de datos SQLite

Fecha de prueba: 14/06/2026

Credenciales utilizadas:

- Usuario: joseva
- Contraseña: joseva_password

Resultado obtenido:

- El login se realiza contra la tabla `users` de SQLite.
- El servidor genera un token aleatorio.
- El token se almacena en la tabla `sessions`.
- El cliente AngularJS guarda el token en `localStorage`.
- La petición protegida `GET /api/ping` funciona enviando el token en la cabecera `Authorization`.
- El panel de administración muestra el mensaje: `API REST funcionando con token válido`.

Prueba adicional realizada desde PowerShell:

- `POST /login` devuelve un token válido.
- `GET /api/ping` con `Authorization: Bearer <token>` devuelve respuesta correcta.

Estado: Superada.

## Credenciales de prueba

### Administrador

Usuario: joseva  
Contraseña: joseva_password

### Usuario normal

Usuario: usuario  
Contraseña: usuario_password

## Criterio de aceptación general

La práctica se considera terminada cuando:

- El login funciona contra base de datos.
- El servidor devuelve un token.
- El cliente guarda el token en el navegador.
- Las rutas protegidas validan el token.
- El administrador puede gestionar usuarios, categorías y vídeos.
- El usuario normal puede ver vídeos agrupados por categoría.

## Pruebas realizadas en Sprint 2 - CRUD de categorías y vídeos

### P-08. Listar categorías

**Objetivo:** comprobar que un administrador autenticado puede obtener las categorías existentes.

**Comando probado:**

Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/categories" -Headers @{ Authorization = "Bearer $token" }

**Resultado obtenido:** la API devuelve las categorías existentes: Programación y Redes.

**Estado:** SUPERADA.

---

### P-09. Crear categoría

**Objetivo:** comprobar que un administrador puede crear una nueva categoría.

**Comando probado:**

Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/categories" -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" } -Body $cat

**Resultado obtenido:** se crea correctamente la categoría Bases de datos.

**Estado:** SUPERADA.

---

### P-10. Modificar categoría

**Objetivo:** comprobar que un administrador puede modificar una categoría existente.

**Resultado obtenido:** la categoría Bases de datos se modifica correctamente a SQLite y bases de datos.

**Estado:** SUPERADA.

---

### P-11. Eliminar categoría

**Objetivo:** comprobar que un administrador puede eliminar una categoría existente.

**Resultado obtenido:** la API devuelve el mensaje Categoría eliminada correctamente.

**Estado:** SUPERADA.

---

### P-12. Listar vídeos

**Objetivo:** comprobar que un usuario autenticado puede obtener la lista de vídeos junto con su categoría.

**Comando probado:**

Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/videos" -Headers @{ Authorization = "Bearer $token" }

**Resultado obtenido:** la API devuelve los vídeos existentes con id, name, url, category_id y category_name.

**Estado:** SUPERADA.

---

### P-13. Crear vídeo

**Objetivo:** comprobar que un administrador puede crear un vídeo asociado a una categoría.

**Resultado obtenido:** se crea correctamente el vídeo Introducción a SQLite asociado a la categoría Bases de datos.

**Estado:** SUPERADA.

---

### P-14. Modificar vídeo

**Objetivo:** comprobar que un administrador puede modificar un vídeo existente.

**Resultado obtenido:** el vídeo Introducción a SQLite se modifica correctamente a SQLite con NodeJS.

**Estado:** SUPERADA.

---

### P-15. Eliminar vídeo

**Objetivo:** comprobar que un administrador puede eliminar un vídeo existente.

**Resultado obtenido:** la API devuelve el mensaje Vídeo eliminado correctamente.

**Estado:** SUPERADA.

---

### P-16. Evitar duplicados en vídeos de ejemplo

**Objetivo:** comprobar que los vídeos iniciales no se duplican al regenerar la base de datos.

**Resultado obtenido:** tras borrar backend/database.db y reiniciar el servidor, solo aparecen los dos vídeos iniciales esperados.

**Estado:** SUPERADA.
