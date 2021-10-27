(function () {
    'use strict';

    angular
        .module('app.adminSetting')
        .factory('CoverImageAPI', CoverImageAPI);

    /** @ngInject */
    function CoverImageAPI($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/CoverImage/GetAllKdCoverImages'),
            getByType: $resource(appConfig.SkillApi + 'api/Admin/CoverImage/GetKdCoverImagesType', {}, {
                query: { method: 'GET', isArray: false }
            }),
            addNew: $resource(appConfig.SkillApi + '/api/Admin/CoverImage/AddNewKdCoverImage'),
            update: $resource(appConfig.SkillApi + 'api/Admin/CoverImage/UpdateKdCoverImage'),
            deleteMultiAds: $resource(appConfig.SkillApi + '/api/Admin/CoverImage/DeleteMultiKdCoverImages'),            
        };

        function getAllActiveAds(){
            var deferred = $q.defer();
            api.getAllActiveAds.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }


        function getAll(option, keyword,filterBy,total) {

            var skip = option.data.skip;
            var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "";
            var isExport = (option.data.take === total);
            var Take =  option.data.take;
            var Aggregate = null;
            var Group = null;
            var searchTerm = keyword == null || undefined ? "" : keyword;

            api.getAll.save({}, { Take: Take, Skip: skip, sort :sortField, Filter : filterBy , Group : Group , Aggregate: Aggregate, SearchString : searchTerm}, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
        }

        function getByType(kdType) {
            var deferred = $q.defer();
            var postData = {
                Kdtype: kdType
            }
            api.getByType.query(postData, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }


        function addNew(postData) {
            return api.addNew.save(postData).$promise;
        }

        function update(postData) {
            return api.update.save(postData).$promise;
        }


        return {
            api: api,
            getAll: getAll,
            getByType: getByType,
            addNew: addNew,
            update: update,
            getAllActiveAds:getAllActiveAds,
            deleteMultiAds: function (postData) {
                return api.deleteMultiAds.save(postData).$promise;
            }
        };
    }

})();