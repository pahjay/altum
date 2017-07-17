/**
 * Created by dev on 7/5/2017.
 */
angular.module('angulobby').controller('indexController',
['$scope', '$http', 'AuthService', 'socket', function( $scope, $http, AuthService, socket) {
  var init = function() {
    AuthService.getUserStatus()
      .then(function(response) {
        if (response.isAuthenticated) {
          // add user to user map, if user already exists, add socket
          socket.emit('add-user', response.username);
        } else {
          // user not authenticated, do nothing
        }
      })
      .catch(function(response) {
        // TODO
      });
  };
  init();
}]);
