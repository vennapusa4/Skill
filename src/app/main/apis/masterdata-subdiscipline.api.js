(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MasterDataSubDisciplineApi', MasterDataSubDisciplineApi);

    /** @ngInject */
    function MasterDataSubDisciplineApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllSubDiscipline'),
            addNew: $resource(appConfig.SkillApi + '/api/Admin/MasterData/CreateNewSubDiscipline'),
            getById: $resource(appConfig.SkillApi + '/api/Admin/MasterData/GetDisciplineById'),
            update: $resource(appConfig.SkillApi + '/api/Admin/MasterData/UpdateSubDiscipline'),
            deleteItem: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteSubDiscipline'),
            exportToExcel: $resource(appConfig.SkillApi + '/api/Admin/MasterData/SubDisciplineToExcel'),
            GetDisciplineSuggestions: $resource(appConfig.SkillApi + 'api/Search/GetDisciplineSuggestions', {}, {
                save: { method: 'POST', isArray: true }
            }),
            deleteMultiSubdiscipline: $resource(appConfig.SkillApi + '/api/Admin/MasterData/DeleteMultiSubdiscipline'),
        };

        function getAll(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "subDisciplineName";
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

        function getById(id) {
            api.getCoPById.save({}, { id: id }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
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

        function getDisciplineSuggestions(options) {
            var deferred = $q.defer();
            var searchTerm = _.get(options, 'data.filter.filters[0].value');
            api.GetDisciplineSuggestions.save({}, { searchText: searchTerm }, function (res) {
                options.success(res);
            }, function (res) {
                options.error(res);
            });
            return deferred.promise;
        }

        return {
            api: api,
            getAll: getAll,
            addNew: addNew,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            update: update,
            getById: getById,
            getDisciplineSuggestions: getDisciplineSuggestions,
            deleteMultiSubdiscipline: function (postData) {
                return api.deleteMultiSubdiscipline.save(postData).$promise;
            }
        };
    }

})();