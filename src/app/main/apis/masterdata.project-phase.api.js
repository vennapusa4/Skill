(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('MasterDataProjectPhaseApi', MasterDataProjectPhaseApi);

    /** @ngInject */
    function MasterDataProjectPhaseApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllProjectPhase'),
            addProjectPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddProjectPhase'),
            updateProjectPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateProjectPhase'),
            deleteProjectPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteProjectPhase'),
            deleteMultiProjectPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiProjectPhase'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/ProjectPhaseToExcel')
        };

        return {
            api: api,
            getAll: function (option, keyword) {
                api.getAll.save({}, {
                    searchTerm: keyword,
                    skip: option.data.skip ? option.data.skip : 0,
                    take: option.data.take ? option.data.take : 10,
                    sortField: option.data.sort ? option.data.sort[0].field : "ProjectPhaseId",
                    sortDir: option.data.sort ? option.data.sort[0].dir : "asc",
                    isExport: false
                }
                    , function (data) {
                        option.success(data);
                    }, function (data) {
                        option.error(data);
                    });
            },

            addProjectPhase: function (data) {
                return api.addProjectPhase.save(data).$promise;
            },

            updateProjectPhase: function (data) {
                return api.updateProjectPhase.save(data).$promise;
            },

            deleteProjectPhase: function (id) {
                return api.deleteProjectPhase.save({ id: id }).$promise;
            },
            deleteMultiProjectPhase: function (data) {
                return api.deleteMultiProjectPhase.save(data).$promise;
            },
            exportToExcel: function (option, keyword) {
                var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "subDisciplineName";
                var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
                var keyword = keyword !== undefined ? keyword : "";
                var skip = option.data.skip !== undefined ? option.data.skip : 0;
                var take = option.data.take !== undefined ? option.data.take : 10;
                api.exportToExcel.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: true }, function (data) {
                    option.success(data);
                }, function (data) {

                    option.error(data);
                });
            }
        };
    }

})();