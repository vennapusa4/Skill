(function () {
    'use strict';

    angular
        .module('app.user', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('appAdmin.userAdmin', {
            title: 'User Admin',
            url: '/admin-user',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/user/user-admin.html',
                    controller: 'UserAdminController as vm'
                }
            },
        });

    }

})();