(function () {
  'use strict';

  angular
    .module('app.collection', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {
    // State
    $stateProvider.state('app.collectionDetail', {
      title: 'Collection Detail',
      url: '/collection-detail/:id',
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/collection/collection-detail.html',
          controller: 'collectionDetailController as vm'
        }
      },
    });

    $stateProvider.state('app.collectionDetailAdminNew', {
      title: 'Collection Detail Admin New',
      url: '/collection-detail-admin-new/:id',
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/collection/collection-detail-admin-new.html',
          controller: 'collectionDetailAdminNewController as vm'
        }
      },
    });
  }

})();
