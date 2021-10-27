(function () {
    'use strict';
  
    angular
      .module('app.abbreviation', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('app.Abbreviation', {
        title: 'Abbreviation',
        url: '/abbreviation?:id',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/abbreviation/abbreviation.html',
            controller: 'AbbreviationController as vm'
          }
        },
      });
      
    }
  
  })();
  