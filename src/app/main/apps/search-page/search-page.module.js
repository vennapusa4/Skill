(function () {
    'use strict';
  
    angular
      .module('app.SearchPage', [])
      .config(config);
  
    /** @ngInject */
    function config($stateProvider) {
  
      // State
      $stateProvider.state('app.SearchPage', {
        title: 'Search',
        url: '/new-search',
        views: {
          'content@app': {
            templateUrl: 'app/main/apps/search-page/search-page.html',
            controller: 'SearchPageController as vm'
          }
        },
      });
  
      $stateProvider.state('app.SearchPage.knowledge', {
        title: 'Knowledge',
        url: '/knowledge?:docType&:searchKeyword&:knowledgeID&:Disciplines&:Projects:&Equipments&:Wells&:Sources:categoryName&:displayName&:itemId',
        views: {
            'subContent@app.SearchPage': {
              templateUrl: 'app/main/apps/search-page/knowledge/template.html',
              controller: 'KnowledgesController as vm'
            }
        }
      });

      $stateProvider.state('app.SearchPage.cop', {
        title: 'CoP',
        url: '/cop?:docType&:searchKeyword',
        views: {
            'subContent@app.SearchPage': {
                templateUrl: 'app/main/apps/search-page/cop/template.html',
                controller: 'copController as vm'
            }
        }
      });
      $stateProvider.state('app.SearchPage.people', {
        title: 'People',
        url: '/people?:docType&sortBy&startDate&endDate',
        params: {
          tag : null
        },
        views: {
            'subContent@app.SearchPage': {
                templateUrl: 'app/main/apps/search-page/people/template.html',
                controller: 'peopleController as vm'
            }
        }
      });
      $stateProvider.state('app.SearchPage.media', {
        title: 'Media',
        url: '/media?:docType&:searchKeyword',
        views: {
            'subContent@app.SearchPage': {
                templateUrl: 'app/main/apps/search-page/media/template.html',
                controller: 'MediaController as vm'
            }
        }
      });  
      $stateProvider.state('app.SearchPage.collection', {
        title: 'Collections',
        url: '/collection?:searchKeyword',
        views: {
            'subContent@app.SearchPage': {
                templateUrl: 'app/main/apps/search-page/collection/template.html',
                controller: 'CollectionController as vm'
            }
        }
      });  
  
    }
  
  })();
  