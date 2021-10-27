(function () {
    'use strict';
  
    angular
      .module('app.performanceReport', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('appAdmin.performanceReport', {
        title: 'Performance Report',
        url: '/performance-report',
        views: {
          'content@appAdmin': {
            templateUrl: 'app/main/apps/master-data/performance-report/performance-report.html',
            controller: 'PerformanceReortController as vm'
          }
        },
      });

       $stateProvider.state('appAdmin.performanceReport.performanceReportUpload', {
        title: 'Performance Report Upload',
        url: '/performance-report-upload/{id}',
        views: {
          'content@appAdmin': {
            templateUrl: 'app/main/apps/master-data/performance-report/performance-report-upload.html',
            controller: 'PerformanceReortUploadController as vm'
        }
        },
      });

  }
  
  })();
  