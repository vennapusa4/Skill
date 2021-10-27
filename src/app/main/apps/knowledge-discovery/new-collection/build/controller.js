(function () {
  'use strict';

  angular
    .module('app.knowledgeDiscovery')
    .controller('KnowledgeNewCollectionBuildController', KnowledgeNewCollectionBuildController);

  /** @ngInject */
  function KnowledgeNewCollectionBuildController($scope, CollectionApi, $log, logger, $state, $timeout) {
    var vm = this;
    $scope.ngModel = $scope.ngModel || {};
        $scope.NewCollection = {};
        $scope.showImageError = false;
      $scope.knowledgetype = "Collections";
        $scope.UploadedImage = function (data) {
          $scope.NewCollection.CoverImage = {
            id: data.id,
            result: data.result,
            name: data.name
          }
          $scope.NewCollection.coverImageId = data.id;
          if($scope.NewCollection.coverImageId != null){
            $scope.showImageError = false;
          }
        }
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

        $scope.SaveCollection = function (event) {

          event.preventDefault();
          if($scope.NewCollection.CoverImage == undefined){
            $scope.showImageError = true;
            return
          }
          else{
            $scope.showImageError = false;
          }

            CollectionApi.createCollection($scope.NewCollection, function (response) {
              $scope.NewCollection = {};
              $log.info('Created collection successfully.');
              CollectionApi.closeForm("#CreateCollection");
              setTimeout(function () {
  
                $state.go('app.SearchPage.collection');
              }, 500);
            }, function (response) {
              logger.error(response.data.errorMessage);
            });
          
      
        };

        $scope.Cancel = function () {
          $scope.NewCollection = {};
        }
  }
  
})();
