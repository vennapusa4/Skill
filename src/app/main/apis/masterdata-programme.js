(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataProgrammeApi', MasterDataProgrammeApi);

    /** @ngInject */
    function MasterDataProgrammeApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetAllProgramme'),
            addProgramme: $resource(appConfig.SkillApi + '/api/Admin/MasterData/CreateNewProgramme'),
            getProgrammeById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetProgrammeById'),
            updateProgramme: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateProgramme'),
            deletemultiProgramme: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeletemultiProgramme'),
        };

        function getAll(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            api.getAll.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getProgrammeById(id) {
            api.getCoPById.save({}, { id: id }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function addProgramme(postData) {
            return api.addProgramme.save(postData).$promise;
        }

        function updateProgramme(postData) {
            return api.updateProgramme.save(postData).$promise;
        }

        return {
            api: api,

            getAll: getAll,
            addProgramme: addProgramme,
            updateProgramme: updateProgramme,
            getProgrammeById: getProgrammeById,
            deletemultiProgramme: function (postData) {
                return api.deletemultiProgramme.save(postData).$promise;
            }
        };
    }

})();