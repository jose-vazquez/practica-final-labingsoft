# Product Backlog

## Objetivo del producto

Desarrollar una aplicación web cliente/servidor para gestionar usuarios, categorías y vídeos mediante AngularJS, NodeJS, API REST y SQLite.

## Historias de usuario

| ID | Historia de usuario | Prioridad | Dificultad | Sprint | Estado |
|---|---|---|---|---|---|
| HU-01 | Como usuario quiero iniciar sesión para acceder a la aplicación | Alta | 3 | Sprint 1 | Hecha |
| HU-02 | Como usuario quiero que el sistema almacene un token tras el login | Alta | 3 | Sprint 1 | Hecha |
| HU-03 | Como administrador quiero acceder a un panel de administración | Alta | 2 | Sprint 1 | Hecha |
| HU-04 | Como administrador quiero listar categorías | Alta | 2 | Sprint 2 | Hecha |
| HU-05 | Como administrador quiero crear, modificar y eliminar categorías | Alta | 5 | Sprint 2 | Hecha |
| HU-06 | Como administrador quiero listar vídeos | Alta | 2 | Sprint 2 | Hecha |
| HU-07 | Como administrador quiero crear, modificar y eliminar vídeos | Alta | 5 | Sprint 2 | Hecha |
| HU-08 | Como administrador quiero listar usuarios | Alta | 2 | Sprint 2 | Hecha  |
| HU-09 | Como administrador quiero crear, modificar y eliminar usuarios | Alta | 5 | Sprint 2 | Hecha  |
| HU-10 | Como usuario normal quiero ver los vídeos agrupados por categoría | Media | 3 | Sprint 3 | Pendiente |
| HU-11 | Como usuario normal quiero ver el nombre y la URL de cada vídeo | Media | 2 | Sprint 3 | Pendiente |

## Criterio de priorización

Primero se desarrolla la funcionalidad obligatoria de administrador, ya que representa la parte principal de la evaluación. La funcionalidad opcional de usuario se deja para el último sprint.

## Estado actual del Product Backlog

En este punto del desarrollo ya se ha completado el login, la generación de token, la protección de rutas, el CRUD de usuarios, el CRUD de categorías y el CRUD de vídeos.

La funcionalidad obligatoria de administración queda completada. Queda pendiente únicamente la funcionalidad opcional de usuario normal con vídeos agrupados por categoría.