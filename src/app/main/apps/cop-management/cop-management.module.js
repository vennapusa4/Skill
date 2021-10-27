(function () {
  'use strict';

  angular
    .module('app.copManagement', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    // State
    $stateProvider.state('appAdmin.copManagement', {
      title: 'Cop Management',
      url: '/cop-management',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/cop-management/cop-management.html',
          controller: 'CopManagementController as vm'
        },
        'subContent@appAdmin.copManagement': {
        },
      },
    });

    $stateProvider.state('appAdmin.copManagement.management', {
      title: 'CoP - Management',
      url: '/management',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.copManagement': {
          templateUrl: 'app/main/apps/cop-management/management/template.html',
          controller: 'AdminCopManagementController as vm'
        }
      },
    });
    $stateProvider.state('appAdmin.copManagement.copAdministrationAdd', {
      title: 'Add New CoP',
      url: '/add/{id}',
      views: {
        'subContent@appAdmin.copManagement': {
          templateUrl: 'app/main/apps/cop-management/management/cop-administration-add.html',
          controller: 'CopAdministrationAddController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.copManagement.noticeBoard', {
      title: 'CoP - Notice Board',
      url: '/notice-board',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.copManagement': {
          templateUrl: 'app/main/apps/cop-management/notice-board/template.html',
          controller: 'AdminCopNoticeBoardController as vm'
        }
      },
    });
    $stateProvider.state('appAdmin.copManagement.InactiveCoP', {
      title: 'Inactive CoP',
      url: '/Inactive-CoP',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.copManagement': {
          templateUrl: 'app/main/apps/cop-management/audit-trail/template.html',
          controller: 'AdminCopAuditTrailController as vm'
        }
      },
    });
    $stateProvider.state('appAdmin.copManagement.mapping', {
      title: 'CoP - Mapping',
      url: '/mapping',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.copManagement': {
          templateUrl: 'app/main/apps/cop-management/mapping/template.html',
          controller: 'AdminCopMappingController as vm'
        }
      },
    });
    // $stateProvider.state('appAdmin.systemAdmin.searchTermsCount', {
    //   title: 'System Administration - Search Terms Count',
    //   url: '/search-terms-count',
    //   params: { tag: null, admin: true },
    //   views: {
    //     'subContent@appAdmin.systemAdmin': {
    //       templateUrl: 'app/main/apps/system-admin/search-terms-count/template.html',
    //       controller: 'AdminSystemSearchTermsCountController as vm'
    //     }
    //   },
    // });
    // $stateProvider.state('appAdmin.systemAdmin.coverImage', {
    //   title: 'System Administration - Cover Image',
    //   url: '/cover-image',
    //   params: { tag: null, admin: true },
    //   views: {
    //     'subContent@appAdmin.systemAdmin': {
    //       templateUrl: 'app/main/apps/system-admin/cover-image/template.html',
    //       controller: 'AdminSystemCoverImageController as vm'
    //     }
    //   },
    // });
    // $stateProvider.state('appAdmin.systemAdmin.skipReview', {
    //   title: 'System Administration - Skip Review',
    //   url: '/skip-review',
    //   params: { tag: null, admin: true },
    //   views: {
    //     'subContent@appAdmin.systemAdmin': {
    //       templateUrl: 'app/main/apps/system-admin/skip-review/template.html',
    //       controller: 'AdminSystemSkipReviewController as vm'
    //     }
    //   },
    // });
    // $stateProvider.state('appAdmin.systemAdmin.publishKnowledge', {
    //   title: 'System Administration - Publish Knowledge',
    //   url: '/publish-knowledge',
    //   params: { tag: null, admin: true },
    //   views: {
    //     'subContent@appAdmin.systemAdmin': {
    //       templateUrl: 'app/main/apps/system-admin/publish-knowledge/template.html',
    //       controller: 'AdminSystemPublishKnowledgeController as vm'
    //     }
    //   },
    // });

  }

})();
