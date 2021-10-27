(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MDBusinessSectorAPI', MDBusinessSectorAPI);

    /** @ngInject */
    function MDBusinessSectorAPI($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/getAllBusinessSectors'),
            addBusinessSector: $resource(appConfig.SkillApi + 'api/Admin/MasterData/createBusinessSectors'),
            updateBusinessSector: $resource(appConfig.SkillApi + 'api/Admin/MasterData/updateBusinessSectors'),
            deleteItem: $resource(appConfig.SkillApi + 'api/Admin/MasterData/deleteBusinessSectors'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/exportBusinessSectorsToExcel'),
            deleteMultiBusinessSectors: $resource(appConfig.SkillApi + 'api/Admin/MasterData/deleteMultiBusinessSectors'),
        };

        function getAll(option, keyword, total) {
            var keyword = keyword;
            var skip = option.data.skip;
            var take = option.data.take;
            var sortField = _.get(option, 'options.data.sort[0].field', 'name');
            var sortDir = _.get(option, 'options.data.sort[0].dir', 'asc');
            var Export= (option.data.take === total);


            api.getAll.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: Export }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function addBusinessSector(postData) {
            return api.addBusinessSector.save(postData).$promise;
        }

        function updateBusinessSector(postData) {
            return api.updateBusinessSector.save(postData).$promise;
        }

        function deleteItem(itemIds) {
            return api.deleteItem.save(itemIds).$promise;
        }

        function exportToExcel(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
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

        return {
            api: api,
            getAll: getAll,
            addBusinessSector: addBusinessSector,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            updateBusinessSector: updateBusinessSector,
            deleteMultiBusinessSectors: function (postData) {
                return api.deleteMultiBusinessSectors.save(postData).$promise;
            }
        };
    }

})();