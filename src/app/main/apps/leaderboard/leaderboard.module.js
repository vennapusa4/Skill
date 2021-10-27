(function () {
    'use strict';

    angular
        .module('app.leaderboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.leaderboardMyAchievements', {
            title: 'My Achievements',
            url: '/leaderboard/my-achievements',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/leaderboard/my-achievements/my-achievements.html',
                    controller: 'LeaderboardMyAchievementsController as vm'
                }
            },
        });

        $stateProvider.state('app.leaderboardBadges', {
            title: 'Badges',
            url: '/leaderboard/badges',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/leaderboard/badges/badges.html',
                    controller: 'LeaderboardBadgesController as vm'
                }
            },
        });

        $stateProvider.state('app.leaderboardChallenges', {
            title: 'Challenges',
            url: '/leaderboard/challenges',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/leaderboard/challenges/challenges.html',
                    controller: 'LeaderboardChallengesController as vm'
                }
            },
        });

        $stateProvider.state('app.leaderboardCommunityScore', {
            title: 'Community Score',
            url: '/leaderboard/community-score',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/leaderboard/community-score/community-score.html',
                    controller: 'LeaderboardCommunityScoreController as vm'
                }
            },
        });

    }

})();
