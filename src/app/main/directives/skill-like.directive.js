/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillLike', skillLike);

    /** @ngInject */
    function skillLike(KnowledgeDocumentApi, $rootScope) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope) {

                $scope.postLike = function (kdId) {
                    var isLiked = $scope.data.isLiked || false;
                    if (isLiked) {
                        $scope.data.isLiked = false;
                        $scope.data.totalLikesCount--;
                        if ($scope.data.totalLikesCount <= 0) {
                            $scope.data.totalLikesCount = 0;
                        }
                        KnowledgeDocumentApi.postLike(kdId, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikesCount++;
                                $scope.data.isLiked = true;
                            }
                            $rootScope.$broadcast('updateTotalLikeCount', {
                                kdId: $scope.data.kdId,
                                isLiked: $scope.data.isLiked
                            });
                        }, function (error) {
                            $scope.data.totalLikesCount++;
                            $scope.data.isLiked = true;
                        });
                    }
                    else {
                        $scope.data.isLiked = true;
                        $scope.data.totalLikesCount++;
                        KnowledgeDocumentApi.postLike(kdId, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikesCount--;
                                if ($scope.data.totalLikesCount <= 0) {
                                    $scope.data.totalLikesCount = 0;
                                }
                                $scope.data.isLiked = false;
                            }
                            $rootScope.$broadcast('updateTotalLikeCount', {
                                kdId: $scope.data.kdId,
                                isLiked: $scope.data.isLiked
                            });
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
            templateUrl: 'app/main/directives/skill-like.html',
        };
    }
})();
