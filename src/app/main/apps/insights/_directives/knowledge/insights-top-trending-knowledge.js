/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsTopTrendingKnowledge', insightsTopTrendingKnowledge);
    /** @ngInject */
    function insightsTopTrendingKnowledge() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($scope, $filter, appConfig, InsightsCommonService, InsightsApi, $state, $rootScope) {
                // Declare variables
                $scope.isFirstTimeToLoad = true;
                $scope.arrClass = appConfig.arrClass;
                $scope.data = [];
                $scope.showDropdown = false;
                $scope.filter = "All";
                var xDate = new Date();
                var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
                var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
                $scope.fromDate = new Date(1, 1, 1900); //currentDate;
                $scope.toDate = new Date(); //lastDateInMonth;
                $scope.defaultFilter = "year";
                $scope.colorViewMoreTopTrendingKD = 0;
                $scope.dataPopup = [];

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
                    if (isViewMore) {
                        $scope.dataPopup = [];
                    } else {
                        $scope.data = [];
                    }

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        segmentItems: segmentItems,
                        isViewMore: isViewMore
                    };
                    InsightsApi.getTopTrendingKnowledge(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            _.each(data, function (item, index) {
                                item.valueCreation = item.valueCreation != null ? InsightsCommonService.kmlFormatter(item.valueCreation, 0) : 0
                            });
                            var result = _.chain(data).groupBy("kdType").map(function (v, i) {
                                return {
                                    kdType: i,
                                    items: v
                                }
                            }).value();
                            if (isViewMore) {
                                $scope.dataPopup = result;
                            } else {
                                $scope.data = result;
                                console.log($scope.data[0].items.length)
                            }
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                // Show view more popup
                $scope.viewMoreTopTrendingKnowledge = function (type, index) {
                    var segmentItems = InsightsCommonService.getAllSegmentLabels();
                    var segmentItemsInput = [];
                    $scope.colorViewMoreTopTrendingKD = index;

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
                $scope.closeViewMoreTopTrendingKnowledge = function () {
                    $('#ModalTableTrendingAll').modal('hide');
                }

                $scope.goAllKnowledge = function () {
                    $state.go('app.knowledgeDiscovery.allKnowledge');
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
            templateUrl: 'app/main/apps/insights/_directives/knowledge/insights-top-trending-knowledge.html',
        };
    }
})();
