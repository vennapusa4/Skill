(function () {
    'use strict';

    angular
        .module('app.email', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State
        $stateProvider.state('appAdmin.emailAdmin', {
            title: 'Email Admin',
            url: '/admin-email',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/email/email-admin.html',
                    controller: 'EmailAdminController as vm'
                },
            },
        });

        $stateProvider.state('appAdmin.emailAdmin.typeOfEmail', {
            title: 'Type Of Email',
            url: '/type-of-email',
            params: { tag: null },
            views: {
                'subContent@appAdmin.emailAdmin': {
                    templateUrl: 'app/main/apps/email/type-of-email/type-of-email.html',
                    controller: 'TypeOfEmailController as vm'
                },
            },
        });

        // $stateProvider.state('appAdmin.emailAdmin.technicalAlertDistributionList', {
        //     title: 'Technical Alert Distribution List',
        //     url: '/technical-alert-distribution-list',
        //     params: { tag: null },
        //     views: {
        //         'subContent@appAdmin.emailAdmin': {
        //             templateUrl: 'app/main/apps/email/technical-alert-distribution-list/technical-alert-distribution-list.html',
        //             controller: 'TechnicalAlertDistributionListController as vm'
        //         },
        //     },
        // });
        // $stateProvider.state('appAdmin.emailAdmin.distributionListBuild', {
        //     title: 'Technical Alert Distribution List',
        //     url: '/technical-alert-distribution-list',
        //     params: { tag: null },
        //     views: {
        //         'subContent@appAdmin.emailAdmin': {
        //             templateUrl: 'app/main/apps/email/technical-alert-distribution-list/build/template.html',
        //             controller: 'TechnicalAlertDistributionListBuildController as vm'
        //         },
        //     },
        // });
    }

})();