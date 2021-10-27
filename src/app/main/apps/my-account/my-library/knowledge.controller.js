(function () {
    'use strict';

    angular
        .module('app.myAccount')
        .controller('MyLibraryKnowledgeController', MyLibraryKnowledgeController);

    /** @ngInject */
    function MyLibraryKnowledgeController($rootScope, $scope, KnowledgeDocumentApi, SearchApi) {

        $rootScope.libraryType = 'Knowledges';

        var vm = this;
        vm.SearchResult = {};
        vm.FilterDisciplines = []; //id, name
        vm.arrSortby = [
            { id: 'HighestEngagement', name: 'Highest Engagement' },
            { id: 'LatestContribution', name: 'Latest Contribution' },
            { id: 'LatestValidation', name: 'Latest Validation' },
            { id: 'HighestValueRealised', name: 'Highest Value Realised' },
            { id: 'HighestPotentialValue', name: 'Highest Potential Value' },
            { id: 'HighestReplication', name: 'Highest Replication' },
        ];
        vm.selectSortby = vm.arrSortby[0];

        var date = new Date();
        var y = new Date().getFullYear();
        // var m = new Date().getMonth() + 1;
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

        vm.changeSortBy = function () {
            vm.pageIndex = 1;
            vm.Search();
        }

        // Contributions
        vm.keyword = '';
        vm.ResetSearch = function () {

            vm.pageIndex = 1;
            vm.Search();
        }

        vm.fromPos = 0;
        vm.toPos = 0;

        /* PAGING */
        vm.pageIndex = 1;
        vm.pageSize = 16;
        vm.maxSize = 5;
        vm.setPage = function (pageNo) {
            $scope.pageIndex = pageNo;
        };

        vm.pageChanged = function () {
            vm.Search();
        };

        vm.Search = function () {
            function formatDate(date) {
                date = new Date(date);
                var day = ('0' + date.getDate()).slice(-2);
                var month = ('0' + (date.getMonth() + 1)).slice(-2);
                var year = date.getFullYear();

                return year + '-' + month + '-' + day;
            }
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
            function getPostData() {
                return {
                    status: '',
                    Category: getFilter(),
                    fromDate: vm.fromDate ? formatDate(vm.fromDate) : undefined,
                    todate: vm.toDate ? formatDate(vm.toDate) : undefined,
                    keyword: vm.keyword,
                    sortBy: vm.selectSortby.id,
                    skip: (vm.pageIndex - 1) * vm.pageSize,
                    take: vm.pageSize
                };
            }

            var postData = getPostData();
            KnowledgeDocumentApi.GetMyKnowledgeLibrary(postData).then(function (data) {

                // Set for "DisableSave"
                for (var i = 0; i < data.data.length; i++) {
                    data.data[i].isDisabledSaveToLibrary = true;
                }

                vm.SearchResult = data;
                if (data.total > 0) {
                    vm.fromPos = postData.skip + 1;
                    vm.toPos = vm.fromPos + data.data.length - 1;
                }
                else {
                    vm.fromPos = 0;
                    vm.toPos = 0;
                }
            });
        }
        vm.Search();

        vm.filterDate = function (startDate, endDate, period) {

            vm.pageIndex = 1;
            vm.fromDate = startDate._d;
            vm.toDate = endDate._d;
            vm.Search();
        }

        vm.changeSortByInMobile = function (sortBy) {
            vm.selectSortby = sortBy;
            vm.changeSortBy();
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
            vm.Search();
            $(".range_filter").find('.start-date:first').removeClass('start-date');
        }
    }
})();
