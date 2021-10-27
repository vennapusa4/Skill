/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsTotalContributorsChart', insightsTotalContributorsChart);
    /** @ngInject */
    function insightsTotalContributorsChart() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                datainput: '=',
                typeselected: '@',
            },
            controller: function ($scope) {
                
            },
            templateUrl: 'app/main/apps/insights/_directives/people/insights-total-contributors-chart.html',
            link: function (scope, element, attrs) {
            }
        };
    }
})();
