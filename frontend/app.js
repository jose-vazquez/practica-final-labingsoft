'use strict';

/*

* Se crea el módulo principal de AngularJS.
*
* Nombre del módulo: CatalogoApp
* Dependencia: ngRoute
*
* ngRoute permite crear una aplicación SPA, es decir,
* una aplicación con varias vistas sin recargar toda la página.
  */
  angular.module('CatalogoApp', ['ngRoute'])

/*

* Configuración de rutas de la aplicación.
*
* $routeProvider permite indicar qué vista HTML y qué controlador
* se cargan según la URL interna de AngularJS.
  */
  .config(function($routeProvider) {
  $routeProvider

  ```
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
    * Ruta por defecto.
    *
    * Si el usuario escribe una ruta no válida,
    * se le redirige automáticamente al login.
    */
   .otherwise({
       redirectTo: '/'
   });
  ```

})

/*

* Servicio AngularJS para comunicarse con la API REST.
*
* Se utiliza una factory porque necesitamos centralizar las llamadas
* HTTP al servidor NodeJS.
*
* Ventaja:
* Los controladores no construyen directamente las peticiones.
* Llaman a apiService y este se encarga de hablar con el backend.
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
  *
  * Este formato es habitual en APIs REST protegidas.
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
  * Si son correctos, devolverá:
  * * token
  * * datos del usuario
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
    api.logout = function(token) {
    return $http.put('/logout', {}, api.getAuthConfig(token));
    };

  /*

  * Petición de comprobación de API protegida.
  *
  * Llama a GET /api/ping enviando el token.
  *
  * Sirve para comprobar que:
  * * el token existe;
  * * el token está en la base de datos;
  * * el servidor acepta la sesión.
      */
      api.ping = function(token) {
      return $http.get('/api/ping', api.getAuthConfig(token));
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
* * los datos escritos en el formulario;
* * el envío del login;
* * el almacenamiento del token;
* * la redirección al panel de administración.
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
  * "Usuario o contraseña incorrectos"
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
          localStorage.setItem('token', response.data.token);

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
          $location.path('/admin');
          })

      /*

      * catch() se ejecuta si el backend devuelve error.
      *
      * Por ejemplo:
      * * credenciales incorrectas;
      * * servidor no disponible;
      * * error interno.
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
* * comprobación de sesión;
* * lectura del usuario autenticado;
* * validación del token contra el backend;
* * cierre de sesión.
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
