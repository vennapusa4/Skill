(function () {
    'use strict';

    angular
        .module('app.gamificationBadges', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State
        $stateProvider.state('appAdmin.gamificationBadgesAdmin', {
            title: 'Gamification Badges Admin',
            url: '/admin-gamification-badges',
            params: { tag: null, admin: true },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/gamification-badges/gamification-badges-admin.html',
                    controller: 'GamificationBadgesAdminController as vm'
                }
            },
        });

    }

})();