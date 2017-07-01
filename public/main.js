var app = angular.module('angulobby', ['ui.select','ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/home.html',
      access: { restricted: true }
    })
    .when('/login', {
      templateUrl: 'pages/login.html',
      controller: 'loginController',
      access: { restricted: false }
    })
    .when('/logout', {
      controller:  'logoutController',
      access: { restricted: true }
    })
    .when('/register', {
      templateUrl: 'pages/register.html',
      controller: 'registerController',
      access: { restricted: false }
    })
    .when('/contact', {
      templateUrl: 'pages/contact.html',
      access: {restricted: true }
    })
    .otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);

}]);

app.run(function($rootScope, $location, $route, AuthService) {
  $rootScope.$on('$routeChangeStart',
  function (event, next, current) {
    AuthService.getUserStatus()
      .then(function(){
        if (next.access.restricted && !AuthService.isLoggedIn()){
          $location.path('/login');
          $route.reload();
        }
      });
  });
});

