/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.bulkUpload')
        .directive('busubmission', busubmission);

    /** @ngInject */
    function busubmission(UserProfileApi, Utils, $rootScope) {
        return {
            restrict: 'AE',
            scope: {
                showAa: '=',
                iamauthor: '=',
                authors: '=',
                arrindexs: '@',
                idx: '@'
            },
            controller: function ($scope) {
                $scope.SubmissionBy = {};
                $scope.Authors = [];

                $scope.loadPage = function () {
                    $scope.SubmissionBy = UserProfileApi.getUserInfo();
                    $scope.Authors = $scope.authors;
                    $scope.IdIndex = $scope.idx != '' ? JSON.parse($scope.idx) : -1;
                    $scope.ArrIndexs = $scope.arrindexs != '' ? $scope.arrindexs.split(',') : [];

                    $scope.Avatar = Utils.getImage('avatar', $scope.SubmissionBy.id);
                    $scope.IsAuthor = $scope.iamauthor;//_.findIndex($scope.Authors, ['isSubmission', true]) !== -1;
                }
                $scope.loadPage();

                $scope.Submit = function (event) {
                    $scope.$parent.authorIds = $scope.Authors;
                    $scope.$parent.isSaveAuthor = true;
                    $rootScope.$broadcast('GetAuthorsList', { isSaveAuthor: true, authorIds: $scope.Authors, idx: $scope.IdIndex, indexSelecteds: $scope.ArrIndexs });
                };


                $scope.$watch('Authors', function (next, prev) {
                    $scope.ArrIndexs = $scope.arrindexs != '' ? $scope.arrindexs.split(',') : [];
                    if ($scope.ArrIndexs.length > 0) {
                        $rootScope.$broadcast('GetAuthorsList', { isSaveAuthor: false, authors: $scope.Authors, idx: $scope.IdIndex, indexSelecteds: $scope.ArrIndexs });
                    }
                }, true);

                function _AlsoAuthor() {
                    if ($scope.showAa) {
                        $scope.$broadcast('AlsoAuthor', { status: $scope.IsAuthor, submissionBy: $scope.SubmissionBy });
                    } else {
                        $scope.$parent.$broadcast('AlsoAuthor', { status: $scope.IsAuthor, submissionBy: $scope.SubmissionBy });
                    }
                }
                $scope.AlsoAuthor = _AlsoAuthor;
            },
            templateUrl: 'app/main/apps/bulk-upload/_directives/bu-submission.html',
        };
    }
})();
