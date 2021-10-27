/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.leaderboard')
        .directive('leaderboardMyRankingTag', leaderboardMyRankingTag);
    /** @ngInject */
    function leaderboardMyRankingTag() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
          controller: function ($scope, LeaderboardApi) {
              // Declare variable
              $scope.data = {};

              // Load My Ranking
              function getMyRanking() {
                LeaderboardApi.getMyRanking().then(function (data) {
                  if (data != null) {
                    $scope.data = data;
                  }
                }, function (error) {
                  console.log(error);
                });
              }
            getMyRanking();
            },
            templateUrl: 'app/main/apps/leaderboard/_directives/my-achievements/my-ranking.html',
        };
    }
})();
