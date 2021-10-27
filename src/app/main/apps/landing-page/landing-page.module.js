(function () {
    'use strict';
  
    angular
      .module('app.landingPage', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('app.LandingPageController', {
        title: 'Home',
        url: '/',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/landing-page/landing-page.html',
            controller: 'LandingPageController as vm'
          }
        },
      });

      $stateProvider.state('app.LandingPageConstructionController', {
        title: 'Under Construction',
        url: '/underconstruction',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/landing-page/underconstruction.html',
            controller: 'LandingPageConstructionController as vm'
          }
        },
      });
  
  
    }
  
  })();
  