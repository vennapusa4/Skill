/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('expertInterviewSimilar', expertInterviewSimilar);
    /** @ngInject */
    function expertInterviewSimilar(ExpertInterviewApi, logger) {

        return {
            restrict: 'AE',
            scope: {
                expertInterviewId: '<'
            },
            controller: function ($scope) {
                $scope.data = [];

                var _loadData = function () {
                    ExpertInterviewApi.getSimilar($scope.expertInterviewId).then(function (response) {
                        $scope.data = response;
                    }, function (response) {
                        if (response.status !== 404)
                            logger.error(response.data.errorMessage);
                    });
                }

                $scope.loadData = _loadData;
                _loadData();
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/expert-interview-similar.html',
        };
    }
})();
