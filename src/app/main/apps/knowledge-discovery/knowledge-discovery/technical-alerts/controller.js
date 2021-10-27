(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
      .controller('KnowledgeTechnicalAlertsListController', KnowledgeTechnicalAlertsListController);

    /** @ngInject */
  function KnowledgeTechnicalAlertsListController($scope, KnowledgeDocumentApi, SearchApi, InsightsCommonService, InsightsApi, MasterDataCopApi, $stateParams) {
        var vm = this;
        vm.loading = false;
        // vm.isfirstLoadCalendar = true; //fix show curent in calendar
        vm.arrSortby = [
            { id: 'HighestEngagement', name: 'Highest Engagement' },
            { id: 'LatestContribution', name: 'Latest Contribution' },
            { id: 'LatestValidation', name: 'Latest Validation' },
            { id: 'HighestValueRealised', name: 'Highest Value Realised' },
            { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
            { id: 'HighestReplication', name: 'Highest Replication' },
        ];

        vm.selectSortby = vm.arrSortby[0];
        vm.pageIndex = 1;
        vm.pageSize = 16;
        vm.recordcount = 0;
        vm.maxSize = 5;
        vm.documentType = 'Technical Alerts';
        vm.SearchResult = {};

        var date = new Date();
        var y = new Date().getFullYear();
        var m = date.getMonth();
        vm.fromDate = null;
        vm.toDate = null;
        $scope.IsShowValue = false;
        vm.isShowAll = true;
        vm.isShowHasValue = false;
        vm.isShowHasVideo = false;
        vm.isShowValidate = false;
        vm.switchMode = function (type) {
            if (type == 2) {
                vm.isShowHasValue = !vm.isShowHasValue;
                $scope.IsShowValue = !$scope.IsShowValue;
            }
            if (type == 3) {
                vm.isShowHasVideo = !vm.isShowHasVideo;
            }
            if (type == 4) {
                vm.isShowValidate = !vm.isShowValidate;
            }
            vm.isShowAll = vm.isShowHasValue == false && vm.isShowHasVideo == false && vm.isShowValidate == false;
            getData();
        }

        function clearFilterSources() {
            vm.FilterSources = {
                Disciplines: [],
                Subdisciplines: [],
                CoPs: [],
                Locations: [],
                Authors: [],
                Contributors: [],
                Projects: [],
                Wells: [],
                Equipments: [],
                Keywords: [],
                Departments: [],
                Divisions: [],
                WellsOperations: [],
                WellsPhase: [],
                Sources: [],

                WellsType: [],
                ProjectPhase: [],
                PPMSActivity: [],
                PRAElements: [],
            };
            vm.fromDate = null;
            vm.toDate = null;
        };

        clearFilterSources();

        /* LEFT Panel */
        vm.Sources = {
            dataTextField: "text",
            dataValueField: "id",
            filter: "contains",
            minLength: 1,
            delay: 500,
            dataSource: {
                serverFiltering: true,
                transport: {
                    read: function (options) {
                        return SearchApi.SearchSuggestions(options);
                    }
                },
                group: { field: "type" }
            },
            open: function (e) {
                setTimeout(function () {
                    e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
                }, 100);
            },
            select: function (e) {
                var index = _.findIndex(vm.FilterSources[e.dataItem.realType], function (obj) { return obj.id == e.dataItem.id });
                if (index == -1) {
                    $scope.$apply(function () {
                        vm.FilterSources[e.dataItem.realType].push({ id: e.dataItem.id, itemGuid: e.dataItem.guid, name: (e.dataItem.realType === 'Locations') ? (e.dataItem.type + ': ' + e.dataItem.text) : e.dataItem.text });
                        vm.Search();
                    });
                }

                $scope.$apply(function () {
                    vm.txtsearch = '';
                });
            },
        };

        vm.ClearFilter = function () {
            $scope.$broadcast('Clear', null);
            if (!_.isEmpty(vm.FilterSources)) {
                clearFilterSources();
                vm.Search();
            }
        }

        vm.RemoveFilter = function (id, type) {
            _.remove(vm.FilterSources[type], function (obj) {
                return obj.id === id;
            });
            vm.Search();
        }

        vm.Search = function () {
            vm.pageIndex = 1;
            getData();
        }

        function getListLocationByKnowledge() {
            InsightsApi.getListLocationByKnowledge(vm.documentType).then(function (data) {
                if (data != null) {
                    InsightsCommonService.bindDataTomap(data);
                }
            });
        }
        //getListLocationByKnowledge();

        vm.SearchText = function () {
            var postdata = { searchText: vm.txtsearch };
            SearchApi.api.SearchSuggestionsText(postdata).then(function (data) {
                var arrType = Object.keys(vm.FilterSources);//["Discipline", "Location", "Author"];
                _.each(arrType, function (type) {
                    var lstObj = _.map(data, function (item) {
                        if (item.type == type)
                            return { itemName: item.name, itemId: item.id, itemGuid: item.itemGuid };
                    })
                    vm.FilterSources[type] = _.union(vm.FilterSources[type], lstObj);
                });
                vm.Search();
            });
        };

        // vm.isfirstLoad = true;
        function getDocumentFilter() {
            if ($stateParams.copid != undefined) {
                MasterDataCopApi.getById($stateParams.copid).then(function (data) {
                    if (data) {
                        vm.FilterSources.CoPs = [
                            {
                                "name": data.copName,
                                "id": $stateParams.copid
                            }
                        ];
                        vm.Search();
                    }
                }, function (e) {
                    console.log(e);
                });
            } else {
                var inputSearch = InsightsCommonService.getInputSearch();
                if (inputSearch) {
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    clearFilterSources();
                    if (inputSearch.fromDate != null && inputSearch.toDate != null) {
                        vm.fromDate = inputSearch.fromDate;
                        vm.toDate = inputSearch.toDate;
                    }
                    vm.FilterSources.Authors = inputSearch.Authors || [];
                    vm.FilterSources.Contributors = inputSearch.Contributors || [];
                    vm.FilterSources.CoPs = inputSearch.CoPs || [];
                    vm.FilterSources.Departments = inputSearch.Departments || [];
                    vm.FilterSources.Disciplines = inputSearch.Disciplines || [];
                    vm.FilterSources.Divisions = inputSearch.Divisions || [];
                    vm.FilterSources.Subdisciplines = inputSearch.Subdisciplines || [];

                    vm.FilterSources.Equipments = inputSearch.Equipments || [];
                    vm.FilterSources.Keywords = inputSearch.Keywords || [];
                    vm.FilterSources.Projects = inputSearch.Projects || [];
                    vm.FilterSources.Wells = inputSearch.Wells || [];
                    vm.FilterSources.WellsOperations = inputSearch.WellsOperations || [];
                    vm.FilterSources.WellsPhase = inputSearch.WellsPhase || [];
                    vm.FilterSources.Locations = inputSearch.Locations || [];
                    vm.FilterSources.Sources = inputSearch.Sources || [];

                    vm.FilterSources.WellsType = inputSearch.WellsType || [];
                    vm.FilterSources.ProjectPhase = inputSearch.ProjectPhase || [];
                    vm.FilterSources.PPMSActivity = inputSearch.PPMSActivity || [];
                    vm.FilterSources.PRAElements = inputSearch.PRAElements || [];

                    InsightsCommonService.setInputSearch({});
                    vm.Search();
                } else {
                    KnowledgeDocumentApi.documentFilterByCurrentUser().then(function (data) {
                        if (data && data.length > 0) {
                            _.each(data, function (item) {
                                vm.FilterSources[item.categoryName] = _.map(item.itemized, function (val) {
                                    return { name: val.itemName, id: val.itemId, itemGuid: item.itemGuid };
                                });
                            });
                        }

                        // After get Save Filter of CurrentUser => must getData
                        vm.Search();
                    });
                }
            }
        }
        getDocumentFilter();

        function getDataDocumentType() {
            function formatDate(date) {
                //fix error display calendar when month,weekend, day
                // var addMonth = vm.isfirstLoadCalendar ? 0 : 1;
                var addMonth = 1;
                date = new Date(date);
                var day = ('0' + date.getDate()).slice(-2);
                var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
                var year = date.getFullYear();

                return year + '-' + month + '-' + day;
            }

            function getFilter() {
                var results = [];
                var arrFilter = Object.keys(vm.FilterSources);
                _.each(arrFilter, function (cate) {
                    results.push({
                        categoryName: cate,
                        itemized: _.map(vm.FilterSources[cate], function (item) { return { itemName: item.name, itemId: item.id, itemGuid: item.itemGuid } })
                    });
                });
                return results;
            }

            return {
                docType: vm.documentType,
                fromDate: vm.fromDate ? formatDate(vm.fromDate) : undefined,
                todate: vm.toDate ? formatDate(vm.toDate) : undefined,
                year: 0,
                category: getFilter(),
                sortBy: vm.selectSortby.id,
                skip: (vm.pageIndex - 1) * vm.pageSize,
                take: vm.pageSize,
                isShowAll: vm.isShowAll,
                isShowHasValue: vm.isShowHasValue,
                isShowHasVideo: vm.isShowHasVideo,
                isShowValidate: vm.isShowValidate
            }
        }

        function getData() {
            vm.loading = true;
            var postData = getDataDocumentType();
            KnowledgeDocumentApi.documentType(postData).then(function (data) {
                vm.SearchResult = data;
                vm.loading = false;

                var dataMap = [];
                if (data != null && data.data != null && data.data.length > 0) {
                    dataMap = data.dataLocation;
                }
                InsightsCommonService.bindDataTomap(dataMap);
            });
        }

        vm.changeSortBy = function () {
            vm.pageIndex = 1;
            getData();
        }

        vm.changeSortByInMobile = function (sortBy) {
            vm.selectSortby = sortBy;
            vm.changeSortBy();
        }

        vm.pageChanged = function (page) {
            if (page <= 0) return;
            vm.pageIndex = page;
            getData();
        };

        vm.filterDate = function (startDate, endDate, period) {

            vm.pageIndex = 1;
            vm.fromDate = startDate._d;
            vm.toDate = endDate._d;
            vm.Search();
        }


        /*------------Save This Filter--------------*/
        vm.SaveFilter = function () {
            vm.loading = true;
            var postData = getDataDocumentType();
            // vm.isfirstLoadCalendar = false;
            KnowledgeDocumentApi.saveFilter(postData).then(function (data) {
                vm.loading = false;
            });
        }

        vm.dd_close = false;
        vm.RefineByClose = function () {
            vm.dd_close = !vm.dd_close;
            $('body').removeClass('menu-open');
        }

        // DatNT38 - Remove date filter
        vm.removeFilterDate = function (type) {
            vm.pageIndex = 1;
            vm.fromDate = null;
            vm.toDate = null;
            getData();
            $(".range_filter").find('.start-date:first').removeClass('start-date');
        }
    }
})();
