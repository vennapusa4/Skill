(function () {
  'use strict';

  angular
    .module('app.myAccount')
    .controller('UserProfileController', UserProfileController);

  /** @ngInject */
  function UserProfileController($rootScope, $scope, $stateParams, UserProfileApi, InsightsCommonService, $filter, appConfig, LeaderboardApi) {
    var vm = this;

    vm.userId = $stateParams.id;

    $scope.dataMyLevel = null;
    $scope.dataMyEarnedBadges = null;
    $scope.arrClassBadge = appConfig.arrClassBadge;

    // Load user Level
    function getUserLevel() {
      LeaderboardApi.getUserLevel(vm.userId).then(function (data) {
        if (data != null) {
          $scope.dataMyLevel = data;
        }
      }, function (error) {
        console.log(error);
      });
    }
    getUserLevel();

    function getUserEarnedBadges() {
      LeaderboardApi.getUserEarnedBadges(vm.userId).then(function (data) {
        if (data != null) {
          $scope.dataMyEarnedBadges = data;
        }
      }, function (error) {
        console.log(error);
      });
    }
    getUserEarnedBadges();

    $scope.setBadgeClassName = function (index) {
      if (index < $scope.arrClassBadge.length) {
        return $scope.arrClassBadge[index];
      } else {
        var tempIndex = index - $scope.arrClassBadge.length;
        return $scope.arrClassBadge[tempIndex];
      }
    }

    $scope.userInfo = {};
    if ($stateParams.id == null || $stateParams.id == 0) {
      $scope.userInfo = $rootScope.userInfo;
      vm.userId = $scope.userInfo.userId;
    } else {
      UserProfileApi.getLoginProfile(vm.userId).then(function (data) {
        $scope.userInfo = data;
        UserProfileApi.getProfile(vm.userId).then(function (data2) {
          $scope.userInfo = $.extend({}, $scope.userInfo, data2);
        });
      });
    }

    vm.UserRank = {};
    UserProfileApi.getRank(vm.userId).then(function (data) {
      vm.UserRank = data;
    });

    vm.flagShowHideMoreDetails = true;
    vm.showHideMoreDetails = function () {
      vm.flagShowHideMoreDetails = !vm.flagShowHideMoreDetails;
    }
    vm.applyFilter = function (typeId, obj) {
      var filter = {
        Disciplines: [],
        Subdisciplines: [],
        Skills: [],
        AreaOfExpertises: [],
        Experiences: []
      }

      if (obj) {

        switch (typeId) {
          case 1: {
            // Disciplines = 1
            filter.Disciplines.push({
              name: obj.disciplineName,
              id: obj.disciplineId
            });
            break;
          }
          case 2: {
            // Sub Disciplines = 2
            filter.Subdisciplines.push({
              name: obj.subdisciplineName,
              id: obj.subdisciplineId
            });
            break;
          }
          case 3: {
            // Area of Expertise = 3
            filter.AreaOfExpertises.push({
              name: obj.name,
              id: obj.id
            });
            break;
          }
          case 4: {
            // Skill = 4
            filter.Skills.push({
              name: obj.name,
              id: obj.id
            });
            break;
          }
          case 5: {
            // Experience = 5
            filter.Experiences.push({
              name: obj.name,
              id: obj.id
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
