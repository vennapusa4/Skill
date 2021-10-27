(function () {
    'use strict';

    angular
        .module('app.faq', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.faq', {
            title: 'FAQ',
            url: '/faq',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/faq/faq.html',
                    controller: 'FaqController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.faqAdmin', {
            title: 'FAQ Admin',
            url: '/admin-faq?topicId',
            params: { topicId: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/faq/faq-admin.html',
                    controller: 'FaqAdminController as vm'
                }
            },
        });

    }

})();