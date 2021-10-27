(function () {
    'use strict';

    angular
        .module('app.featuredSlides', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State
        $stateProvider.state('appAdmin.featuredSlidesAdmin', {
            title: 'Featured Slides Admin',
            url: '/admin-featured-slides',
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/featured-slides/featured-slides-admin.html',
                    controller: 'FeaturedSlidesAdminController as vm'
                }
            },
        });

    }

})();