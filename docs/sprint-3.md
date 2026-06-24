# Sprint 3 - Funcionalidad opcional y cierre

## Objetivo del sprint

Implementar la funcionalidad opcional de usuario normal, mostrando los vídeos agrupados por categoría, y completar la documentación final de la práctica.

## Historias de usuario incluidas

- HU-10: Como usuario normal quiero ver los vídeos agrupados por categoría.
- HU-11: Como usuario normal quiero ver el nombre y la URL de cada vídeo.

## Tareas técnicas

- Crear la vista de usuario normal.
- Crear una ruta AngularJS para la vista de vídeos por categoría.
- Redirigir al usuario según su rol tras el login.
- Crear endpoint REST para obtener categorías con sus vídeos.
- Mostrar una sección por cada categoría.
- Mostrar debajo de cada categoría sus vídeos correspondientes.
- Documentar pruebas manuales.
- Revisar README.
- Revisar archivo de entrega.

## Resultado esperado

Al finalizar este sprint, el usuario normal debe poder iniciar sesión y visualizar los vídeos organizados por categorías.

## Definición de terminado

- El usuario normal puede iniciar sesión.
- El sistema identifica el rol del usuario.
- El usuario administrador accede al panel de administración.
- El usuario normal accede a la vista de vídeos.
- Los vídeos aparecen agrupados por categoría.
- Cada vídeo muestra nombre y URL.
- La documentación de pruebas queda completada.

### Incremento obtenido

Se implementó la vista opcional de usuario normal. Tras iniciar sesión con un usuario de rol `user`, la aplicación redirige a `#!/user`, carga categorías y vídeos desde la API REST usando el token de sesión, y muestra los vídeos agrupados por categoría con su nombre y URL.

Esta funcionalidad completa la parte opcional indicada en el enunciado.