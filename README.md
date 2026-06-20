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
- Gestión CRUD de categorías.
- Gestión CRUD de vídeos asociados a categorías.
- Ordenación visual por ID en las tablas del panel.

Funcionalidades pendientes de completar:

- Gestión CRUD de usuarios desde el panel de administración.
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

## Estructura de la práctica final

```text
backend/
  server.js
  schema.sql

frontend/
  index.html
  app.js
  css/
  views/

docs/
  product-backlog.md
  sprint-1.md
  sprint-2.md
  sprint-3.md
  git-workflow.md
  pruebas.md

entrega_practica_final.txt
