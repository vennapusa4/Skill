(function () {
  'use strict';

  angular
      .module('app.SearchPage')
      .factory('searchPageAPI', searchPageAPI);

  /** @ngInject */
  function searchPageAPI($resource, appConfig, $q , UserProfileApi) {
      var $q = $q; 
      var vm = this;
      
      var api = {
          getCategoryCount: $resource(appConfig.SkillApi + 'api/SearchV2/TotalKnowledgeCount', {}, {
              query: { method: 'GET', isArray: true }
          }),
          getTrendingKnowledge: $resource(appConfig.SkillApi + 'api/SearchV2/SearchTrendingKnowledge', {}, {
              query: { method: 'GET', isArray: true }
          }),
         // getTrendingKnowledge1: chunkedRequestWithPromise(appConfig.SkillApi + 'api/SearchV2/SearchTrendingKnowledge'),
        
          getTrendingMedia: $resource(appConfig.SkillApi + 'api/SearchV2/SearchTrendingMedia', {}, {
              query: { method: 'GET', isArray: true }
          }),
          getSingleCOP: $resource(appConfig.SkillApi + 'api/SearchV2/SearchSingleCop', {}, {
              query: { method: 'GET', isArray: false }
          }), 
          SearchTrendingSingleCop: $resource(appConfig.SkillApi + 'api/SearchV2/SearchTrendingSingleCop', {}, {
            query: { method: 'GET', isArray: false }
          }), 
          getSearchSingleCOP: $resource(appConfig.SkillApi + 'api/SearchV2/SearchSingleCop', {}, {
            query: { method: 'GET', isArray: false }
          }),  
          getTrendingCOP: $resource(appConfig.SkillApi + 'api/SearchV2/GetTrendingCop', {}, {
              query: { method: 'GET', isArray: true }
          }),
          getKnowledge: $resource(appConfig.SkillApi + 'api/SearchV2/SearchResult', {}, {
              query: { method: 'POST', isArray: true }
          }),
          getKnowledgeCount: $resource(appConfig.SkillApi + 'api/SearchV2/SearchResultCount', {}, {
              query: { method: 'POST', isArray: false }
          }),
          getAllCoP: $resource(appConfig.SkillApi + 'api/SearchV2/SearchCoP', {}, {
              query: { method: 'POST', isArray: true }
          }),  
          getMedia: $resource(appConfig.SkillApi + 'api/SearchV2/SearchMedia', {}, {
              query: { method: 'POST', isArray: true }
          }), 
          Suggestions: $resource(appConfig.SkillApi + 'api/Search/RefineSearchSuggestions', {}, {
              save: { method: 'POST', isArray: true }
          }),
          getTrendingCollections: $resource(appConfig.SkillApi + 'api/SearchV2/TrendingCollection', {}, {
            query: { method: 'GET', isArray: true }
          }),  
          getCollections: $resource(appConfig.SkillApi + 'api/SearchV2/SearchCollection', {}, {
            query: { method: 'POST', isArray: true }
          }),
          getLocation: $resource(appConfig.SkillApi + 'api/SearchV2/GetLocations', {}, {
            query: { method: 'GET', isArray: true }
          }), 
          GetTrendingPeople: $resource(appConfig.SkillApi + '/api/SearchV2/TrendingPeople', {}, {
            query: { method: 'GET', isArray: true }
          }),     
          FollowingPeople : $resource(appConfig.SkillApi + '/api/SearchV2/FollowPeople', {}, {
            query: { method: 'GET', isArray: false }
          }),
          IsFollowingPeople : $resource(appConfig.SkillApi + '/api/SearchV2/IsFollowingPeople', {}, {
            query: { method: 'GET', isArray: false }
          }),   
          GetPeopleForGridView : $resource(appConfig.SkillApi + 'api/SearchV2/SearchPeople', {}, {
            query: { method: 'POST', isArray: true }
          }),
          GetPeopleYouFollowing : $resource(appConfig.SkillApi + '/api/SearchV2/PeopleYouFollow', {}, {
            query: { method: 'GET', isArray: true }
          }),   
          GetPeopleRecommendation : $resource(appConfig.SkillApi + '/api/SearchV2/PeopleRecommendation', {}, {
            query: { method: 'GET', isArray: true }
          }), 
          BasicSearchPeople : $resource(appConfig.SkillApi + '/api/SearchV2/BasicSearchPeople', {}, {
            query: { method: 'GET', isArray: true }
          }),  
      };

        function chunkedRequestWithPromise  (url) {
        var deferred = $q.defer();
        var xhr = new XMLHttpRequest()
        xhr.open("GET", url+"?doctype=All", true);
        var header= CryptoJS.AES.decrypt(localStorage["access-token"], appConfig.passwordKey).toString(CryptoJS.enc.Utf8);
        xhr.setRequestHeader("AccessToken",header);
        xhr.onprogress = function () {
          setTimeout(function() {
            deferred.notify(xhr.responseText)}
          , 0)// deferred.notify(xhr.responseText);
        }
        xhr.onreadystatechange = function (oEvent) {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                  deferred.resolve('success');
              } else {
                  deferred.reject(xhr.statusText);
              }
          }
        };
        xhr.send();
        return deferred.promise;
      };
      function getCategoryCount(searchText) {
          return api.getCategoryCount.query({ searchKeyword:  searchText }).$promise;
      }
      function getLocation(searchText) {
        return api.getLocation.query({ searchKeyword:  searchText }).$promise;
      }
      function GetTrendingPeople() {
        return api.GetTrendingPeople.query({}).$promise;
      }
      function getTrendingKnowledge(searchText , categoryName) {
          return api.getTrendingKnowledge.query({ searchKeyword:  searchText , docType : categoryName }).$promise;
      }
      function getTrendingKnowledge1(searchText , categoryName) {
        return chunkedRequestWithPromise(appConfig.SkillApi + 'api/SearchV2/SearchTrendingKnowledge');
    }
      function getTrendingMedia(searchText , categoryName) {
          return api.getTrendingMedia.query({ searchKeyword:  searchText , docType : categoryName }).$promise;
      }
      function getSingleCOP(searchText) {
          return api.getSingleCOP.query({ searchKeyword:  searchText}).$promise;
      }
      function SearchTrendingSingleCop(docType) {
        return api.SearchTrendingSingleCop.query({ docType:  docType}).$promise;
    }
      
      function getTrendingCOP(searchText , categoryName) {
          return api.getTrendingCOP.query({ searchKeyword:  searchText , docType : categoryName }).$promise;
      }

      function FollowingPeople(followUserId) {
        return api.FollowingPeople.query({ followUserId :  followUserId }).$promise;
      }

      function IsFollowingPeople(userId, followUserId) {
        return api.IsFollowingPeople.query({ userId: userId, followPeopleId :  followUserId }).$promise;
      }

      function GetPeopleYouFollowing(takePeople) {
        return api.GetPeopleYouFollowing.query({ take :  takePeople }).$promise;
      }

      function _GetPeopleRecommendation(takePeople) {
        return api.GetPeopleRecommendation.query({ take :  takePeople }).$promise;
      }

      function _BasicSearchPeople(searchText,takePeople) {
        return api.BasicSearchPeople.query({ searchText: searchText, take : takePeople }).$promise;
      }

      function GetPeopleForGridView(searchData) {
        var deferred = $q.defer();
        api.GetPeopleForGridView.save({}, searchData,
          function (res) {
            deferred.resolve(res);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
        
      }

      function getTrendingCollections(searchText) {
        var deferred = $q.defer();
        if(searchText == ""){
          api.getTrendingCollections.query({}, {}, function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        }
        else{
          api.getTrendingCollections.query({searchKeyword:searchText}, {}, function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });
        }
       
        return deferred.promise;

      }
      function getCollections(searchData) {
        var deferred = $q.defer();
        api.getCollections.save({}, searchData,
          function (res) {
            deferred.resolve(res);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
        
    }

      function getKnowledge(searchData) {
          var deferred = $q.defer();
          api.getKnowledge.save({}, searchData,
            function (res) {
              deferred.resolve(res);
              //debugger;
              // if(searchData.searchKeyword!="" && searchData.searchKeyword!=null)
              // {
              //   getKnowledgeCount(searchData);
              // }
            },
            function (err) {
              deferred.reject(err);
            }
          );
          return deferred.promise;
          
      }
      function  getKnowledgeCount(searchData) {
        var deferred = $q.defer();
        //api.getTrendingCollections.query({}, {}
        api.getKnowledgeCount.query({}, searchData,
          function (res) {
            deferred.resolve(res);
          },
          function (err) {
            deferred.reject(err);
          }
        );
        return deferred.promise;
        
        }
      function getAllCoP(searchData) {
          var deferred = $q.defer();
          api.getAllCoP.save({}, searchData,
            function (res) {
              deferred.resolve(res);
            },
            function (err) {
              deferred.reject(err);
            }
          );
          return deferred.promise;
          
      }

      function getMedia(searchData) {
          var deferred = $q.defer();
          api.getMedia.save({}, searchData,
            function (res) {
              deferred.resolve(res);
            },
            function (err) {
              deferred.reject(err);
            }
          );
          return deferred.promise;
          
      }

      function getSuggestions(options,category,isPeople) {
        var SearchText = _.get(options, 'data.filter.filters[0].value');
        if(isPeople){
            api.Suggestions.save({ SearchText: SearchText,Category: category,IsPeople:true }).$promise.then(function (res) {
            options.success(res);
            }, function (err) {

                options.error(err);
            });
        }
        else{
              api.Suggestions.save({ SearchText: SearchText,Category: category }).$promise.then(function (res) {
                options.success(res);
            }, function (err) {

                options.error(err);
            });
        }
        
      }

      // function getSuggestions(searchText) {
      //   var deferred = $q.defer();
      //   if(searchText == ""){
      //     api.Suggestions.query({searchText: ""}, {}, function (data) {
      //       deferred.resolve(data);
      //   }, function (data) {
      //       deferred.reject(data);
      //   });
      //   }
      //   else{
      //     api.Suggestions.query({searchText:searchText}, {}, function (data) {
      //       deferred.resolve(data);
      //   }, function (data) {
      //       deferred.reject(data);
      //   });
      //   }
       
     
      //   return deferred.promise;

      // }


      return {
          api: api,
          getCategoryCount: getCategoryCount,
          getLocation: getLocation,
          getTrendingKnowledge : getTrendingKnowledge,
          getTrendingKnowledge1 : getTrendingKnowledge1,
          getTrendingMedia: getTrendingMedia,
          getSingleCOP: getSingleCOP,
          SearchTrendingSingleCop:SearchTrendingSingleCop,
          getTrendingCOP: getTrendingCOP,
          getKnowledge:getKnowledge,
          getAllCoP:getAllCoP,
          getMedia:getMedia,
          getSuggestions : getSuggestions,
          getCollections:getCollections,
          getTrendingCollections:getTrendingCollections,
          getKnowledgeCount:getKnowledgeCount,
          GetTrendingPeople:GetTrendingPeople,
          FollowingPeople:FollowingPeople,
          IsFollowingPeople:IsFollowingPeople,
          GetPeopleForGridView:GetPeopleForGridView,
          GetPeopleYouFollowing : GetPeopleYouFollowing,
          GetPeopleRecommendation : _GetPeopleRecommendation,
          BasicSearchPeople : _BasicSearchPeople
      };
  }

})();