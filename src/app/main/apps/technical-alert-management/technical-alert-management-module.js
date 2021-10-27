(function () {
    'use strict';

    angular
        .module('app.technicalAlert', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State
        $stateProvider.state('appAdmin.technicalAlert', {
            title: 'Technical Alert',
            url: '/technical-alert',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/technical-alert-management/technical-alert-management.html',
                    controller: 'TechnicalAlertManagementController as vm'
                },
            },
        });

        $stateProvider.state('appAdmin.technicalAlert.management', {
            title: 'Technical Alert Management',
            url: '/management',
            params: { tag: null },
            views: {
                'subContent@appAdmin.technicalAlert': {
                    templateUrl: 'app/main/apps/technical-alert-management/technical-alert-knowledge-management/template.html',
                    controller: 'AdminTechnicalAlertManagementController as vm'
                },
            },
        });


        $stateProvider.state('appAdmin.technicalAlert.distributions', {
            title: 'Technical Alert Distribution List',
            url: '/distribution-list',
            params: { tag: null },
            views: {
                'subContent@appAdmin.technicalAlert': {
                    templateUrl: 'app/main/apps/technical-alert-management/technical-alert-distribution-list/template.html',
                    controller: 'AdminTechnicalAlertDistributionListController as vm'
                },
            },
        });
        $stateProvider.state('appAdmin.technicalAlert.distributionListBuild', {
            title: 'Technical Alert Distribution List',
            url: '/technical-alert-distribution-list',
            params: { tag: null },
            views: {
                'subContent@appAdmin.technicalAlert': {
                    templateUrl: 'app/main/apps/technical-alert-management/technical-alert-distribution-list/build/template.html',
                    controller: 'TechnicalAlertDistributionListBuildController as vm'
                },
            },
        });

        $stateProvider.state('appAdmin.technicalAlert.usermanagement', {
            title: 'Technical Alert User Management',
            url: '/technical-alert-user-management',
            params: { tag: null },
            views: {
                'subContent@appAdmin.technicalAlert': {
                    templateUrl: 'app/main/apps/technical-alert-management/technical-alert-user-management/technical-alert-user-management.html',
                    controller: 'TechnicalAlertUserManagementController as vm'
                },
            },
        });

        $stateProvider.state('appAdmin.technicalAlert.implementation', {
            title: 'Technical Alert Use Iimplementation',
            url: '/technical-alert-implementation',
            params: { tag: null },
            views: {
                'subContent@appAdmin.technicalAlert': {
                    templateUrl: 'app/main/apps/technical-alert-management/technical-alert-implementation/template.html',
                    controller: 'AdminTechnicalAlertImplementationController as vm'
                },
            },
        });

    }

})();