/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillLikeCollection', skillLikeCollection);

    /** @ngInject */
    function skillLikeCollection(CollectionApi) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope) {
                $scope.postLike = function (collectionId) {
                    var isLiked = $scope.data.isLiked || false;
                    if (isLiked) {
                        $scope.data.isLiked = false;
                        $scope.data.totalLikesCount--;
                        if ($scope.data.totalLikesCount <= 0) {
                            $scope.data.totalLikesCount = 0;
                        }
                        CollectionApi.postLike(collectionId, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikesCount++;
                                $scope.data.isLiked = true;
                            }
                        }, function (error) {
                            $scope.data.totalLikesCount++;
                            $scope.data.isLiked = true;
                        });
                    }
                    else {
                        $scope.data.isLiked = true;
                        $scope.data.totalLikesCount++;
                        CollectionApi.postLike(collectionId, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikesCount--;
                                if ($scope.data.totalLikesCount <= 0) {
                                    $scope.data.totalLikesCount = 0;
                                }
                                $scope.data.isLiked = false;
                            }
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
            templateUrl: 'app/main/directives/skill-like-collection.html',
        };
    }
})();