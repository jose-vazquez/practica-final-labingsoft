'use strict';

/*
 * Defino la aplicación AngularJS principal de la práctica.
 *
 * Uso AngularJS 1.x con ngRoute porque el enunciado pide una aplicación
 * cliente basada en AngularJS. Organizo el cliente como una SPA sencilla:
 * una vista de login, una vista de administración y una vista de usuario normal.
 */

/*
 * Se crea el módulo principal de AngularJS.
 *
 * Nombre del módulo: CatalogoApp
 * Dependencia: ngRoute
 *
 * ngRoute permite crear una aplicación SPA:
 * varias vistas dentro de la misma página sin recargar todo el documento.
 */
/*
 * Registro el módulo CatalogoApp e incluyo ngRoute.
 *
 * Necesito ngRoute para cambiar entre vistas sin recargar toda la página.
 */
angular.module('CatalogoApp', ['ngRoute'])

/*
 * Configuración de rutas de la aplicación.
 *
 * $routeProvider indica qué plantilla HTML y qué controlador se cargan
 * según la URL interna de AngularJS.
 */
.config(function($routeProvider, $locationProvider) {
    /*
     * AngularJS 1.6+ utiliza por defecto rutas con hashbang.
     * Esto hace que las URLs internas tengan este formato:
     *
     * http://localhost:8080/#!/
     * http://localhost:8080/#!/admin
     */
    $locationProvider.hashPrefix('!');

    $routeProvider
        /*
         * Ruta principal.
         *
         * Cuando el usuario entra en:
         * http://localhost:8080/#!/
         *
         * AngularJS carga la vista login.html
         * y usa el controlador LoginController.
         */
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })

        /*
         * Ruta del panel de administración.
         *
         * Cuando el usuario entra en:
         * http://localhost:8080/#!/admin
         *
         * AngularJS carga la vista admin.html
         * y usa el controlador AdminController.
         */
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminController'
        })

        /*
         * Ruta de usuario normal.
         *
         * Cumple la parte opcional del enunciado:
         * el usuario autenticado puede ver vídeos agrupados por categoría.
         */
        .when('/user', {
            templateUrl: 'views/user.html',
            controller: 'UserController'
        })

        /*
         * Ruta por defecto.
         *
         * Si el usuario escribe una ruta no válida,
         * se redirige automáticamente al login.
         */
        .otherwise({
            redirectTo: '/'
        });
})

/*
 * Servicio AngularJS para comunicarse con la API REST.
 *
 * Se utiliza una factory porque necesitamos centralizar las llamadas HTTP
 * al servidor NodeJS.
 *
 * Ventaja:
 * los controladores no construyen directamente las peticiones;
 * llaman a apiService y este se encarga de hablar con el backend.
 */
