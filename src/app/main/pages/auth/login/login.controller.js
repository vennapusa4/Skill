(function () {
    'use strict';

    angular
        .module('app.pages.auth.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
  function LoginController(appConfig, $window, $state, $http, AccountApi, $cookies
  ) {
    var vm = this;
    vm.isValid = true;
    vm.loading = false;

    vm.domains = [{ 'id': 1, 'name': 'PETRONAS' }];
  }     
})();
