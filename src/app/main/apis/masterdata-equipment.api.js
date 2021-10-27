(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataEquipmentApi', MasterDataEquipmentApi);

    /** @ngInject */
    function MasterDataEquipmentApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllEquipments'),
            addNew: $resource(appConfig.SkillApi + '/api/Admin/MasterData/AddEquipment'),
            getById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetEquipmentById'),
            update: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateEquipment'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteEquipment'),
            exportToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/EquipmentToExcel'),
            deleteMultiEquipment: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteMultiEquipment'),
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

        function getById(id) {
            var deferred = $q.defer();
            api.getCoPById.save({}, { id: id }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }
        function addNew(postData) {
            return api.addNew.save(postData).$promise;
        }

        function update(postData) {
            return api.update.save(postData).$promise;
        }

        function deleteItem(postData) {
            return api.deleteItem.save(postData).$promise;
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
            addNew: addNew,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            update: update,
            getById: getById,
            deleteMultiEquipment: function (postData) { return api.deleteMultiEquipment.save(postData).$promise; }
        };
    }

})();