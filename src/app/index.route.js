(function () {
    'use strict';

    angular
        .module('fuse')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        /**
         * Layout Style Switcher
         *
         * This code is here for demonstration purposes.
         * If you don't need to switch between the layout
         * styles like in the demo, you can set one manually by
         * typing the template urls into the `State definitions`
         * area and remove this code
         */
        // Inject $cookies
        var $cookies;

        angular.injector(['ngCookies']).invoke([
            '$cookies', function (_$cookies) {
                $cookies = _$cookies;
            }
        ]);

        // Get active layout
        var layoutStyle = $cookies.get('layoutStyle') || 'frontEnd';

        var layouts = {
            frontEnd: {
                main: 'app/core/layouts/skill-front-end.html',

                header: 'app/navigation/header.html',
                footer: 'app/navigation/footer.html',
                leftNavigation: 'app/navigation/left-navigation.html'
            }
        };
        // END - Layout Style Switcher

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: layouts[layoutStyle].main,
                        controller: 'MainController as vm'
                    },
                    'header@app': {
                        templateUrl: layouts[layoutStyle].header,
                        controller: 'HeaderController as vm'
                    },
                    'leftNavigation@app': {
                        templateUrl: layouts[layoutStyle].leftNavigation,
                        controller: 'LeftNavigationController as vm'
                    },
                    'footer@app': {
                        templateUrl: layouts[layoutStyle].footer,
                        controller: 'FooterController as vm'
                    },
                }
            });

        $stateProvider
            .state('appAdmin', {
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: 'app/core/layouts/skill-back-end.html',
                        controller: 'MainController as vm'
                    },
                    'header@appAdmin': {
                        templateUrl: 'app/navigation/header.html',
                        controller: 'HeaderController as vm'
                    },
                    'leftNavigation@appAdmin': {
                        templateUrl: 'app/navigation/left-navigation.html',
                        controller: 'LeftNavigationController as vm'
                    },
                    'footer@appAdmin': {
                        templateUrl: 'app/navigation/footer.html',
                        controller: 'FooterController as vm'
                    },
                }
            });
    }

})();