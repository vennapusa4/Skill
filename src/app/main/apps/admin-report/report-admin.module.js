(function () {
  'use strict';

  angular
    .module('app.adminReport', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    // State

    $stateProvider.state('appAdmin.adminReport', {
      title: 'Admin Report',
      url: '/admin-report',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/admin-report/report-admin.html',
          controller: 'ReportAdminController as vm'
        },
        'subContent@appAdmin.adminReport': {
        },
      },
    });


    $stateProvider.state('appAdmin.adminReport.knowledgeReuse', {
      title: 'Admin Report - Knowledge Reuse',
      url: '/reuse',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.adminReport': {
          templateUrl: 'app/main/apps/admin-report/knowledge-reuse/template.html',
          controller: 'AdminReportKnowledgeReuseController as vm'
        }
      },
    });


    $stateProvider.state('appAdmin.adminReport.potentials', {
      title: 'Admin Report - Potential Value Tracking',
      url: '/potentials',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.adminReport': {
          templateUrl: 'app/main/apps/admin-report/potentials/template.html',
          controller: 'AdminReportPotentials as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.adminReport.keywordz', {
      title: 'Admin Report - Keyword Search (Zero Result)',
      url: '/keywordz',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.adminReport': {
          templateUrl: 'app/main/apps/admin-report/keywordz/template.html',
          controller: 'AdminReportKeywordz as vm'
        }
      },
    });
    $stateProvider.state('appAdmin.adminReport.keywordf', {
      title: 'Admin Report - Keyword Search (Frequent)',
      url: '/keywordf',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.adminReport': {
          templateUrl: 'app/main/apps/admin-report/keywordf/template.html',
          controller: 'AdminReportKeywordf as vm'
        }
      },
    });
    // $stateProvider.state('appAdmin.gameMechanicsAdmin.pointBuild', {
    //   title: 'Admin Game Mechanics: Points Edit',
    //   url: '/admin-game-mechanics/points/build?{id: int}',
    //   views: {
    //     'subContent@appAdmin.gameMechanicsAdmin': {
    //       templateUrl: 'app/main/apps/game-mechanics/points-management/build/template.html',
    //       controller: 'GameMechanicsEditPointController as vm'
    //     }
    //   },
    // });

    // $stateProvider.state('appAdmin.gameMechanicsAdmin.levelBuild', {
    //   title: 'Admin Game Mechanics: Level Edit',
    //   url: '/admin-game-mechanics/levels/build?{id: int}',
    //   views: {
    //     'subContent@appAdmin.gameMechanicsAdmin': {
    //       templateUrl: 'app/main/apps/game-mechanics/levels/build/template.html',
    //       controller: 'GameMechanicsEditLevelController as vm'
    //     }
    //   },
    // });

    // $stateProvider.state('appAdmin.gameMechanicsAdmin.challengeBuild', {
    //   title: 'Admin Game Mechanics: Challenge Edit',
    //   url: '/admin-game-mechanics/challenges/build?{id: int}',
    //   views: {
    //     'subContent@appAdmin.gameMechanicsAdmin': {
    //       templateUrl: 'app/main/apps/game-mechanics/challenges/build/template.html',
    //       controller: 'GameMechanicsEditChallengeController as vm'
    //     }
    //   },
    // });
  }

})();
