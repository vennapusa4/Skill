(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataIdeasCategoryApi', MasterDataIdeasCategoryApi);

    /** @ngInject */
    function MasterDataIdeasCategoryApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetAllIdeasCategory'),
            addIdeasCategory: $resource(appConfig.SkillApi + '/api/Admin/MasterData/CreateNewIdeasCategory'),
            getIdeasCategoryById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetIdeasCategoryById'),
            updateIdeasCategory: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateIdeasCategory'),
            deletemultiIdeasCategory: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeletemultiIdeasCategory'),
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

        function getIdeasCategoryById(id) {
            api.getCoPById.save({}, { id: id }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function addIdeasCategory(postData) {
            return api.addIdeasCategory.save(postData).$promise;
        }

        function updateIdeasCategory(postData) {
            return api.updateIdeasCategory.save(postData).$promise;
        }

        return {
            api: api,

            getAll: getAll,
            addIdeasCategory: addIdeasCategory,
            updateIdeasCategory: updateIdeasCategory,
            getIdeasCategoryById: getIdeasCategoryById,
            deletemultiIdeasCategory: function (postData) {
                return api.deletemultiIdeasCategory.save(postData).$promise;
            }
        };
    }

})();