(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('MasterDataWellOperationApi', MasterDataWellOperationApi);

    /** @ngInject */
    function MasterDataWellOperationApi($resource, appConfig, $q) {
        var $q = $q;
        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllWellOperation'),
            addWellOperation: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddWellOperation'),
            updateWellOperation: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateWellOperation'),
            deleteWellOperation: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteWellOperation'),
            deleteMultiWellOperation: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiWellOperation'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/WellOperationToExcel'),
        };

        return {
            api: api,
            getAll: function (option, keyword) {
                api.getAll.save({}, {
                    searchTerm: keyword,
                    skip: option.data.skip ? option.data.skip : 0,
                    take: option.data.take ? option.data.take : 10,
                    sortField: option.data.sort ? option.data.sort[0].field : "Id",
                    sortDir: option.data.sort ? option.data.sort[0].dir : "asc",
                    isExport: false
                }
                    , function (data) {
                        option.success(data);
                    }, function (data) {
                        option.error(data);
                    });
            },

            addWellOperation: function (data) {
                return api.addWellOperation.save(data).$promise;
            },

            updateWellOperation: function (data) {
                return api.updateWellOperation.save(data).$promise;
            },

            deleteWellOperation: function (id) {
                return api.deleteWellOperation.save({ id: id }).$promise;
            },
            deleteMultiWellOperation: function (data) {
                return api.deleteMultiWellOperation.save(data).$promise;
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