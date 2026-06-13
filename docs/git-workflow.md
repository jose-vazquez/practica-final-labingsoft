# Flujo de trabajo con Git

## Objetivo

Documentar el uso de Git durante el desarrollo de la práctica final.

El desarrollo se organiza mediante ramas por tarea, partiendo siempre de la rama principal `main`.

## Rama principal

La rama principal del proyecto es `main`.

En ella se integran los incrementos funcionales terminados y probados.

## Convención de ramas

Las ramas utilizadas durante el desarrollo son:

- `dia1/preparacion-proyecto-final`
- `sprint1/login-angularjs`
- `sprint2/servidor-login-token`
- `sprint2/crud-categorias-videos`
- `sprint2/crud-usuarios`
- `sprint3/videos-por-categoria`
- `docs/pruebas-presentacion`

## Convención de commits

Se usa una convención simple basada en prefijos:

- `chore`: tareas de estructura o configuración.
- `docs`: documentación.
- `feat`: nueva funcionalidad.
- `fix`: corrección de errores.
- `style`: cambios visuales.
- `test`: pruebas o documentación de pruebas.

## Flujo de trabajo aplicado

1. Actualizar la rama principal.
2. Crear una rama para la tarea.
3. Desarrollar la funcionalidad.
4. Probar los cambios.
5. Hacer commit con un mensaje descriptivo.
6. Subir la rama a GitHub.
7. Fusionar la rama en `main` cuando el incremento esté terminado.

## Ejemplo de uso

Ejemplo para crear una rama de login:

- `git checkout main`
- `git pull origin main`
- `git checkout -b sprint1/login-angularjs`
- `git add .`
- `git commit -m "feat: implementar login inicial en AngularJS"`
- `git push origin sprint1/login-angularjs`

## Relación con Scrum

Cada rama representa una tarea técnica asociada a una historia de usuario del Product Backlog.

Al terminar una tarea, se genera un incremento funcional que puede revisarse y fusionarse en la rama principal.
