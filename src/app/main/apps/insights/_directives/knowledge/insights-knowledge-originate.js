/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsKnowledgeOriginate', insightsKnowledgeOriginate);
    /** @ngInject */
    function insightsKnowledgeOriginate() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($scope, $filter, appConfig, InsightsCommonService, InsightsApi, $rootScope) {
                // Declare variables
                $scope.isFirstTimeToLoad = true;
                $scope.arrClass = appConfig.arrClass;
                $scope.arrColor = appConfig.arrColor;
                $scope.byLocationData = [];
                $scope.allData = [];
                $scope.mapData = [];
                $scope.typeSelected = '';
                $scope.locationIds = [];
                $scope.dataLatestContributors = [];
                $scope.showDropdown = false;
                $scope.filter = "All";
                var xDate = new Date();
                var currentDate = new Date(xDate.getFullYear(), xDate.getMonth(), 1);
                var lastDateInMonth = new Date(xDate.getFullYear(), xDate.getMonth() + 1, 0);
                $scope.fromDate = new Date(1, 1, 1900); //currentDate;
                $scope.toDate = new Date(); //lastDateInMonth;
                $scope.defaultFilter = "year";
                $scope.colorViewMoreTopReplications = 0;

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
                        isViewMore: isViewMore
                    };
                    InsightsApi.getLatestContributors(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            _.each(data, function (item, index) {
                                item.createdDate = InsightsCommonService.dateTimeToText(item.createdDate);
                            });
                            $scope.dataLatestContributors = data;
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });

                    // For map
                    $scope.byLocationData = [];
                    $scope.typeSelected = '';
                    $scope.mapData = [];
                    $scope.allData = [];

                    InsightsApi.getDataByLocation(input).then(function (data) {
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
                            console.log(result);
                            $scope.typeSelected = result != null && result.length > 0 ? result[0].segmentType : '';

                            // Draw map
                            $scope.drawMap();

                            window.setTimeout(function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            }, 1000);
                            window.setTimeout(function () {
                                $('.data_tab_nav a:first').tab('show');
                                $('#Segment-0').addClass('active');
                            });
                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                $scope.setTabActive = function (index) {
                    return index == 0 ? "active" : "";
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

                $scope.onShapeMouseLeave = function () {
                    try {
                        $scope.loadActiveLocationDetail = null;
                        activeShape = null;
                        activeShape.options.set("stroke", { width: 0, color: "#00f" });
                        $('.map-tooltip').css('display', 'none');
                    } catch (e) {

                    }
                }

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
                                knowledgeCount: x.knowledgeCount
                            });
                        }
                        if (x.segmentType == $scope.typeSelected && x.knowledgeCount > maxByType) {
                            maxByType = x.knowledgeCount;
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
                                knowledgeCount: activeShape.dataItem.knowledgeCount
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
                }


                // Formar currency
                $scope.kmlFormatter = function (str) {
                    return InsightsCommonService.kmlFormatter(str);
                }
                $scope.hoverUser = function (index) {
                    $('#user_hover_' + index).addClass('user_hover_in');
                }
                $scope.leaveUser = function (index) {
                    $('#user_hover_' + index).removeClass('user_hover_in');
                }

                // View All
                $scope.viewAll = function (item) {
                    var filter = {
                        Locations: []
                    }
                    if (item) {
                        filter.Locations.push({ name: item.locationName, id: item.locationId });
                    }

                    window.setTimeout(function () {
                        InsightsCommonService.applyFilter(
                            $filter('date')($scope.fromDate, "yyyy-MM-dd"),
                            $filter('date')($scope.toDate, "yyyy-MM-dd"),
                            item.segmentFilter,
                            filter);
                    }, 200);
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
            templateUrl: 'app/main/apps/insights/_directives/knowledge/insights-knowledge-originate.html',
        };
    }
})();
