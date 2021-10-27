/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsLocationCreatedMostValue', insightsLocationCreatedMostValue);
    /** @ngInject */
    function insightsLocationCreatedMostValue() {
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
                $scope.colorViewMoreTopReplications = 0;
                $scope.dataPopup = [];
                $scope.byLocationData = [];
                $scope.allData = [];
                $scope.mapData = [];
                $scope.typeSelected = '';

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
                    $scope.dataLatestContributors = [];

                    var input = {
                        fromDate: $filter('date')($scope.fromDate, "MM/dd/yyyy"),
                        toDate: $filter('date')($scope.toDate, "MM/dd/yyyy"),
                        segmentItems: segmentItems,
                        isViewMore: isViewMore,
                        isEndorsed: !$scope.isShowAll,
                    };

                    // For map
                    $scope.byLocationData = [];
                    $scope.typeSelected = '';
                    $scope.mapData = [];
                    $scope.allData = [];

                    InsightsApi.getValueDataByLocation(input).then(function (data) {
                        if (data != null) {
                            $scope.loading = false;

                            _.each(data, function (x, xIndex) {
                                x.isChecked = true;
                            });

                            $scope.allData = data;
                            // Draw chart
                            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
                                return {
                                    segmentType: i,
                                    items: v
                                }
                            }).value();
                            $scope.byLocationData = result;
                            $scope.typeSelected = result != null && result.length > 0 ? result[0].segmentType : '';

                            // Draw map
                            $scope.drawMap();

                            window.setTimeout(function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            }, 1000);
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                // Tab Change event
                $scope.tabChanged = function (type) {
                    if (type != $scope.typeSelected) {
                        $scope.typeSelected = type;
                        $scope.drawMap();
                    }
                }

                // Draw map
                var maxSize = 10;
                $scope.loadActiveLocationDetail = null;

                var lastMouseX, lastMouseY;
                $(document).on("mousemove", function (e) {
                    lastMouseX = e.pageX;
                    lastMouseY = e.pageY;
                });

                $scope.drawMap = function () {
                    $scope.mapData = [];
                    var maxByType = 1;
                    _.each($scope.allData, function (x, xIndex) {
                        if (x.isChecked && x.locationId != null && x.latitude != null && x.longitude != null && x.segmentType == $scope.typeSelected) {
                            $scope.mapData.push({
                                id: x.locationId,
                                value: '10',
                                location: [x.latitude, x.longitude],
                                locationName: x.locationName,
                                knowledgeCount: x.value
                            });
                        }
                        if (x.segmentType == $scope.typeSelected && x.value > maxByType) {
                            maxByType = x.value;
                        }
                    });

                    _.each($scope.allData, function (x, xIndex) {
                        x.maxByType = maxByType;
                    });

                    var activeShape;
                    var maxSize = 10;
                    $("#map2").kendoMap({
                        center: [4.2105, 101.9758],
                        minZoom: 3,
                        zoom: 4,
                        wraparound: false,
                        layerDefaults: {
                            bubble: {
                                maxSize: maxSize
                            }
                        },
                        layers: [{
                            type: "tile",
                            urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
                            subdomains: ["a", "b", "c"],
                        }, {
                            type: "bubble",
                            style: {
                                fill: {
                                    color: "#00f",
                                    opacity: 0.4
                                },
                                stroke: {
                                    width: 0
                                }
                            },
                            dataSource: {
                                data: $scope.mapData
                            },
                            locationField: "location",
                            valueField: "value"
                        }],
                        shapeClick: onShapeMouseEnter,
                        reset: onShapeMouseLeave,
                        zoomStart: onShapeMouseLeave,
                        zoomEnd: onShapeMouseLeave,
                        pan: onShapeMouseLeave,
                        panEnd: onShapeMouseLeave,
                    });

                    function onShapeMouseEnter(e) {
                        activeShape = e.shape;
                        $scope.$apply(function () {
                            $scope.loadActiveLocationDetail = {
                                locationName: activeShape.dataItem.locationName,
                                knowledgeCount: activeShape.dataItem.value
                            };
                        });

                        activeShape.options.set("stroke", { width: 1.5, color: "#00f" });


                        var locationOffsetTop = $('.xlocation').matchHeight().offset().top;
                        var locationOffsetLeft = $('.xlocation').matchHeight().offset().left;
                        var oTop = lastMouseY - locationOffsetTop;
                        var oLeft = lastMouseX - locationOffsetLeft;
                        $('.map-tooltip').css({ 'left': oLeft + 'px', 'top': oTop + 'px', 'display': 'block' });
                    }
                    function onShapeMouseLeave() {
                        try {
                            $scope.loadActiveLocationDetail = null;
                            $('.map-tooltip').css('display', 'none');
                            activeShape.options.set("stroke", { width: 0, color: "#00f" });
                            activeShape = null;
                        } catch (e) {

                        }
                    }
                    $scope.onShapeMouseLeave = function () {
                        $scope.loadActiveLocationDetail = null;
                        activeShape.options.set("stroke", { width: 0, color: "#00f" });
                        activeShape = null;
                        $('.map-tooltip').css('display', 'none');
                    }
                }

                // Formar currency
                $scope.kmlFormatter = function (str) {
                    return InsightsCommonService.kmlFormatter(str);
                }

                // View All
                $scope.viewAll = function (item) {
                    var filter = {
                        Locations: [],
                        CoPs: []
                    }

                    try {
                        var allSegments = InsightsCommonService.getAllSegmentLabels();
                        var segmentObj = _.find(allSegments.labelItemResponses, function (item, index) {
                            return (item.name == parentItem.segmentType || item.name.replace(/ /g, '') == parentItem.segmentType.replace(/ /g, ''));
                        });
                        //if (segmentObj && segmentObj.name != "All") {
                        //    filter.CoPs.push({
                        //        name: segmentObj.name,
                        //        id: segmentObj.departmentId
                        //    });
                        //}
                    } catch (e) {

                    }
                    if (item) {
                        filter.Locations.push({
                            name: item.locationName,
                            id: item.locationId
                        });
                    }
                    InsightsCommonService.applyFilter(
                        $filter('date')($scope.fromDate, "yyyy-MM-dd"),
                        $filter('date')($scope.toDate, "yyyy-MM-dd"),
                        item.segmentFilter,
                        filter);
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
            templateUrl: 'app/main/apps/insights/_directives/value/insights-location-created-most-value.html',
        };
    }
})();
