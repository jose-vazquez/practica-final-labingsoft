# Práctica Final - Laboratorio de Ingeniería del Software

## Alumno

José Vázquez Avilés

## Repositorio

https://github.com/jose-vazquez/practica-final-labingsoft

## Descripción

Aplicación web cliente/servidor para la gestión de un catálogo multimedia.


- Cliente AngularJS 1.x.
- Servidor NodeJS con Express.
- API REST.
- Base de datos SQLite.
- Autenticación mediante usuario y contraseña.
- Generación de token de sesión.
- Almacenamiento del token en `localStorage`.
- Rutas protegidas mediante cabecera `Authorization`.
- Panel de administración.
- Gestión CRUD de usuarios desde el panel de administración.
- Gestión CRUD de categorías.
- Gestión CRUD de vídeos asociados a categorías.
- Ordenación visual por ID en las tablas del panel.
- Carga local de AngularJS y `angular-route`.
- Interfaz visual mejorada mediante CSS propio.
- Favicon e iconos propios de la aplicación.

Funcionalidad opcional pendiente:

- Vista de usuario normal con vídeos agrupados por categoría.

## Credenciales de prueba

### Administrador

- Usuario: joseva
- Contraseña: joseva_password

### Usuario normal

- Usuario: usuario
- Contraseña: usuario_password

## Tecnologías utilizadas

### Cliente

- HTML
- CSS
- JavaScript
- AngularJS 1.x
- angular-route

### Servidor

- NodeJS
- Express
- SQLite
- API REST

### Metodología y control de versiones

- Scrum
- Git
- GitHub
- Ramas por tarea

### Vista de usuario normal

La aplicación incluye una vista para usuarios con rol `user`. Tras iniciar sesión, el usuario normal accede a `#!/user`, donde se muestran las categorías y los vídeos asociados a cada categoría. De cada vídeo se muestra su nombre y su URL.

### Compatibilidad con `session_id`

La API REST mantiene compatibilidad con el formato indicado en el enunciado de la práctica. El endpoint `POST /login` devuelve un `session_id`, las rutas protegidas pueden recibirlo en la URL, en el cuerpo de la petición o en la cabecera `Authorization`, y el endpoint `PUT /logout` elimina la sesión del servidor. Se ha comprobado que, tras cerrar sesión, reutilizar el mismo `session_id` devuelve error `401`.


## Estructura de la práctica final

```text
backend/
  server.js
  schema.sql

frontend/
  index.html
  app.js
  css/
  icons/
  lib/
  views/
  favicon.ico

docs/
  product-backlog.md
  sprint-1.md
  sprint-2.md
  sprint-3.md
  git-workflow.md
  pruebas.md

entrega_practica_final.txt



