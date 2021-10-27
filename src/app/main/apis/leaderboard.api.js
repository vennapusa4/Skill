(function () {
    'use strict';

    angular
        .module('app.leaderboard')
        .factory('LeaderboardApi', LeaderboardApi);

    /** @ngInject */
    function LeaderboardApi($resource, appConfig, $http, $q) {
        var $q = $q;

        var api = {
            // My Achievement
            getMyAchievement: $resource(appConfig.SkillApi + '/api/Leaderboard/MyAchievement', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getMyAchievementFilter: $resource(appConfig.SkillApi + 'api/Leaderboard/MyAchievementChart/:filter', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getMyAchievementHistory: $resource(appConfig.SkillApi + 'api/Leaderboard/History', {}, {
                query: { method: 'GET', isArray: true }
            }),

            // My Level
            getMyLevel: $resource(appConfig.SkillApi + '/api/Leaderboard/MyLevel?id=', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getUserLevel: $resource(appConfig.SkillApi + '/api/Leaderboard/MyLevel?id=:id', {}, {
                query: { method: 'GET', isArray: false }
            }),

            // My Earned Badges
            getMyEarnedBadges: $resource(appConfig.SkillApi + 'api/Leaderboard/MyEarnedBadges?id=', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getUserEarnedBadges: $resource(appConfig.SkillApi + 'api/Leaderboard/MyEarnedBadges?id=:id', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getBadges: $resource(appConfig.SkillApi + '/api/Level/BadgesEarned', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getBadgesCommunity: $resource(appConfig.SkillApi + '/api/Level/BadgesCommunity', {}, {
                query: { method: 'GET', isArray: true }
            }),

            // My Ranking
            getMyRanking: $resource(appConfig.SkillApi + '/api/Leaderboard/MyRanking', {}, {
                query: { method: 'GET', isArray: false }
            }),


            getGetScoreboardHeader: $resource(appConfig.SkillApi + '/api/Leaderboard/Scoreboard/GetHeader/:filter', {}, {
                query: { method: 'GET', isArray: false }
            }),
            getScoreboardDetail: $resource(appConfig.SkillApi + '/api/Leaderboard/Scoreboard/Details'),
            getCommunityScoreRanking: $resource(appConfig.SkillApi + 'api/Leaderboard/CommunityScoreRanking', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getCommunityScoreRankingByCop: $resource(appConfig.SkillApi + 'api/Leaderboard/CommunityScoreRankingByCop', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getSubscribedCoP: $resource(appConfig.SkillApi + 'api/Leaderboard/GetSubscribedCoP', {}, {
                save: { method: 'POST', isArray: true }
            }),
            getAllCoP: $resource(appConfig.SkillApi + 'api/Leaderboard/GetAllCop', {}, {
                save: { method: 'POST', isArray: true }
            }),
            //searchSegmentSuggestions: $resource(appConfig.SkillApi + 'api/Insights/SearchSegmentItem', {}, {
            //    save: { method: 'POST', isArray: true }
            //}),

            getOngoingChallenges: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/OnGoingChallenges', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getCompletedChallenges: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/CompletedChallenges', {}, {
                query: { method: 'GET', isArray: true }
            }),
            getNewCompletedChallenges: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/CompletedChallenges', {}, {
                query: { method: 'GET', isArray: true }
            }),
            setChallengeFavourite: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/SetChallengeFavourite', {}, {
                save: { method: 'POST', isArray: false }
            }),
            shareChallenge: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/Share', {}, {
                save: { method: 'POST', isArray: false }
            }),
            getChallengeShareInfors: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/GetChallengeShareInfors', {}, {
                query: { method: 'GET', isArray: false }
            }),
        };

        // My Achievement
        function getMyAchievement() {
            var deferred = $q.defer();
            api.getMyAchievement.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getMyAchievementFilter(filter) {
            var deferred = $q.defer();
            api.getMyAchievementFilter.query({ filter: filter }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getMyAchievementHistory(isShowAll) {
            var deferred = $q.defer();
            api.getMyAchievementHistory.query({ isShowAll: isShowAll }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // My Level
        function getMyLevel() {
            var deferred = $q.defer();
            api.getMyLevel.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getUserLevel(id) {
            var deferred = $q.defer();
            api.getUserLevel.query({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // My Earned Badges
        function getMyEarnedBadges() {
            var deferred = $q.defer();
            api.getMyEarnedBadges.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getUserEarnedBadges(id) {
            var deferred = $q.defer();
            api.getUserEarnedBadges.query({ id: id }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getBadges() {
            var deferred = $q.defer();
            api.getBadges.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getBadgesCommunity() {
            var deferred = $q.defer();
            api.getBadgesCommunity.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getOngoingChallenges(obj) {
            var deferred = $q.defer();
            api.getOngoingChallenges.save({}, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function setChallengeFavourite(obj) {
            var deferred = $q.defer();
            api.setChallengeFavourite.save({}, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function shareChallenge(obj) {
            var deferred = $q.defer();
            api.shareChallenge.save({}, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getCompletedChallenges() {
            var deferred = $q.defer();
            api.getCompletedChallenges.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getNewCompletedChallenges(payload) {
            var deferred = $q.defer();
            api.getNewCompletedChallenges.query(payload, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getChallengeShareInfors() {
            var deferred = $q.defer();
            api.getChallengeShareInfors.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        // My Ranking
        function getMyRanking() {
            var deferred = $q.defer();
            api.getMyRanking.query({}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }


        function getGetScoreboardHeader(searchTerm) {
            var deferred = $q.defer();
            api.getGetScoreboardHeader.query({ filter: searchTerm}, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getScoreboardDetail(levelId, filterResult, searchTerm) {
            var deferred = $q.defer();
            api.getScoreboardDetail.save({}, {
                LevelId: levelId,
                FilterResult: filterResult,
                SearchTerm: searchTerm
            }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }

        function getCommunityScoreRanking(filter, obj) {
            var deferred = $q.defer();
            api.getCommunityScoreRanking.save({ }, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getCommunityScoreRankingByCop(filter, obj) {
            var deferred = $q.defer();
            api.getCommunityScoreRankingByCop.save({ }, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getSubscribedCoP(filter, obj) {
            var deferred = $q.defer();
            api.getSubscribedCoP.save({ }, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getAllCop(filter, obj) {
            var deferred = $q.defer();
            api.getAllCoP.save({ }, obj, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        //function searchSegmentSuggestions(options, data) {
        //    api.searchSegmentSuggestions.save(data).$promise.then(function (res) {
        //        options.success(res);
        //    }, function (err) {
        //        options.error(err);
        //    });
        //}

        return {
            api: api,

            // My Achievement
            getMyAchievement: getMyAchievement,
            getMyAchievementFilter: getMyAchievementFilter,
            getMyAchievementHistory: getMyAchievementHistory,

            // My Level
            getMyLevel: getMyLevel,
            getUserLevel: getUserLevel,

            // My Earned Badges
            getMyEarnedBadges: getMyEarnedBadges,
            getUserEarnedBadges: getUserEarnedBadges,
            getBadges: getBadges,
            getBadgesCommunity: getBadgesCommunity,
            getOngoingChallenges: getOngoingChallenges,
            setChallengeFavourite: setChallengeFavourite,
            getCompletedChallenges: getCompletedChallenges,
            shareChallenge: shareChallenge,

            // My Ranking
            getMyRanking: getMyRanking,

            getGetScoreboardHeader: getGetScoreboardHeader,
            getScoreboardDetail: getScoreboardDetail,
            getCommunityScoreRanking: getCommunityScoreRanking,
            getCommunityScoreRankingByCop: getCommunityScoreRankingByCop,
            getSubscribedCoP: getSubscribedCoP,
            getAllCop: getAllCop,
            //searchSegmentSuggestions: searchSegmentSuggestions,
            getChallengeShareInfors: getChallengeShareInfors,
            getNewCompletedChallenges:getNewCompletedChallenges
        };
    }

})();
