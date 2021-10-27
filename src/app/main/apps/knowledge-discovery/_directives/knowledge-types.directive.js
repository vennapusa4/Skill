/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('knowledgeTypes', knowledgeTypes);

    /** @ngInject */
    function knowledgeTypes() {

        return {
            restrict: 'E',
            scope: {
              name: '=',
              current: '=',
              total: '=',
              description: '=',
              firststep: '='
            },
            controller: function ($scope,UserProfileApi) {
               
               // $scope.article.description = $scope.article.description.slice(0, 270)+"...";
               $scope.userInfo = {};
               $scope.userInfo = UserProfileApi.getUserInfo();
               $scope.userInfo.isAdmin=$scope.userInfo.roles.indexOf("Administrator")!=-1;
               if($scope.firststep == undefined) {
                  
                   $scope.stepOne = 'Knowledge';
               } else {
                $scope.stepOne = $scope.firststep;
               }

            $scope.changePage = function(data) {
                if(data !== $scope.name) {
                    var redirect = '';
                    if(data == 'Lesson Learnt') {
                        redirect = 'app.knowledgeDiscovery.lessonsLearnt.build'
                    } else if(data == 'Best Practice') {
                        redirect = 'app.knowledgeDiscovery.bestPractices.build'
                    } else if(data == 'Publication') {
                        redirect = 'app.knowledgeDiscovery.publications.build'
                    } else if(data == 'Technical Alert') {
                        redirect = 'app.knowledgeDiscovery.technicalAlerts.build'
                    } else if(data == 'Bulk Upload') {
                        redirect = 'app.bulkUpload'
                    } else if(data == 'Insights') {
                        redirect = 'app.knowledgeDiscovery.insights.build'
                    }
                    else if(data == 'Create Collection') {
                        redirect = 'app.knowledgeDiscovery.collections.build'
                    }
                    $scope.$emit('changePage', redirect);
                }
            }

            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/knowledge-types.html'
            
        };
    }
})();
