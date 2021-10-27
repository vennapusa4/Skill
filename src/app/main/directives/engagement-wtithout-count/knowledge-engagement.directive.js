/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.SearchPage')
        .directive('knowledgeEngagement', knowledgeEngagement);

    /** @ngInject */
    function knowledgeEngagement() {

        return {
            restrict: 'E',
            scope: {
              article: '=',
              pagename: '='
            },
            controller: function ($scope,KnowledgeDocumentApi,$rootScope, $state) {
            
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";

               $scope.showKnowledgeArticle = function(knowledge){
                var redirect = $state.href('app.knowledgeDiscovery.knowledgeDetail', { id: knowledge.articleID });
                $window.open(redirect, '_blank');
              }

               $scope.showArticleShare = function (data) {
                $scope.$emit('modalShareOpen', data);
               }

               $scope.postSave = function (articleID) {
                if ($scope.article.isDisabledSaveToLibrary == true) return;

                var isSaved = $scope.article.isBookmarked || false;
                if (isSaved) {
                    $scope.article.isBookmarked = false;
                    $scope.article.totalBookmark--;
                    if ($scope.article.totalBookmark <= 0) {
                        $scope.article.totalBookmark = 0;
                    }

                    KnowledgeDocumentApi.postSave(articleID, false).then(function (data) {
                        if (!data.isSuccess) {
                            $scope.article.isSavedToLibrary = true;
                            $scope.article.totalSaveLibraryCount++;
                        }
                        $rootScope.$broadcast('updateTotalBookmarkCount', {
                            kdId: $scope.article.kdId,
                            isSavedToLibrary: $scope.article.isSavedToLibrary
                        });
                    }, function (error) {
                        $scope.article.isSavedToLibrary = false;
                        $scope.article.totalSaveLibraryCount++;
                    });
                }
                else {
                    $scope.article.isBookmarked = true;
                    $scope.article.totalBookmark++;
                    KnowledgeDocumentApi.postSave(articleID, true).then(function (data) {
                        if (!data.isSuccess) {
                            $scope.article.totalSaveLibraryCount--;
                            if ($scope.article.totalSaveLibraryCount <= 0) {
                                $scope.article.totalSaveLibraryCount = 0;
                            }
                        }
                        $rootScope.$broadcast('updateTotalBookmarkCount', {
                            kdId: $scope.article.articleID,
                            isSavedToLibrary: $scope.article.isBookmarked
                        });
                    }, function (error) {
                        $scope.data.totalSaveLibraryCount--;
                        if ($scope.article.totalSaveLibraryCount <= 0) {
                            $scope.article.totalSaveLibraryCount = 0;
                        }
                    });
                }

                return false;
            }

            },
            templateUrl: 'app/main/directives/engagement-wtithout-count/knowledge-engagement.html'
            
        };
    }
})();
