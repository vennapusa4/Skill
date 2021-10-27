(function () {
  'use strict';

  angular
    .module('app.expertDirectory')
    .controller('ExpertDirectoryController', ExpertDirectoryController);

  /** @ngInject */
  function ExpertDirectoryController($scope, $window, ExpertDirectoryApi, SearchApi, InsightsCommonService) {
    var vm = this;
    vm.loading = false;
    vm.SearchResults = [];
    vm.isShowAll = false;
    vm.switchMode = function () {
      vm.isShowAll = !vm.isShowAll;
      getData();
    }
    vm.arrSortby = [
      { id: 'HighestContributor', name: 'Highest Contributor' },
      { id: 'HighestValueContributor', name: 'Highest Value Contributor' },
      { id: 'HighestValidator', name: 'Highest Validator' },
      { id: 'HighestReplicator', name: 'Highest Replicator' },
      { id: 'HighestRank', name: 'Highest Rank' },
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
    vm.canvasOptions = {
      elementId: "myCanvas",
      width: 135,
      height: 50
    };
    var currentdate = new Date();
    vm.summary = {
      totalSMECount: 0,
      totalDisciplineCount: 0,
      totalLocationCount: 0,
      totalKnowledgeValidationCount: 0,
      validationsCount: 0,
      curentYear: currentdate.getFullYear()
    };
    vm.months = [];
    var monthStr = {};
    _.forEach(moment.monthsShort(), function (val, idx) {
      var key = idx + 1;
      monthStr['' + key] = val;
    });

    ExpertDirectoryApi.summary().then(function (data) {
      vm.summary = data;
      vm.validationsCount = data.validationsCount;
      vm.summary.curentYear = currentdate.getFullYear();
      vm.months = _.map(data.months, function (o) { return { name: monthStr[o.monthName], value: o.count, year: o.year } });
      //var chartDatas = {};
      //_.map(vm.summary.months, function (item) {
      //    chartDatas[item.monthName] = item.count;
      //});
      //ChartService.draw(vm.canvasOptions, chartDatas);
    })

    vm.GetMostEngaged = {};
    ExpertDirectoryApi.mostEngaged().then(function (data) {
      vm.GetMostEngaged = data;
    });

    vm.GetLatestValidated = {};
    ExpertDirectoryApi.latestValidated().then(function (data) {
      vm.GetLatestValidated = data;
    });

    vm.GetUpcomingExperts = [];
    ExpertDirectoryApi.getUpcomingExperts().then(function (data) {
      vm.GetUpcomingExperts = data;
    });

    ExpertDirectoryApi.departments().then(function (data) {
      vm.Departments = [{ id: 0, name: '--Select Department--' }];
      vm.Departments = _.union(vm.Departments, data);
    });

    ExpertDirectoryApi.divisions().then(function (data) {
      vm.Divisions = [{ id: 0, divisionName: '--Select Division--' }];
      vm.Divisions = _.union(vm.Divisions, data);
    });

    ExpertDirectoryApi.locations().then(function (data) {
      vm.Locations = [{ id: 0, locationName: '--Select Location--' }];
      vm.Locations = _.union(vm.Locations, data);
    });


    function clearFilterSources() {
      vm.FilterSources = {
        Disciplines: [],
        Subdisciplines: [],
        Divisions: [],
        Departments: [],
        CoPs: [],
        Locations: [],
        Skills: [],
        AreaOfExpertises: [],
        Experiences: [],
      };
    };
    clearFilterSources();

    function getDocumentFilter() {
      var inputSearch = InsightsCommonService.getInputSearch();
      if (inputSearch) {
        clearFilterSources();
        vm.FilterSources.Disciplines = inputSearch.Disciplines || [];
        vm.FilterSources.Subdisciplines = inputSearch.Subdisciplines || [];
        vm.FilterSources.Skills = inputSearch.Skills || [];
        vm.FilterSources.AreaOfExpertises = inputSearch.AreaOfExpertises || [];
        vm.FilterSources.Experiences = inputSearch.Experiences || [];
        vm.FilterSources.Departments = inputSearch.Departments || [];
        vm.FilterSources.Divisions = inputSearch.Divisions || [];
        InsightsCommonService.setInputSearch({});
        getData();
      } else {
        ExpertDirectoryApi.expertDirectoryFilterByCurrentUser().then(function (data) {
          if (data && data.length > 0) {
            _.each(data, function (item) {
              vm.FilterSources[item.category] = _.map(item.itemized, function (val) {
                return { name: val.itemName, id: val.itemId };
              }).sort();
            });
          }

          // After get left filter => then SearchData
          getData();
        });
      }
    }
    getDocumentFilter();

    //layout
    function clearLayout() {
      vm.layout_grid = false;
      vm.layout_list = false;
    }

    function resetLayout() {
      clearLayout();
      var screenWidth = $window.innerWidth;
      if (screenWidth < 700) {
        vm.layout_list = true;
      } else {
        vm.layout_grid = true;
      }
    }
    resetLayout();

    vm.selectLayout = function (type) {
      clearLayout();
      vm[type] = true;
    }
    //end layout    

    // vm.isFirstLoad = true;
    function getData() {
      function getFilter() {
        var results = [];
        var arrFilter = Object.keys(vm.FilterSources);
        _.each(arrFilter, function (cate) {
          results.push({
            category: cate,
            itemized: _.map(vm.FilterSources[cate], function (item) { return { itemName: item.name, itemId: item.id } })
          });
        });
        return results;
      }
      var postdata = {
        searchName: vm.seach.searchName ? vm.seach.searchName : vm.seach.searchExperts,
        divisionid: vm.seach.division.id,
        departmentid: vm.seach.department.id,
        locationId: vm.seach.location.id,
        role: vm.seach.role,
        sortBy: vm.selectSortby.id,
        leftFilter: getFilter(),
        skip: (vm.pageIndex - 1) * vm.pageSize,
        take: vm.pageSize,
        IsHasExpertInterview: vm.isShowAll
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

    vm.ariaExpanded = function () {
      vm.expandedValue = !vm.expandedValue;
    }
    vm.dd_close = false;

    vm.RefineByClose = function () {
      vm.dd_close = !vm.dd_close;
      $('body').removeClass('menu-open');
    }

    vm.changeSortByInMobile = function (sortBy) {
      vm.selectSortby = sortBy;
      vm.changeSortBy();
    }
  }
})();
