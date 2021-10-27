(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataDisciplineApi', MasterDataDisciplineApi);

    /** @ngInject */
    function MasterDataDisciplineApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetAllDiscipline'),
            addDiscipline: $resource(appConfig.SkillApi + '/api/Admin/MasterData/CreateNewDiscipline'),
            getDisciplineById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetDisciplineById'),
            updateDiscipline: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateDiscipline'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteDiscipline'),
            exportToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DisciplineToExcel'),
            deletemultiDiscipline: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeletemultiDiscipline'),
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

        function getDisciplineById(id) {
            api.getCoPById.save({}, { id: id }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function addDiscipline(postData) {
            return api.addDiscipline.save(postData).$promise;
        }

        function updateDiscipline(postData) {
            return api.updateDiscipline.save(postData).$promise;
        }

        function deleteItem(itemIds) {
            return api.deleteItem.save(itemIds).$promise;
        }

        function exportToExcel(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
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

        return {
            api: api,
            getAll: getAll,
            addDiscipline: addDiscipline,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            updateDiscipline: updateDiscipline,
            getDisciplineById: getDisciplineById,
            deletemultiDiscipline: function (postData) {
                return api.deletemultiDiscipline.save(postData).$promise;
            }
        };
    }

})();