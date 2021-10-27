(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('TrendingApi', TrendingApi);

    /** @ngInject */
    function TrendingApi($resource, appConfig, $q) {
        var $q = $q;

        var api = {
            getKnowledgeContribution: $resource(appConfig.SkillApi + '/api/Trending/GetKnowledgeContribution', {}, {
                save: { method: 'POST', isArray: false }
              }),
            getValueCreateions: $resource(appConfig.SkillApi + '/api/Trending/GetValueCreateions', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getKnowledgeReplicated: $resource(appConfig.SkillApi + '/api/Trending/GetKnowledgeReplicated', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTopTrendingKnowledge: $resource(appConfig.SkillApi + 'api/Trending/GetTopTrendingKnowledge', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTopTrendingCollection: $resource(appConfig.SkillApi + '/api/Trending/GetTopTrendingCollection', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTopContributors: $resource(appConfig.SkillApi + '/api/Trending/GetTopContributors', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTopEngagedPeople: $resource(appConfig.SkillApi + '/api/Trending/GetTopEngagedPeople', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTopValueRealized: $resource(appConfig.SkillApi + '/api/Trending/GetTopValueRealized', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTopReplicatedKnowledge: $resource(appConfig.SkillApi + '/api/Trending/GetTopReplicatedKnowledge', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTrendingTopics: $resource(appConfig.SkillApi + '/api/Trending/GetTrendingTopics', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getTrendingSearchKeywords: $resource(appConfig.SkillApi + '/api/Trending/GetTrendingSearchKeywords', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getCurrentChallenge: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/OnGoingChallenges', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getCompletedChallenge: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/CompletedChallenges', {}, {
                save: { method: 'POST', isArray: false }
            }),
        };
       
        function getKnowledgeContribution(payload) {
            var deferred = $q.defer();
            api.getKnowledgeContribution.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getValueCreateions(payload) {
            var deferred = $q.defer();
            api.getValueCreateions.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getKnowledgeReplicated(payload) {
            var deferred = $q.defer();
            api.getKnowledgeReplicated.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTopTrendingKnowledge(payload) {
            var deferred = $q.defer();
            api.getTopTrendingKnowledge.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTopContributors(payload) {
            var deferred = $q.defer();
            api.getTopContributors.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTopEngagedPeople(payload) {
            var deferred = $q.defer();
            api.getTopEngagedPeople.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTopTrendingCollection(payload) {
            var deferred = $q.defer();
            api.getTopTrendingCollection.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTopValueRealized(payload) {
            var deferred = $q.defer();
            api.getTopValueRealized.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTopReplicatedKnowledge(payload) {
            var deferred = $q.defer();
            api.getTopReplicatedKnowledge.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getTrendingTopics(payload) {
            var deferred = $q.defer();
            api.getTrendingTopics.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getTrendingSearchKeywords(payload) {
            var deferred = $q.defer();
            api.getTrendingSearchKeywords.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getCurrentChallenge(payload) {
            var deferred = $q.defer();
            api.getCurrentChallenge.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getCompletedChallenge(payload) {
            var deferred = $q.defer();
            api.getCompletedChallenge.save({}, payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        
        return {
            api: api,
            getKnowledgeContribution: getKnowledgeContribution,
            getValueCreateions: getValueCreateions,
            getKnowledgeReplicated: getKnowledgeReplicated,
            getTopTrendingKnowledge: getTopTrendingKnowledge,
            getTopContributors: getTopContributors,
            getTopEngagedPeople: getTopEngagedPeople,
            getTopTrendingCollection: getTopTrendingCollection,
            getTopValueRealized: getTopValueRealized,
            getTopReplicatedKnowledge: getTopReplicatedKnowledge,
            getTrendingTopics: getTrendingTopics,
            getTrendingSearchKeywords:getTrendingSearchKeywords,
            getCurrentChallenge : getCurrentChallenge,
            getCompletedChallenge : getCompletedChallenge
        };
    }

})();