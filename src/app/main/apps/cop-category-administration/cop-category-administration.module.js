(function () {
    'use strict';
  
    angular
      .module('app.copCategory', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('appAdmin.copCategoryAdministration', {
        title: 'CoP Category',
        url: '/cop-category',
        views: {
          'content@appAdmin': {
            templateUrl: 'app/main/apps/cop-category-administration/cop-category-administration.html',
            controller: 'copCategoryAdministration as vm'
          }
        },
      });
  
    }
  
  })();
  