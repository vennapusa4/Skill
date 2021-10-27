(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchCollectionController', SearchCollectionController);

    /** @ngInject */
    function SearchCollectionController($scope, $rootScope, $stateParams, $timeout, KnowledgeDocumentApi, SearchApi) {
        var vm = this;
        vm.loading = false;
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
                Projects: [],
                Wells: [],
                Equipments: [],
                Keywords: [],
                Departments: [],
                Divisions: [],
                WellsOperations: [],
                WellsPhase: [],

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
                        vm.FilterSources[e.dataItem.realType].push({ id: e.dataItem.id, name: (e.dataItem.realType === 'Locations') ? (e.dataItem.type + ': ' + e.dataItem.text) : e.dataItem.text });
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

        // callback for Search
        $rootScope.$on("SearchCollection", function (event, args) {
            vm.collectionName = args.keyword;
            vm.Search();
        });

        vm.Onload = function () {
            if ($stateParams.type != '' && $stateParams.id != null && vm.FilterSources[$stateParams.type] != null) {
                // add filter to left panel
                vm.FilterSources[$stateParams.type].push({ id: $stateParams.id, name: $stateParams.typetext });
            }
            vm.collectionName = $stateParams.keyword;
            vm.Search();
        }

        $timeout(vm.Onload, 500);

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
                            return { itemName: item.name, itemId: item.id };
                    })
                    vm.FilterSources[type] = _.union(vm.FilterSources[type], lstObj);
                });
                vm.Search();
            });
        };

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
                            itemized: _.map(vm.FilterSources[cate], function (item) { return { itemName: item.name, itemId: item.id } })
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
            KnowledgeDocumentApi.collections(postData).then(function (data) {
                vm.SearchResult = data;
                vm.loading = false;
            });
        }
        vm.changeSortBy = function () {
            vm.pageIndex = 1;
            getData();
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

        // DatNT38 - Remove date filter
        vm.removeFilterDate = function (type) {
            vm.pageIndex = 1;
            vm.fromDate = null;
            vm.toDate = null;
            vm.Search();
            $(".range_filter").find('.start-date:first').removeClass('start-date');
        }
    }
})();
