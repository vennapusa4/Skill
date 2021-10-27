/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('peopleCard', peopleCard);

    /** @ngInject */
    function peopleCard() {

        return {
            restrict: 'E',
            scope: {
                user:'='
            },
            controller: function ($scope , $element, AdminSettingCoPApi, appConfig, searchPageAPI, CollectionApi, $log, logger, UserProfileApi) {
                $scope.currentuser = UserProfileApi.getUserInfo();
                $scope.isDisableButton = false;
                $scope.followButtonClick =  function (peopleId){
                    $scope.isDisableButton = true;
                    searchPageAPI.FollowingPeople(peopleId).then(function(res){
                        $scope.user.isFollowing = !$scope.user.isFollowing;
                        $scope.isDisableButton = false;
                        $scope.$emit('successFollow' , peopleId);
                    })
                }
            },
            templateUrl: 'app/main/directives/people-card.html'
            
        };
    }
})();
