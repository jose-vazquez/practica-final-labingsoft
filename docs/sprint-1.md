# Sprint 1 - Cliente AngularJS y login

## Objetivo del sprint

Crear la estructura inicial del cliente AngularJS, configurar las rutas principales de la aplicación y preparar el formulario de autenticación.

## Historias de usuario incluidas

- HU-01: Como usuario quiero iniciar sesión para acceder a la aplicación.
- HU-02: Como usuario quiero que el sistema almacene un token tras el login.
- HU-03: Como administrador quiero acceder a un panel de administración.

## Tareas técnicas

- Crear la estructura del frontend.
- Crear `index.html` con `ng-app`.
- Configurar `ngRoute` para gestionar las vistas.
- Crear la vista `login.html`.
- Crear la vista `admin.html`.
- Crear el controlador de login.
- Crear el controlador del panel de administración.
- Crear un servicio AngularJS para comunicarse con la API REST.
- Preparar el almacenamiento del token en `localStorage`.

## Resultado esperado

Al finalizar este sprint, la aplicación debe cargar correctamente el cliente AngularJS y mostrar una pantalla de login. Tras un login correcto, el usuario debe acceder al panel de administración.

## Definición de terminado

- El frontend carga desde el navegador.
- AngularJS inicializa correctamente el módulo principal.
- Existen rutas para login y administración.
- El formulario de login recoge usuario y contraseña.
- El token devuelto por el servidor queda preparado para guardarse en el navegador.
- El panel de administración queda preparado para la gestión posterior de usuarios, categorías y vídeos.
