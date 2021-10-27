/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('peopleCardList', peopleCardList);

    /** @ngInject */
    function peopleCardList() {

        return {
            restrict: 'E',
            scope: {
                user:'=',
            },
            controller: function ($scope , $element, AdminSettingCoPApi, searchPageAPI, appConfig , CollectionApi, $log, logger, UserProfileApi) {
                $scope.isDisableButton = false;
                $scope.currentuser = UserProfileApi.getUserInfo();
                $scope.followButtonClick =  function (peopleId){
                    $scope.isDisableButton = true;
                    searchPageAPI.FollowingPeople(peopleId).then(function(res){
                        $scope.user.isFollowing = !$scope.user.isFollowing;
                        $scope.isDisableButton = false;
                        $scope.$emit('successFollow' , peopleId);
                    })
                }
            },
            templateUrl: 'app/main/directives/people-card-list.html'
            
        };
    }
})();
