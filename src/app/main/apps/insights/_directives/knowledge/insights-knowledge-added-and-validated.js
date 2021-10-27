/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsKnowledgeAddedAndValidated', insightsKnowledgeAddedAndValidated);
    /** @ngInject */
    function insightsKnowledgeAddedAndValidated() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($scope, $rootScope, $filter, appConfig, InsightsCommonService, InsightsApi) {
                // Declare variables
                $scope.isFirstTimeToLoad = true;
                $scope.arrClass = appConfig.arrClass;
                $scope.arrColor = appConfig.arrColor;
                $scope.dataKnowledgeAddedVsValidated = [];
                $scope.dataKnowledgeAddedVsValidatedChart = {};
                $scope.isChartLoaded = false;
                $scope.typeSelected = '';
                $scope.disciplineIds = [];
                $scope.showDropdown = false;
                $scope.filter = "All";
                var xDate = new Date();
                var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
                var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
                $scope.fromDate = new Date(1, 1, 1900); //currentDate;
                $scope.toDate = new Date(); //lastDateInMonth;
                $scope.defaultFilter = "year";
                $scope.colorViewMoreTopReplications = 0;

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

                    loadDataKnowledgeAddedVsValidated();

                    $scope.$apply(function () {
                        $scope.showDropdown = false;
                    });
                }

                // Load data
                $scope.allTypes = [];
                function loadDataKnowledgeAddedVsValidated() {
                    $scope.loading = true;
                    $scope.isChartLoaded = false;
                    $scope.dataKnowledgeAddedVsValidated = [];

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy")
                    };
                    InsightsApi.getKnowledgeAddedVsValidated(input).then(function (data) {
                        $scope.loading = false;
                        $scope.allTypes = [];
                        $scope.dataKnowledgeAddedVsValidated = [];
                        if (data != null) {
                            var tempData = [];
                            _.each(data, function (item, index) {
                                if (item.newKnowledgeItem != null && item.newKnowledgeItem.length > 0 && (item.newKnowledgeItem[0].added != 0 || item.newKnowledgeItem[0].validated != 0)) {
                                    tempData.push(item);
                                }
                            });
                            _.each(tempData, function (item, index) {
                                var isExists = _.findIndex($scope.allTypes, function (type, index2) {
                                    return type == item.type;
                                });
                                if (isExists == -1) {
                                    $scope.allTypes.push(item.type);
                                }

                                // Set default data for main chart
                                if ($scope.typeSelected == '' || $scope.typeSelected == 'All') {
                                    if (index == 0) {
                                        $scope.typeSelected = item.type;
                                    }
                                    if (item.type == $scope.typeSelected) {
                                        _.each(item.newKnowledgeItem, function (location, index2) {
                                            $scope.disciplineIds.push(location.disciplineId);
                                        });
                                    }
                                }
                            });
                            $scope.dataKnowledgeAddedVsValidated = tempData;

                            $rootScope.$broadcast('knowledgeAddedAndValidatedDrawChart', { data: tempData, type: $scope.typeSelected });

                            loadDataKnowledgeAddedVsValidatedChart();

                            window.setTimeout(function () {
                                if ($scope.typeSelected != '') {
                                    try {
                                        var tabIndex = _.findIndex($scope.allTypes, function (type, index2) {
                                            return $scope.typeSelected == item.type;
                                        });
                                        $('#added-validated-tabs #show-compare-' + tabIndex).tab('show');
                                        $('.tab-pane').removeClass('active');
                                        $('#Compare-' + tabIndex).addClass('active');
                                    } catch (e) {

                                    }
                                }

                                //
                                $('.chkLocation').change(function () {
                                    locationsSelectedChange();
                                });
                            }, 1500);
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }
                loadDataKnowledgeAddedVsValidated();

                // Load data for chart
                function loadDataKnowledgeAddedVsValidatedChart() {
                    if ($scope.dataKnowledgeAddedVsValidated == null || $scope.dataKnowledgeAddedVsValidated.length <= 0) {
                        return;
                    }
                    $scope.loading = true;
                    $scope.dataKnowledgeAddedVsValidatedChart = {};

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        type: $scope.typeSelected,
                        disciplineIds: $scope.disciplineIds
                    };
                    InsightsApi.getKnowledgeAddedVsValidatedChart(input).then(function (data) {
                        $scope.loading = false;
                        // Chart 32
                        // The data for our dataset
                        var minValue = 0;
                        var maxValue = 0;

                        var pointRadiusAdded = [];
                        var pointRadiusValidated = [];
                        var addedOrderArr = [];
                        var validatedOrderArr = [];

                        _.each(data.added, function (item, index) {
                            if (item > maxValue) {
                                maxValue = item;
                            }
                            if (item < minValue) {
                                minValue = item;
                            }
                            addedOrderArr.push(item);
                        });
                        _.each(data.validated, function (item, index) {
                            if (item > maxValue) {
                                maxValue = item;
                            }
                            if (item < minValue) {
                                minValue = item;
                            }
                            validatedOrderArr.push(item);
                        });

                        addedOrderArr.sort(function (a, b) { return a - b });
                        validatedOrderArr.sort(function (a, b) { return a - b });
                        _.each(data.added, function (item, index) {
                            var idx = _.findIndex(addedOrderArr, function (value, index2) {
                                return item == value;
                            });
                            pointRadiusAdded.push(idx + 4);
                        });
                        _.each(data.validated, function (item, index) {
                            var idx = _.findIndex(validatedOrderArr, function (value, index2) {
                                return item == value;
                            });
                            pointRadiusValidated.push(idx + 8);
                        });

                        var data32 = {
                            labels: data.months,
                            datasets: [{
                                label: "Pending validation",
                                data: data.added,
                                backgroundColor: '#fcd202',
                                fill: false,
                                pointRadius: pointRadiusAdded,
                                showLine: false,
                                pointStyle: 'circle',
                            }, {
                                label: "Validated ",
                                data: data.validated,
                                backgroundColor: '#b0de09',
                                fill: false,
                                pointRadius: pointRadiusValidated,
                                showLine: false,
                                pointStyle: 'rectRot',
                            }]
                        };
                        // Configuration options go here
                        var options32 = {
                            maintainAspectRatio: false,
                            plugins: {
                                centerLabel: false   // disable plugin 'centerLabel' for this instance
                            },
                            legend: {
                                display: true,
                            },
                            //legend: {
                            //  display: false
                            //},
                            //tooltips: {
                            //  enabled: false
                            //},
                            //hover: {
                            //  mode: null
                            //},
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        maxRotation: 0,
                                        minRotation: 0,
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        max: maxValue + 10,
                                        min: minValue,
                                        stepSize: (maxValue + 10) / data.added.length,
                                    }
                                }],
                            }
                        };

                        window.setTimeout(function () {
                            $('#Chart32').remove();
                            $('#the-big-chart').append('<canvas id="Chart32" width="708" height="330" class="chartjs-render-monitor" style="display: block; width: 708px; height: 330px;"></canvas>');
                            var ctx32 = $('#Chart32').get(0).getContext('2d');
                            new Chart(ctx32, {
                                type: 'line',
                                data: data32,
                                options: options32
                            });
                            $scope.$apply(function () {
                                $scope.isChartLoaded = true;
                            });
                        }, 2000);
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }
                $scope.setTabActive = function (index) {
                    return index == 0 ? "active" : "";
                }
                // Tab Change event
                $scope.tabChanged = function (type, index) {
                    if (type != $scope.typeSelected) {
                        $scope.typeSelected = type;
                        locationsSelectedChange();
                    }

                }

                function locationsSelectedChange() {
                    var locationSelectedArr = [];
                    $('.chkLocation:checked').each(function (index, location) {
                        if (location.name == $scope.typeSelected) {
                            locationSelectedArr.push(location.value);
                        }
                    });
                    try {
                        //$scope.$apply(function () {
                        $scope.disciplineIds = locationSelectedArr;
                        //});
                    } catch (e) {
                        $scope.disciplineIds = locationSelectedArr;
                    }
                    $scope.isChartLoaded = false;
                    loadDataKnowledgeAddedVsValidatedChart();
                }

                // View All
                $scope.viewAll = function (parentItem, item, stateName) {
                    var filter = {
                        Disciplines: []
                    }
                    if (item) {
                        filter.Disciplines.push({
                            name: item.disciplineName,
                            id: item.disciplineId
                        });
                    }
                    InsightsCommonService.applyFilter(
                        $filter('date')($scope.fromDate, "yyyy-MM-dd"),
                        $filter('date')($scope.toDate, "yyyy-MM-dd"),
                        parentItem.segmentFilter,
                        filter,
                        stateName);
                }

                $scope.$on('globalFilterDateChange', function (event, args) {
                    var data = args.any;
                    $scope.fromDate = data.fromDate;
                    $scope.toDate = data.toDate;
                    $scope.defaultFilter = data.defaultFilter;
                    $scope.filter = data.label;

                    loadDataKnowledgeAddedVsValidated();
                    $rootScope.$broadcast('globalFilterDateChangeSuccess');
                });

                // DatNT38 - Remove date filter
                $scope.removeFilter = function (type) {
                    $scope.fromDate = new Date(1, 1, 1900);
                    $scope.toDate = new Date();
                    $scope.defaultFilter = "year";
                    $scope.filter = "All";
                    $scope.showDropdown = false;
                    loadDataKnowledgeAddedVsValidated();
                    $(".range_filter").find('.start-date:first').removeClass('start-date');
                }
            },
            templateUrl: 'app/main/apps/insights/_directives/knowledge/insights-knowledge-added-and-validated.html',
        };
    }
})();
