(function () {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchExpertDirectoryController', SearchExpertDirectoryController);

    /** @ngInject */
    function SearchExpertDirectoryController($scope, $rootScope, $stateParams, $timeout, ExpertDirectoryApi, SearchApi) {
        var vm = this;
        vm.loading = false;
        vm.SearchResults = [];
        vm.arrSortby = [
            { id: 'HighestContributor', name: 'Highest Contributor' },
            { id: 'HighestValueContributor', name: 'Highest Value Contributor' },
            { id: 'HighestValidator', name: 'Highest Validator' },
            { id: 'HighestReplicator', name: 'Highest Replicator' },
            { id: 'HighestRank', name: 'Highest Rank (When Gamification Available)' },
            { id: 'LatestContributor', name: 'Latest Contributor' },

            { id: 'MostActive', name: 'Most Active' },
            { id: 'MostPopular', name: 'Most Popular' },
            { id: 'AtoZ', name: 'A-Z' },
            { id: 'ZtoA', name: 'Z-A' },
        ];
        vm.selectSortby = vm.arrSortby[0];

        vm.seach = {
            searchExperts: '',
            searchName: '',
            division: { id: 0, divisionName: '--Select Division--' },
            department: { id: 0, name: '--Select Department--' },
            location: { id: 0, locationName: '--Select Location--' },
            role: ''
        };
        vm.pageIndex = 1;
        vm.pageSize = 18;
        vm.recordcount = 0;
        vm.maxSize = 5;

        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        vm.fromDate = null;
        vm.toDate = null;

        function clearFilterSources() {
            vm.FilterSources = {
                Disciplines: [],
                Subdisciplines: [],
                Divisions: [],
                Departments: [],
                CoPs: [],
                Locations: [],
            };
            vm.fromDate = null;
            vm.toDate = null;
        };
        clearFilterSources();

        function getData() {
            function formatDate(date) {
                date = new Date(date);
                var day = ('0' + date.getDate()).slice(-2);
                var month = ('0' + (date.getMonth() + 1)).slice(-2);
                var year = date.getFullYear();

                return year + '-' + month + '-' + day;
            }
            function getFilter() {
                var results = [];
                var arrFilter = Object.keys(vm.FilterSources);// ["Discipline", "Location", "Author"];
                _.each(arrFilter, function (cate) {
                    results.push({
                        category: cate,
                        itemized: _.map(vm.FilterSources[cate], function (item) { return { itemName: item.name, itemId: item.id } })
                    });
                });
                return results;
            }
            var postdata = {
                searchName: vm.keyword,
                divisionid: vm.seach.division.id,
                departmentid: vm.seach.department.id,
                locationId: vm.seach.location.id,
                role: vm.seach.role,
                fromDate: vm.fromDate ? formatDate(vm.fromDate) : undefined,
                todate: vm.toDate ? formatDate(vm.toDate) : undefined,
                sortBy: vm.selectSortby.id,
                leftFilter: getFilter(),
                skip: (vm.pageIndex - 1) * vm.pageSize,
                take: vm.pageSize
            };
            vm.loading = true;
            ExpertDirectoryApi.search(postdata).then(function (data) {
                vm.SearchResults = data;
                vm.loading = false;
            });
        }

        vm.changeSortBy = function () {

            vm.expandedValue = false;
            vm.Search();
        }

        vm.pageChanged = function (page) {
            if (page < 1) {
                return;
            }
            vm.pageIndex = page;
            getData();
        };

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
                        return SearchApi.SearchSuggestionsForExpert(options);
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
        $rootScope.$on("SearchExpertDirectory", function (event, args) {
            vm.keyword = args.keyword;
            vm.Search();
        });

        vm.Search = function () {
            vm.pageIndex = 1;
            getData();
        }

        vm.Onload = function () {
            if ($stateParams.type != '' && $stateParams.id != null && vm.FilterSources[$stateParams.type] != null) {
                // add filter to left panel
                vm.FilterSources[$stateParams.type].push({ id: $stateParams.id, name: $stateParams.typetext });
            }
            vm.keyword = $stateParams.keyword;
            vm.Search();
        }

        $timeout(vm.Onload, 500);

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
