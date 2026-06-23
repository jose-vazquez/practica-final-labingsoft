# Sprint 2 - Servidor NodeJS, base de datos y API REST

## Objetivo del sprint

Implementar el servidor NodeJS, la base de datos SQLite y los servicios REST obligatorios para la administración de usuarios, categorías y vídeos.

## Historias de usuario incluidas

- HU-04: Como administrador quiero listar categorías.
- HU-05: Como administrador quiero crear, modificar y eliminar categorías.
- HU-06: Como administrador quiero listar vídeos.
- HU-07: Como administrador quiero crear, modificar y eliminar vídeos.
- HU-08: Como administrador quiero listar usuarios.
- HU-09: Como administrador quiero crear, modificar y eliminar usuarios.

## Tareas técnicas

- Crear el servidor con NodeJS y Express.
- Crear la base de datos SQLite.
- Crear la tabla `users`.
- Crear la tabla `sessions`.
- Crear la tabla `categories`.
- Crear la tabla `videos`.
- Implementar `POST /login`.
- Implementar `PUT /logout`.
- Implementar middleware para validar el token.
- Implementar CRUD de usuarios.
- Implementar CRUD de categorías.
- Implementar CRUD de vídeos.
- Validar que cada vídeo pertenece a una categoría.

## Resultado esperado

Al finalizar este sprint, el administrador debe poder iniciar sesión y gestionar usuarios, categorías y vídeos mediante peticiones REST protegidas con token.

### Adaptación contractual de `session_id`

Durante la revisión de la práctica se adaptó la API REST para cumplir literalmente el uso de `session_id` descrito en el enunciado. El login devuelve `session_id`, las rutas `/users/:session_id` y `/user/:session_id/:user_id` aceptan dicho identificador, y las operaciones de creación, modificación y eliminación de usuarios también pueden realizarse usando `session_id`.

Además, se verificó que `PUT /logout` elimina la sesión en el servidor. La prueba final confirma que, después del logout, reutilizar el mismo `session_id` devuelve `401`, demostrando que la sesión ya no es válida.


## Definición de terminado

- El login consulta usuario y contraseña en la base de datos.
- El servidor genera un token de sesión.
- El token se almacena en la tabla `sessions`.
- Las rutas protegidas rechazan peticiones sin token.
- El administrador puede crear, listar, modificar y eliminar usuarios.
- El administrador puede crear, listar, modificar y eliminar categorías.
- El administrador puede crear, listar, modificar y eliminar vídeos.
- Cada vídeo queda asociado a una categoría.

## Estado actual del sprint

Durante este sprint se han completado las siguientes partes:

- Servidor NodeJS con Express.
- Base de datos SQLite.
- Tabla `users`.
- Tabla `sessions`.
- Tabla `categories`.
- Tabla `videos`.
- Login contra base de datos.
- Generación de token de sesión.
- Validación de rutas protegidas mediante token.
- CRUD REST de categorías.
- CRUD REST de vídeos.
- Panel AngularJS conectado al CRUD de categorías.
- Panel AngularJS conectado al CRUD de vídeos.
- Ordenación visual por ID en las tablas del panel.
- CRUD REST de usuarios.
- Panel AngularJS conectado al CRUD de usuarios.
- Protección de operaciones administrativas mediante rol `admin`.
- Prevención del borrado del usuario autenticado.
- Carga local de AngularJS y `angular-route`.
- Mejora visual del panel de administración mediante CSS propio.

Con estas tareas, la funcionalidad obligatoria de administración queda completada: el administrador puede gestionar usuarios, categorías y vídeos desde una API REST protegida y desde el panel AngularJS.

## CRUD de usuarios implementado

Durante este sprint se completó la gestión de usuarios tanto en backend como en frontend.

### Endpoints REST implementados

- `GET /api/users`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

Estos endpoints están protegidos mediante token y requieren que el usuario autenticado tenga rol `admin`.

### Funcionalidad desde AngularJS

En el panel de administración se añadió una sección de usuarios que permite:

- Listar usuarios.
- Crear usuarios.
- Editar usuarios.
- Eliminar usuarios.
- Evitar la eliminación del usuario autenticado.

### Relación con la base de datos

Los usuarios se almacenan en la tabla `users` de SQLite. Las sesiones se almacenan en la tabla `sessions`, asociando cada token al usuario autenticado.