.factory('apiService', function($http) {
    const api = {};

    /*
     * Construye la configuración de autenticación.
     *
     * Recibe el token de sesión y lo añade a la cabecera HTTP
     * Authorization con el formato:
     *
     * Bearer <token>
     */
    /*
     * Construyo la cabecera Authorization para las rutas protegidas.
     *
     * Envío el token/session_id con formato Bearer porque el backend lo valida
     * en requireToken. Este método se reutiliza en categorías, vídeos, usuarios
     * y cierre de sesión.
     */
    api.getAuthConfig = function(token) {
        return {
            headers: {
                Authorization: 'Bearer ' + token
            }
        };
    };

    /*
     * Petición de login.
     *
     * Envía usuario y contraseña al endpoint POST /login.
     *
     * El backend comprobará estos datos contra SQLite.
     * Si son correctos, devolverá el token y los datos del usuario.
     */
    /*
     * Ejecuto la petición de login contra el backend.
     *
     * Envío user y passwd tal como aparece en el enunciado. Si las credenciales
     * son correctas, el backend devuelve token, session_id y los datos del usuario.
     */
    api.login = function(user, passwd) {
        return $http.post('/login', {
            user: user,
            passwd: passwd
        });
    };

    /*
     * Petición de cierre de sesión.
     *
     * Envía una petición PUT /logout.
     *
     * Como es una ruta protegida, se envía el token en la cabecera
     * Authorization.
     */
    /*
     * Ejecuto el cierre de sesión.
     *
     * Envío el token por Authorization y también session_id en el cuerpo para
     * mantener compatibilidad con el formato contractual del enunciado.
     */
    api.logout = function(token) {
        return $http.put('/logout', { session_id: token }, api.getAuthConfig(token));
    };

    /*
     * Petición de comprobación de API protegida.
     *
     * Llama a GET /api/ping enviando el token.
     *
     * Sirve para comprobar que:
     * - el token existe;
     * - el token está en la base de datos;
     * - el servidor acepta la sesión.
     */
    api.ping = function(token) {
        return $http.get('/api/ping', api.getAuthConfig(token));
    };

    /*
    * Obtiene todas las categorías existentes.
    *
    * Llama al endpoint:
    * GET /api/categories
    *
    * Es una ruta protegida, por eso se envía el token.
    */
    /*
     * Solicito al backend las categorías disponibles.
     *
     * Esta función la uso tanto en el panel de administración como en la vista
     * de usuario normal, porque ambos necesitan conocer las categorías.
     */
    api.getCategories = function(token) {
        return $http.get('/api/categories', api.getAuthConfig(token));
    };

    /*
    * Crea una nueva categoría.
    *
    * Llama al endpoint:
    * POST /api/categories
    *
    * El objeto category debe tener esta forma:
    * {
    *     name: 'Nombre de la categoría'
    * }
    */
    api.createCategory = function(token, category) {
        return $http.post('/api/categories', category, api.getAuthConfig(token));
    };

    /*
    * Modifica una categoría existente.
    *
    * Llama al endpoint:
    * PUT /api/categories/:id
    */
    api.updateCategory = function(token, id, category) {
        return $http.put('/api/categories/' + id, category, api.getAuthConfig(token));
    };

    /*
    * Elimina una categoría existente.
    *
    * Llama al endpoint:
    * DELETE /api/categories/:id
    */
    api.deleteCategory = function(token, id) {
        return $http.delete('/api/categories/' + id, api.getAuthConfig(token));
    };

    /*
     * Obtiene todos los usuarios existentes.
     *
     * Llama al endpoint:
     * GET /api/users
     */
    api.getUsers = function(token) {
        return $http.get('/api/users', api.getAuthConfig(token));
    };

    /*
     * Crea un nuevo usuario.
     *
     * Llama al endpoint:
     * POST /api/users
     */
    api.createUser = function(token, user) {
        return $http.post('/api/users', user, api.getAuthConfig(token));
    };

    /*
     * Modifica un usuario existente.
     *
     * Llama al endpoint:
     * PUT /api/users/:id
     */
    api.updateUser = function(token, id, user) {
        return $http.put('/api/users/' + id, user, api.getAuthConfig(token));
    };

    /*
     * Elimina un usuario existente.
     *
     * Llama al endpoint:
     * DELETE /api/users/:id
     */
    api.deleteUser = function(token, id) {
        return $http.delete('/api/users/' + id, api.getAuthConfig(token));
    };

    /*
    * Obtiene todos los vídeos existentes.
    *
    * Llama al endpoint:
    * GET /api/videos
    *
    * El backend devuelve cada vídeo junto con su categoría.
    */
    /*
     * Solicito al backend los vídeos existentes.
     *
     * El backend devuelve cada vídeo con su category_id y category_name, lo que
     * me permite mostrar la relación entre vídeos y categorías.
     */
    api.getVideos = function(token) {
        return $http.get('/api/videos', api.getAuthConfig(token));
    };

    /*
    * Crea un nuevo vídeo.
    *
    * Llama al endpoint:
    * POST /api/videos
    *
    * El objeto video debe tener esta forma:
    * {
    *     name: 'Nombre del vídeo',
    *     url: 'https://...',
    *     category_id: 1
    * }
    */
    api.createVideo = function(token, video) {
        return $http.post('/api/videos', video, api.getAuthConfig(token));
    };

    /*
    * Modifica un vídeo existente.
    *
    * Llama al endpoint:
    * PUT /api/videos/:id
    */
    api.updateVideo = function(token, id, video) {
        return $http.put('/api/videos/' + id, video, api.getAuthConfig(token));
    };

    /*
    * Elimina un vídeo existente.
    *
    * Llama al endpoint:
    * DELETE /api/videos/:id
    */
    api.deleteVideo = function(token, id) {
        return $http.delete('/api/videos/' + id, api.getAuthConfig(token));
    };

    /*
     * Se devuelve el objeto api para que pueda ser usado
     * por los controladores.
     */
    return api;
})

/*
 * Controlador del login.
 *
 * Se asocia a la vista:
 * frontend/views/login.html
 *
 * Gestiona:
 * - los datos escritos en el formulario;
 * - el envío del login;
 * - el almacenamiento del token;
 * - la redirección al panel de administración.
 */
