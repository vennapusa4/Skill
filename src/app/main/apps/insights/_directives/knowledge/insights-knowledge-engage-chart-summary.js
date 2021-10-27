/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsKnowledgeEngageChartSummary', insightsKnowledgeEngageChartSummary);
    /** @ngInject */
    function insightsKnowledgeEngageChartSummary() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                data: '@',
                idx: '@'
            },
            controller: function ($scope, appConfig, InsightsCommonService) {
                var arrColor = appConfig.arrColor;
                $scope.drawChart = function () {
                    var labels = [];
                    var datasets = [];
                    var maxValue = 0;
                    var dataInput = JSON.parse($scope.data);
                    _.each(dataInput.items, function (segment, index) {
                        var dataItem = [];
                        _.each(segment.items, function (item, idd) {
                            _.each(item.submissionChartResponses, function (c, idx) {
                                var isExists = _.findIndex(labels, function (label) {
                                    return label == c.timeDistance;
                                });
                                if (isExists == -1) {
                                    labels.push(c.timeDistance);
                                }
                                if (c.count > maxValue) {
                                    maxValue = c.count;
                                }
                                dataItem.push(c.count);
                            });
                        })
                        datasets.push({
                            data: dataItem,
                            borderColor: arrColor[index],
                            fill: false,
                            pointRadius: 0,
                            borderWidth: 2,
                            lineTension: 0,
                        });
                    });

                    // Chart 8
                    // The data for our dataset
                    var data8 = {
                        labels: labels,
                        datasets: datasets,

                    };
                    // Configuration options go here
                    var options8 = {
                        plugins: {
                            centerLabel: false   // disable plugin 'centerLabel' for this instance
                        },
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        tooltips: {
                            enabled: false
                        },
                        hover: {
                            mode: null
                        },
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false,
                                    drawBorder: false,
                                },
                                ticks: {
                                    maxRotation: 0,
                                    minRotation: 0,
                                },
                            }],
                            yAxes: [{
                                position: 'right',
                                ticks: {
                                    max: maxValue,
                                    min: 0,
                                    stepSize: maxValue / 4,
                                    callback: function (value, index, values) {
                                        if (value % (maxValue / 2) === 0) {
                                            return value.toLocaleString();
                                        } else {
                                            return ' ';
                                        }
                                    },
                                },

                                gridLines: {
                                    drawBorder: false,
                                },
                            }],
                        }
                    };

                    window.setTimeout(function () {
                        var idz = $scope.idx;
                        var ctx8 = $(idz).get(0).getContext('2d');
                        new Chart(ctx8, {
                            type: 'line',
                            data: data8,
                            options: options8
                        });
                    }, 1500);
                }
                $scope.drawChart();
                // Formar currency
                $scope.kmlFormatter = function (str) {
                    return InsightsCommonService.kmlFormatter(str);
                }
            },
            templateUrl: 'app/main/apps/insights/_directives/knowledge/insights-knowledge-engage-chart-summary.html',
        };
    }
})();
