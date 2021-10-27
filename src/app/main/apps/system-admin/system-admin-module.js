(function () {
  'use strict';

  angular
    .module('app.systemAdmin', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    // State
    $stateProvider.state('appAdmin.systemAdmin', {
      title: 'System Administration',
      url: '/system-admin',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/system-admin/system-admin.html',
          controller: 'SystemAdminController as vm'
        },
        'subContent@appAdmin.systemAdmin': {
        },
      },
    });

    // $stateProvider.state('appAdmin.systemAdmin.searchTerms', {
    //   title: 'System Administration - Search Terms',
    //   url: '/search-terms',
    //   params: { tag: null, admin: true },
    //   views: {
    //     'subContent@appAdmin.systemAdmin': {
    //       templateUrl: 'app/main/apps/system-admin/search-terms/template.html',
    //       controller: 'AdminSystemSearchTermsController as vm'
    //     }
    //   },
    // });
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
    $stateProvider.state('appAdmin.systemAdmin.coverImage', {
      title: 'System Administration - Cover Image',
      url: '/cover-image',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.systemAdmin': {
          templateUrl: 'app/main/apps/system-admin/cover-image/template.html',
          controller: 'AdminSystemCoverImageController as vm'
        }
      },
    });
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
