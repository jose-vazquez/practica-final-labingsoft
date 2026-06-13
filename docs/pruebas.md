# Pruebas manuales

## Objetivo

Documentar las pruebas realizadas sobre la práctica final para comprobar que la aplicación funciona correctamente.

Este documento se irá completando durante el desarrollo de los sprints.

## Pruebas previstas

| ID | Funcionalidad | Usuario | Resultado esperado | Estado |
|---|---|---|---|---|
| P-01 | Login administrador | joseva | Acceso al panel de administración | Pendiente |
| P-02 | Login usuario normal | usuario | Acceso a la vista de vídeos | Pendiente |
| P-03 | Token de sesión | joseva | El token se guarda en el navegador | Pendiente |
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
