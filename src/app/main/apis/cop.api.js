(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('CopApi', CopApi);

    /** @ngInject */
    function CopApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetAllCoP'),
            save: $resource(appConfig.SkillApi + '/api/Admin/MasterData/AddCoP'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteCoP'),

            getCoPById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetCoPById'),
            updateCoP: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateCoP'),
        };


        function getCoPById(id) {

            var deferred = $q.defer();
            api.getCoPById.save({}, { id: id }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }

        function getAll(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "";
            api.getAll.save({}, { searchTerm: keyword, skip: option.data.skip, take: option.data.take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {

                option.error(data);
            });
        }

        function AddCoP(id, name) {

            var deferred = $q.defer();
            api.save.save({}, { id: id, name: name }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }

        function UpdateCoP(id, name) {
            var deferred = $q.defer();
            api.updateCoP.save({}, { id: id, name: name }, function (data) {

                options.success(data);
            }, function (data) {

                options.error(data);
            });
        }
        function save(postData) {

            var deferred = $q.defer();
            api.save.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
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

        return {
            api: api,

            getAll: getAll,
            save: save,
            deleteItem: deleteItem,
            AddCoP: AddCoP,
            UpdateCoP: UpdateCoP,
            getCoPById: getCoPById
        };
    }

})();