/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.leaderboard')
    .directive('leaderboardMyLevelTag', leaderboardMyLevelTag);
  /** @ngInject */
  function leaderboardMyLevelTag() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {},
      controller: function ($scope, LeaderboardApi, UserProfileApi, LeaderboardCommonService) {
        // Declare variable
        $scope.data = {};
        $scope.currentUser = {};

        // Load My Level
        function getMyLevel() {
          LeaderboardApi.getMyLevel().then(function (data) {
            if (data != null) {
              $scope.data = data;
            }

            // dump data
            //$scope.data = {
            //  "currentLevel": "Master",
            //  "currentBadgeUrl": "/assets/images/badges/master.png",
            //  "currentPoint": 27100,
            //  "nextLevel": "Elite",
            //  "nextBadgeUrl": "/assets/images/badges/elite.png",
            //  "nextPoint": 30000,
            //  "latestReceived": {
            //    "point": 25,
            //    "trigger": "todo",
            //    "kdId": 1,
            //    "kdTitle": "Electro-pneumatic Converter for Direct Current Signals"
            //  },
            //  "levelProgression": [
            //    {
            //      "level": "Apprentice",
            //      "requirementsToUnlock": "string",
            //      "requirementsToUnlockValue": 0,
            //      "dateUnlocked": "2017-10-03",
            //      "levelPhotoUrl": "/assets/images/badges/apprentice.png"
            //    },
            //    {
            //      "level": "Practitioner",
            //      "requirementsToUnlock": "string",
            //      "requirementsToUnlockValue": 10000,
            //      "dateUnlocked": "2018-04-05",
            //      "levelPhotoUrl": "/assets/images/badges/practitioner.png"
            //    },
            //    {
            //      "level": "Master",
            //      "requirementsToUnlock": "string",
            //      "requirementsToUnlockValue": 20000,
            //      "dateUnlocked": "2018-11-10",
            //      "levelPhotoUrl": "/assets/images/badges/master.png"
            //    },
            //    {
            //      "level": "Elite",
            //      "requirementsToUnlock": "string",
            //      "requirementsToUnlockValue": 30000,
            //      "dateUnlocked": "",
            //      "levelPhotoUrl": "/assets/images/badges/elite.png"
            //    }
            //  ]
            //};
          }, function (error) {
            console.log(error);
          });
        }

        // Load page
        function loadPage() {
          $scope.currentUser = UserProfileApi.getUserInfo();
          getMyLevel();
        }
        loadPage();

        // Common function
        $scope.formatTime = function (str) {
            try {
                var mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(str);
                var seconds = Math.floor((new Date() - date) / 1000);

                var interval = Math.floor(seconds / 31536000);

                if (interval > 1) {
                    return date.getDate() + " " + mlist[date.getMonth()] + " " + date.getFullYear();
                }
                interval = Math.floor(seconds / 2592000);
                if (interval > 1) {
                    return date.getDate() + " " + mlist[date.getMonth()] + " " + date.getFullYear();
                }
                interval = Math.floor(seconds / 86400);
                if (interval > 1) {
                    return interval + " days ago";
                }
                interval = Math.floor(seconds / 3600);
                if (interval > 1) {
                    return interval + " hours ago";
                }
                interval = Math.floor(seconds / 60);
                if (interval > 1) {
                    return interval + " minutes ago";
                }
                return Math.floor(seconds) + " seconds ago";
            } catch (e) {
                return str;
            }
        }

        $scope.formatDate = function (str) {
            try {
                var mlist = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(str);
                return date.getDate() + " " + mlist[date.getMonth()] + " " + date.getFullYear();
            } catch (e) {
                return str;
            }
        }
      },
      templateUrl: 'app/main/apps/leaderboard/_directives/my-achievements/my-level.html',
    };
  }
})();
