/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillBookmarkCollection', skillBookmarkCollection);

    /** @ngInject */
    function skillBookmarkCollection(CollectionApi) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope) {

                $scope.postSave = function (collectionId) {
                    if ($scope.data.isDisabledSaveToLibrary == true) return;

                    var isSaved = $scope.data.isSavedToLibrary || false;
                    if (isSaved) {
                        $scope.data.isSavedToLibrary = false;
                        $scope.data.totalSaveLibraryCount--;
                        if ($scope.data.totalSaveLibraryCount <= 0) {
                            $scope.data.totalSaveLibraryCount = 0;
                        }

                        CollectionApi.postSave(collectionId, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.isSavedToLibrary = true;
                                $scope.data.totalSaveLibraryCount++;
                            }
                        }, function (error) {
                            $scope.data.isSavedToLibrary = false;
                            $scope.data.totalSaveLibraryCount++;
                        });
                    }
                    else {
                        $scope.data.isSavedToLibrary = true;
                        $scope.data.totalSaveLibraryCount++;
                        CollectionApi.postSave(collectionId, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalSaveLibraryCount--;
                                if ($scope.data.totalSaveLibraryCount <= 0) {
                                    $scope.data.totalSaveLibraryCount = 0;
                                }
                            }
                        }, function (error) {
                            $scope.data.totalSaveLibraryCount--;
                            if ($scope.data.totalSaveLibraryCount <= 0) {
                                $scope.data.totalSaveLibraryCount = 0;
                            }
                        });
                    }

                    return false;
                }
            },
            templateUrl: 'app/main/directives/skill-bookmark-collection.html',
        };
    }
})();