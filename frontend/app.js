'use strict';

angular.module('CatalogoApp', ['ngRoute'])

.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        })
        .when('/admin', {
            templateUrl: 'views/admin.html',
            controller: 'AdminController'
        })
        .otherwise({
            redirectTo: '/'
        });
})

.factory('apiService', function($http) {
    const api = {};

    api.login = function(user, passwd) {
        return $http.post('/login', {
            user: user,
            passwd: passwd
        });
    };

    return api;
})

.controller('LoginController', function($scope, $location, apiService) {
    $scope.user = '';
    $scope.passwd = '';
    $scope.error = '';

    $scope.login = function() {
        $scope.error = '';

        apiService.login($scope.user, $scope.passwd)
            .then(function(response) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('usuario', JSON.stringify(response.data.user));

                $location.path('/admin');
            })
            .catch(function() {
                $scope.error = 'Usuario o contraseña incorrectos';
            });
    };
})

.controller('AdminController', function($scope, $location) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (!token || !usuarioGuardado) {
        $location.path('/');
        return;
    }

    $scope.usuario = JSON.parse(usuarioGuardado);

    $scope.logout = function() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        $location.path('/');
    };
});
