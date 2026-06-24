# Pruebas manuales

## Objetivo

Documentar las pruebas realizadas sobre la práctica final para comprobar que la aplicación funciona correctamente.

## Pruebas previstas

| ID | Funcionalidad | Usuario | Resultado esperado | Estado |
|---|---|---|---|---|
| P-01 | Login administrador | joseva | Acceso al panel de administración | Superada |
| P-25 | Ordenación por ID | joseva | Categorías y vídeos aparecen ordenados por ID | Superada |
| P-02 | Login usuario normal | usuario | Acceso a la vista de vídeos | Superada |
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
| P-26 | Vídeos por categoría en vista de usuario normal | usuario | Los vídeos aparecen agrupados por categoría | Superada |
| P-27 | Evitar borrado del usuario autenticado | joseva | El sistema no permite eliminar el usuario actualmente autenticado | Superada |
| P-28 | CRUD de usuarios desde AngularJS | joseva | Crear, editar y eliminar usuarios desde el panel | Superada |
| P-29 | Compatibilidad contractual con session_id | joseva | Login devuelve session_id, las rutas protegidas lo aceptan y logout invalida la sesión en servidor | Superada |


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

### P-29 - Compatibilidad contractual con `session_id`

Fecha de prueba: 23/06/2026

Credenciales utilizadas:

* Usuario: joseva
* Contraseña: joseva_password

#### Objetivo

Comprobar que la API REST cumple literalmente el formato indicado en el enunciado de la práctica, donde el identificador de sesión se denomina `session_id`.

Esta prueba verifica que:

* `POST /login` devuelve un `session_id`.
* El `session_id` permite acceder a rutas protegidas.
* La ruta `GET /users/:session_id` lista los usuarios.
* La ruta `GET /user/:session_id/:user_id` obtiene un usuario concreto.
* La ruta `POST /user` permite crear usuarios usando `session_id` en el cuerpo de la petición.
* La ruta `PUT /user` permite modificar usuarios usando `session_id` en el cuerpo de la petición.
* La ruta `DELETE /user/:session_id/:id` permite eliminar usuarios usando `session_id` en la URL.
* `PUT /logout` elimina la sesión en el servidor.
* Después de hacer logout, reutilizar el mismo `session_id` devuelve error `401`.

#### Prueba de login

Comando utilizado:

```powershell
$body = @{ user = "joseva"; passwd = "joseva_password" } | ConvertTo-Json

$login = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8080/login" `
  -ContentType "application/json" `
  -Body $body

$session_id = $login.session_id

$login
```

Resultado obtenido:

```text
session_id                                                       token                                                            user
----------                                                       -----                                                            ----
74d0a24ae339f2fc9dbae86b920108b421b1ade8ec67720fd68e4d3eef6d7c68 74d0a24ae339f2fc9dbae86b920108b421b1ade8ec67720fd68e4d3eef6d7c68 @{id=1; username=...}
```

Conclusión: el login devuelve correctamente un `session_id`.

#### Prueba de listado de usuarios

Comando utilizado:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8080/users/$session_id"
```

Resultado obtenido:

```text
id username   name                   role
-- --------   ----                   ----
 1 joseva     José Vázquez Avilés    admin
 2 usuario    Usuario de prueba      user
 8 prueba_web Usuario de prueba Web  admin
```

Conclusión: la ruta `GET /users/:session_id` funciona correctamente usando el identificador de sesión en la URL.

#### Prueba de consulta de usuario concreto

Comando utilizado:

```powershell
Invoke-RestMethod `
  -Method Get `
  -Uri "http://localhost:8080/user/$session_id/1"
```

Resultado obtenido:

```text
id username name                role
-- -------- ----                ----
 1 joseva   José Vázquez Avilés admin
```

Conclusión: la ruta `GET /user/:session_id/:user_id` devuelve correctamente los datos de un usuario concreto.

#### Prueba de creación de usuario

Comando utilizado:

```powershell
$n = Get-Random

$newUser = @{
    session_id = $session_id
    name       = "usuario_literal_$n"
    email      = "usuario_literal_$n@prueba.local"
    passwd     = "literal_password"
    role       = "user"
} | ConvertTo-Json

$created = Invoke-RestMethod `
  -Method Post `
  -Uri "http://localhost:8080/user" `
  -ContentType "application/json" `
  -Body $newUser

$created
```

Resultado obtenido:

```text
id username                  name                      role
-- --------                  ----                      ----
11 usuario_literal_191707732 usuario_literal_191707732 user
```

Conclusión: la ruta `POST /user` permite crear usuarios usando `session_id` en el cuerpo de la petición.

#### Prueba de modificación de usuario

Comando utilizado:

```powershell
$updatedUser = @{
    session_id = $session_id
    id         = $created.id
    name       = "usuario_literal_modificado_$n"
    passwd     = "literal_password_modificada"
    role       = "user"
} | ConvertTo-Json

Invoke-RestMethod `
  -Method Put `
  -Uri "http://localhost:8080/user" `
  -ContentType "application/json" `
  -Body $updatedUser
```

Resultado obtenido:

```text
id username                             name                                 role
-- --------                             ----                                 ----
11 usuario_literal_modificado_191707732 usuario_literal_modificado_191707732 user
```

Conclusión: la ruta `PUT /user` permite modificar usuarios usando `session_id` en el cuerpo de la petición.

#### Prueba de eliminación de usuario

Comando utilizado:

```powershell
Invoke-RestMethod `
  -Method Delete `
  -Uri "http://localhost:8080/user/$session_id/$($created.id)"
```

Resultado obtenido:

```text
message
-------
Usuario eliminado correctamente
```

Conclusión: la ruta `DELETE /user/:session_id/:id` elimina correctamente el usuario indicado.

#### Prueba de logout

Comando utilizado:

```powershell
$logoutBody = @{ session_id = $session_id } | ConvertTo-Json

Invoke-RestMethod `
  -Method Put `
  -Uri "http://localhost:8080/logout" `
  -ContentType "application/json" `
  -Body $logoutBody
```

Resultado obtenido:

```text
message
-------
Sesión cerrada correctamente
```

Conclusión: el servidor acepta el `session_id` para cerrar sesión.

#### Comprobación de sesión invalidada

Comando utilizado:

```powershell
try {
    Invoke-RestMethod `
      -Method Get `
      -Uri "http://localhost:8080/users/$session_id"
} catch {
    $_.Exception.Response.StatusCode.value__
}
```

Resultado obtenido:

```text
401
```

Conclusión: después del logout, el mismo `session_id` ya no es válido. Esto demuestra que la sesión se elimina en el servidor y no solo en el cliente.

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
