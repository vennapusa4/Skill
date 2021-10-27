/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillPendingActionBox', skillPendingActionBox);

    /** @ngInject */
    function skillPendingActionBox() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/directives/skill-pending-action-box.html',
        };
    }
})();