/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('happeningInCopList', happeningInCopList);

    /** @ngInject */
    function happeningInCopList() {

        return {
            restrict: 'E',
            scope: {
              cop: '=',
            },
            controller: function ($scope , appConfig , LandingPageAPI , UserProfileApi , $state) {
                $scope.color;
                $scope.arrcolors= appConfig.copCategoryColor;
               // $scope.cop.description = $scope.cop.description.slice(0, 210)+"...";

                function setCopColor(){
                    if($scope.cop.copGroup == 'Operation & Technology'){
                        $scope.color = $scope.arrcolors[0];
                    }
                    else if($scope.cop.copGroup== 'Engineering & Maintenance'){
                        $scope.color = $scope.arrcolors[1];
                    }
                    else if($scope.cop.copGroup == 'Project Management'){
                        $scope.color = $scope.arrcolors[2];
                    }
                    else if($scope.cop.copGroup == 'Business Improvement'){
                        $scope.color = $scope.arrcolors[3];
                    }
                    else if($scope.cop.copGroup == 'Production, Development & Exploration'){
                        $scope.color = $scope.arrcolors[4];
                    }
                    else if($scope.cop.copGroup == 'HSE'){
                        $scope.color = $scope.arrcolors[5];
                    }
                    else if($scope.cop.copGroup == 'Business Enablers'){
                        $scope.color = $scope.arrcolors[6];
                    }
                    else if($scope.cop.coPGroup == 'Technical Data'){
                        $scope.color = $scope.arrcolors[7];
                    }
                }

                $scope.requestToSubscribe = function(copID){
                    $scope.userInfo = UserProfileApi.getUserInfo(); 

                    $scope.postData = {
                        userId :   $scope.userInfo.userId,
                        copId: copID
                    }

                    LandingPageAPI.RequestToSubscribeToCop($scope.postData).then(function (data) {
                        $state.go('app.ProfilePage.cop', { copid: copID});
                     },function (error) {
                       logger.error(error);
                     });


                }


                $scope.requestToUnSubscribe = function(copID){
                    $scope.userInfo = UserProfileApi.getUserInfo(); 

                    $scope.postData = {
                        requesterId :   $scope.userInfo.userId,
                        copId: copID,
                        channelName : "General"
                    }                    

                    LandingPageAPI.requestToUnJoinChannel($scope.postData).then(function (data) {
                        $state.go('app.ProfilePage.cop', { copid: copID});
                     },function (error) {
                       logger.error(error);
                     });
                }
                setCopColor();
                $scope.setCopColor = setCopColor;
            },
            templateUrl: 'app/main/apps/landing-page/directives/happening-in-cop-list.html'
            
        };
    }
})();
