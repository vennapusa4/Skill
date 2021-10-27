(function () {
    'use strict';

    angular
        .module('app.ranking')
        .factory('RankingApi', RankingApi);

    /** @ngInject */
    function RankingApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/Ranking/GetAll'),
            delete: $resource(appConfig.SkillApi + 'api/Admin/Ranking/Delete', {}, {
                delete: {
                    method: 'POST',
                }
            }),
            saveRank: $resource(appConfig.SkillApi + 'api/Admin/Ranking/Insert')
        };

        function getAll() {

            var deferred = $q.defer();
            api.getAll.get({}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function saveRank(postData) {

            var deferred = $q.defer();
            api.saveRank.save({}, postData, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function deleteItem(header) {

            var deferred = $q.defer();
            api.delete.delete({ id: header }, {}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        return {
            api: api,

            getAll: getAll,
            deleteItem: deleteItem,
            saveRank: saveRank
        };
    }

})();