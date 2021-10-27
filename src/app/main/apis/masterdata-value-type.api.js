(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataValueTypeApi', MasterDataValueTypeApi);

    /** @ngInject */
    function MasterDataValueTypeApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetAllValueType'),
            addValueType: $resource(appConfig.SkillApi + '/api/Admin/MasterData/CreateNewValueType'),
            getValueTypeById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetValueTypeById'),
            updateValueType: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateValueType'),
            deletemultiValueType: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeletemultiValueType'),
        };

        function getAll(option, keyword) {
            var sortField = (option.data.sort && option.data.sort.length > 0) ? option.data.sort[0].field : "sortOrder";
            var sortDir = (option.data.sort && option.data.sort.length > 0) ? option.data.sort[0].dir : "asc";
            var keyword = keyword ? keyword : "";
            var skip = option.data.skip ? option.data.skip : 0;
            var take = option.data.take ? option.data.take : 10;
            api.getAll.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getValueTypeById(id) {
            api.getCoPById.save({}, { id: id }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function addValueType(postData) {
            return api.addValueType.save(postData).$promise;
        }

        function updateValueType(postData) {
            return api.updateValueType.save(postData).$promise;
        }

        return {
            api: api,

            getAll: getAll,
            addValueType: addValueType,
            updateValueType: updateValueType,
            getValueTypeById: getValueTypeById,
            deletemultiValueType: function (postData) {
                return api.deletemultiValueType.save(postData).$promise;
            }
        };
    }

})();