/*
 * Gestiono la pantalla de login.
 *
 * Desde este controlador recojo usuario y contraseña, llamo al backend y guardo
 * la sesión en localStorage. Después redirijo según el rol: admin al panel de
 * administración y user a la vista normal de vídeos.
 */
.controller('LoginController', function($scope, $location, apiService) {
    /*
     * Variables enlazadas con el formulario mediante ng-model.
     *
     * En login.html tendremos:
     * ng-model="user"
     * ng-model="passwd"
     */
    $scope.user = '';
    $scope.passwd = '';

    /*
     * Variable para mostrar errores en pantalla.
     *
     * Por ejemplo:
     * "Usuario o contraseña incorrectos".
     */
    $scope.error = '';

    /*
     * Función que se ejecuta al enviar el formulario de login.
     *
     * En la vista se llama mediante:
     * ng-submit="login()"
     */
    $scope.login = function() {
        /*
         * Se limpia el mensaje de error antes de hacer una nueva petición.
         */
        $scope.error = '';

        /*
         * Se llama al servicio apiService.login().
         *
         * Esta función envía una petición POST /login al backend.
         */
        apiService.login($scope.user, $scope.passwd)
            /*
             * then() se ejecuta si el servidor responde correctamente.
             *
             * En este caso, el backend ha validado usuario y contraseña.
             */
            .then(function(response) {
                /*
                 * Se guarda el token devuelto por el servidor.
                 *
                 * localStorage permite mantener el token aunque se recargue
                 * la página.
                 */
                /*
                 * Guardo la sesión en localStorage.
                 *
                 * Uso session_id si viene informado porque es el nombre indicado
                 * por el enunciado. Si no existiera, mantengo compatibilidad con token.
                 */
                const sessionId = response.data.session_id || response.data.token;
                localStorage.setItem('token', sessionId);
                localStorage.setItem('session_id', sessionId);

                /*
                 * Se guardan también los datos del usuario.
                 *
                 * JSON.stringify convierte el objeto JavaScript en texto,
                 * porque localStorage solo guarda cadenas de texto.
                 */
                localStorage.setItem('usuario', JSON.stringify(response.data.user));

                /*
                 * Redirección al panel de administración.
                 *
                 * AngularJS cambia la vista sin recargar toda la página.
                 */
                /*
                 * Redirijo según el rol del usuario autenticado.
                 *
                 * Los administradores acceden al CRUD completo y los usuarios
                 * normales acceden a la vista opcional de vídeos por categoría.
                 */
                if (response.data.user.role === 'admin') {
                    $location.path('/admin');
                } else {
                    $location.path('/user');
                }
            })

            /*
             * catch() se ejecuta si el backend devuelve error.
             *
             * Por ejemplo:
             * - credenciales incorrectas;
             * - servidor no disponible;
             * - error interno.
             */
            .catch(function() {
                $scope.error = 'Usuario o contraseña incorrectos';
            });
    };
})

/*
 * Controlador del panel de administración.
 *
 * Se asocia a la vista:
 * frontend/views/admin.html
 *
 * Gestiona:
 * - comprobación de sesión;
 * - lectura del usuario autenticado;
 * - validación del token contra el backend;
 * - cierre de sesión.
 */
/*
 * Gestiono el panel de administración.
 *
 * Desde este controlador cargo y mantengo los CRUD de usuarios, categorías
 * y vídeos. Todas las operaciones se hacen contra la API REST protegida,
 * enviando el token guardado en localStorage.
 */
