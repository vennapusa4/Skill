/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.expertInterview')
        .directive('skillBookmarkExpertInterview', skillBookmarkExpertInterview);

    /** @ngInject */
    function skillBookmarkExpertInterview(ExpertInterviewApi, $rootScope) {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function ($scope) {

                $scope.postSave = function (expertInterviewId) {
                    if ($scope.data.isDisabledSaveToLibrary == true) return;

                    var isSaved = $scope.data.isSavedToLibrary || false;
                    if (isSaved) {
                        $scope.data.isSavedToLibrary = false;
                        $scope.data.totalSaveLibraryCount--;
                        if ($scope.data.totalSaveLibraryCount <= 0) {
                            $scope.data.totalSaveLibraryCount = 0;
                        }

                        ExpertInterviewApi.postSave(expertInterviewId, false).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.isSavedToLibrary = true;
                                $scope.data.totalSaveLibraryCount++;
                            }
                            $rootScope.$broadcast('updateExpertInterviewTotalBookmarkCount', $scope.data.isSavedToLibrary);
                        }, function (error) {
                            $scope.data.isSavedToLibrary = false;
                            $scope.data.totalSaveLibraryCount++;
                        });
                    }
                    else {
                        $scope.data.isSavedToLibrary = true;
                        $scope.data.totalSaveLibraryCount++;
                        ExpertInterviewApi.postSave(expertInterviewId, true).then(function (data) {
                            if (!data.isSuccess) {
                                $scope.data.totalSaveLibraryCount--;
                                if ($scope.data.totalSaveLibraryCount <= 0) {
                                    $scope.data.totalSaveLibraryCount = 0;
                                }
                            }
                            $rootScope.$broadcast('updateExpertInterviewTotalBookmarkCount', $scope.data.isSavedToLibrary);
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
            templateUrl: 'app/main/directives/skill-bookmark-expert-interview.html',
        };
    }
})();
