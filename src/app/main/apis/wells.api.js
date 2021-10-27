(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('WellApi', WellApi);

    /** @ngInject */
    function WellApi($resource, appConfig, $q, $timeout, $window) {
        var $q = $q;
        var $timeout = $timeout;
        var $window = $window;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllWells'),
            addWell: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddWell'),
            updateWell: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateWell'),
            deleteItem: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteWell'),
            deleteMultiWell: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteMultiWell'),
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
                }, function (data) {
                    option.success(data);
                }, function (data) {
                    option.error(data);
                });
            },

            addWell: function (data) {
                return api.addWell.save(data).$promise;
            },

            updateWell: function (data) {
                return api.addWell.save(data).$promise;
            },

            deleteItem: function (id) {
                return api.deleteItem.save({ id: id }).$promise;
            },

            deleteMultiWell: function (data) {
                return api.deleteMultiWell.save(data).$promise;
            },
        };
    }

})();