/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsTrendingTopics', insightsTrendingTopics);
    /** @ngInject */
    function insightsTrendingTopics() {
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

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        segmentItems: segmentItems,
                        isViewMore: isViewMore
                    };
                    InsightsApi.getTrendingTopics(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            var result = _.chain(data).groupBy("type").map(function (v, i) {
                                return {
                                    kdType: i,
                                    items: v
                                }
                            }).value();
                            $scope.data = result;
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
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
            templateUrl: 'app/main/apps/insights/_directives/knowledge/insights-trending-topics.html',
        };
    }
})();
