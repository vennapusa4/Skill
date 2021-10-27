(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataCopApi', MasterDataCopApi);

    /** @ngInject */
    function MasterDataCopApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllCoP'),
            getCopStatus: $resource(appConfig.SkillApi + 'api/Admin/MasterData/CopStatus'),
            addNew: $resource(appConfig.SkillApi + '/api/Admin/MasterData/AddCoP'),
            getById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/CopById', {}, {
                query: { method: 'GET', isArray: false }
            }),
            update: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateCoP'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteCoP'),
            exportToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/COPToExcel'),
            deleteMultiCoP: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteMultiCoP'),
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

        function getCopStatus(option, keyword){
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
            var keyword = keyword !== undefined ? keyword : "";
            var skip = option.data.skip !== undefined ? option.data.skip : 0;
            var take = option.data.take !== undefined ? option.data.take : 10;
            api.getCopStatus.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
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
            getAll: getAll,
            getCopStatus: getCopStatus,
            addNew: addNew,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            update: update,
            getById: getById,
            deleteMultiCoP: function (postData) {
                return api.deleteMultiCoP.save(postData).$promise;
            }
        };
    }

})();