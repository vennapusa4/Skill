(function () {
    'use strict';

    angular
        .module('app.adminSetting')
        .factory('AdsSettingAPI', AdsSettingAPI);

    /** @ngInject */
    function AdsSettingAPI($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/Advertisement/GetAllAds'),
            addNew: $resource(appConfig.SkillApi + '/api/Admin/Advertisement/AddNewAdvertisement'),
            update: $resource(appConfig.SkillApi + 'api/Admin/Advertisement/UpdateAdvertisement'),
            deleteMultiAds: $resource(appConfig.SkillApi + '/api/Admin/Advertisement/DeleteMultiAds'),
            getAllActiveAds: $resource(appConfig.SkillApi + '/api/Admin/Advertisement/GetAllActiveAds' , {}, {
                query: { method: 'GET', isArray: false }
            }),
            
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


        function getAll(option, keyword , total) {

            var keyword = keyword;
            var skip = option.data.skip;
            var take = option.data.take;
            var sortField = _.get(option, 'options.data.sort[0].field', 'title');
            var sortDir = _.get(option, 'options.data.sort[0].dir', 'asc');
            var Export= (option.data.take === total);
            api.getAll.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: Export }, function (data) {
                option.success(data);
            }, function (data) {
                option.error(data);
            });
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
            addNew: addNew,
            update: update,
            getAllActiveAds:getAllActiveAds,
            deleteMultiAds: function (postData) {
                return api.deleteMultiAds.save(postData).$promise;
            }
        };
    }

})();