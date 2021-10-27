(function () {
    'use strict';

    angular
        .module('app.home')
      .factory('MasterDataLanguageCodesApi', MasterDataLanguageCodesApi);

    /** @ngInject */
  function MasterDataLanguageCodesApi($resource, appConfig, $q) {
        var $q = $q;
        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetLanguageCodes'),
            getList: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetLanguageCodesList', {}, {
              query: { method: 'GET', isArray: true }
            }),
            addLanguageCode: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddLanguageCode'),
            updateLanguageCode: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateLanguageCode'),
            deleteLanguageCode: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteLanguageCode'),
            deleteMultiLanguageCode: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiLanguageCode'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/LanguageCodesToExcel'),
        };

        return {
            api: api,
            getAll: function (option, keyword) {
                api.getAll.save({}, {
                    searchTerm: keyword,
                    skip: option.data.skip ? option.data.skip : 0,
                    take: option.data.take ? option.data.take : 10,
                    sortField: option.data.sort ? option.data.sort[0].field : "LanguageCodeId",
                    sortDir: option.data.sort ? option.data.sort[0].dir : "asc",
                    isExport: false
                }
                    , function (data) {
                        option.success(data);
                    }, function (data) {
                        option.error(data);
                    });
            },
            getList: function () {
                var deferred = $q.defer();
                api.getList.query({ }, function (data) {
                  deferred.resolve(data);
                }, function (data) {
                  deferred.reject(data);
                });
                return deferred.promise;
            },

            addLanguageCode: function (data) {
                return api.addLanguageCode.save(data).$promise;
            },

            updateLanguageCode: function (data) {
                return api.updateLanguageCode.save(data).$promise;
            },

            deleteLanguageCode: function (id) {
                return api.deleteLanguageCode.save({ id: id }).$promise;
            },

            deleteMultiLanguageCode: function (data) {
                return api.deleteLanguageCode.save(data).$promise;
            },

            exportToExcel: function (option, keyword) {
                var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "Name";
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
