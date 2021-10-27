/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.collection')
    .directive('newCollection', newCollection);

  /** @ngInject */
  function newCollection(CollectionApi, $log, logger, $state, $timeout) {
    return {
      restrict: 'AE',
      scope: {
        ngModel: '=data',
        onSaved: "&onSaved"
      },
      controller: function ($scope) {
        window.logger = logger;
        $scope.ngModel = $scope.ngModel || {};
        $scope.NewCollection = {};

        $scope.UploadedImage = function (data) {
          $scope.NewCollection.CoverImage = {
            id: data.id,
            result: data.result,
            name: data.name
          }
          $scope.NewCollection.coverImageId = data.id;
        }

        $scope.SaveCollection = function () {
          CollectionApi.createCollection($scope.NewCollection, function (response) {
            $scope.NewCollection = {};
            $log.info('Created collection successfully.');
            CollectionApi.closeForm("#CreateCollection");
            setTimeout(function () {

              $state.go('app.collectionDetailAdminNew', { id: response.id });
            }, 500);
          }, function (response) {
            logger.error(response.data.errorMessage);
          });
        };

        $scope.Cancel = function () {
          $scope.NewCollection = {};
        }
      },
      templateUrl: 'app/main/apps/collection/_directives/new-collection.html',
      link: function () {
        $timeout(function () {
          $('#CreateCollection').on('show.bs.modal', function () {
            $('#MobileMenu').collapse('hide');
          });
        }, 1000);
      }
    };
  }
})();
