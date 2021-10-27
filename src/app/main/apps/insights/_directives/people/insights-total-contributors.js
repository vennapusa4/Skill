/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsTotalContributors', insightsTotalContributors);
    /** @ngInject */
    function insightsTotalContributors() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($scope, $filter, appConfig, InsightsCommonService, InsightsApi, $rootScope) {
                // Declare variables
                $scope.arrClass = appConfig.arrClass;
                $scope.arrColor = appConfig.arrColor;

                $scope.isFirstTimeToLoad = true;
                $scope.data = [];
                $scope.showDropdown = false;
                $scope.filter = "All";
                var xDate = new Date();
                var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
                var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
                $scope.fromDate = new Date(1, 1, 1900); //currentDate;
                $scope.toDate = new Date(); //lastDateInMonth;
                $scope.defaultFilter = "year";

                $scope.userPercent = 0;
                $scope.smePercent = 0;
                $scope.totalBigChart = 0;
                $scope.userTotalCount = 0;
                $scope.smeTotalCount = 0;

                // View All
                $scope.viewAll = function (item) {
                    InsightsCommonService.applyFilter(
                        $filter('date')($scope.fromDate, "yyyy-MM-dd"),
                        $filter('date')($scope.toDate, "yyyy-MM-dd"),
                        item.segmentFilter);
                }

                $scope.goAllKnowledge = function () {
                    $state.go('app.knowledgeDiscovery.allKnowledge');
                }

                $scope.countTotal = function (items, isSME) {
                    if (isSME) {
                        var smeItems = _.filter(items, function (o) { return o.isSME; });
                        var totalSME = _.sumBy(smeItems, function (o) { return o.totalCount; });
                        return totalSME;
                    }

                    var totalAll = _.sumBy(items, function (o) { return o.totalCount; });
                    return totalAll;
                }

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
                    $scope.data = [];

                    //var dumpData = [{ "segmentType": 'All', "issme": true, "totalCount": 123521, "totalContributorsChartResponses": [{ "timeDistance": "Sep 1", "count": 1212 }, { "timeDistance": "Sep 6", "count": 232 }, { "timeDistance": "Sep 11", "count": 12 }, { "timeDistance": "Sep 16", "count": 89 }, { "timeDistance": "Sep 21", "count": 421 }, { "timeDistance": "Sep 26", "count": 232 }, { "timeDistance": "Sep 30", "count": 12 }] }, { "segmentType": 'All', "issme": false, "totalCount": 17667689, "totalContributorsChartResponses": [{ "timeDistance": "Sep 1", "count": 23 }, { "timeDistance": "Sep 6", "count": 435 }, { "timeDistance": "Sep 11", "count": 12189 }, { "timeDistance": "Sep 16", "count": 12 }, { "timeDistance": "Sep 21", "count": 323 }, { "timeDistance": "Sep 26", "count": 5454 }, { "timeDistance": "Sep 30", "count": 5656 }] }, { "segmentType": "Engineering", "issme": true, "totalCount": 9765, "totalContributorsChartResponses": [{ "timeDistance": "Sep 1", "count": 121 }, { "timeDistance": "Sep 6", "count": 232 }, { "timeDistance": "Sep 11", "count": 545 }, { "timeDistance": "Sep 16", "count": 121 }, { "timeDistance": "Sep 21", "count": 323 }, { "timeDistance": "Sep 26", "count": 43 }, { "timeDistance": "Sep 30", "count": 998 }] }, { "segmentType": "Engineering", "issme": false, "totalCount": 144457, "totalContributorsChartResponses": [{ "timeDistance": "Sep 1", "count": 12 }, { "timeDistance": "Sep 6", "count": 78 }, { "timeDistance": "Sep 11", "count": 190 }, { "timeDistance": "Sep 16", "count": 323 }, { "timeDistance": "Sep 21", "count": 554 }, { "timeDistance": "Sep 26", "count": 121 }, { "timeDistance": "Sep 30", "count": 78 }] }, { "segmentType": "Instrumentation and Control", "issme": true, "totalCount": 89787, "totalContributorsChartResponses": [{ "timeDistance": "Sep 1", "count": 889 }, { "timeDistance": "Sep 6", "count": 78 }, { "timeDistance": "Sep 11", "count": 189 }, { "timeDistance": "Sep 16", "count": 91 }, { "timeDistance": "Sep 21", "count": 433 }, { "timeDistance": "Sep 26", "count": 12 }, { "timeDistance": "Sep 30", "count": 222 }] }, { "segmentType": "Instrumentation and Control", "issme": false, "totalCount": 175645, "totalContributorsChartResponses": [{ "timeDistance": "Sep 1", "count": 121 }, { "timeDistance": "Sep 6", "count": 88 }, { "timeDistance": "Sep 11", "count": 122 }, { "timeDistance": "Sep 16", "count": 90 }, { "timeDistance": "Sep 21", "count": 78 }, { "timeDistance": "Sep 26", "count": 998 }, { "timeDistance": "Sep 30", "count": 29 }] }];
                    //var result = _.chain(dumpData).groupBy("segmentType").map(function (v, i) {
                    //  return {
                    //    segmentType: i,
                    //    items: v
                    //  }
                    //}).value();

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        segmentItems: segmentItems,
                        isViewMore: isViewMore
                    };
                    InsightsApi.getPeopleTotalContributors(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
                                return {
                                    segmentType: i,
                                    items: v
                                }
                            }).value();
                            $scope.data = result;
                            $scope.drawBigChart('All');
                            drawSmallCharts();
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                function drawSmallCharts() {
                    _.each($scope.data, function (item, index) {
                        _.each(item.items, function (x, idx) {
                            var labels = [];
                            var dataChart = [];
                            _.each(x.totalContributorsChartResponses, function (y, ix) {
                                labels.push(y.timeDistance);
                                dataChart.push(y.count);
                            });
                            // Chart 6
                            // The data for our dataset
                            var data6 = {
                                labels: labels,
                                datasets: [{
                                    backgroundColor: '#f2f1fa',
                                    borderWidth: 2,
                                    borderColor: '#615e99',
                                    pointRadius: 0,
                                    data: dataChart,
                                }]
                            };
                            // Configuration options go here
                            var options6 = {
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

                            if (x.isSME) {
                                window.setTimeout(function () {
                                    var ctx6 = $('#chart6_2_' + index).get(0).getContext('2d');
                                    new Chart(ctx6, {
                                        type: 'line',
                                        data: data6,
                                        options: options6
                                    });
                                });
                            } else {
                                window.setTimeout(function () {
                                    var ctx6 = $('#chart6_1_' + index).get(0).getContext('2d');
                                    new Chart(ctx6, {
                                        type: 'line',
                                        data: data6,
                                        options: options6
                                    });
                                });
                            }
                        });
                    });
                }

                $scope.drawBigChart = function (type) {
                    $scope.userPercent = 0;
                    $scope.smePercent = 0;
                    $scope.totalBigChart = 0;
                    $scope.userTotalCount = 0;
                    $scope.smeTotalCount = 0;

                    type = type == "All" ? "All" : type;
                    var itemSelected = _.find($scope.data, { 'segmentType': type });
                    if (itemSelected != null) {
                        _.each(itemSelected.items, function (x, idx) {
                            $scope.totalBigChart += x.totalCount;
                            if (x.isSME) {
                                $scope.smeTotalCount += x.totalCount;
                            } else {
                                $scope.userTotalCount += x.totalCount;
                            }
                        });
                        $scope.userPercent = ($scope.totalBigChart != 0) ? (($scope.userTotalCount * 100) / $scope.totalBigChart).toFixed(3) : 0;
                        $scope.smePercent = ($scope.totalBigChart != 0) ? (($scope.smeTotalCount * 100) / $scope.totalBigChart).toFixed(3) : 0;

                        // Chart 5
                        Chart.pluginService.register({
                            id: 'centerLabel',
                            beforeDraw: function (chart) {
                                var width = chart.chart.width,
                                    height = chart.chart.height,
                                    ctx = chart.chart.ctx;

                                ctx.restore();
                                var fontSize = (height / 250).toFixed(2);
                                ctx.font = 16 + "px 'museo_sans',sans-serif";
                                ctx.textBaseline = "middle";
                                ctx.fillStyle = "#444444";

                                var text = $filter("number")($scope.totalBigChart),
                                    textX = (Math.round((width - ctx.measureText(text).width) / 2)).toFixed(3),
                                    textY = height / 2;

                                ctx.fillText(text, textX, textY);
                                ctx.save();
                            }
                        });

                        // The data for our dataset
                        var data5 = {
                            labels: ['Users', 'SME'],
                            datasets: [{
                                backgroundColor: ['#615e99', '#93bfeb'],

                                data: [$scope.userTotalCount, $scope.smeTotalCount],
                                borderWidth: 0,
                            }]
                        };
                        // Configuration options go here
                        var options5 = {
                            legend: { display: false },
                            maintainAspectRatio: true,
                            events: [],
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {

                                        var dataset = data.datasets[tooltipItem.datasetIndex];

                                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                            return previousValue + currentValue;
                                        });

                                        var currentValue = dataset.data[tooltipItem.index];

                                        var precentage = total != 0 ? (currentValue * 100 / total).toFixed(3) : 0;

                                        return precentage + "%";
                                    }
                                }
                            },
                            legendCallback: function (chart) {
                                var text = [];
                                text.push('<ul>');

                                var data = chart.data;
                                var datasets = data.datasets;
                                var labels = data.labels;

                                if (datasets.length) {
                                    for (var i = 0; i < datasets[0].data.length; ++i) {
                                        text.push('<li>');
                                        if (labels[i]) {

                                            // calculate percentage
                                            var total = datasets[0].data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                                return previousValue + currentValue;
                                            });
                                            var currentValue = datasets[0].data[i];
                                            var precentage = total != 0 ? (currentValue * 100 / total).toFixed(3) : 0;

                                            text.push('<strong style="color:' + datasets[0].backgroundColor[i] + '">' + precentage + '%' + '</strong> ' + labels[i] + ' ' + '<small>' + '(' + datasets[0].data[i] + ')' + ' </small>');
                                        }
                                        text.push('</li>');
                                    }
                                }
                                text.push('</ul>');
                                return text.join('');
                            },
                        };
                        window.setTimeout(function () {
                            $('.chart5').each(function () {
                                var ctx5 = $(this).get(0).getContext('2d');
                                var CustomLegend5 = new Chart(ctx5, {
                                    type: 'doughnut',
                                    data: data5,
                                    options: options5
                                });
                                $('.chart_legend').html(CustomLegend5.generateLegend());
                            });
                        });
                    }
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
            },
            templateUrl: 'app/main/apps/insights/_directives/people/insights-total-contributors.html',
        };
    }
})();
