/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.landingPage')
        .directive('discussion', discussion);

    /** @ngInject */
    function discussion() {

        return {
            restrict: 'E',
            scope: {
                discussion: '=',
            },
            controller: function ($scope , appConfig) {
                $scope.color;
                $scope.arrcolors= appConfig.copCategoryColor;
                $scope.newMessage = $scope.discussion.message.replace(/(<([^>]+)>)/gi, "");

                function setDiscussionColor(){
                    if($scope.discussion.copGroup == 'Operation & Technology'){
                        $scope.color = $scope.arrcolors[0];
                    }
                    else if($scope.discussion.copGroup == 'Engineering & Maintenance'){
                        $scope.color = $scope.arrcolors[1];
                    }
                    else if($scope.discussion.copGroup == 'Project Management'){
                        $scope.color = $scope.arrcolors[2];
                    }
                    else if($scope.discussion.copGroup == 'Business Improvement'){
                        $scope.color = $scope.arrcolors[3];
                    }
                    else if($scope.discussion.copGroup == 'Production, Development & Exploration'){
                        $scope.color = $scope.arrcolors[4];
                    }
                    else if($scope.discussion.copGroup == 'HSE'){
                        $scope.color = $scope.arrcolors[5];
                    }
                    else if($scope.discussion.copGroup == 'Business Enablers'){
                        $scope.color = $scope.arrcolors[6];
                    }
                    else if($scope.discussion.copGroup == 'Technical Data'){
                        $scope.color = $scope.arrcolors[7];
                    }
                }

                setDiscussionColor();

            },
            templateUrl: 'app/main/apps/landing-page/directives/discussion.html'
            
        };
    }
})();
