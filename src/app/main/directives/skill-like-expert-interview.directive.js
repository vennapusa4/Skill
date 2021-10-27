/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillLikeExpertInterview', skillLikeExpertInterview);

    /** @ngInject */
    function skillLikeExpertInterview(ExpertInterviewApi, $rootScope) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope) {

                $scope.postLike = function (expertInterviewId) {
                    var isLiked = $scope.data.isLiked || false;
                    if (isLiked) {
                        $scope.data.isLiked = false;
                        $scope.data.totalLikesCount--;
                        if ($scope.data.totalLikesCount <= 0) {
                            $scope.data.totalLikesCount = 0;
                        }
                        ExpertInterviewApi.postLike(expertInterviewId, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikesCount++;
                                $scope.data.isLiked = true;
                            }
                            $rootScope.$broadcast('updateExpertInterviewTotalLikeCount', $scope.data.isLiked);
                        }, function (error) {
                            $scope.data.totalLikesCount++;
                            $scope.data.isLiked = true;
                        });
                    }
                    else {
                        $scope.data.isLiked = true;
                        $scope.data.totalLikesCount++;
                        ExpertInterviewApi.postLike(expertInterviewId, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikesCount--;
                                if ($scope.data.totalLikesCount <= 0) {
                                    $scope.data.totalLikesCount = 0;
                                }
                                $scope.data.isLiked = false;
                            }
                            $rootScope.$broadcast('updateExpertInterviewTotalLikeCount', $scope.data.isLiked);
                        }, function (error) {
                            $scope.data.totalLikesCount--;
                            if ($scope.data.totalLikesCount <= 0) {
                                $scope.data.totalLikesCount = 0;
                            }
                            $scope.data.isLiked = false;
                        });
                    }

                    return false;
                }
            },
            templateUrl: 'app/main/directives/skill-like-expert-interview.html',
        };
    }
})();
