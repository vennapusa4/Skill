/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsValueWasCreated', insightsValueWasCreated);
    /** @ngInject */
    function insightsValueWasCreated() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                isShowAll: '<'
            },
            controller: function ($scope, $filter, appConfig, InsightsCommonService, InsightsApi, $rootScope, $state) {
                // Declare variables
                var myChart;
                var myChart2;
                $scope.isFirstTimeToLoad = true;
                $scope.arrClass = appConfig.arrClass;
                $scope.arrColor = appConfig.arrColor;
                $scope.data = [];
                $scope.data2 = [];
                $scope.data3 = [];
                $scope.data4 = [];
                $scope.showDropdown = false;
                $scope.filter = "All";
                var xDate = new Date();
                var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
                var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
                $scope.fromDate = new Date(1, 1, 1900); //currentDate;
                $scope.toDate = new Date(); //lastDateInMonth;
                $scope.defaultFilter = "year";
                $scope.colorViewMoreTopReplications = 0;
                $scope.dataPopup = [];
                $scope.totalValue = 0;
                var dumpData = [{ "segmentType": 'All', "valueType": "CASH (Cash Generation)", "totalValue": 2800200, "potentialValue": 2800200, "valueRealised": 0, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 0 }, { "timeDistance": "Sep 15", "value": 0 }, { "timeDistance": "Sep 20", "value": 0 }, { "timeDistance": "Sep 25", "value": 0 }, { "timeDistance": "Sep 30", "value": 0 }, { "timeDistance": "Sep 35", "value": 0 }, { "timeDistance": "Sep 40", "value": 0 }] }, { "segmentType": 'All', "valueType": "SIMPLIFICATION (Cost Efficiency)", "totalValue": 90000000, "potentialValue": 0, "valueRealised": 90000000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 0 }, { "timeDistance": "Sep 15", "value": 0 }, { "timeDistance": "Sep 20", "value": 0 }, { "timeDistance": "Sep 25", "value": 0 }, { "timeDistance": "Sep 30", "value": 0 }, { "timeDistance": "Sep 35", "value": 0 }, { "timeDistance": "Sep 40", "value": 0 }] }, { "segmentType": 'All', "valueType": "PROJECT (Project Execution)", "totalValue": 501234400, "potentialValue": 500000400, "valueRealised": 1234000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 0 }, { "timeDistance": "Sep 15", "value": 0 }, { "timeDistance": "Sep 20", "value": 0 }, { "timeDistance": "Sep 25", "value": 0 }, { "timeDistance": "Sep 30", "value": 0 }, { "timeDistance": "Sep 35", "value": 0 }, { "timeDistance": "Sep 40", "value": 0 }] }, { "segmentType": 'All', "valueType": "TECHNOLOGY (Technology as Differentiator) ", "totalValue": 250000, "potentialValue": 0, "valueRealised": 250000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 0 }, { "timeDistance": "Sep 15", "value": 0 }, { "timeDistance": "Sep 20", "value": 200000 }, { "timeDistance": "Sep 25", "value": 0 }, { "timeDistance": "Sep 30", "value": 0 }, { "timeDistance": "Sep 35", "value": 0 }, { "timeDistance": "Sep 40", "value": 0 }] }, { "segmentType": 'All', "valueType": "Others", "totalValue": 391716575, "potentialValue": 300000000, "valueRealised": 91716575, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 0 }, { "timeDistance": "Sep 15", "value": 0 }, { "timeDistance": "Sep 20", "value": 0 }, { "timeDistance": "Sep 25", "value": 301320000 }, { "timeDistance": "Sep 30", "value": 20396565 }, { "timeDistance": "Sep 35", "value": 0 }, { "timeDistance": "Sep 40", "value": 0 }] }, { "segmentType": "ABC", "valueType": "CASH (Cash Generation)", "totalValue": 2800200, "potentialValue": 2800200, "valueRealised": 122232, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 17897 }, { "timeDistance": "Sep 15", "value": 6454 }, { "timeDistance": "Sep 20", "value": 998 }, { "timeDistance": "Sep 25", "value": 1234 }, { "timeDistance": "Sep 30", "value": 6453 }, { "timeDistance": "Sep 35", "value": 2323 }, { "timeDistance": "Sep 40", "value": 34334 }] }, { "segmentType": "ABC", "valueType": "SIMPLIFICATION (Cost Efficiency)", "totalValue": 90000000, "potentialValue": 655656, "valueRealised": 90000000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 1212 }, { "timeDistance": "Sep 15", "value": 2323 }, { "timeDistance": "Sep 20", "value": 545 }, { "timeDistance": "Sep 25", "value": 1993 }, { "timeDistance": "Sep 30", "value": 787 }, { "timeDistance": "Sep 35", "value": 232 }, { "timeDistance": "Sep 40", "value": 1212 }] }, { "segmentType": "ABC", "valueType": "PROJECT (Project Execution)", "totalValue": 501234400, "potentialValue": 500000400, "valueRealised": 1234000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 982 }, { "timeDistance": "Sep 15", "value": 1202 }, { "timeDistance": "Sep 20", "value": 4534 }, { "timeDistance": "Sep 25", "value": 12324 }, { "timeDistance": "Sep 30", "value": 8797 }, { "timeDistance": "Sep 35", "value": 1211 }, { "timeDistance": "Sep 40", "value": 2323 }] }, { "segmentType": "ABC", "valueType": "TECHNOLOGY (Technology as Differentiator) ", "totalValue": 250000, "potentialValue": 343456, "valueRealised": 250000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 542 }, { "timeDistance": "Sep 15", "value": 1234 }, { "timeDistance": "Sep 20", "value": 200000 }, { "timeDistance": "Sep 25", "value": 7654 }, { "timeDistance": "Sep 30", "value": 2121 }, { "timeDistance": "Sep 35", "value": 545 }, { "timeDistance": "Sep 40", "value": 123 }] }, { "segmentType": "ABC", "valueType": "Others", "totalValue": 391716575, "potentialValue": 300000000, "valueRealised": 91716575, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 54 }, { "timeDistance": "Sep 15", "value": 12 }, { "timeDistance": "Sep 20", "value": 34 }, { "timeDistance": "Sep 25", "value": 301320000 }, { "timeDistance": "Sep 30", "value": 20396565 }, { "timeDistance": "Sep 35", "value": 98 }, { "timeDistance": "Sep 40", "value": 112 }] }, { "segmentType": "XYZ", "valueType": "SIMPLIFICATION (Cost Efficiency)", "totalValue": 90000000, "potentialValue": 655656, "valueRealised": 90000000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 1212 }, { "timeDistance": "Sep 15", "value": 2323 }, { "timeDistance": "Sep 20", "value": 545 }, { "timeDistance": "Sep 25", "value": 1993 }, { "timeDistance": "Sep 30", "value": 787 }, { "timeDistance": "Sep 35", "value": 232 }, { "timeDistance": "Sep 40", "value": 1212 }] }, { "segmentType": "XYZ", "valueType": "PROJECT (Project Execution)", "totalValue": 501234400, "potentialValue": 500000400, "valueRealised": 1234000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 982 }, { "timeDistance": "Sep 15", "value": 1202 }, { "timeDistance": "Sep 20", "value": 4534 }, { "timeDistance": "Sep 25", "value": 12324 }, { "timeDistance": "Sep 30", "value": 8797 }, { "timeDistance": "Sep 35", "value": 1211 }, { "timeDistance": "Sep 40", "value": 2323 }] }, { "segmentType": "XYZ", "valueType": "CASH (Cash Generation)", "totalValue": 2800200, "potentialValue": 2800200, "valueRealised": 122232, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 17897 }, { "timeDistance": "Sep 15", "value": 6454 }, { "timeDistance": "Sep 20", "value": 998 }, { "timeDistance": "Sep 25", "value": 1234 }, { "timeDistance": "Sep 30", "value": 6453 }, { "timeDistance": "Sep 35", "value": 2323 }, { "timeDistance": "Sep 40", "value": 34334 }] }, { "segmentType": "XYZ", "valueType": "TECHNOLOGY (Technology as Differentiator) ", "totalValue": 250000, "potentialValue": 343456, "valueRealised": 250000, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 542 }, { "timeDistance": "Sep 15", "value": 1234 }, { "timeDistance": "Sep 20", "value": 200000 }, { "timeDistance": "Sep 25", "value": 7654 }, { "timeDistance": "Sep 30", "value": 2121 }, { "timeDistance": "Sep 35", "value": 545 }, { "timeDistance": "Sep 40", "value": 123 }] }, { "segmentType": "XYZ", "valueType": "Others", "totalValue": 391716575, "potentialValue": 300000000, "valueRealised": 91716575, "valueWasCreatedChartResponses": [{ "timeDistance": "Sep 10", "value": 54 }, { "timeDistance": "Sep 15", "value": 12 }, { "timeDistance": "Sep 20", "value": 34 }, { "timeDistance": "Sep 25", "value": 301320000 }, { "timeDistance": "Sep 30", "value": 20396565 }, { "timeDistance": "Sep 35", "value": 98 }, { "timeDistance": "Sep 40", "value": 112 }] }];

                function loadDataBaseLocalStorage(isSave) {
                    var segmentFromLocalStorage = localStorage.getItem("skillSegmentsSelected");
                    var segmentItems = {};
                    if (segmentFromLocalStorage != null) {
                        segmentItems = JSON.parse(segmentFromLocalStorage);
                    } else {
                        segmentItems.labelItemResponses = [InsightsCommonService.defaultAllUser()];
                    }
                    if ($scope.isFirstTimeToLoad) {
                        loadData(segmentItems.labelItemResponses, false);
                        $scope.isFirstTimeToLoad = false;
                    } else {
                        if (isSave) {
                            loadData(segmentItems.labelItemResponses, false);
                        }
                    }
                }
                loadDataBaseLocalStorage(false);

                // Segment Labels Changes
                $scope.$on('segmentLabelChanges', function (event, data) {
                    loadDataBaseLocalStorage(data.isSave);
                });

                // Switch mode
                $scope.$on('switchMode', function (event, data) {
                    var segmentItems = InsightsCommonService.getAllSegmentLabels();
                    $scope.isShowAll = data.isShowAll;
                    loadData(segmentItems.labelItemResponses, false);
                });

                // Filter by date
                $scope.filterDate = function (startDate, endDate, period) {
                    var segmentItems = InsightsCommonService.getAllSegmentLabels();
                    $scope.fromDate = startDate._d;
                    $scope.toDate = endDate._d;

                    $scope.defaultFilter = period;
                    var month = $scope.fromDate.getMonth() + 1;
                    var year = $scope.fromDate.getFullYear();
                    switch (period) {
                        case 'month': {
                            $scope.toDate = new Date(year, month, 0);
                            $scope.filter = month + "/" + year;
                            break;
                        }
                        case 'quarter': {
                            var quarter = InsightsCommonService.getQuarter($scope.fromDate);
                            $scope.toDate = new Date(year, quarter * 3, 0);
                            $scope.filter = "Quarter " + quarter;
                            break;
                        }
                        case 'year': {
                            $scope.toDate = new Date(year, 12, 0);
                            $scope.filter = "Year " + year;
                            break;
                        }
                        default:
                    }

                    // Reload data for top trending
                    loadData(segmentItems.labelItemResponses, false);

                    $scope.$apply(function () {
                        $scope.showDropdown = false;
                    });
                }

                // Load data
                function loadData(segmentItems, isViewMore) {
                    $scope.loading = true;

                    var input = {
                        type: '',
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        isEndorsed: !$scope.isShowAll,
                        segmentItems: segmentItems,
                        isViewMore: isViewMore
                    };

                    // Get Experience Value Chart data
                    $scope.data = [];
                    InsightsApi.getExperienceValue(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            _.each(data, function (item, index) {
                                item.isSelected = false;
                                if (index == 0) {
                                    item.isSelected = true;
                                    drawBigChart(item, 1);
                                }
                                $scope.totalValue += item.totalValue;
                            });
                            $scope.data = data;
                            drawSmallChart(data, 1);
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });

                    // Get Replication Value Chart data
                    $scope.data2 = [];
                    InsightsApi.getReplicationValue(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            _.each(data, function (item, index) {
                                item.isSelected = false;
                                if (index == 0) {
                                    item.isSelected = true;
                                    drawBigChart(item, 2);
                                }
                                $scope.totalValue += item.totalValue;
                            });
                            $scope.data2 = data;
                            drawSmallChart(data, 2);
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });

                    // Experience Value Breakdown data
                    $scope.data3 = [];
                    input.type = 'Experience';
                    InsightsApi.getExperienceValueBreakdown(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            var result = _.chain(data).groupBy("valueType").map(function (v, i) {
                                return {
                                    valueType: i,
                                    items: v
                                }
                            }).value();
                            _.each(result, function (item, index) {
                                var temp = _.chain(item.items).groupBy("segmentType").map(function (v, i) {
                                    return {
                                        segmentType: i,
                                        items: v
                                    }
                                }).value();
                                item = temp;
                                drawBreakdownChart(temp, index, 1);
                            });
                            $scope.data3 = result;
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });

                    // Replication Value Breakdown data
                    $scope.data4 = [];
                    input.type = 'Replication';
                    InsightsApi.getExperienceValueBreakdown(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            var result = _.chain(data).groupBy("valueType").map(function (v, i) {
                                return {
                                    valueType: i,
                                    items: v
                                }
                            }).value();
                            _.each(result, function (item, index) {
                                var temp = _.chain(item.items).groupBy("segmentType").map(function (v, i) {
                                    return {
                                        segmentType: i,
                                        items: v
                                    }
                                }).value();
                                item = temp;
                                drawBreakdownChart(temp, index, 2);
                            });
                            $scope.data4 = result;
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                // Formar currency
                $scope.kmlFormatter = function (str) {
                    return InsightsCommonService.kmlFormatter(str);
                }

                //
                $scope.selectedChartChange = function (indx) {
                    _.each($scope.data, function (item, index) {
                        item.isSelected = false;
                        if (index == indx) {
                            item.isSelected = true;
                            drawBigChart(item, 1);
                        }
                    });
                    var temp = $scope.data[0];
                    $scope.data[0] = $scope.data[indx];
                    $scope.data[indx] = temp;
                }

                //
                $scope.selectedChartChange2 = function (indx) {
                    _.each($scope.data2, function (item, index) {
                        item.isSelected = false;
                        if (index == indx) {
                            item.isSelected = true;
                            drawBigChart(item, 2);
                        }
                    });
                    var temp = $scope.data2[0];
                    $scope.data2[0] = $scope.data2[indx];
                    $scope.data2[indx] = temp;
                }

                //
                $scope.totalValueChart1 = "";
                $scope.totalValueChart2 = "";
                function drawBigChart(item, typeId) {
                    if (typeId == 1) {
                        $scope.totalValueChart1 = "RM " + $scope.kmlFormatter(item.totalValue)
                    }
                    if (typeId == 2) {
                        $scope.totalValueChart2 = "RM " + $scope.kmlFormatter(item.totalValue)
                    }
                    var arrColor = [];
                    var arrData = [];
                    var arrLabel = [];
                    if (item.valueTypeResponses == null || item.valueTypeResponses.length <= 0) {
                        return;
                    }
                    _.each(item.valueTypeResponses, function (x, idx) {
                        arrColor.push($scope.arrColor[idx]);
                        arrData.push(x.value);
                        var temp = x.typeName;
                        if (x.typeName != null && x.typeName.length > 15) {
                            temp = x.typeName.substring(0, 15) + "...";
                        }
                        arrLabel.push(temp);
                    });

                    var data7 = {
                        labels: arrLabel,
                        datasets: [{
                            backgroundColor: arrColor,
                            data: arrData,
                            borderWidth: 0,
                        }]
                    };
                    // Configuration options go here
                    var options7 = {
                        legend: { display: false },
                        maintainAspectRatio: false,
                    };
                    window.setTimeout(function () {
                        var ctx7 = $('#chart7-' + typeId).get(0).getContext('2d');
                        if (typeId == 1) {
                            if (myChart) {
                                myChart.destroy();
                            }
                            myChart = new Chart(ctx7, {
                                type: 'doughnut',
                                data: data7,
                                options: options7
                            });
                        }
                        if (typeId == 2) {
                            if (myChart2) {
                                myChart2.destroy();
                            }
                            myChart2 = new Chart(ctx7, {
                                type: 'doughnut',
                                data: data7,
                                options: options7
                            });
                        }
                    });
                }

                //
                function drawSmallChart(data, typeId) {
                    _.each(data, function (item, index) {
                        var arrData = [];
                        var arrLabel = [];
                        _.each(item.valueWasCreatedChartResponses, function (x, idx) {
                            arrData.push(x.value);
                            arrLabel.push(x.timeDistance);
                        });

                        // Chart 4
                        // The data for our dataset
                        var data4 = {
                            labels: arrLabel,
                            datasets: [{
                                backgroundColor: '#f2f1fa',
                                borderWidth: 2,
                                borderColor: $scope.arrColor[index],
                                pointRadius: 0,
                                data: arrData,
                            }]
                        };
                        // Configuration options go here
                        var options4 = {
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
                        window.setTimeout(function () {
                            var ctx4 = $('#chart4-' + typeId + '-' + index).get(0).getContext('2d');
                            new Chart(ctx4, {
                                type: 'line',
                                data: data4,
                                options: options4
                            });
                        });
                    });
                }

                function drawBreakdownChart(data, index, typeId) {
                    _.each(data, function (x, i) {
                        _.each(x.items, function (item, idx) {
                            var labels = [];
                            var values = [];

                            _.each(item.valueWasCreatedChartResponses, function (y, k) {
                                labels.push(y.valueType);
                                values.push(y.value);
                            });

                            // The data for our dataset
                            var data4 = {
                                labels: labels,
                                datasets: [{
                                    backgroundColor: '#f2f1fa',
                                    borderWidth: 2,
                                    borderColor: '#615e99',
                                    pointRadius: 0,
                                    data: values,
                                }]
                            };
                            // Configuration options go here
                            var options4 = {
                                plugins: {
                                    centerLabel: false
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


                            window.setTimeout(function () {
                                if (typeId == 2) {
                                    ctx4 = $('#chart5-' + index + '-' + i).get(0).getContext('2d');
                                    new Chart(ctx4, {
                                        type: 'line',
                                        data: data4,
                                        options: options4
                                    });
                                } else {
                                    var ctx4 = $('#chart4-' + index + '-' + i).get(0).getContext('2d');
                                    new Chart(ctx4, {
                                        type: 'line',
                                        data: data4,
                                        options: options4
                                    });
                                }
                            });

                        });
                    })
                }

                $scope.$on('globalFilterDateChange', function (event, args) {
                    var data = args.any;
                    $scope.fromDate = data.fromDate;
                    $scope.toDate = data.toDate;
                    $scope.defaultFilter = data.defaultFilter;
                    $scope.filter = data.label;

                    var segmentItems = InsightsCommonService.getAllSegmentLabels();
                    loadData(segmentItems.labelItemResponses, false);
                    $rootScope.$broadcast('globalFilterDateChangeSuccess');
                });

                // DatNT38 - Remove date filter
                $scope.removeFilter = function (type) {
                    $scope.fromDate = new Date(1, 1, 1900);
                    $scope.toDate = new Date();
                    $scope.defaultFilter = "year";
                    $scope.filter = "All";
                    $scope.showDropdown = false;
                    var segmentItems = InsightsCommonService.getAllSegmentLabels();
                    loadData(segmentItems.labelItemResponses, false);
                    $(".range_filter").find('.start-date:first').removeClass('start-date');
                }

                $scope.applyFilterValue = function () {
                    $rootScope.isShowValue = true;
                    $state.go('app.knowledgeDiscovery.allKnowledge');
                }
            },
            templateUrl: 'app/main/apps/insights/_directives/value/insights-value-was-created.html',
        };
    }
})();
