(function () {
    'use strict';

    angular
        .module('fuse')
        .factory('CommonApi', CommonApi);

    /** @ngInject */
    function CommonApi($resource, appConfig, $q, $window) {
        var $q = $q;

        var api = {
            getTopNavigation: $resource(appConfig.SkillApi + 'api/Home/DynamicTopNavigation'),
            getAllDiscipline: $resource(appConfig.SkillApi + 'api/Lookup/Disciplines', {}, {
                save: { method: 'POST', isArray: true, cache: true }
            }),
            getAllSubDiscipline: $resource(appConfig.SkillApi + 'api/Lookup/SubDisciplines', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getAllLocations: $resource(appConfig.SkillApi + 'api/Lookup/Locations', {}, {
                save: { method: 'GET', isArray: true }
            }),
            getAllRuleTypes: $resource(appConfig.SkillApi + 'api/Admin/RuleType/GetAll'),

            getSubDisciplines: $resource(appConfig.SkillApi + 'api/Lookup/GetSubDisciplines', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getNotification: $resource(appConfig.SkillApi + 'api/User/PendingTask?userId=:id', {}, {
                get: { method: 'GET', isArray: false }
            }),
            getBadgeNotification: $resource(appConfig.SkillApi + 'api/User/BadgesCount?userId=:id', {}, {
                get: { method: 'GET', isArray: false }
            }),
            getAllBusinessSectors: $resource(appConfig.SkillApi + 'api/Lookup/AllBusinessSectors', {}, {
                get: { method: 'GET', isArray: true }
            }),
        };

        function getTopNavigation() {

            var deferred = $q.defer();
            try {
                if ($window.localStorage['TopNavigation'] != null) {
                    var data = JSON.parse($window.localStorage['TopNavigation']);
                    deferred.resolve(data);
                }
                else {
                    api.getTopNavigation.query({}, function (data) {

                        $window.localStorage['TopNavigation'] = JSON.stringify(data);
                        deferred.resolve(data);
                    }, function (data) {

                        deferred.reject(data);
                    });
                }
            }
            catch (err) {

            }

            return deferred.promise;
        }

        function getAllDiscipline() {

            var deferred = $q.defer();

            api.getAllDiscipline.save({}, { searchKeyword: '', skip: 0, take: 0 }, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getAllSubDiscipline(parentsId) {

            var deferred = $q.defer();

            api.getAllSubDiscipline.save({}, { id: parentsId, skip: 0, take: 0, sortField: "", sortDir: "", isExport: false }, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getSubDisciplines(ids) {
            var deferred = $q.defer();

            api.getSubDisciplines.save({}, ids, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getNotification(id) {
            var deferred = $q.defer();
            api.getNotification.get(id, {}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
        function getBadgeNotification(id) {
            var deferred = $q.defer();
            api.getBadgeNotification.get(id, {}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getAllBusinessSectors(){
            var deferred = $q.defer();

            api.getAllBusinessSectors.query({}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise; 
        }
        function getLocations() {

            var deferred = $q.defer();

            api.getAllLocations.query({}, function (data) {

                deferred.resolve(data);
            }, function (data) {

                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getAllRuleTypes(options) {
            var deferred = $q.defer();

            api.getAllRuleTypes.query({}, {}, function (data) {
                options.success(data);

            }, function (data) {
                options.error(data);
            });
        }

        return {
            api: api,

            getTopNavigation: getTopNavigation,
            getAllDiscipline: getAllDiscipline,
            getAllSubDiscipline: getAllSubDiscipline,
            getLocations: getLocations,
            getAllRuleTypes: getAllRuleTypes,
            getSubDisciplines: getSubDisciplines,
            getNotification: getNotification,
            getBadgeNotification: getBadgeNotification,
            getAllBusinessSectors:getAllBusinessSectors
        };
    }

})();
