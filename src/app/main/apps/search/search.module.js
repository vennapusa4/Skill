(function () {
    'use strict';

    angular
        .module('app.search', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('app.search', {
            title: 'Search',
            url: '/search?:keyword&:type&:typetext&:id',
            params: { keyword: '', type: null, typetext: null, id: null },
            views: {
                'content@app': {
                    templateUrl: 'app/main/apps/search/search.html',
                    controller: 'SearchController as vm'
                }
            },
        });

        $stateProvider.state('app.search.knowledgeDiscovery', {
            title: 'Search - Knowledge Discovery',
            url: '/knowledge-discovery',
            views: {
                'subContent@app.search': {
                    templateUrl: 'app/main/apps/search/knowledge-discovery/template.html',
                    controller: 'SearchKnowledgeDiscoveryController as vm'
                }
            }
        });

        $stateProvider.state('app.search.collection', {
            title: 'Search - Collection',
            url: '/collection',
            views: {
                'subContent@app.search': {
                    templateUrl: 'app/main/apps/search/collection/template.html',
                    controller: 'SearchCollectionController as vm'
                }
            }
        });

        $stateProvider.state('app.search.expertDirectory', {
            title: 'Search - Experts Directory',
            url: '/expert-directory',
            views: {
                'subContent@app.search': {
                    templateUrl: 'app/main/apps/search/expert-directory/template.html',
                    controller: 'SearchExpertDirectoryController as vm'
                }
            }
        });

    }

})();