/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillLoading', skillLoading);

    /** @ngInject */
    function skillLoading($http) {

        return {
            restrict: 'AE',
            scope: {},
            controller: function () {

            },
            templateUrl: 'app/main/directives/skill-loading.html',
            link: function (scope) {
                scope.show = false;
                scope.determinateValue = 0;
                scope.loading = function () {
                    scope.determinateValue = $http.pendingRequests.length;
                    return ($http.pendingRequests.length > 0);
                };

                scope.$watch(scope.loading, function (loading) {
                    scope.show = loading;
                });
            }
        };
    }
})();