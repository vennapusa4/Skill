(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataKeywordsApi', MasterDataKeywordsApi);

    /** @ngInject */
    function MasterDataKeywordsApi($resource, appConfig, $q, $timeout, $window) {
        var $q = $q;
        var $timeout = $timeout;
        var $window = $window;

        var api = {
            getAllKeywords: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllKeywords'),
            addKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/AddKeyword'),
            updateKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateKeyword'),
            deleteKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteKeyword'),
            deleteMultiKeyword: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiKeyword'),
            exportToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/EquipmentToExcel'),
        };

        function getAllKeywords(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.getAllKeywords.save({}, { searchTerm: keyword, skip: option.data.skip, take: option.data.take, sortField: 'name', sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function addKeyword(postData) {
            var deferred = $q.defer();

            api.addKeyword.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function updateKeyword(postData) {
            var deferred = $q.defer();

            api.updateKeyword.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function deleteKeyword(postData) {
            var deferred = $q.defer();

            api.deleteKeyword.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function exportToExcel(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.exportToExcel.save({}, { searchTerm: keyword, skip: option.data.skip, take: option.data.take, sortField: 'name', sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }


        return {
            api: api,

            getAllKeywords: getAllKeywords,
            addKeyword: addKeyword,
            updateKeyword: updateKeyword,
            deleteKeyword: deleteKeyword,
            deleteMultiKeyword: function (data) {
                return api.deleteMultiKeyword.save(data).$promise;
            },
            exportToExcel: exportToExcel
        };
    }

})();