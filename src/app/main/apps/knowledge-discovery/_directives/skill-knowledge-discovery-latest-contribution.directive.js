/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('skillKnowledgeDiscoveryLatestContribution', skillKnowledgeDiscoveryLatestContribution);

    /** @ngInject */
    function skillKnowledgeDiscoveryLatestContribution() {

        return {
            restrict: 'AE',
            scope: {
                data: '=',
            },
            controller: function () {

            },
            templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-knowledge-discovery-latest-contribution.html',
        };
    }
})();