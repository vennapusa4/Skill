/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillAccordionBox', skillAccordionBox);

    /** @ngInject */
    function skillAccordionBox() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/directives/skill-accordion-box.html',
        };
    }
})();