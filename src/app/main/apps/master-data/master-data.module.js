(function () {
    'use strict';

    angular
        .module('app.masterData', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider) {

        // State
        $stateProvider.state('appAdmin.masterDataAdmin', {
            title: 'Master Data Admin',
            url: '/admin-master-data',
            views: {
                'content@appAdmin': {
                    templateUrl: 'app/main/apps/master-data/master-data-admin.html',
                    controller: 'MasterDataAdminController as vm'
                },
                'subContent@appAdmin.masterDataAdmin': {
                },
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.disciplines', {
            title: 'Master Data Admin - Disciplines',
            url: '/disciplines',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/disciplines/template.html',
                    controller: 'MasterDataDisciplinesController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.subDisciplines', {
            title: 'Master Data Admin - Sub Disciplines',
            url: '/sub-disciplines',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/subdisciplines/template.html',
                    controller: 'MasterDataSubDisciplinesController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.cop', {
            title: 'Master Data Admin - CoP',
            url: '/cop',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/cop/template.html',
                    controller: 'MasterDataCopController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.copCategory', {
            title: 'Master Data Admin - CoP Category',
            url: '/cop-category',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/cop-category/template.html',
                    controller: 'MasterDataCopCategoryController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.businessSector', {
            title: 'Master Data Admin - Business Sector',
            url: '/business-sector',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/business-sector/template.html',
                    controller: 'MasterDataBusinessSectorController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.equipment', {
            title: 'Master Data Admin - Equipment',
            url: '/equipment',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/equipment/template.html',
                    controller: 'MasterDataEquipmentController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.project', {
            title: 'Master Data Admin - Project',
            url: '/project',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/project/template.html',
                    controller: 'MasterDataProjectController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.wells', {
            title: 'Master Data Admin - Wells',
            url: '/wells',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/wells/template.html',
                    controller: 'MasterDataWellsController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.keywords', {
            title: 'Master Data Admin - Keywords',
            url: '/keywords',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/keywords/template.html',
                    controller: 'MasterDataKeywordsController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.projectPhase', {
            title: 'Master Data Admin - Project Phase',
            url: '/project-phase',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/project-phase/template.html',
                    controller: 'MasterDataProjectPhaseController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.wellPhase', {
            title: 'Master Data Admin - Wells Phase',
            url: '/well-phase',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/well-phase/template.html',
                    controller: 'MasterDataWellPhaseController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.wellOperation', {
            title: 'Master Data Admin - Wells Operation',
            url: '/well-operation',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/well-operation/template.html',
                    controller: 'MasterDataWellOperationController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.valueType', {
            title: 'Master Data Admin - Value Type',
            url: '/value-type',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/value-type/template.html',
                    controller: 'MasterDataValueTypeController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.ideasCategory', {
            title: 'Master Data Admin - Ideas Category',
            url: '/ideas-category',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/ideas-category/template.html',
                    controller: 'MasterDataIdeasCategoryController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.programme', {
            title: 'Master Data Admin - Programme',
            url: '/programme',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/programme/template.html',
                    controller: 'MasterDataProgrammeController as vm'
                }
            },
        });

        $stateProvider.state('appAdmin.masterDataAdmin.ratingComments', {
            title: 'Master Data Admin - Predefined Rating',
            url: '/kdRatingComments',
            views: {
                'subContent@appAdmin.masterDataAdmin': {
                    templateUrl: 'app/main/apps/master-data/knowledge-rating/template.html',
                    controller: 'MasterKDRatingCommentsController as vm'
                }
            },
        });

        
    }

})();