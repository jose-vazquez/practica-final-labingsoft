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

## Definición de terminado

- El login consulta usuario y contraseña en la base de datos.
- El servidor genera un token de sesión.
- El token se almacena en la tabla `sessions`.
- Las rutas protegidas rechazan peticiones sin token.
- El administrador puede crear, listar, modificar y eliminar usuarios.
- El administrador puede crear, listar, modificar y eliminar categorías.
- El administrador puede crear, listar, modificar y eliminar vídeos.
- Cada vídeo queda asociado a una categoría.
