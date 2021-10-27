(function () {
    'use strict';

    angular
        .module('app.masterData')
        .controller('MasterDataAdminController', MasterDataAdminController);

    /** @ngInject */
    function MasterDataAdminController($scope, $state) {
        var vm = this;
        $scope.currentSubpage = 'Disciplines';
        $scope.allMaster = [
            {
                name: 'Disciplines',
                route: 'appAdmin.masterDataAdmin.disciplines'
            },
            {
                name: 'Sub Disciplines',
                route: 'appAdmin.masterDataAdmin.subDisciplines'
            },
            {
                name: 'CoP',
                route: 'appAdmin.masterDataAdmin.cop'
            },
            {
                name: 'CoP Category',
                route: 'appAdmin.masterDataAdmin.copCategory'
            },
            {
                name: 'Business Sector',
                route: 'appAdmin.masterDataAdmin.businessSector'
            },
            {
                name: 'Equipment',
                route: 'appAdmin.masterDataAdmin.equipment'
            },
            {
                name: 'Project',
                route: 'appAdmin.masterDataAdmin.project'
            },
            {
                name: 'Wells',
                route: 'appAdmin.masterDataAdmin.wells'
            },
            {
                name: 'Keywords',
                route: 'appAdmin.masterDataAdmin.keywords'
            },
            {
                name: 'Project Phase',
                route: 'appAdmin.masterDataAdmin.projectPhase'
            },
            {
                name: 'Wells Phase',
                route: 'appAdmin.masterDataAdmin.wellPhase'
            },
            {
                name: 'Wells Operation',
                route: 'appAdmin.masterDataAdmin.wellOperation'
            },
            {
                name: 'Value Type',
                route: 'appAdmin.masterDataAdmin.valueType'
            },
            {
                name: 'Ideas Category',
                route: 'appAdmin.masterDataAdmin.ideasCategory'
            },
            {
                name: 'Programme',
                route: 'appAdmin.masterDataAdmin.programme'
            },
            {
                name: 'Predefined Rating Comments',
                route: 'appAdmin.masterDataAdmin.ratingComments'
            },
        ]

        $scope.changeRoute = function () {
            var newRoute = $scope.allMaster.find(function(x){
                return x.name == $scope.currentSubpage;
            });
            $state.go(newRoute.route);
        }
    }
})();