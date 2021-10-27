/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillAddRemoveKnowledge', skillAddRemoveKnowledge);

  /** @ngInject */
  function skillAddRemoveKnowledge() {

    return {
      restrict: 'AE',
      scope: {
        data: '=',
        callback: '&'
      },
      controller: function ($rootScope, $scope, $stateParams, CollectionApi, UserProfileApi, $log, logger) {

        var collectionId = $stateParams.id;
        $scope.isSkip = $rootScope.userInfo.userAppConfiguration.isShowAddRemoveDialog;
        $scope.tryShowAddRemoveCollection = function (kdId) {
          if ($rootScope.userInfo.userAppConfiguration.isShowAddRemoveDialog == true) {
            $scope.element.find('.add-remove-collection-dlg').modal('show');
          }
          else {
            if ($scope.data.collectionId != null) {
              $scope.postRemoveFromCollection(kdId);
            }
            else {
              $scope.postAddToCollection(kdId);
            }
          }
        }
        // $stateParams
        $scope.postAddToCollection = function (kdId) {
          var datapost = {
            kdId: kdId,
            collectionId: collectionId,
            isSkip: $scope.isSkip
          };
          CollectionApi.addKdToCollection(datapost, function (response) {
            if (response.result == true) {
              $rootScope.userInfo.userAppConfiguration.isShowAddRemoveDialog = !$scope.isSkip;
              UserProfileApi.saveUserInfo($rootScope.userInfo);
              $log.info('Added knowledge to collections successfully.');
              $scope.element.find('.add-remove-collection-dlg').modal('hide');
              $scope.data.collectionId = collectionId;

              $scope.callback();
            } else {
              $log.info('Added knowledge to collections failed.');
              logger.error('Added knowledge to collections failed.');
            }
          }, function (response) {
            logger.error(response.data.errorMessage);
          });
        }

        $scope.postRemoveFromCollection = function (kdId) {
          var datapost = {
            kdId: kdId,
            collectionId: collectionId,
            isSkip: $scope.isSkip
          };
          CollectionApi.removeKdFromCollection(datapost, function (response) {
            if (response.result == true) {
              $rootScope.userInfo.userAppConfiguration.isShowAddRemoveDialog = !$scope.isSkip;
              UserProfileApi.saveUserInfo($rootScope.userInfo);
              $log.info('Removed knowledge from collection successfully.');
              $scope.element.find('.add-remove-collection-dlg').modal('hide');
              $scope.data.collectionId = null;

              $scope.callback();
            }
            else {
              $log.info('Added knowledge to collections failed.');
              logger.error('Added knowledge to collections failed.');
            }
          }, function (response) {
            logger.error(response.data.errorMessage);
          });
        }
      },
      templateUrl: 'app/main/directives/skill-add-remove-knowledge.html',
      link: function ($scope, $element) {

        var $scope = $scope;
        var $element = $($element);
        $scope.element = $element;
      }
    };
  }
})();
