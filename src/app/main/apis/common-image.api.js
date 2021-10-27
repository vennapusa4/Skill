(function () {
    'use strict';

    angular
        .module('app.commonImageSetting')
        .factory('CommonImageApi', CommonImageApi );

    /** @ngInject */
    function CommonImageApi ($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/CommonImage/GetAll'),
            details: $resource(appConfig.SkillApi + 'api/Admin/CommonImage/Detail'),
            save: $resource(appConfig.SkillApi + 'api/Admin/CommonImage/Save'),
        };

        function getAll() {

            var deferred = $q.defer();
            api.getAll.query({}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getDetails(name) {

            var deferred = $q.defer();
            api.details.get({ name: name }, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function save(id, key, title, imageBytes) {
            var deferred = $q.defer();
            var postData = {
                id: id,
                key: key,
                title: title,
                imageBytes: imageBytes,
            };

            api.save.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        return {
            api: api,

            getAll: getAll,
            getDetails: getDetails,
            save: save,
        };
    }

})();
