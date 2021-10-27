(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('EquipmentApi', EquipmentApi);

    /** @ngInject */
    function EquipmentApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetAllEquipments'),
            addEquipment: $resource(appConfig.SkillApi + '/api/Admin/MasterData/AddEquipment'),
            getEquipmentById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetEquipmentById'),
            updateEquipment: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateEquipment'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteEquipment'),
            equipmentToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/EquipmentToExcel'),
        };

        function getAll(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.getAll.save({}, { searchTerm: keyword, skip: option.data.skip, take: option.data.take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {

                option.error(data);
            });
        }

        function addEquipment(id, name) {
            var deferred = $q.defer();
            api.addEquipment.save({}, { id: id, name: name }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }

        function getEquipmentById(id) {
            var deferred = $q.defer();
            api.getEquipmentById.save({}, { id: id }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }

        function updateEquipment(id, name) {
            var deferred = $q.defer();
            api.updateEquipment.save({}, { id: id, name: name }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }

        function deleteItem(itemIds) {
            var deferred = $q.defer();
            api.deleteItem.save({}, itemIds, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function equipmentToExcel() {

        }

        return {
            api: api,

            getAll: getAll,
            addEquipment: addEquipment,
            getEquipmyentById: getEquipmentById,
            updateEquipment: updateEquipment,
            deleteItem: deleteItem,
            equipmentToExcel: equipmentToExcel
        };
    }

})();