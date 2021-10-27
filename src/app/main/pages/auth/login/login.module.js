(function () {
    'use strict';

    angular
        .module('app.pages.auth.login', ['ngCookies'])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider) {
        // State
        $stateProvider.state('app.pages_auth_login', {
            title: 'Login',
            url: '/pages/auth/login',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/skill-content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_auth_login': {
                    templateUrl: 'app/main/pages/auth/login/login.html',
                    controller: 'LoginController as vm'
                }
            },
            bodyClass: 'login'
        });

        // // Translation
        // $translatePartialLoaderProvider.addPart('app/main/pages/auth/login');

        // Navigation
        msNavigationServiceProvider.saveItem('pages.auth', {
            title: 'Authentication',
            icon: 'icon-lock',
            weight: 1
        });

        msNavigationServiceProvider.saveItem('pages.auth.login', {
            title: 'Login',
            state: 'app.pages_auth_login',
            weight: 1
        });
    }

})();