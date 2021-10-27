(function () {
  'use strict';

  angular
    .module('app.leaderboard')
    .controller('LeaderboardCommunityScoreController', LeaderboardCommunityScoreController);

  /** @ngInject */
  function LeaderboardCommunityScoreController($scope, LeaderboardApi, UserProfileApi, InsightsCommonService, $filter) {
    $scope.dataScoreboardHeader = [];
    $scope.dataScoreboardDetails = [];
    $scope.userInfo = null;
    $scope.currentlevelId = 0;
    $scope.currentRankInPetronas = 0;
    $scope.currentRankInDivision = 0;
    $scope.currentRankInDepartment = 0;
    $scope.IsIndividual = true;

    $scope.levelId = 0;
    $scope.filterResult = '';
    $scope.searchTerm = '';

    // Switch mode
    $scope.switchMode = function () {
      $scope.IsIndividual = !$scope.IsIndividual;
      $scope.changeOverallLoading(false);
      $scope.changeMyDivisionLoading(false);
      $scope.changeMyDepartmentLoading(false);
    }


    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
    var currentYear = currentDate.getFullYear();

    // Filter by date
    $scope.showDropdown = false;
    $scope.filter = "All";
    $scope.defaultFilter = "year";
    $scope.filterDate = function (startDate, endDate, period) {
      $scope.filterOverall.fromDate = startDate._d;
      $scope.filterOverall.toDate = endDate._d;
      $scope.defaultFilter = period;
      var month = $scope.filterOverall.fromDate.getMonth() + 1;
      var year = $scope.filterOverall.fromDate.getFullYear();
      switch (period) {
        case 'month': {
          $scope.filterOverall.toDate = new Date(year, month, 0);
          $scope.filter = month + "/" + year;
          break;
        }
        case 'quarter': {
          var quarter = InsightsCommonService.getQuarter($scope.filterOverall.fromDate);
          $scope.filterOverall.toDate = new Date(year, quarter * 3, 0);
          $scope.filter = "Quarter " + quarter;
          break;
        }
        case 'year': {
          $scope.filterOverall.toDate = new Date(year, 12, 0);
          $scope.filter = "Year " + year;
          break;
        }
        default:
      }
      $scope.filterMyDivision.fromDate = $scope.filterOverall.fromDate;
      $scope.filterMyDivision.toDate = $scope.filterOverall.toDate;
      $scope.filterMyDepartment.fromDate = $scope.filterOverall.fromDate;
      $scope.filterMyDepartment.toDate = $scope.filterOverall.toDate;

      // Reload data for top trending
      $scope.changeOverallLoading(false);
      $scope.changeMyDivisionLoading(false);
      $scope.changeMyDepartmentLoading(false);

      $scope.$apply(function () {
        $scope.showDropdown = false;
      });
    }

    $scope.dataOverall = [];
    $scope.filterOverallDate = "All";
    $scope.filterOverall = {
      type: "Overall",
      start: 0,
      length: 0,
      skip: 0, // don't care
      take: 0, // don't care
      fromDate: new Date(1, 1, 1900),
      toDate: new Date()
    };
    $scope.changeOverallLoading = function (isLoadMore) {
      $scope.dataOverall = null;
      $scope.currentRankInPetronas = 0;
      if (!isLoadMore) {
        $scope.filterOverall.start = 0;
        $scope.filterOverall.length = 0;
      }
      $scope.filterOverall.IsIndividual = $scope.IsIndividual;
      LeaderboardApi.getCommunityScoreRanking("Overall", $scope.filterOverall).then(function (data) {
        if (data != null) {
          $scope.filterOverall.start = data.skip;
          $scope.filterOverall.length = data.take + 4;
          $scope.dataOverall = data;
          _.each(data.rankingListResponse, function (x, xIndex) {
            if ($scope.IsIndividual && x.userId == $scope.userInfo.userId) {
              $scope.currentRankInPetronas = x.rank;
            }
            if (!$scope.IsIndividual && x.userName == $scope.userInfo.divisionName) {
              $scope.currentRankInPetronas = x.rank;
            }
          });
        }
      }, function (error) {
        console.log(error);
      });
    }


    $scope.dataMyDivision = [];
    $scope.filterMyDivision = {
      type: "MyDivision",
      start: 0,
      length: 0,
      skip: 0, // don't care
      take: 0, // don't care
      fromDate: new Date(1, 1, 1900),
      toDate: new Date()
    };
    $scope.changeMyDivisionLoading = function (isLoadMore) {
      $scope.dataMyDivision = null;
      $scope.currentRankInDivision = 0;
      if (!isLoadMore) {
        $scope.filterMyDivision.start = 0;
        $scope.filterMyDivision.length = 0;
      }
      $scope.filterMyDivision.IsIndividual = $scope.IsIndividual;
      LeaderboardApi.getCommunityScoreRanking("MyDivision", $scope.filterMyDivision).then(function (data) {
        if (data != null) {
          $scope.filterMyDivision.start = data.skip;
          $scope.filterMyDivision.length = data.take + 4;
          $scope.dataMyDivision = data;

          _.each(data.rankingListResponse, function (x, xIndex) {
            if ($scope.IsIndividual && x.userId == $scope.userInfo.userId) {
              $scope.currentRankInDivision = x.rank;
            }
            if (!$scope.IsIndividual && x.userName == $scope.userInfo.departmentName) {
              $scope.currentRankInDivision = x.rank;
            }
          });
        }
      }, function (error) {
        console.log(error);
      });
    }

    $scope.dataMyDepartment = [];
    $scope.filterMyDepartment = {
      type: "MyDepartment",
      start: 0,
      length: 0,
      skip: 0, // don't care
      take: 0, // don't care
      fromDate: new Date(1, 1, 1900),
      toDate: new Date()
    };
    $scope.changeMyDepartmentLoading = function (isLoadMore) {
      $scope.dataMyDepartment = null;
      $scope.currentRankInDepartment = 0;
      if (!isLoadMore) {
        $scope.filterMyDepartment.start = 0;
        $scope.filterMyDepartment.length = 0;
      }
      $scope.filterMyDepartment.IsIndividual = $scope.IsIndividual;
      LeaderboardApi.getCommunityScoreRanking("MyDepartment", $scope.filterMyDepartment).then(function (data) {
        if (data != null) {
          $scope.filterMyDepartment.start = data.skip;
          $scope.filterMyDepartment.length = data.take + 4;
          $scope.dataMyDepartment = data;

          _.each(data.rankingListResponse, function (x, xIndex) {
            if (x.userId == $scope.userInfo.userId) {
              $scope.currentRankInDepartment = x.rank;
            }
          });
        }
      }, function (error) {
        console.log(error);
      });
    }


    // Load data
    function getData() {
      $scope.userInfo = UserProfileApi.getUserInfo();

      // Load Community Score
      $scope.changeOverallLoading(false);
      $scope.changeMyDivisionLoading(false);
      $scope.changeMyDepartmentLoading(false);

      // Load score board header
      getScoreBoardHeader(null);
    }
    getData();

    function getScoreBoardHeader(filterResult) {
      filterResult = filterResult == null || filterResult == '' ? "Overall" : filterResult;
      LeaderboardApi.getGetScoreboardHeader(filterResult).then(function (data) {
        if (data != null) {
          $scope.dataScoreboardHeader = data;

          // Store current level
          if ($scope.dataScoreboardHeader != null) {
            _.each($scope.dataScoreboardHeader.headerItems, function (x, xIndex) {
              if (x.isUserInLevel == true) {
                $scope.currentlevelId = x.levelId;
              }
            });
          }

          // Load tab detail
          $scope.levelId = data.dataScoreboardHeader > 0 ? data.headerItems[0].levelId : 0;
          $scope.filterResult = data.filterResult > 0 ? data.filterResult[0] : "Overall";
          $scope.searchTerm = "";

          $scope.scoreboardChange($scope.currentlevelId, filterResult);
        }
      }, function (error) {
        console.log(error);
      });
    }

    // Load score board details
    function loadScoreboardDetail(levelId) {
      $scope.dataScoreboardDetails = [];
      LeaderboardApi.getScoreboardDetail(levelId, $scope.filterResult, $scope.searchTerm).then(function (res) {
        if (res != null) {
          $scope.levelId = levelId;
          // Set default tab selected after search
          _.each($scope.dataScoreboardHeader.headerItems, function (x, xIndex) {
            x.isUserInLevel = x.levelId == levelId;
          });
          $scope.dataScoreboardDetails = res;
        }
      }, function (error) {
        console.log(error);
      });
    }
    $scope.searchScoreboardDetail = function () {
      loadScoreboardDetail($scope.currentlevelId);
    }

    // scoreboardTabChange
    $scope.scoreboardChange = function (levelId, filterResult) {
      if (levelId != 0) {
        $scope.levelId = levelId;
        if ($scope.dataScoreboardHeader != null) {
          _.each($scope.dataScoreboardHeader.headerItems, function (x, xIndex) {
            x.isUserInLevel = x.levelId == levelId;
          });
        }
      }
      if (filterResult != null) {
        $scope.filterResult = filterResult;
      }
      loadScoreboardDetail($scope.levelId);
    }

    // scoreboardTabChange
    $scope.scoreboardFilterResultChange = function (levelId, filterResult) {
      getScoreBoardHeader(filterResult);
    }

    // DatNT38 - Remove date filter
    $scope.removeFilter = function () {
      $scope.showDropdown = false;
      $scope.filter = "All";
      $scope.defaultFilter = "year";

      $scope.filterOverall.fromDate = new Date(1, 1, 1900);
      $scope.filterMyDivision.fromDate = $scope.filterOverall.fromDate;
      $scope.filterMyDepartment.fromDate = $scope.filterOverall.fromDate;

      $scope.filterOverall.toDate = new Date();
      $scope.filterMyDivision.toDate = $scope.filterOverall.toDate;
      $scope.filterMyDepartment.toDate = $scope.filterOverall.toDate;

      // Reload data for top trending
      $scope.changeOverallLoading(false);
      $scope.changeMyDivisionLoading(false);
      $scope.changeMyDepartmentLoading(false);
      $(".range_filter").find('.start-date:first').removeClass('start-date');
    }

    $scope.applyFilter = function (typeId, obj) {
      var filter = {
        Departments: [],
        Divisions: []
      }

      if (obj) {
        switch (typeId) {
          case 1: {
            filter.Departments.push({
              name: obj.userName,
              id: obj.userId
            });
            break;
          }
          case 2: {
            filter.Divisions.push({
              name: obj.userName,
              id: obj.userId
            });
            break;
          }
          default:
        }
      }
      InsightsCommonService.applyFilter(
        $filter('date')($scope.fromDate, "yyyy-MM-dd"),
        $filter('date')($scope.toDate, "yyyy-MM-dd"),
        null,
        filter,
        "app.expertDirectory"
      );
    }
  }
})();
