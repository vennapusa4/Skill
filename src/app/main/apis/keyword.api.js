(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('KeywordApi', KeywordApi);

    /** @ngInject */
    function KeywordApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllKeywords'),

            addKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddKeyword'),
            updateKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateKeyword'),
            deleteItem: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteKeyword'),
            keywordToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/KeywordToExcel'),
            deleteMultiKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiKeyword'),
        };

        return {
            api: api,

            getAll: function (option, keyword , total) {
                api.getAll.save({}, {
                    searchTerm: keyword,
                    skip: option.data.skip ? option.data.skip : 0,
                    take: option.data.take ? option.data.take : 10,
                    sortField: option.data.sort ? option.data.sort[0].field : "Id",
                    sortDir: option.data.sort ? option.data.sort[0].dir : "asc",
                    Export : (option.data.take === total)
                }, function (data) {

                    option.success(data);
                }, function (data) {

                    option.error(data);
                });
            },

            addKeyword: function (data) {
                return api.addKeyword.save(data).$promise;
            },

            updateKeyword: function (data) {
                return api.updateKeyword.save(data).$promise;
            },

            deleteItem: function (id) {
                return api.deleteItem.save({ id: id }).$promise;
            },
            deleteMultiKeyword: function (data) {
                return api.deleteMultiKeyword.save(data).$promise;
            },
        };
    }

})();