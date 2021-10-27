/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillExpertProfileInfo', skillExpertProfileInfo);

    /** @ngInject */
    function skillExpertProfileInfo() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                expertInterviewId: '<',
            },
            controller: function ($scope, ExpertInterviewApi) {
                $scope.expertProfile = null;

                function _getExpertProfile() {
                    ExpertInterviewApi.getExpertProfileDetails($scope.expertInterviewId).then(function (response) {
                        $scope.expertProfile = response;
                    });
                };

                $scope.getExpertProfile = _getExpertProfile;
                $scope.getExpertProfile();

                // $scope.$on('UpdateStatus', function (event, data) {
                //     _getExpertProfile();
                // });
            },
            templateUrl: 'app/main/apps/expert-interview/_directives/skill-expert-profile-info.html',
        };
    }
})();
