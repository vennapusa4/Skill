/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('skillCollectionLandingpage', skillCollectionLandingpage);

    /** @ngInject */
    function skillCollectionLandingpage(CollectionApi, $log, logger) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
                articleID : '='
            },
            controller: function ($scope) {
                $scope.showAddToCollection = function (kdId) {
                    $scope.kdcollectionsModel = {};
                    $scope.kd_id = kdId;
                    CollectionApi.getCollectionsByKdId({ id: kdId }, function (response) {
                      $scope.kdcollectionsModel = response;
                      $scope.kdcollectionsModel.kd_id = kdId;
                      $log.info('Retrieved collections by knowledgeId successfully.');
                    },
                      function (response) {
                        logger.error(response.data.errorMessage);
                      });
                  }
          
                  $scope.SavedKdToColection = function () {
                    CollectionApi.closeForm("#AddCollection" + $scope.kd_id);
                    $scope.kdcollectionsModel = {};
                    //load lại icon ở đây
                    toastr.success('Added to collections', 'SKILL')
                  }
            
            },
            templateUrl: 'app/main/apps/landing-page/directives/skill-collection-landingpage.html',
        };
    }
})();
