(function () {
    'use strict';

    angular
        .module('app.knowledgeManagement', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {
        // State
        $stateProvider.state('appAdmin.knowledgeManagement', {
            title: 'Admin Knowledge Management',
            url: '/admin-knowledge-management',
            params: { tag: null },
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/knowledge-management/admin-knowledge.html',
                    controller: 'adminKnowledge as vm'
                },
                'subContent@appAdmin.knowledgeManagement': {
                },
            },
        });

        $stateProvider.state('appAdmin.knowledgeManagement.knowledges', {
            title: 'Admin Knowledge Management - Knowledges',
            url: '/knowledges',
            views: {
                'subContent@appAdmin.knowledgeManagement': {
                    templateUrl: 'app/main/apps/knowledge-management/knowledges/template.html',
                    controller: 'KnowledgeManagementKnowledges as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.knowledgeManagement.collections', {
            title: 'Admin Knowledge Management - Collection',
            url: '/collections',
            views: {
                'subContent@appAdmin.knowledgeManagement': {
                    templateUrl: 'app/main/apps/knowledge-management/collections/template.html',
                    controller: 'KnowledgeManagementCollections as vm'
                }
            },
        });


        
    }

})();