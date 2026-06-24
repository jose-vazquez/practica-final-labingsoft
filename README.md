# Práctica Final - Laboratorio de Ingeniería del Software

## Alumno

José Vázquez Avilés

## Grupo

Grupo 4

## Repositorio

https://github.com/jose-vazquez/practica-final-labingsoft

## Descripción

Aplicación web cliente/servidor para la gestión de un catálogo multimedia.

La práctica implementa una aplicación completa con cliente AngularJS 1.x, servidor NodeJS con Express, API REST y base de datos SQLite. La aplicación permite iniciar sesión, gestionar usuarios, categorías y vídeos desde un panel de administración, y acceder como usuario normal a una vista de vídeos agrupados por categoría.

## Funcionalidades principales

* Cliente AngularJS 1.x.
* Servidor NodeJS con Express.
* API REST.
* Base de datos SQLite.
* Autenticación mediante usuario y contraseña.
* Generación de token de sesión.
* Compatibilidad con `session_id`, según el formato del enunciado.
* Almacenamiento del token de sesión en `localStorage`.
* Rutas protegidas mediante cabecera `Authorization`.
* Validación de sesiones en servidor.
* Cierre de sesión con invalidación del token en la base de datos.
* Panel de administración.
* Gestión CRUD de usuarios desde el panel de administración.
* Gestión CRUD de categorías.
* Gestión CRUD de vídeos asociados a categorías.
* Relación entre vídeos y categorías mediante `category_id`.
* Ordenación visual por ID en las tablas del panel.
* Carga local de AngularJS y `angular-route`.
* Interfaz visual mejorada mediante CSS propio.
* Favicon e iconos propios de la aplicación.
* Código principal comentado en primera persona técnica.

## Funcionalidad opcional implementada

* Vista de usuario normal con vídeos agrupados por categoría.
* Acceso diferenciado según rol de usuario.
* Redirección del usuario normal a `#!/user`.
* Visualización de categorías.
* Visualización de vídeos asociados a cada categoría.
* Visualización del nombre y URL de cada vídeo.

## Credenciales de prueba

### Administrador

* Usuario: `joseva`
* Contraseña: `joseva_password`

### Usuario normal

* Usuario: `usuario`
* Contraseña: `usuario_password`

## Tecnologías utilizadas

### Cliente

* HTML
* CSS
* JavaScript
* AngularJS 1.x
* angular-route

### Servidor

* NodeJS
* Express
* SQLite
* API REST

### Metodología y control de versiones

* Scrum
* Git
* GitHub
* Ramas por tarea
* Commits descriptivos
* Integración de ramas mediante merge

## Vista de usuario normal

La aplicación incluye una vista para usuarios con rol `user`. Tras iniciar sesión, el usuario normal accede a `#!/user`, donde se muestran las categorías y los vídeos asociados a cada categoría. De cada vídeo se muestra su nombre y su URL.

Esta funcionalidad cubre la parte opcional de la práctica.

## Compatibilidad con `session_id`

La API REST mantiene compatibilidad con el formato indicado en el enunciado de la práctica. El endpoint `POST /login` devuelve un `session_id`, las rutas protegidas pueden recibirlo en la URL, en el cuerpo de la petición o en la cabecera `Authorization`, y el endpoint `PUT /logout` elimina la sesión del servidor.

Se ha comprobado que, tras cerrar sesión, reutilizar el mismo `session_id` devuelve error `401`.

## Estructura de la práctica final

```text
backend/
  db.js
  server.js
  schema.sql
  package.json
  package-lock.json

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
```

## Ejecución

Desde la raíz del proyecto:

```powershell
node backend\server.js
```

Después abrir en el navegador:

```text
http://localhost:8080
```

## Pruebas realizadas

La práctica incluye documentación de pruebas manuales en:

```text
docs/pruebas.md
```

Se han probado, entre otros puntos:

* Login de administrador.
* Login de usuario normal.
* Acceso a rutas protegidas.
* Validación de `session_id`.
* Logout con invalidación de sesión.
* CRUD de usuarios.
* CRUD de categorías.
* CRUD de vídeos.
* Vista de usuario normal con vídeos agrupados por categoría.
