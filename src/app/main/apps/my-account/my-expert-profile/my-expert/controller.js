(function () {
    'use strict';

    angular
        .module('app.myAccount')
        .controller('MyExpertProfileMyExpertController', MyExpertProfileMyExpertController);

    /** @ngInject */
    function MyExpertProfileMyExpertController($rootScope, $scope, $stateParams, UserProfileApi) {

        $scope.SearchResult = {};

        /* PAGING */
        $scope.fromPos = 0;
        $scope.toPos = 0;
        $scope.pageIndex = 1;
        $scope.pageSize = 5;
        $scope.maxSize = 5;

        $scope.setPage = function (pageNo) {
            $scope.pageIndex = pageNo;
        };

        $scope.pageChanged = function () {
            $scope.search();
        };
        $scope.changeSortBy = function () {
            $scope.pageIndex = 1;
            $scope.search();
        }

        var userId = $stateParams.id;
        if (userId == null || userId == 0) {
            userId = $rootScope.userInfo.userId;
        }

        function _search() {
            var postData = _getPostData();
            UserProfileApi.getExpertProfilePaging(postData).then(function (data) {
                $scope.SearchResult = data;
                if (data.total > 0) {
                    $scope.fromPos = postData.skip + 1;
                    $scope.toPos = $scope.fromPos + data.data.length - 1;
                }
                else {
                    $scope.fromPos = 0;
                    $scope.toPos = 0;
                }
            })
        }

        function _getPostData() {
            return {
                UserId: userId,

                sortBy: '',
                skip: ($scope.pageIndex - 1) * $scope.pageSize,
                take: $scope.pageSize
            };
        }

        $scope.search = _search;
        $scope.search();
    }
})();
