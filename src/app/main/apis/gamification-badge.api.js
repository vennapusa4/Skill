(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('GamificationBadgeApi', GamificationBadgeApi);

    /** @ngInject */
    function GamificationBadgeApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getAll: $resource(appConfig.SkillApi + 'api/Admin/GamificationBadge/GetAll'),
            save: function () {
                return $resource(appConfig.SkillApi + 'api/Admin/GamificationBadge/Save', {}, {
                    save: {
                        method: "POST",
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/octet-stream'
                        },
                        responseType: 'blob',
                        transformResponse: function (data, headers) {
                            //return KnowledgeService.transform(data, headers);
                        }
                    }
                });
            },
            deleteItem: $resource(appConfig.SkillApi + 'api/Admin/GamificationBadge/Delete')
        };

        function getGamificationBadges(options, keyword) {
            var sortField = options.data.sort !== undefined ? options.data.sort[0].field : "";
            var sortDir = options.data.sort !== undefined ? options.data.sort[0].dir : "";
            api.getAll.save({}, { searchTerm: keyword, skip: options.data.skip, take: options.data.take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
                options.success(data);
            }, function (data) {
                options.error(data);
            });
        }

        function saveGamificationBadge(formData) {
            var defer = $q.defer();
            api.save().save(formData,
                function (data) {
                    defer.resolve(data);
                },
                function (data) {
                    defer.reject(data);
                }
            );

            return defer.promise;
        }

        function deleteGamificationBadges(itemIds) {
            var deferred = $q.defer();
            api.deleteItem.save({}, itemIds,
                function (data) {
                    deferred.resolve(data);
                },
                function (data) {
                    deferred.reject(data);
                });

            return deferred.promise;
        }

        return {
            api: api,

            getGamificationBadges: getGamificationBadges,
            saveGamificationBadge: saveGamificationBadge,
            deleteGamificationBadges: deleteGamificationBadges
        };
    }

})();