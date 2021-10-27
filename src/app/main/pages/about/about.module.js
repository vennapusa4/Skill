(function () {
    'use strict';

    angular
        .module('app.pages.about', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.pages_about_tnc', {
            title: 'About',
            url: '/pages/about/terms_and_conditions',
            views: {
                'main@': {
                    templateUrl: 'app/core/layouts/skill-content-only.html',
                    controller: 'MainController as vm'
                },
                'content@app.pages_about_tnc': {
                    templateUrl: 'app/main/pages/about/terms-and-conditions.html',
                }
            },
            bodyClass: 'tnc'
        });
    }

})();