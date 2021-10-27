/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillPopularSearches', skillPopularSearches);

    /** @ngInject */
    function skillPopularSearches() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/apps/home/directives/skill-popular-searches.html',
        };
    }
})();