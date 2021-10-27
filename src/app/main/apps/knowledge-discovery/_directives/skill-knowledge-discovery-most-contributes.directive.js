/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    // skill-knowledge-discovery-most-contributes.directive
    angular.module('app.knowledgeDiscovery')
        .directive('skillKnowledgeDiscoveryMostContributes', skillKnowledgeDiscoveryMostContributes);

    /** @ngInject */
    function skillKnowledgeDiscoveryMostContributes() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-knowledge-discovery-most-contributes.html',
        };
    }
})();