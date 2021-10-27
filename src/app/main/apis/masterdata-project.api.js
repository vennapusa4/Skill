(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataProjectApi', MasterDataProjectApi);

    /** @ngInject */
    function MasterDataProjectApi($resource, appConfig, $q, $timeout, $window) {
        var $q = $q;
        var $timeout = $timeout;
        var $window = $window;

        var api = {
            getAllProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllProject'),
            addProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddProject'),
            updateProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateProject'),
            deleteProject: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteProject'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/ProjectToExcel'),
        };

        function getAllProject(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.getAllProject.save({}, { searchTerm: keyword, skip: option.data.skip, take: option.data.take, sortField: 'name', sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {

                option.error(data);
            });
        }

        function addProject(postData) {
            var deferred = $q.defer();

            api.addProject.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }
        function updateProject(postData) {
            var deferred = $q.defer();

            api.updateProject.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function deleteProject(postData) {
            var deferred = $q.defer();

            api.deleteProject.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function exportToExcel(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.exportToExcel.save({}, { searchTerm: keyword, skip: option.data.skip, take: option.data.take, sortField: 'name', sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        return {
            api: api,

            getAllProject: getAllProject,
            addProject: addProject,
            updateProject: updateProject,
            deleteProject: deleteProject
        };
    }

})();