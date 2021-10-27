(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataCopCategoryApi', MasterDataCopCategoryApi);

    /** @ngInject */
    function MasterDataCopCategoryApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAllCopCategries: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetCopCategories'),
            addNew: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddCoPCategory'),
            update: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateCoPCategory'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteCoPCategory'),
            exportToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/COPCategoryToExcel'),
            deleteMultiCoPCategory: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteMultiCoPCategory'),
        };

        function getAllCopCategries(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            api.getAllCopCategries.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getById(idx) {
            var deferred = $q.defer();
            api.getById.query({ id: idx }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
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
            getAllCopCategries: getAllCopCategries,
            addNew: addNew,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            update: update,
            getById: getById,
            deleteMultiCoPCategory: function (postData) {
                return api.deleteMultiCoPCategory.save(postData).$promise;
            }
        };
    }

})();