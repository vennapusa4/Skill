(function () {
    'use strict';
  
    angular
      .module('app.cop', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('app.copDirectory', {
        title: 'CoP Directory',
        url: '/cop-directory',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/cop-directory/cop-directory.html',
            controller: 'CopDirectoryController as vm'
          }
        },
      });
  
    }
  
  })();
  