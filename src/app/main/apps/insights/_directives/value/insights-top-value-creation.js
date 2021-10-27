/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsTopValueCreation', insightsTopValueCreation);
    /** @ngInject */
    function insightsTopValueCreation() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                isShowAll: '<'
            },
            controller: function ($scope, $filter, appConfig, InsightsCommonService, InsightsApi, $rootScope) {
                // Declare variables
                $scope.isFirstTimeToLoad = true;
                $scope.arrClass = appConfig.arrClass;
                $scope.arrColor = appConfig.arrColor;
                $scope.data = [];
                $scope.showDropdown = false;
                $scope.filter = "All";
                var xDate = new Date();
                var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
                var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
                $scope.fromDate = new Date(1, 1, 1900); //currentDate;
                $scope.toDate = new Date(); //lastDateInMonth;
                $scope.defaultFilter = "year";
                $scope.colorViewMoreTopValueCreation = 0;
                $scope.dataPopup = [];
                $scope.exportData = [];

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
                    if (isViewMore) {
                        $scope.dataPopup = [];
                    } else {
                        $scope.data = [];
                    }

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        isEndorsed: !$scope.isShowAll,
                        segmentItems: segmentItems,
                        isViewMore: isViewMore
                    };
                    InsightsApi.getTopValue(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            data = mappingDataForBarChar(data);
                            _.each(data, function (item, index) {
                                item.replicated = item.replicated != null ? InsightsCommonService.kmlFormatter(item.replicated, 0) : 0
                            });
                            var result = _.chain(data).groupBy("kdType").map(function (v, i) {
                                return {
                                    kdType: i,
                                    items: v
                                }
                            }).value();
                            mappingToExcelData(result);
                            if (isViewMore) {
                                $scope.dataPopup = result;
                            } else {
                                $scope.data = result;
                            }
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                // Show view more popup
                $scope.viewMoreTopValueCreation = function (type, index) {
                    var segmentItems = InsightsCommonService.getAllSegmentLabels();
                    var segmentItemsInput = [];
                    $scope.colorViewMoreTopValueCreation = index;

                    if (type == 'All') {
                        segmentItemsInput.push({
                            id: 0,
                            segmentTypeL1: 'All',
                            segmentTypeL2: '',
                            name: 'All'
                        });
                    } else {
                        _.forEach(segmentItems.labelItemResponses, function (item, index) {
                            if (item.name == type) {
                                segmentItemsInput.push({
                                    id: item.id,
                                    segmentTypeL1: item.segmentTypeL1,
                                    segmentTypeL2: item.segmentTypeL2,
                                    name: item.name
                                });
                            }
                        });
                    }

                    $('#ModalTableTrendingAll').modal('show');

                    loadData(segmentItemsInput, true);
                }

                // Close View more popup
                $scope.closeViewMoreTopValueCreation = function () {
                    $('#ModalTableTrendingAll').modal('hide');
                }

                // View All
                $scope.viewAll = function () {
                    $scope.closeViewMoreTopValueCreation();
                    window.setTimeout(function () {
                        InsightsCommonService.applyFilter($filter('date')($scope.fromDate, "yyyy-MM-dd"), $filter('date')($scope.toDate, "yyyy-MM-dd"), null);
                    }, 200);
                }

                // Formar currency
                $scope.kmlFormatter = function (str) {
                    return InsightsCommonService.kmlFormatter(str);
                }

                // Mapping data for bar char
                function mappingDataForBarChar(arr) {
                    _.each(arr, function (item, index) {
                        var totalValue = 0;
                        _.each(item.valueTypeResponses, function (type, indexValue) {
                            totalValue += type.value;
                        });

                        _.each(item.valueTypeResponses, function (type, indexValue) {
                            try {
                                type.percentage = (type.value * 100) / totalValue;
                            } catch (e) {
                                type.percentage = 0;
                            }
                        });
                    });
                    return arr;
                }

                // Mapping data for export excel
                function mappingToExcelData(data) {
                    $scope.exportData = [];
                    $scope.exportData.push(["#", "KNOWLEDGE", "AUTHOR", "VALUE CREATED", "VALUE TYPE"]);
                    var index = 1;
                    angular.forEach(data, function (cat, key1) {
                        $scope.exportData.push([cat.kdType, null, null, null, null, null]);
                        angular.forEach(cat.items, function (item, key2) {
                            $scope.exportData.push([index, item.kdTitle + " - RM " + item.replicated, item.contributor.displayName, "RM " + $scope.kmlFormatter(item.valueCreated), ""]);
                            index++;
                        });
                    });
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
            templateUrl: 'app/main/apps/insights/_directives/value/insights-top-value-creation.html',
        };
    }
})();
