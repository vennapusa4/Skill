(function () {
    'use strict';

    angular
        .module('app.translationEngagement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('appAdmin.translationEngagementAdmin', {
            title: 'Admin Translation Engagement',
            url: '/admin-translation-engagement',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/translation-engagement/translation-engagement.html',
                    controller: 'TranslationEngagementAdminController as vm'
                }
            },
        });

    }

})();
