(function () {
    'use strict';

    angular
        .module('app.masterData')
        .factory('AdminFeaturedSlidesApi', AdminFeaturedSlidesApi);

    /** @ngInject */
    function AdminFeaturedSlidesApi($resource, appConfig, $q, AdminFeaturedSlidesService) {
        var $q = $q;

        var api = {
            searchKnowledge: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/SearchKnowledge', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getAllSlide: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/Gets?request.skip=0'),
            getSlideById: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/Get/:id'),
            save: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/Save'),
            "delete": $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/Delete'),

            uploadImage: function (type) {
                return $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/UploadFile', {}, {
                    save: {
                        method: "POST",
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined,
                            'Accept': 'application/octet-stream'
                        },
                        responseType: 'blob',
                        transformResponse: function (data, headers) {
                            return AdminFeaturedSlidesService.transform(data, headers);
                        }
                    }
                });
            },

            getKnowledgeById: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/GetKnowledgeDocument/:id'),
        };

        return {
            api: api,
            getAllSlide: function () {
                var deferred = $q.defer();
                api.getAllSlide.get({}, function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            getSlideById: function (id) {
                var deferred = $q.defer();
                api.getSlideById.get({ id: id }, function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            save: function (data) {
                var deferred = $q.defer();
                api.save.save({}, data,
                    function (data) {
                        deferred.resolve(data);
                    },
                    function (data) {
                        deferred.reject(data);
                    }
                );
                return deferred.promise;
            },

            "delete": function (data) {
                var deferred = $q.defer();
                api.delete.save({}, data,
                    function (data) {
                        deferred.resolve(data);
                    },
                    function (data) {
                        deferred.reject(data);
                    }
                );
                return deferred.promise;
            },
            uploadImage: function (type, fd) {
                var defer = $q.defer();
                api.uploadImage(type).save(fd,
                    function (data) {
                        defer.resolve(data);
                    },
                    function (data) {
                        defer.reject(data);
                    }
                );
                return defer.promise;
            },
            searchKnowledge: function (options) {
                var SearchTerm = _.get(options, 'data.filter.filters[0].value');
                api.searchKnowledge.save({}, { SearchTerm: SearchTerm, take: 20 }).$promise.then(function (res) {
                    options.success(res);
                }, function (err) {

                    options.error(err);
                });
            },
            getKnowledgeById: function (id) {
                var deferred = $q.defer();
                api.getKnowledgeById.get({ id: id }, function (data) {
                    deferred.resolve(data);
                }, function (data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
        };
    }
})();