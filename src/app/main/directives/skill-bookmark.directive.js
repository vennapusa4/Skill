/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillBookmark', skillBookmark);

    /** @ngInject */
    function skillBookmark(KnowledgeDocumentApi, $rootScope) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
                hidetotal:'='
            },
            controller: function ($scope) {
                // $(".bookmark1").attr("title",$scope.data.totalSaveLibraryCount);
                $scope.postSave = function (kdId,e) {
                    e.preventDefault();
                    if ($scope.data.isDisabledSaveToLibrary == true) return;

                    var isSaved = $scope.data.isSavedToLibrary || false;
                    if (isSaved) {
                        $scope.data.isSavedToLibrary = false;
                        $scope.data.totalSaveLibraryCount--;
                        if ($scope.data.totalSaveLibraryCount <= 0) {
                            $scope.data.totalSaveLibraryCount = 0;
                        }

                        KnowledgeDocumentApi.postSave(kdId, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.isSavedToLibrary = true;
                                $scope.data.totalSaveLibraryCount++;
                            }
                            $rootScope.$broadcast('updateTotalBookmarkCount', {
                                kdId: $scope.data.kdId,
                                isSavedToLibrary: $scope.data.isSavedToLibrary
                            });
                        }, function (error) {
                            $scope.data.isSavedToLibrary = false;
                            $scope.data.totalSaveLibraryCount++;
                        });
                    }
                    else {
                        $scope.data.isSavedToLibrary = true;
                        $scope.data.totalSaveLibraryCount++;
                        KnowledgeDocumentApi.postSave(kdId, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalSaveLibraryCount--;
                                if ($scope.data.totalSaveLibraryCount <= 0) {
                                    $scope.data.totalSaveLibraryCount = 0;
                                }
                            }
                            $rootScope.$broadcast('updateTotalBookmarkCount', {
                                kdId: $scope.data.kdId,
                                isSavedToLibrary: $scope.data.isSavedToLibrary
                            });
                        }, function (error) {
                            $scope.data.totalSaveLibraryCount--;
                            if ($scope.data.totalSaveLibraryCount <= 0) {
                                $scope.data.totalSaveLibraryCount = 0;
                            }
                        });
                    }
                    // $(".bookmark1").removeAttr("title");
                    // $(".bookmark1").attr("data-original-title",$scope.data.totalSaveLibraryCount);
                    return false;
                }
            },
            templateUrl: 'app/main/directives/skill-bookmark.html',
        };
    }
})();