.controller('AdminController', function($scope, $location, apiService) {
    /*
     * Se recupera el token guardado durante el login.
     */
    const token = localStorage.getItem('token');

    /*
     * Se recuperan los datos del usuario guardados durante el login.
     */
    const usuarioGuardado = localStorage.getItem('usuario');

    /*
     * Si no hay token o no hay usuario guardado,
     * no se permite acceder al panel de administración.
     *
     * El usuario vuelve al login.
     */
    if (!token || !usuarioGuardado) {
        $location.path('/');
        return;
    }

    /*
     * JSON.parse convierte el texto guardado en localStorage
     * de nuevo en un objeto JavaScript.
     *
     * Así la vista puede mostrar:
     * usuario.name
     * usuario.role
     */
    $scope.usuario = JSON.parse(usuarioGuardado);

    /*
     * Mensaje inicial mientras se comprueba el token contra el backend.
     */
    $scope.apiMessage = 'Comprobando token de sesión...';

    /*
     * Se llama a una ruta protegida del servidor.
     *
     * Si el token es válido, el backend responde correctamente.
     * Si el token no es válido, se elimina la sesión local.
     */
    apiService.ping(token)
        /*
         * Si la API responde correctamente,
         * se muestra el mensaje devuelto por el servidor.
         */
        .then(function(response) {
            $scope.apiMessage = response.data.message;
        })

        /*
         * Si la API rechaza el token,
         * se elimina la información local y se vuelve al login.
         */
        .catch(function() {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');
            $location.path('/');
        });

       /*
     * Listas de datos que se mostrarán en el panel.
     *
     * categories contendrá las categorías recibidas desde SQLite.
     * videos contendrá los vídeos recibidos desde SQLite.
     */
    $scope.users = [];
    $scope.categories = [];
    $scope.videos = [];

    /*
     * Objetos enlazados a los formularios de alta.
     *
     * newCategory se usará para crear una categoría nueva.
     * newVideo se usará para crear un vídeo nuevo.
     */
    $scope.newUser = {};
    $scope.newCategory = {};
    $scope.newVideo = {};

    /*
     * Objetos usados cuando el usuario quiere editar un registro.
     *
     * editingCategory guarda una copia de la categoría que se está modificando.
     * editingVideo guarda una copia del vídeo que se está modificando.
     */

    $scope.editingUser = null;
    $scope.editingCategory = null;
    $scope.editingVideo = null;

    /*
     * Mensajes de estado para mostrar errores o confirmaciones
     * sin tener que mirar siempre la consola del navegador.
     */
    $scope.userMessage = '';
    $scope.categoryMessage = '';
    $scope.videoMessage = '';

    /*
     * Carga todos los usuarios desde la API REST.
     *
     * Llama al servicio:
     * GET /api/users
     */
    $scope.loadUsers = function() {
        apiService.getUsers(token)
            .then(function(response) {
                $scope.users = response.data;
            })
            .catch(function() {
                $scope.userMessage = 'Error al cargar los usuarios';
            });
    };

    /*
     * Crea un nuevo usuario.
     *
     * La vista escribirá:
     * newUser.username
     * newUser.password
     * newUser.name
     * newUser.role
     */
    $scope.createUser = function() {
        $scope.userMessage = '';

        apiService.createUser(token, $scope.newUser)
            .then(function() {
                $scope.newUser = {};
                $scope.userMessage = 'Usuario creado correctamente';
                $scope.loadUsers();
            })
            .catch(function() {
                $scope.userMessage = 'Error al crear el usuario';
            });
    };

    /*
     * Activa el modo edición para un usuario.
     */
    $scope.editUser = function(user) {
        $scope.editingUser = angular.copy(user);
        $scope.editingUser.password = '';
        $scope.userMessage = '';
    };

    /*
     * Cancela la edición de usuario.
     */
    $scope.cancelUserEdit = function() {
        $scope.editingUser = null;
    };

    /*
     * Guarda los cambios de un usuario editado.
     */
    $scope.updateUser = function() {
        $scope.userMessage = '';

        apiService.updateUser(
            token,
            $scope.editingUser.id,
            $scope.editingUser
        )
            .then(function() {
                $scope.editingUser = null;
                $scope.userMessage = 'Usuario modificado correctamente';
                $scope.loadUsers();
            })
            .catch(function() {
                $scope.userMessage = 'Error al modificar el usuario';
            });
    };

    /*
     * Elimina un usuario.
     *
     * El backend no permite eliminar el usuario autenticado.
     */
    $scope.deleteUser = function(user) {
        const confirmed = confirm(
            '¿Seguro que quieres eliminar el usuario "' + user.username + '"?'
        );

        if (!confirmed) {
            return;
        }

        $scope.userMessage = '';

        apiService.deleteUser(token, user.id)
            .then(function() {
                $scope.userMessage = 'Usuario eliminado correctamente';
                $scope.loadUsers();
            })
            .catch(function() {
                $scope.userMessage = 'Error al eliminar el usuario';
            });
    };

    /*
     * Carga todas las categorías desde la API REST.
     *
     * Llama al servicio:
     * GET /api/categories
     */
    $scope/*
     * Cargo las categorías para administrarlas desde el panel.
     */
    .loadCategories = function() {
        apiService.getCategories(token)
            .then(function(response) {
                $scope.categories = response.data;
            })
            .catch(function() {
                $scope.categoryMessage = 'Error al cargar las categorías';
            });
    };

    /*
     * Carga todos los vídeos desde la API REST.
     *
     * Llama al servicio:
     * GET /api/videos
     */
    $scope/*
     * Cargo los vídeos para administrarlos desde el panel.
     *
     * El listado incluye la categoría asociada para poder verificar que cada
     * vídeo pertenece a una categoría.
     */
    .loadVideos = function() {
        apiService.getVideos(token)
            .then(function(response) {
                $scope.videos = response.data;
            })
            .catch(function() {
                $scope.videoMessage = 'Error al cargar los vídeos';
            });
    };

    /*
     * Crea una nueva categoría.
     *
     * La vista escribirá el nombre en:
     * newCategory.name
     */
    $scope.createCategory = function() {
        $scope.categoryMessage = '';

        apiService.createCategory(token, $scope.newCategory)
            .then(function() {
                $scope.newCategory = {};
                $scope.categoryMessage = 'Categoría creada correctamente';
                $scope.loadCategories();
            })
            .catch(function() {
                $scope.categoryMessage = 'Error al crear la categoría';
            });
    };

    /*
     * Activa el modo edición para una categoría.
     *
     * angular.copy() crea una copia del objeto.
     * Así no modificamos directamente la tabla mientras el usuario escribe.
     */
    $scope.editCategory = function(category) {
        $scope.editingCategory = angular.copy(category);
        $scope.categoryMessage = '';
    };

    /*
     * Cancela la edición de categoría.
     */
    $scope.cancelCategoryEdit = function() {
        $scope.editingCategory = null;
    };

    /*
     * Guarda los cambios de una categoría editada.
     */
    $scope.updateCategory = function() {
        $scope.categoryMessage = '';

        apiService.updateCategory(
            token,
            $scope.editingCategory.id,
            $scope.editingCategory
        )
            .then(function() {
                $scope.editingCategory = null;
                $scope.categoryMessage = 'Categoría modificada correctamente';
                $scope.loadCategories();
                $scope.loadVideos();
            })
            .catch(function() {
                $scope.categoryMessage = 'Error al modificar la categoría';
            });
    };

    /*
     * Elimina una categoría.
     *
     * Si la categoría tiene vídeos asociados, el backend los elimina también
     * por la relación ON DELETE CASCADE definida en SQLite.
     */
    $scope.deleteCategory = function(category) {
        const confirmed = confirm(
            '¿Seguro que quieres eliminar la categoría "' + category.name + '"?'
        );

        if (!confirmed) {
            return;
        }

        $scope.categoryMessage = '';

        apiService.deleteCategory(token, category.id)
            .then(function() {
                $scope.categoryMessage = 'Categoría eliminada correctamente';
                $scope.loadCategories();
                $scope.loadVideos();
            })
            .catch(function() {
                $scope.categoryMessage = 'Error al eliminar la categoría';
            });
    };

    /*
     * Crea un nuevo vídeo asociado a una categoría.
     *
     * La vista escribirá:
     * newVideo.name
     * newVideo.url
     * newVideo.category_id
     */
    $scope.createVideo = function() {
        $scope.videoMessage = '';

        apiService.createVideo(token, $scope.newVideo)
            .then(function() {
                $scope.newVideo = {};
                $scope.videoMessage = 'Vídeo creado correctamente';
                $scope.loadVideos();
            })
            .catch(function() {
                $scope.videoMessage = 'Error al crear el vídeo';
            });
    };

    /*
     * Activa el modo edición para un vídeo.
     */
    $scope.editVideo = function(video) {
        $scope.editingVideo = angular.copy(video);
        $scope.videoMessage = '';
    };

    /*
     * Cancela la edición de vídeo.
     */
    $scope.cancelVideoEdit = function() {
        $scope.editingVideo = null;
    };

    /*
     * Guarda los cambios de un vídeo editado.
     */
    $scope.updateVideo = function() {
        $scope.videoMessage = '';

        apiService.updateVideo(
            token,
            $scope.editingVideo.id,
            $scope.editingVideo
        )
            .then(function() {
                $scope.editingVideo = null;
                $scope.videoMessage = 'Vídeo modificado correctamente';
                $scope.loadVideos();
            })
            .catch(function() {
                $scope.videoMessage = 'Error al modificar el vídeo';
            });
    };

    /*
     * Elimina un vídeo.
     */
    $scope.deleteVideo = function(video) {
        const confirmed = confirm(
            '¿Seguro que quieres eliminar el vídeo "' + video.name + '"?'
        );

        if (!confirmed) {
            return;
        }

        $scope.videoMessage = '';

        apiService.deleteVideo(token, video.id)
            .then(function() {
                $scope.videoMessage = 'Vídeo eliminado correctamente';
                $scope.loadVideos();
            })
            .catch(function() {
                $scope.videoMessage = 'Error al eliminar el vídeo';
            });
    };

    /*
     * Carga inicial de datos al entrar al panel.
     *
     * Cuando AdminController se activa, se cargan automáticamente
     * categorías y vídeos.
     */
    $scope.loadUsers();
    $scope.loadCategories();
    $scope.loadVideos();
   
   
        /*
     * Función de cierre de sesión.
     *
     * Se ejecuta desde la vista con:
     * ng-click="logout()"
     */
    $scope.logout = function() {
        /*
         * Se avisa al backend para que elimine la sesión de la base de datos.
         */
        apiService.logout(token)
            /*
             * finally() se ejecuta tanto si el servidor responde bien
             * como si se produce algún error.
             *
             * De este modo, el usuario siempre queda desconectado
             * en el navegador.
             */
            .finally(function() {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                $location.path('/');
            });
    };
});
/*
 * Controlador de la vista de usuario normal.
 *
 * Se asocia a la vista:
 * frontend/views/user.html
 *
 * Cumple la parte opcional del enunciado:
 * - el usuario normal inicia sesión;
 * - se usa el token/session_id guardado en localStorage;
 * - se consultan categorías y vídeos mediante la API REST;
 * - los vídeos se muestran agrupados por categoría;
 * - de cada vídeo se muestra el nombre y la URL.
 */
