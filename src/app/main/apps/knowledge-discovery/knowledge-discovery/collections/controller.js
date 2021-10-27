(function () {
    'use strict';

    angular
        .module('app.knowledgeDiscovery')
        .controller('KnowledgeCollectionsController', KnowledgeCollectionsController);

    /** @ngInject */
    function KnowledgeCollectionsController($scope, KnowledgeDocumentApi, SearchApi) {
        var vm = this;
        vm.loading = false;
        vm.isShowvPotentialRealized = "";
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
        vm.documentType = 'Collections';
        vm.SearchResult = {};

        var date = new Date();
        var y = date.getFullYear();
        vm.fromDate = null;
        vm.toDate = null;

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
            KnowledgeDocumentApi.documentFilterByCurrentUser().then(function (data) {
                if (data && data.length > 0) {
                    _.each(data, function (item) {
                        vm.FilterSources[item.categoryName] = _.map(item.itemized, function (val) {
                            return { name: val.itemName, id: val.itemId, itemGuid: item.itemGuid };
                        });
                    });
                }

                // After get Save Filter of CurrentUser => must getData
                getData();
            });
        }
        getDocumentFilter();

        function getData() {
            function formatDate(date) {
                var addMonth = 1;
                date = new Date(date);
                var day = ('0' + date.getDate()).slice(-2);
                var month = ('0' + (date.getMonth() + addMonth)).slice(-2);
                var year = date.getFullYear();

                return year + '-' + month + '-' + day;
            }

            function getPostData() {
                function getFilter() {
                    var results = [];
                    var arrFilter = Object.keys(vm.FilterSources);//["Discipline", "Location", "Author"];
                    _.each(arrFilter, function (cate) {
                        results.push({
                            categoryName: cate,
                            itemized: _.map(vm.FilterSources[cate], function (item) { return { itemName: item.name, itemId: item.id, itemGuid: item.itemGuid } })
                        });
                    });
                    return results;
                }

                return {
                    collectionName: vm.collectionName,
                    fromDate: vm.fromDate ? formatDate(vm.fromDate) : undefined,
                    todate: vm.toDate ? formatDate(vm.toDate) : undefined,
                    category: getFilter(),
                    skip: (vm.pageIndex - 1) * vm.pageSize,
                    take: vm.pageSize
                }
            }

            vm.loading = true;
            var postData = getPostData();
            //vm.isShowvPotentialRealized = "";
            //if (postData.sortBy == "HighestPotentialValue" || postData.sortBy == "HighestValueRealised") {
            //    vm.isShowvPotentialRealized = postData.sortBy;
            //}
            vm.isShowvPotentialRealized = postData.sortBy;
            KnowledgeDocumentApi.collections(postData).then(function (data) {
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].isShowvPotentialRealized = vm.isShowvPotentialRealized;
                }
                vm.SearchResult = data;
                vm.loading = false;
            });
        }

        vm.changeSortBy = function () {
            //vm.isShowvPotentialRealized = vm.selectSortby.id;
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

        vm.CollectionsSearch = function () {
            vm.pageIndex = 1;
            getData();
        }

        vm.filterDate = function (startDate, endDate, period) {
            vm.pageIndex = 1;
            vm.fromDate = startDate._d;
            vm.toDate = endDate._d;
            vm.Search();
        }

        /*------------Save This Filter--------------*/
        vm.SaveFilter = function () {

            function getDataDocumentType() {
                function formatDate(date) {
                    //fix error display calendar when month,weekend, day
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
                            itemized: _.map(vm.FilterSources[cate], function (item) { return { itemName: item.name, itemId: item.id } })
                        });
                    });
                    return results;
                }

                return {
                    docType: vm.documentType,
                    fromDate: formatDate(vm.fromDate),
                    todate: formatDate(vm.toDate),
                    year: 0,
                    category: getFilter(),
                    sortBy: vm.selectSortby.id,
                    skip: (vm.pageIndex - 1) * vm.pageSize,
                    take: vm.pageSize
                }
            }
            vm.loading = true;
            var postData = getDataDocumentType();
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
