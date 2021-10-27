(function () {
  'use strict';

  angular
    .module('app.systemAdmin')
    .controller('SystemAdminController', SystemAdminController);

  /** @ngInject */
  function SystemAdminController($scope, $timeout, GamificationBadgeApi, CommonApi) {
    var vm = this;
  }
})();