angular.module('CatalogoApp')
/*
 * Gestiono la vista de usuario normal.
 *
 * Esta parte cubre el opcional del enunciado. Cargo categorías y vídeos desde
 * la API REST usando el token de sesión y agrupo los vídeos debajo de su
 * categoría correspondiente.
 */
.controller('UserController', function($scope, $location, apiService) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    $scope.usuario = null;
    $scope.categories = [];
    $scope.videos = [];
    $scope.categoriesWithVideos = [];
    $scope.error = '';

    if (!token || !usuarioGuardado) {
        $location.path('/');
        return;
    }

    try {
        $scope.usuario = JSON.parse(usuarioGuardado);
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('session_id');
        localStorage.removeItem('usuario');
        $location.path('/');
        return;
    }

    /*
     * Agrupa los vídeos por categoría.
     *
     * El backend devuelve:
     * - categorías con id y name;
     * - vídeos con category_id.
     *
     * Esta función construye una estructura cómoda para la vista:
     * cada categoría contiene su array de vídeos.
     */
    /*
     * Construyo la estructura agrupada que necesita la vista user.html.
     *
     * Recorro las categorías y, para cada una, filtro los vídeos que tienen
     * el mismo category_id. Así muestro una sección por categoría con sus vídeos.
     */
    function buildCategoriesWithVideos() {
        $scope.categoriesWithVideos = $scope.categories.map(function(category) {
            const videosOfCategory = $scope.videos.filter(function(video) {
                return Number(video.category_id) === Number(category.id);
            });

            return {
                id: category.id,
                name: category.name,
                description: category.description,
                videos: videosOfCategory
            };
        });
    }

    /*
     * Carga categorías y vídeos usando el token/session_id.
     */
    $scope/*
     * Cargo el contenido del usuario normal.
     *
     * Primero pido categorías y después vídeos. Cuando tengo ambos conjuntos,
     * construyo la agrupación que se muestra en pantalla.
     */
    .loadUserContent = function() {
        apiService.getCategories(token)
            .then(function(categoriesResponse) {
                $scope.categories = categoriesResponse.data;
                return apiService.getVideos(token);
            })
            .then(function(videosResponse) {
                $scope.videos = videosResponse.data;
                buildCategoriesWithVideos();
            })
            .catch(function() {
                $scope.error = 'Error al cargar las categorías y vídeos';
            });
    };

    /*
     * Cierra sesión.
     *
     * El backend elimina la sesión y después el cliente borra localStorage.
     */
    $scope.logout = function() {
        apiService.logout(token)
            .finally(function() {
                localStorage.removeItem('token');
                localStorage.removeItem('session_id');
                localStorage.removeItem('usuario');
                $location.path('/');
            });
    };

    $scope.loadUserContent();
});
