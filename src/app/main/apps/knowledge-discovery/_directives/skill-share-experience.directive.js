/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('skillShareExperience', skillShareExperience);

    /** @ngInject */
    function skillShareExperience() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                kdId: '<',
                kdTitle: '<',
            },
            controller: function ($scope, $state) {
                $scope.ShareClick = function (type) {
                    switch (type) {
                        case 1: {
                            $state.go('app.knowledgeDiscovery.lessonsLearnt.build', { shareId: $scope.kdId, shareTitle: $scope.kdTitle });
                            break;
                        }
                        case 2: {
                            $state.go('app.knowledgeDiscovery.bestPractices.build', { shareId: $scope.kdId, shareTitle: $scope.kdTitle });
                            break;
                        }
                        case 3: {
                            $state.go('app.knowledgeDiscovery.publications.build', { shareId: $scope.kdId, shareTitle: $scope.kdTitle });
                            break;
                        }
                        case 4: {
                            $state.go('app.bulkUpload', { shareId: $scope.kdId, shareTitle: $scope.kdTitle });
                            break;
                        }
                        default:
                    }
                }
            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-share-experience.html',
        };
    }
})();
