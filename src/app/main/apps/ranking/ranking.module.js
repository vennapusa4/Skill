(function () {
    'use strict';

    angular
        .module('app.ranking', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        //$stateProvider.state('appAdmin.rankingAdmin', {
        //    title: 'Ranking Admin',
        //    url: '/admin-ranking',
        //    params: { tag: null },
        //    views: {
        //        'content@appAdmin': {
        //            templateUrl: 'app/main/apps/ranking/ranking-admin.html',
        //            controller: 'RankingAdminController as vm'
        //        }
        //    },
        //});

    }

})();
