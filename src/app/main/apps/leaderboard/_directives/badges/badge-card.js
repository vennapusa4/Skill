/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.leaderboard')
        .directive('leaderboardBadgeCardTag', leaderboardBadgeCardTag);
    /** @ngInject */
    function leaderboardBadgeCardTag() {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            controller: function () {

            },
            templateUrl: 'app/main/apps/leaderboard/_directives/badges/badge-card.html',
        };
    }
})();
