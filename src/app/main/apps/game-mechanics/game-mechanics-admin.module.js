(function () {
  'use strict';

  angular
    .module('app.gameMechanics', [])
    .config(config);

  /** @ngInject */
  function config($stateProvider) {

    // State
    $stateProvider.state('appAdmin.gameMechanicsAdmin', {
      title: 'Game Mechanics Admin',
      url: '/game-mechanics',
      views: {
        'content@appAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/game-mechanics-admin.html',
          controller: 'GameMechanicsAdminController as vm'
        },
        'subContent@appAdmin.gameMechanicsAdmin': {
        },
      },
    });

    $stateProvider.state('appAdmin.gameMechanicsAdmin.points', {
      title: 'Game Mechanics Admin - Points Management',
      url: '/admin-game-mechanics/points',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.gameMechanicsAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/points-management/template.html',
          controller: 'GameMechanicsPointsManagementController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.gameMechanicsAdmin.challenges', {
      title: 'Game Mechanics Admin - Challenges',
      url: '/admin-game-mechanics/challenges',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.gameMechanicsAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/challenges/template.html',
          controller: 'GameMechanicsChallengesController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.gameMechanicsAdmin.levels', {
      title: 'Game Mechanics Admin - Levels',
      url: '/admin-game-mechanics/levels',
      params: { tag: null, admin: true },
      views: {
        'subContent@appAdmin.gameMechanicsAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/levels/template.html',
          controller: 'GameMechanicsLevelsController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.gameMechanicsAdmin.pointBuild', {
      title: 'Admin Game Mechanics: Points Edit',
      url: '/admin-game-mechanics/points/build?{id: int}',
      views: {
        'subContent@appAdmin.gameMechanicsAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/points-management/build/template.html',
          controller: 'GameMechanicsEditPointController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.gameMechanicsAdmin.levelBuild', {
      title: 'Admin Game Mechanics: Level Edit',
      url: '/admin-game-mechanics/levels/build?{id: int}',
      views: {
        'subContent@appAdmin.gameMechanicsAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/levels/build/template.html',
          controller: 'GameMechanicsEditLevelController as vm'
        }
      },
    });

    $stateProvider.state('appAdmin.gameMechanicsAdmin.challengeBuild', {
      title: 'Admin Game Mechanics: Challenge Edit',
      url: '/admin-game-mechanics/challenges/build?{id: int}',
      views: {
        'subContent@appAdmin.gameMechanicsAdmin': {
          templateUrl: 'app/main/apps/game-mechanics/challenges/build/template.html',
          controller: 'GameMechanicsEditChallengeController as vm'
        }
      },
    });
  }

})();
