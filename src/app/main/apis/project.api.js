(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('ProjectApi', ProjectApi);

    /** @ngInject */
    function ProjectApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllProject'),
            getProjectById: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetProjectById'),

            addProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddProject'),
            updateProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateProject'),
            deleteItem: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteProject'),
            projectToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/ProjectToExcel'),
            deleteMultiProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiProject'),
        };

        return {
            api: api,
            getAll: function (option, keyword) {
                api.getAll.save({}, {
                    searchTerm: keyword,
                    skip: option.data.skip ? option.data.skip : 0,
                    take: option.data.take ? option.data.take : 10,
                    sortField: option.data.sort ? option.data.sort[0].field : "ProjectId",
                    sortDir: option.data.sort ? option.data.sort[0].dir : "asc",
                    isExport: false
                }, function (data) {
                    option.success(data);
                }, function (data) {
                    option.error(data);
                });
            },

            addProject: function (data) {
                return api.addProject.save(data).$promise;
            },

            updateProject: function (data) {
                return api.updateProject.save(data).$promise;
            },

            deleteItem: function (id) {
                return api.deleteItem.save({ id: id }).$promise;
            },

            deleteMultiProject: function (data) {
                return api.deleteMultiProject.save(data).$promise;
            },
        };
    }

})();