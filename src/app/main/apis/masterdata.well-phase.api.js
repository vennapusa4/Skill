(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('MasterDataWellPhaseApi', MasterDataWellPhaseApi);

    /** @ngInject */
    function MasterDataWellPhaseApi($resource, appConfig, $q) {
        var $q = $q;
        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllWellPhase'),
            addWellPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddWellPhase'),
            updateWellPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateWellPhase'),
            deleteWellPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteWellPhase'),
            deleteMultiWellPhase: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiWellPhase'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/WellPhaseToExcel'),
        };

        return {
            api: api,
            getAll: function (option, keyword) {
                api.getAll.save({}, {
                    searchTerm: keyword,
                    skip: option.data.skip ? option.data.skip : 0,
                    take: option.data.take ? option.data.take : 10,
                    sortField: option.data.sort ? option.data.sort[0].field : "WellPhaseId",
                    sortDir: option.data.sort ? option.data.sort[0].dir : "asc",
                    isExport: false
                }
                    , function (data) {
                        option.success(data);
                    }, function (data) {
                        option.error(data);
                    });
            },

            addWellPhase: function (data) {
                return api.addWellPhase.save(data).$promise;
            },

            updateWellPhase: function (data) {
                return api.updateWellPhase.save(data).$promise;
            },

            deleteWellPhase: function (id) {
                return api.deleteWellPhase.save({ id: id }).$promise;
            },

            deleteMultiWellPhase: function (data) {
                return api.deleteMultiWellPhase.save(data).$promise;
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
