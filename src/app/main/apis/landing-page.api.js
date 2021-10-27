(function () {
    'use strict';

    angular
        .module('app.landingPage')
        .factory('LandingPageAPI', LandingPageAPI);

    /** @ngInject */
    function LandingPageAPI($resource, appConfig, $q) {
        var $q = $q; 
        var vm = this;
        vm.dataToExport = [];
        vm.data = [];
        vm.datasource = [];
        
        var api = {
            summary: $resource(appConfig.SkillApi + 'api/home/dashboard' , {}, {
                query: { method: 'GET', isArray: false }
            }),
            getSlider: $resource(appConfig.SkillApi + 'api/home/dashboard/LandingSliderDashboard' , {}, {
                query: { method: 'GET', isArray: false }
            }),
            getRecommendCollection: $resource(appConfig.SkillApi + 'api/UserProfile/CollectionbyId' , {}, {
                query: { method: 'POST', isArray: false }
            }),
            getArticles: $resource(appConfig.SkillApi + 'api/home/dashboard/LandingArticleDashboard' , {}, {
                query: { method: 'GET', isArray: false }
            }),
            getCoPs: $resource(appConfig.SkillApi + 'api/home/dashboard/LandingCOPDashboard' , {}, {
                query: { method: 'GET', isArray: false }
            }),
            getDiscussions: $resource(appConfig.SkillApi + 'api/home/dashboard/LandingDiscussionDashboard' , {}, {
                query: { method: 'GET', isArray: false }
            }),
            postLike: $resource(appConfig.SkillApi + 'api/home/postlike'),
            bookmark: $resource(appConfig.SkillApi + 'api/home/bookmark'),
            RequestToSubscribeToCop: $resource(appConfig.SkillApi + '/api/home/dashboard/SubscribeToCop'),
        };

        function GetSummary(userID) {
            var deferred = $q.defer();
            api.summary.query({ userId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        
        }
        
        function getSlider(userID) {
            var deferred = $q.defer();
            api.getSlider.query({ userId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
        function getRecommendCollection(userID) {
            var deferred = $q.defer();
            api.getRecommendCollection.save({userid: userID },
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
        }

        function getArticles(userID) {
            var deferred = $q.defer();
            api.getArticles.query({ userId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        
        }
        function getCoPs(userID) {
            var deferred = $q.defer();
            api.getCoPs.query({ userId: userID }, function (data) {
                deferred.resolve(data);
            }, function (data) {
                deferred.reject(data);
            });
            return deferred.promise;
        
        }

        function getDiscussions(discussionData){
            var deferred = $q.defer();
            api.getDiscussions.save({}, discussionData,
              function (res) {
                deferred.resolve(res);
              },
              function (err) {
                deferred.reject(err);
              }
            );
            return deferred.promise;
        }

        
        function postLike(postData){
            return api.update.save(postData).$promise;
        }

        function bookmark(postData){
            return api.bookmark.save(postData).$promise;
        }

        function RequestToSubscribeToCop(postData) {
            return api.RequestToSubscribeToCop.save(postData).$promise;
        }

     

        return {
            api: api,
            GetSummary: GetSummary,
            getSlider:getSlider,
            getRecommendCollection: getRecommendCollection,
            getArticles:getArticles,
            getCoPs:getCoPs,
            getDiscussions:getDiscussions,
            postLike: postLike,
            bookmark:bookmark,
            RequestToSubscribeToCop: RequestToSubscribeToCop
        };
    }

})();