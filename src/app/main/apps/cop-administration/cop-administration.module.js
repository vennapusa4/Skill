(function () {
  'use strict';

  angular
    .module('app.adminSetting', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    // State
    $stateProvider.state('appAdmin.copAdministration', {
      title: 'CoP Management',
      url: '/cop-administration',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/cop-administration/cop-administration.html',
          controller: 'CopAdministrationController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.copAdministrationAdd', {
      title: 'Add New CoP',
      url: '/cop-administration/add/{id}',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/cop-administration/cop-administration-add.html',
          controller: 'CopAdministrationAddController as vm'
        }
      },
    });

  }

})();
