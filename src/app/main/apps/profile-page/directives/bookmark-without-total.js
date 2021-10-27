/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('bookmarkWithoutTotal', bookmarkWithoutTotal);

    /** @ngInject */
    function bookmarkWithoutTotal(KnowledgeDocumentApi, $rootScope) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope) {

                $scope.postSave = function (articleID) {
                    if ($scope.data.isDisabledSaveToLibrary == true) return;

                    var isSaved = $scope.data.isBookmarked || false;
                    if (isSaved) {
                        $scope.data.isBookmarked = false;
                       
                        KnowledgeDocumentApi.postSave(articleID, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.isSavedToLibrary = true;
                               // $scope.data.totalSaveLibraryCount++;
                            }
                            $rootScope.$broadcast('updateTotalBookmarkCount', {
                                kdId: $scope.data.kdId,
                                isSavedToLibrary: $scope.data.isSavedToLibrary
                            });
                        }, function (error) {
                            $scope.data.isSavedToLibrary = false;
                            //$scope.data.totalSaveLibraryCount++;
                        });
                    }
                    else {
                        $scope.data.isBookmarked = true;
                        $scope.data.totalBookmark++;
                        KnowledgeDocumentApi.postSave(articleID, true).then(function (data) {
                      
                            $rootScope.$broadcast('updateTotalBookmarkCount', {
                                kdId: $scope.data.articleID,
                                isSavedToLibrary: $scope.data.isBookmarked
                            });
                        }, function (error) {
                         
                        });
                    }

                    return false;
                }
            },
            templateUrl: 'app/main/apps/profile-page/directives/bookmark-without-total.html',
        };
    }
})();
