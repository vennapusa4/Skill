(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .controller('BulkUploadCompletedController', BulkUploadCompletedController);

    /** @ngInject */
    function BulkUploadCompletedController($scope, $stateParams) {
        var vm = this;
        $scope.Type = decodeURIComponent($stateParams.type);
        $scope.Knowledge = angular.fromJson(localStorage['bulk-upload-complete']);
        $scope.$on("changePage", function (data, redirect) {
            $scope.redirecting = redirect;
            $timeout(function () {
              $('#redirectPosting').modal('show');
            }, 500);
          });
      
          $scope.confirmRedirect = function () {
            $('#redirectPosting').modal('hide');
            $timeout(function () {
              $state.go($scope.redirecting);
            }, 500);
          }
    }
})();