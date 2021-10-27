/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillSkillRank', skillSkillRank);

  /** @ngInject */
  function skillSkillRank() {

    return {
      restrict: 'AE',
      scope: {
        data: '=',
        infor: '='
      },
      controller: function ($scope, LeaderboardApi, appConfig) {
        $scope.dataMyLevel = null;
        $scope.dataMyEarnedBadges = null;
        $scope.arrClassBadge = appConfig.arrClassBadge;

        // Load My Level
        function getMyLevel() {
          LeaderboardApi.getMyLevel().then(function (data) {
            if (data != null) {
              $scope.dataMyLevel = data;
            }
          }, function (error) {
            console.log(error);
          });
        }
        getMyLevel();

        function getMyEarnedBadges() {
          LeaderboardApi.getMyEarnedBadges().then(function (data) {
            if (data != null) {
              $scope.dataMyEarnedBadges = data;
            }
          }, function (error) {
            console.log(error);
          });
        }
        getMyEarnedBadges();

        $scope.setBadgeClassName = function (index) {
          if (index < $scope.arrClassBadge.length) {
            return $scope.arrClassBadge[index];
          } else {
            var tempIndex = index - $scope.arrClassBadge.length;
            return $scope.arrClassBadge[tempIndex];
          }
        }
      },
      templateUrl: 'app/main/apps/home/directives/skill-skill-rank.html',
    };
  }
})();
