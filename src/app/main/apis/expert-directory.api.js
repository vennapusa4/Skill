(function () {
    'use strict';

    angular
        .module('app.expertDirectory')
        .factory('ExpertDirectoryApi', ExpertDirectoryApi);

    /** @ngInject */
    function ExpertDirectoryApi($resource, appConfig, $q, $timeout) {
        var $q = $q;
        var $timeout = $timeout;

        var api = {
            summary: $resource(appConfig.SkillApi + 'api/ExpertDirectory/Summary'),
            mostEngaged: $resource(appConfig.SkillApi + 'api/ExpertDirectory/MostEngaged'),
            latestValidated: $resource(appConfig.SkillApi + 'api/ExpertDirectory/LatestValidated'),
            search: $resource(appConfig.SkillApi + 'api/ExpertDirectory/Search'),
            departments: $resource(appConfig.SkillApi + 'api/Lookup/Departments', {}, {
                save: { method: 'POST', isArray: true }
            }),
            disciplines: $resource(appConfig.SkillApi + 'api/Lookup/Disciplines', {}, {
                save: { method: 'POST', isArray: true }
            }),
            locations: $resource(appConfig.SkillApi + 'api/Lookup/Locations', {}, {
                save: { method: 'GET', isArray: true }
            }),
            divisions: $resource(appConfig.SkillApi + 'api/Lookup/Divisions', {}, {
                save: { method: 'GET', isArray: true }
            }),

            upcomingExperts: $resource(appConfig.SkillApi + 'api/ExpertDirectory/UpcomingExperts', {}, {
                save: { method: 'GET', isArray: true }
            }),
            searchByCurrentUser: $resource(appConfig.SkillApi + 'api/ExpertDirectory/SearchByCurrentUser'),
            expertDirectoryFilterByCurrentUser: $resource(appConfig.SkillApi + 'api/ExpertDirectory/ExpertDirectoryFilterByCurrentUser'),
        };

        function summary() {
            var deferred = $q.defer();
            api.summary.get({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function mostEngaged() {
            var deferred = $q.defer();
            api.mostEngaged.get({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function search(postdata) {
            var deferred = $q.defer();
            api.search.save(postdata, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function latestValidated() {
            var deferred = $q.defer();
            api.latestValidated.get({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function getUpcomingExperts() {

            var deferred = $q.defer();
            api.upcomingExperts.save({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function departments() {
            var deferred = $q.defer();
            api.departments.save({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function disciplines() {
            var deferred = $q.defer();
            api.disciplines.save({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function locations() {
            var deferred = $q.defer();
            api.locations.save({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function divisions() {
            var deferred = $q.defer();
            api.divisions.save({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function searchByCurrentUser(postdata) {
            var deferred = $q.defer();
            api.searchByCurrentUser.save(postdata, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });

            return deferred.promise;
        }

        function expertDirectoryFilterByCurrentUser(postdata) {
            return api.expertDirectoryFilterByCurrentUser.query().$promise;
        }

        return {
            api: api,
            summary: summary,
            search: search,
            departments: departments,
            mostEngaged: mostEngaged,
            latestValidated: latestValidated,
            getUpcomingExperts: getUpcomingExperts,
            disciplines: disciplines,
            locations: locations,
            divisions: divisions,
            searchByCurrentUser: searchByCurrentUser,
            expertDirectoryFilterByCurrentUser: expertDirectoryFilterByCurrentUser
        };
    }

})();


