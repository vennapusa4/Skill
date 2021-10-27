/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('skillLikeLandingpage', skillLikeLandingpage);

    /** @ngInject */
    function skillLikeLandingpage(KnowledgeDocumentApi, $rootScope) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
                pagename: '=',
                articleID : '='
            },
            controller: function ($scope) {

                $scope.postLike = function (articleID) {
                    var isLiked = $scope.data.isLiked || false;
                    if (isLiked) {
                        $scope.data.isLiked = false;
                        $scope.data.totalLikes--;
                        if ($scope.data.totalLikes <= 0) {
                            $scope.data.totalLikes = 0;
                        }
                        KnowledgeDocumentApi.postLike(articleID, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikes++;
                                $scope.data.isLiked = true;
                            }
                            $rootScope.$broadcast('updateTotalLikeCount', {
                                articleID: $scope.data.articleID,
                                isLiked: $scope.data.isLiked
                            });
                        }, function (error) {
                            $scope.data.totalLikes++;
                            $scope.data.isLiked = true;
                        });
                    }
                    else {
                        $scope.data.isLiked = true;
                        $scope.data.totalLikes++;
                        KnowledgeDocumentApi.postLike(articleID, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalLikes--;
                                if ($scope.data.totalLikes <= 0) {
                                    $scope.data.totalLikes = 0;
                                }
                                $scope.data.isLiked = false;
                            }
                            $rootScope.$broadcast('updateTotalLikeCount', {
                                articleID: $scope.data.articleID,
                                isLiked: $scope.data.isLiked
                            });
                        }, function (error) {
                            $scope.data.totalLikes--;
                            if ($scope.data.totalLikes <= 0) {
                                $scope.data.totalLikes = 0;
                            }
                            $scope.data.isLiked = false;
                        });
                    }

                    return false;
                }

                $scope.showKnowledgeArticle = function(knowledge){
               
                    $scope.$broadcast('onLikeClick', knowledge);
                    $scope.$emit('onLikeClick', knowledge);
                }
            },
            templateUrl: 'app/main/apps/landing-page/directives/skill-like-landingpage.html',
        };
    }
})();
