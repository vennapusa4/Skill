(function () {
    'use strict';

    angular
        .module('app.bulkUpload', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.bulkUpload', {
            title: 'Bulk Upload',
            url: '/bulk-upload',
            params: { tag: null, shareId: 0, shareTitle: ''},
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/bulk-upload/bulk-upload.html',
                    controller: 'BulkUploadController as vm'
                },
                'footer@app': {},
            },
        });

        $stateProvider.state('app.bulkUpload.upload', {
            title: 'Bulk Upload - Upload',
            url: '/upload/:type',
            params: { id: null, shareId: 0, shareTitle: '' },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/bulk-upload/bulk-upload.upload.html',
                    controller: 'BulkUploadUploadController as vm'
                },
                'footer@app': {},
            },
        });

        $stateProvider.state('app.bulkUpload.review', {
            title: 'Bulk Upload Review',
            url: '/review/:batchNumber',
            params: { id: null, shareId: 0, shareTitle: ''  },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/bulk-upload/bulk-upload.review.html',
                    controller: 'BulkUploadReviewController as vm'
                },
                'footer@app': {},
            },
        });

        $stateProvider.state('app.bulkUpload.completed', {
            title: 'Bulk Upload Completed',
            url: '/completed/:type',
            params: { id: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/bulk-upload/bulk-upload.completed.html',
                    controller: 'BulkUploadCompletedController as vm'
                }
            },
        });

    }

})();
