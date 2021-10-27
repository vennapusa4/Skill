/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.leaderboard')
        .directive('leaderboardMyEarnedBadgesTag', leaderboardMyEarnedBadgesTag);
    /** @ngInject */
    function leaderboardMyEarnedBadgesTag() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($scope, LeaderboardApi, appConfig) {
                // Declare variable
                $scope.data = [];
                $scope.arrClassBadge = appConfig.arrClassBadge;

                // Load My Earned Badges
                function getMyEarnedBadges() {
                    LeaderboardApi.getMyEarnedBadges().then(function (data) {
                        if (data != null) {
                            //data = [
                            //    {
                            //        "badgeId": 9,
                            //        "badgeName": "Master of Lessons 11",
                            //        "badgeImageUrl": "assets/images/badges/mobile.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 1,
                            //        "badgeName": "Master of Lessons 10",
                            //        "badgeImageUrl": "assets/images/badges/book.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 2,
                            //        "badgeName": "Master of Lessons 9",
                            //        "badgeImageUrl": "assets/images/badges/book.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 3,
                            //        "badgeName": "Master of Lessons 8",
                            //        "badgeImageUrl": "assets/images/badges/book.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 4,
                            //        "badgeName": "Master of Lessons 7",
                            //        "badgeImageUrl": "assets/images/badges/thumbsup.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 5,
                            //        "badgeName": "Master of Lessons 6",
                            //        "badgeImageUrl": "assets/images/badges/broadcast.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 6,
                            //        "badgeName": "Master of Lessons 5",
                            //        "badgeImageUrl": "assets/images/badges/diamond.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 7,
                            //        "badgeName": "Master of Lessons 4",
                            //        "badgeImageUrl": "assets/images/badges/diamond.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 8,
                            //        "badgeName": "Master of Lessons 3",
                            //        "badgeImageUrl": "assets/images/badges/mobile.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    },
                            //    {
                            //        "badgeId": 9,
                            //        "badgeName": "Master of Lessons 2",
                            //        "badgeImageUrl": "assets/images/badges/mobile.png",
                            //        "ruleName": "Submitted 10 Lesson Learnt knowledge."
                            //    }
                            //];
                            $scope.data = data;
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
            templateUrl: 'app/main/apps/leaderboard/_directives/my-achievements/my-earned-badges.html',
        };
    }
})();
