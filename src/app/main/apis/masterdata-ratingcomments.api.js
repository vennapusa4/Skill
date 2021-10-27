(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('MDRatingCommentsApi', MDRatingCommentsApi);

    /** @ngInject */
    function MDRatingCommentsApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetAllRatingComments'),
            addRatingComments: $resource(appConfig.SkillApi + 'api/Admin/MasterData/CreateRatingComments'),
            getCommentById: $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetRatingTypeById'),
            updateRatingComments: $resource(appConfig.SkillApi + 'api/Admin/MasterData/UpdateRatingCommentType'),
            deleteItem: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteRatingCommentType'),
            exportToExcel: $resource(appConfig.SkillApi + 'api/Admin/MasterData/RatingTypeToExcel'),
            deleteMultiRatingComments: $resource(appConfig.SkillApi + 'api/Admin/MasterData/DeleteMultiCommentsType'),
        };

        function getAll(option, keyword,total) {
        
            var keyword = keyword;
            var skip = option.data.skip;
            var take = option.data.take;
            var sortField = _.get(option, 'options.data.sort[0].field', 'typeId');
            var sortDir = _.get(option, 'options.data.sort[0].dir', 'asc');
            var Export= (option.data.take === total);

            api.getAll.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: Export }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getCommentById(id) {
            api.getCommentById.save({}, { id: id }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function addRatingComments(postData) {
            return api.addRatingComments.save(postData).$promise;
        }

        function updateRatingComments(postData) {
            return api.updateRatingComments.save(postData).$promise;
        }

        function deleteItem(itemIds) {
            return api.deleteItem.save(itemIds).$promise;
        }

        function exportToExcel(option, keyword) {
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "typeId";
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
            addRatingComments: addRatingComments,
            deleteItem: deleteItem,
            exportToExcel: exportToExcel,
            updateRatingComments: updateRatingComments,
            getCommentById: getCommentById,
            deleteMultiRatingComments: function (postData) {
                return api.deleteMultiRatingComments.save(postData).$promise;
            }
        };
    }

})();