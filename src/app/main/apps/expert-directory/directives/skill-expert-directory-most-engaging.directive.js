/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertDirectory')
        .directive('skillExpertDirectoryMostEngaging', skillExpertDirectoryMostEngaging);

    /** @ngInject */
    function skillExpertDirectoryMostEngaging() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/apps/expert-directory/directives/skill-expert-directory-most-engaging.html',
        };
    }
})();