(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillUser', skillUser);

  /** @ngInject */
  function skillUser() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        data: '=',
        hiddenimg:'='
      },
      templateUrl: 'app/main/directives/skill-user.html',
    };
  }
})();