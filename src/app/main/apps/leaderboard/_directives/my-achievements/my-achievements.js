/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.leaderboard')
    .directive('leaderboardMyAchievementsTag', leaderboardMyAchievementsTag);
  /** @ngInject */
  function leaderboardMyAchievementsTag() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {},
      controller: function ($scope, LeaderboardApi) {
        // Declare variable
        $scope.allTimePoint = 0;
        $scope.activeChallenge = 0;
        $scope.completedChallenge = 0;
        $scope.currentRank = 0;
        $scope.totalUser = 0;
        $scope.availableReward = 0;
        $scope.Last30Days = 'Last30Days';
        $scope.LastWeek = 'LastWeek';

        // Load My Achievements total data
        function getMyAchievement() {
          LeaderboardApi.getMyAchievement().then(function (data) {
            if (data != null) {
              $scope.allTimePoint = data.allTimePoint;
              $scope.activeChallenge = data.activeChallenge;
              $scope.completedChallenge = data.completedChallenge;
              $scope.currentRank = data.currentRank;
              $scope.totalUser = data.totalUser;
              $scope.availableReward = data.availableReward;
            }
          }, function (error) {
            console.log(error);
          });
        }

        // Tab 1
        $scope.Tab1_totalPointsScored = 0;
        $scope.Tab1_timeDistance = '';
        $scope.Tab1_chartLabel = [];
        $scope.Tab1_chartData = [];

        // Tab 2
        $scope.Tab2_totalPointsScored = 0;
        $scope.Tab2_timeDistance = '';
        $scope.Tab2_chartLabel = [];
        $scope.Tab2_chartData = [];

        // Tab 3
        $scope.Tab3_totalPointsScored = 0;
        $scope.Tab3_timeDistance = '';
        $scope.Tab3_chartLabel = [];
        $scope.Tab3_chartData = [];

        // Tab change handle
        $scope.filter = function (filterType) {
          LeaderboardApi.getMyAchievementFilter(filterType).then(function (response) {
            if (response != null) {
              switch (filterType) {
                case $scope.LastWeek: {
                  $scope.Tab1_totalPointsScored = response.totalPointsScored;
                  $scope.Tab1_timeDistance = response.timeDistance;
                  break;
                }
                case $scope.Last30Days: {
                  $scope.Tab2_totalPointsScored = response.totalPointsScored;
                  $scope.Tab2_timeDistance = response.timeDistance;
                  break;
                }
                default: {
                  $scope.Tab3_totalPointsScored = response.totalPointsScored;
                  $scope.Tab3_timeDistance = response.timeDistance;
                  break;
                }
              }
              drawChart(response, filterType);
            }
          }, function (error) {
            console.log(error);
          });
        }

        // Draw chart
        function drawChart(response, filterType) {
          if (response == null || response.chartData == null || response.chartData.length <= 0) {
            return;
          }
          var maxValue = _.max(response.chartData);
          var stepSize = maxValue / 5;
          // The data for our dataset

          var tempChartData = [];
          _.each(response.chartData, function (xo) {
            tempChartData.push(xo.toFixed(2));
          })
          response.chartData = tempChartData;

          var data1 = {
            labels: response.chartLabels,
            datasets: [{
              data: response.chartData,
              backgroundColor: 'rgba(255,255,255,1)',
            }]
          };
          // Configuration options go here
          var options1 = {
            maintainAspectRatio: false,
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            cornerRadius: 9,
            legend: { display: false },
            hover: { display: false },
            scales: {
              yAxes: [{
                gridLines: {
                  color: '#706CA0',
                },
                ticks: {
                  max: maxValue,
                  min: 0,
                  stepSize: stepSize,
                  beginAtZero: true,
                  fontColor: 'rgba(255,255,255,1)',
                  callback: function (value, index) {
                    if (value !== 0) return value.toFixed(2);
                  }
                },
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  drawBorder: false
                },
                ticks: {
                  display: false,
                },
                stacked: true,
                barPercentage: 1,
                categoryPercentage: 0.5,
                barThickness: 4,
              }]
            },
            tooltips: {
              // Add this..
              intersect: false
            }
          };

          var ctx1;
          switch (filterType) {
            case $scope.LastWeek: {
              ctx1 = $('#Chart1').get(0).getContext('2d');
              break;
            }
            case $scope.Last30Days: {
              ctx1 = $('#Chart2').get(0).getContext('2d');
              break;
            }
          }

          new Chart(ctx1, {
            type: 'bar',
            data: data1,
            options: options1
          });
        }

        // Load page
        function loadPage() {
          getMyAchievement();
          $scope.filter('LastWeek');
        }
        loadPage();
      },
      templateUrl: 'app/main/apps/leaderboard/_directives/my-achievements/my-achievements.html',
    };
  }
})();
