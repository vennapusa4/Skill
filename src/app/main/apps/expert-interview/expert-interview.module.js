(function () {
  'use strict';

  angular
    .module('app.expertInterview', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    // State
    $stateProvider.state('appAdmin.expertInterviewManagement', {
      title: 'Expert Interview Management',
      url: '/expert-interview-management',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/expert-interview/expert-interview.html',
          controller: 'ExpertInterviewController as vm'
        }
      },
    });

    $stateProvider.state('app.expertInterviewDetail', {
      title: 'Expert Interview Details',
      url: '/expert-interview/{id: int}',
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/expert-interview/expert-interview-detail.html',
          controller: 'ExpertInterviewDetailController as vm'
        }
      },
    });

    $stateProvider.state('app.expertInterviewAdd', {
      title: 'Add Expert Interview',
      url: '/expert-interview/add/{id}',
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/expert-interview/expert-interview-add.html',
          controller: 'ExpertInterviewAddController as vm'
        }
      },
    });

    $stateProvider.state('app.expertInterviewAddProfile', {
      title: 'Add Expert Profile',
      url: '/expert-interview/add-profile/{id: int}',
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/expert-interview/expert-interview-add-profile.html',
          controller: 'ExpertInterviewAddProfileController as vm'
        }
      },
    });

    $stateProvider.state('app.expertInterviewAddComplete', {
      title: 'Add Expert Complete',
      url: '/expert-interview/add-complete/{id: int}',
      views: {
        'content@app': {
          templateUrl: 'app/main/apps/expert-interview/expert-interview-add-complete.html',
          controller: 'ExpertInterviewAddCompleteController as vm'
        }
      },
    });

  }

})();
