(function () {
    'use strict';

    angular
        .module('app.insights', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        $stateProvider.state('app.insightsOverview', {
            title: 'Trending',
            url: '/trending-overview',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/insights/insights-overview/insights-overview.html',
                    controller: 'InsightsOverviewController as vm'
                }
            },
        });

        $stateProvider.state('app.insightsKnowledge', {
            title: 'Trending',
            url: '/trending-knowledge',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/insights/insights-knowledge/insights-knowledge.html',
                    controller: 'InsightsKnowledgeController as vm'
                }
            },
        });

        $stateProvider.state('app.insightsPeople', {
            title: 'Trending',
            url: '/trending-people',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/insights/insights-people/insights-people.html',
                    controller: 'InsightsPeopleController as vm'
                }
            },
        });

        $stateProvider.state('app.insightsValueCreation', {
            title: 'Trending',
            url: '/trending-value-amplified',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/insights/insights-value-creation/insights-value-creation.html',
                    controller: 'InsightsValueCreationController as vm'
                }
            },
        });
    }

})();
