/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.insights')
        .directive('insightsTopEngagedUsers', insightsTopEngagedUsers);
    /** @ngInject */
    function insightsTopEngagedUsers() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($rootScope, $scope, $filter, appConfig, InsightsCommonService, InsightsApi) {
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
                $scope.exportData = [];
                $scope.hover = {};

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
                    InsightsApi.getTopEngagedUsers(input).then(function (data) {
                        $scope.loading = false;
                        if (data != null) {
                            _.each(data, function (item, index) {
                                item.userSince = item.createdDate != null ? userSinceFormat(item.createdDate) : '';
                                item.userSinceYear = item.createdDate != null ? userSinceCalculator(item.createdDate) : '';
                            });
                            var result = _.chain(data).groupBy("segmentType").map(function (v, i) {
                                return {
                                    segmentType: i,
                                    items: v
                                }
                            }).value();
                            mappingToExcelData(result);
                            if (isViewMore) {
                                $scope.dataPopup = result;

                                //People's snippet visible on hover.
                                window.setTimeout(function () {
                                    $('#ModalTableEngagementAll .td_hover').hover(function () {
                                        $(this).toggleClass('hover_show');
                                    });
                                });
                            } else {
                                $scope.data = result;

                                //People's snippet visible on hover.
                                window.setTimeout(function () {
                                    $('#main-data-tabe .td_hover').hover(function () {
                                        $(this).toggleClass('hover_show');
                                    });
                                });
                            }

                        }
                    }, function (error) {
                        $scope.loading = false;
                        console.log(error);
                    });
                }

                // Show view more popup
                $scope.viewMoreClick = function (type, index) {
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

                    $('#ModalTableEngagementAll').modal('show');

                    loadData(segmentItemsInput, true);
                }

                // Close View more popup
                $scope.closeViewMoreClick = function () {
                    $('#ModalTableEngagementAll').modal('hide');
                }

                // View All
                $scope.goAllKnowledge = function (segmentType) {
                    $state.go('app.knowledgeDiscovery.allKnowledge');
                }

                // Mapping data for export excel
                function mappingToExcelData(data) {
                    $scope.exportData = [];
                    $scope.exportData.push(["#", "USER", "USER SINCE", "BADGES", "RANK", "REPLICATION", "VIEWS", "LIKES", "SHARES", "SAVES"]);
                    var index = 1;
                    angular.forEach(data, function (cat, key1) {
                        $scope.exportData.push([cat.segmentType, null, null, null, null, null, null, null, null, null]);
                        angular.forEach(cat.items, function (item, key2) {
                            $scope.exportData.push([index, item.contributor.displayName, item.userSince + ", " + item.userSinceYear, item.badgesCount || 0, item.rank || '', item.replicationCount || 0, item.viewCount || 0, item.likeCount || 0, item.shareCount || 0, item.saveCount || 0]);
                            index++;
                        });
                    });
                }

                function userSinceFormat(str) {
                    try {
                        var mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                        var date = new Date(str);
                        var month = mlist[date.getMonth()];
                        var year = date.getFullYear();
                        return month + ' ' + year;
                    } catch (e) {
                        return str;
                    }
                }
                function userSinceCalculator(str) {
                    try {
                        var date = new Date(str);
                        var seconds = Math.floor((new Date() - date) / 1000);
                        var result = '';

                        var interval = Math.floor(seconds / 2592000);
                        if (seconds % 2592000 != 0) {
                            interval += 1;
                        }
                        if (interval > 1) {
                            var year = Math.floor(interval / 12);
                            result = year > 0 ? year + ' years ' + (interval % 12) + " months" : interval > 1 ? interval + " months" : interval + " month";
                        }

                        return result != '' ? result : "0 month";
                    } catch (e) {
                        return "0 month";
                    }
                }

                $rootScope.cacheUserData = $rootScope.cacheUserData || [];

                $scope.idLoading = 0;
                $scope.hoverIn = function (item) {
                    closeAllHoverPopup();
                    var contributorId = item.contributor.id;
                    if (item.isShowHoverBox != true && $scope.idLoading != contributorId) {
                        $scope.idLoading = contributorId;
                        $scope.hover = {};
                        $scope.loading = true;

                        var existUserData = _.find($rootScope.cacheUserData, function (o) {
                            return o.id == contributorId;
                        });
                        if (existUserData) {
                            $scope.loading = false;
                            $scope.hover = existUserData;
                            item.isShowHoverBox = true;
                        } else {
                            InsightsApi.getGetContributorInfoById(contributorId).then(function (data) {
                                $scope.loading = false;
                                if (data != null && $scope.idLoading != 0) {
                                    $scope.hover = data;
                                    var isExistOnCache = _.some($rootScope.cacheUserData, function (o) {
                                        return o.id == data.id;
                                    });
                                    if (!isExistOnCache) {
                                        $rootScope.cacheUserData.push(data);
                                    }
                                    item.isShowHoverBox = true;
                                }
                            }, function (error) {
                                $scope.loading = false;
                                console.log(error);
                            });
                        }
                    }
                };

                $scope.hoverOut = function (item) {
                    item.isShowHoverBox = false;
                };

                function closeAllHoverPopup() {
                    _.each($scope.data, function (x, xIndex) {
                        _.each(x.items, function (y, yIndex) {
                            y.isShowHoverBox = false;
                        });
                    });
                    _.each($scope.dataPopup, function (x, xIndex) {
                        _.each(x.items, function (y, yIndex) {
                            y.isShowHoverBox = false;
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
            templateUrl: 'app/main/apps/insights/_directives/people/insights-top-engaged-users.html',
        };
    }
})();
