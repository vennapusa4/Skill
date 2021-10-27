(function () {
    'use strict';

    angular
        .module('app.newTrending', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.newTrending', {
            title: 'Trending',
            url: '/new-trending',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/new-trending/new-trending.html',
                    controller: 'NewTrendingController as vm'
                }
            },
        });
        $stateProvider.state('app.newTrending.challenges', {
            title: 'Trending - Challenges',
            url: '/challenges',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/new-trending/challenges/template.html',
                    controller: 'ChallengesNewTrendingController as vm'
                }
            },
        });
        $stateProvider.state('app.newTrending.ranking', {
            title: 'Trending - Ranking',
            url: '/ranking',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/new-trending/ranking/template.html',
                    controller: 'RankingNewTrendingController as vm'
                }
            },
        });
    }

})();