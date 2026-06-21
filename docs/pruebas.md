# Pruebas manuales

## Objetivo

Documentar las pruebas realizadas sobre la práctica final para comprobar que la aplicación funciona correctamente.

## Pruebas previstas

| ID | Funcionalidad | Usuario | Resultado esperado | Estado |
|---|---|---|---|---|
| P-01 | Login administrador | joseva | Acceso al panel de administración | Superada |
| P-02 | Login usuario normal | usuario | Acceso a la vista de vídeos | Pendiente |
| P-03 | Token de sesión | joseva | El token se guarda en el navegador | Superada |
| P-04 | Listar usuarios | joseva | Se muestran los usuarios existentes | Superada |
| P-05 | Crear usuario | joseva | Se crea un nuevo usuario | Superada |
| P-06 | Modificar usuario | joseva | Se modifican los datos del usuario | Superada |
| P-07 | Eliminar usuario | joseva | Se elimina el usuario seleccionado | Superada |
| P-08 | Listar categorías desde API REST | joseva | Se muestran las categorías existentes | Superada |
| P-09 | Crear categoría desde API REST | joseva | Se crea una nueva categoría | Superada |
| P-10 | Modificar categoría desde API REST | joseva | Se modifica la categoría seleccionada | Superada |
| P-11 | Eliminar categoría desde API REST | joseva | Se elimina la categoría seleccionada | Superada |
| P-12 | Listar vídeos desde API REST | joseva | Se muestran los vídeos existentes | Superada |
| P-13 | Crear vídeo desde API REST | joseva | Se crea un nuevo vídeo asociado a una categoría | Superada |
| P-14 | Modificar vídeo desde API REST | joseva | Se modifica el vídeo seleccionado | Superada |
| P-15 | Eliminar vídeo desde API REST | joseva | Se elimina el vídeo seleccionado | Superada |
| P-16 | Evitar duplicados en vídeos de ejemplo | joseva | No se duplican los vídeos iniciales al regenerar la base de datos | Superada |
| P-17 | Listar categorías desde AngularJS | joseva | Se muestran las categorías en el panel | Superada |
| P-18 | Crear categoría desde AngularJS | joseva | Se crea una categoría desde el panel | Superada |
| P-19 | Modificar categoría desde AngularJS | joseva | Se modifica una categoría desde el panel | Superada |
| P-20 | Eliminar categoría desde AngularJS | joseva | Se elimina una categoría desde el panel | Superada |
| P-21 | Listar vídeos desde AngularJS | joseva | Se muestran los vídeos en el panel | Superada |
| P-22 | Crear vídeo desde AngularJS | joseva | Se crea un vídeo asociado a una categoría | Superada |
| P-23 | Modificar vídeo desde AngularJS | joseva | Se modifica un vídeo desde el panel | Superada |
| P-24 | Eliminar vídeo desde AngularJS | joseva | Se elimina un vídeo desde el panel | Superada |
| P-25 | Ordenación por ID | joseva | Categorías y vídeos aparecen ordenados por ID | Superada |
| P-26 | Vídeos por categoría en vista de usuario normal | usuario | Los vídeos aparecen agrupados por categoría | Pendiente |
| P-27 | Evitar borrado del usuario autenticado | joseva | El sistema no permite eliminar el usuario actualmente autenticado | Superada |
| P-28 | CRUD de usuarios desde AngularJS | joseva | Crear, editar y eliminar usuarios desde el panel | Superada |



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

## Pruebas realizadas en Sprint 2 - Frontend AngularJS de categorías y vídeos

### P-17 a P-20. Gestión de categorías desde AngularJS

**Objetivo:** comprobar que el administrador puede listar, crear, modificar y eliminar categorías desde el panel AngularJS.

**Resultado obtenido:** las categorías se cargan desde la API REST, se muestran ordenadas por ID y las operaciones de alta, edición y eliminación funcionan correctamente desde la interfaz.

**Estado:** SUPERADA.

---

### P-21 a P-24. Gestión de vídeos desde AngularJS

**Objetivo:** comprobar que el administrador puede listar, crear, modificar y eliminar vídeos asociados a categorías desde el panel AngularJS.

**Resultado obtenido:** los vídeos se cargan desde la API REST, muestran su categoría asociada y las operaciones de alta, edición y eliminación funcionan correctamente desde la interfaz.

**Estado:** SUPERADA.

---

### P-25. Ordenación por ID

**Objetivo:** comprobar que categorías y vídeos se muestran ordenados por identificador.

**Resultado obtenido:** las tablas del panel AngularJS muestran los registros ordenados por el campo `id`.

**Estado:** SUPERADA.

---

## Pruebas realizadas en Sprint 2 - CRUD de usuarios

### P-04. Listar usuarios

**Objetivo:** comprobar que un administrador autenticado puede obtener la lista de usuarios existentes.

**Resultado obtenido:** la API devuelve los usuarios con los campos `id`, `username`, `name` y `role`, sin devolver la contraseña.

**Estado:** SUPERADA.

---

### P-05. Crear usuario

**Objetivo:** comprobar que un administrador puede crear un usuario nuevo.

**Resultado obtenido:** se crea correctamente un usuario de prueba en la base de datos SQLite.

**Estado:** SUPERADA.

---

### P-06. Modificar usuario

**Objetivo:** comprobar que un administrador puede modificar los datos de un usuario existente.

**Resultado obtenido:** se modifican correctamente el nombre de usuario, la contraseña, el nombre completo y el rol.

**Estado:** SUPERADA.

---

### P-07. Eliminar usuario

**Objetivo:** comprobar que un administrador puede eliminar un usuario existente.

**Resultado obtenido:** el usuario de prueba se elimina correctamente y desaparece del listado.

**Estado:** SUPERADA.

---

### P-27. Evitar borrado del usuario autenticado

**Objetivo:** comprobar que el sistema no permite eliminar el usuario con el que se ha iniciado sesión.

**Resultado obtenido:** el backend devuelve un error y mantiene activo al usuario autenticado.

**Estado:** SUPERADA.

---

### P-28. CRUD de usuarios desde AngularJS

**Objetivo:** comprobar que el panel de administración permite gestionar usuarios desde la interfaz web.

**Pasos realizados:**

1. Iniciar sesión como administrador.
2. Acceder al panel de administración.
3. Crear un usuario de prueba.
4. Editar el usuario creado.
5. Guardar los cambios.
6. Eliminar el usuario.
7. Comprobar que el usuario desaparece de la tabla.
8. Comprobar que el botón de eliminar del usuario autenticado está deshabilitado.

**Resultado obtenido:** el CRUD de usuarios funciona correctamente desde el panel AngularJS.

**Estado:** SUPERADA.
