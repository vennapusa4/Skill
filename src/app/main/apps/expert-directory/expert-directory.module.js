(function () {
    'use strict';

    angular
        .module('app.expertDirectory', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.expertDirectory', {
            title: 'Expert Directory',
            url: '/expert-directory',
            params: { tag: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/expert-directory/expert-directory.html',
                    controller: 'ExpertDirectoryController as vm'
                }
            },
        });

        $stateProvider.state('app.expertDirectory.review', {
            title: 'Expert Directory Review',
            url: '/review',
            params: { id: 1 },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/expert-directory/expert-directory.review.html',
                    controller: 'ExpertDirectoryReviewController as vm'
                }
            },
        });

    }

})();