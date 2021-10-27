/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsPeopleEngageChart', insightsPeopleEngageChart);
    /** @ngInject */
    function insightsPeopleEngageChart() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                data: '@',
                idx: '@',
                indexx: '@'
            },
            controller: function ($scope, appConfig, InsightsCommonService) {
                $scope.drawChart = function () {
                    var arrColor = appConfig.arrColor;
                    var dataInput = JSON.parse($scope.data);
                    var labels = [];
                    var data = [];
                    _.each(dataInput, function (item, index) {
                        labels.push(item.timeDistance);
                        data.push(item.count);
                    });
                    var index = (parseInt($scope.indexx));
                    var colorBorder = arrColor[index];
                    // Chart 13
                    // The data for our dataset
                    var data13 = {
                        labels: labels,
                        datasets: [{
                            backgroundColor: '#f2f1fa',
                            borderWidth: 2,
                            borderColor: colorBorder,
                            pointRadius: 0,
                            data: data,
                        }]
                    };
                    // Configuration options go here
                    var options13 = {
                        plugins: {
                            centerLabel: false   // disable plugin 'centerLabel' for this instance
                        },
                        maintainAspectRatio: false,
                        legend: { display: false },
                        hover: { display: false },
                        scales: {
                            yAxes: [{
                                display: false,

                            }],
                            xAxes: [{
                                display: false,
                            }]
                        },
                    };
                    var idChart = $scope.idx;
                    window.setTimeout(function () {
                        var ctx13 = $(idChart).get(0).getContext('2d');
                        new Chart(ctx13, {
                            type: 'line',
                            data: data13,
                            options: options13
                        });
                    }, 1000);
                }
                $scope.drawChart();
                // Formar currency
                $scope.kmlFormatter = function (str) {
                    return InsightsCommonService.kmlFormatter(str);
                }
            },
            templateUrl: 'app/main/apps/insights/_directives/people/insights-people-engage-chart.html',
        };
    }
})();
