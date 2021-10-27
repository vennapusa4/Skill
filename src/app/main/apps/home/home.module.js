(function () {
    'use strict';

    angular
        .module('app.home', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.home', {
            title: 'Home',
            url: '/home',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/home/home.html',
                    controller: 'HomeController as vm'
                }
            },
        });

        // Navigation
        msNavigationServiceProvider.saveItem('apps.list', {
            title: 'Minutes',
            icon: 'icon-file-document',
            state: 'app.list({tag: ""})',
            weight: 2,
            // badge : {
            //     content: 10,
            //     color  : '#F44336'
            // }
        });
        msNavigationServiceProvider.saveItem('apps.list_draft', {
            title: 'Draft',
            icon: 'icon-border-color',
            state: 'app.list_draft',
            weight: 3
        });
        msNavigationServiceProvider.saveItem('apps.list_pending', {
            title: 'Pending Approval',
            icon: 'icon-timer-sand',
            state: 'app.list_pending',
            weight: 4
        });
        msNavigationServiceProvider.saveItem('apps.archive', {
            title: 'Archive',
            icon: 'icon-archive',
            state: 'app.archive',
            weight: 7
        });

    }

})();