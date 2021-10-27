(function () {
    'use strict';
  
    angular
      .module('app.ProfilePage', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('app.ProfilePage', {
        title: 'Profile',
        url: '/profile',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/profile-page/profile-page.html',
            controller: 'ProfilePageController as vm'
          }
        },
      });

      $stateProvider.state('app.ProfilePage.cop', {
        title: 'CoP Detail',
        url: '/cop?{copid : string}',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/cop/cop.html',
                controller: 'CoPController as vm'
            }
        }
      });
      $stateProvider.state('app.ProfilePage.interest', {
        title: 'Interests',
        url: '/interest?{interestId : int}',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/interest/interest.html',
                controller: 'InterestController as vm'
            }
        }
      });
      $stateProvider.state('app.ProfilePage.feeds', {
        title: 'Feeds',
        url: '/feeds',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/feeds/feeds.html',
                controller: 'FeedsController as vm'
            }
        }
      });

      $stateProvider.state('app.ProfilePage.profile', {
        title: 'Profile',
        url: '/user-profile?user',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/profile/template.html',
                controller: 'ProfileController as vm'
            }
        }
      });
      $stateProvider.state('app.ProfilePage.editProfile', {
        title: 'Edit Profile',
        url: '/edit-profile',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/edit-profile/template.html',
                controller: 'EditProfileController as vm'
            }
        }
      });
      $stateProvider.state('app.ProfilePage.bookmark', {
        title: 'Bookmarks',
        url: '/bookmark',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/bookmark/template.html',
                controller: 'BookmarkController as vm'
            }
        }
      });
      $stateProvider.state('app.ProfilePage.actions', {
        title: 'Pending Actions',
        url: '/actions',
        views: {
            'subContent@app.ProfilePage': {
                templateUrl: 'app/main/apps/profile-page/actions/template.html',
                controller: 'ActionsController as vm'
            }
        }
      });
  
  
    }
  
  })();
  