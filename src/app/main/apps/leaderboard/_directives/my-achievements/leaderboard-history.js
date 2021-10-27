/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.leaderboard')
        .directive('leaderboardHistoryTag', leaderboardHistoryTag);
    /** @ngInject */
    function leaderboardHistoryTag() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function ($scope, LeaderboardApi, InsightsCommonService) {
                $scope.data = [];
                $scope.isShowAll = false;
                // Load data
                $scope.getData = function (isShowAll) {
                    $scope.isShowAll = isShowAll;
                    LeaderboardApi.getMyAchievementHistory(isShowAll).then(function (data) {
                        if (data != null) {
                            //data = [{
                            //    "prefix": "Earned",
                            //    "point": 200,
                            //    "activity": "completing",
                            //    "knowledgeType": "",
                            //    "createdDate": "2018-11-13T08:54:47.378Z",
                            //    "kdId": 1,
                            //    "title": "Aspiring Techie"
                            //},
                            //{
                            //    "prefix": "Received",
                            //    "point": 10,
                            //    "activity": "submitting",
                            //    "knowledgeType": "Lesson Learnt",
                            //    "createdDate": "2018-11-13T08:54:47.378Z",
                            //    "kdId": 1,
                            //    "title": "Control Tuning"
                            //}];
                            _.each(data, function (x, xIndex) {
                                x.strCreatedDate = InsightsCommonService.dateTimeToText(x.createdDate);
                                x.strPoint = (x.point >= 0) ? ("+" + x.point) : x.point;
                            });
                            $scope.data = data;
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
                $scope.getData(false);
            },
            templateUrl: 'app/main/apps/leaderboard/_directives/my-achievements/leaderboard-history.html',
        };
    }
})();
