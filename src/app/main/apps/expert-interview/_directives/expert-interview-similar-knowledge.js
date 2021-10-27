/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('expertInterviewSimilarKnowledge', expertInterviewSimilarKnowledge);
    /** @ngInject */
    function expertInterviewSimilarKnowledge(ExpertInterviewApi, ExpertInterviewService, Utils, logger, appConfig) {

        return {
            restrict: 'AE',
            scope: {
                smeid: '@'
            },
            controller: function ($scope, $rootScope) {
                $scope.loading = false;
                $scope.data = [];
                $scope.loadData = function () {
                    $scope.loading = true;
                    ExpertInterviewApi.getSimilarKnowledge($scope.smeid).then(function (response) {
                        $scope.loading = false;
                        $scope.data = response;
                    }, function (response) {
                        $scope.loading = false;
                        if (response.status !== 404)
                            logger.error(response.data.errorMessage);
                    });
                }
                $scope.loadData();
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/expert-interview-similar-knowledge.html',
            link: function (scope, element, attrs) {
            }
        };
    }
})();
