(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgeMain', KnowledgeMain);

  /** @ngInject */
  function KnowledgeMain($scope, CollectionApi, $log, logger, $state, $timeout) {
    $scope.$on("changePage", function (data, redirect) {
      $state.go(redirect);
    });
  }
  
})();
