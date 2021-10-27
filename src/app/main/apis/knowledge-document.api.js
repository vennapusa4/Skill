(function () {
  'use strict';

  angular
    .module('app.home')
    .factory('KnowledgeDocumentApi', KnowledgeDocumentApi);

  /** @ngInject */
  function KnowledgeDocumentApi($resource, appConfig, $q, $timeout, logger,UserProfileApi) {
    var $q = $q;
    var $timeout = $timeout;
    var vm = this;

    var api = {
      newDocumentsSummary: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/NewDocumentsSummary'),
      summary: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Summary'),
      featuredDocuments: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/FeaturedDocuments', {}, {
        save: { method: 'POST', isArray: true }
      }),
      //latest: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Latest'),
      contributors: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Contributors'),
      trending: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Trending'),
      trend: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Trend', {}, {
        query: { method: 'POST', isArray: true }
      }),
      attachment: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Attachment/:id', {}, {
        get: {
          method: "GET",
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined,
            'Accept': 'application/octet-stream'
          },
          responseType: 'blob',
          transformResponse: function (data, headers) {
            if (headers) {
              var contentDispositionHeader = headers('Content-Disposition');
              var result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
              var fileName = result.replace(/"/g, '');
              saveAs(data, fileName);
            }
            return { status: true };
          }
        }
      }),
      searchPopular: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Search/Popular'),
      like: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Like'),
      replicate: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Replicate'),
      share: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Share'),
      knowledgeDocument: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/KnowledgeDocumentDetails?t=' + (new Date().getTime()), {}, {
        byId: { method: 'POST' }
      }),
      GetKnowledgeAdditionInfo: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetKnowledgeAdditionInfo'),
      GetKnowledgeUserInfo: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetKnowledgeUserInfo?t=' + (new Date().getTime())),
      GetKnowledgeRating: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetKnowledgeRating'),
      similarDocuments: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Similar', {}, {
        query: { method: 'POST' }
      }),
      insightReferencesDocuments: $resource(appConfig.SkillApi + 'api/KnowledgeShare/GetInsightKnowledgeReferences', {}, {
        query: { method: 'POST', isArray: true  }
      }),
      attachments: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Attachments', {}, {
        query: { method: 'POST', isArray: true }
      }),
      replicationHistory: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/ReplicationHistory', {}, {
        query: { method: 'POST' }
      }),
      replicationSourceHistory: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/ReplicationSource', {}, {
          query: { method: 'POST' , isArray: true}
      }),
      replicationDetails: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/ReplicationDetails', {}, {
        query: { method: 'POST' }
      }),
      ValueCreation: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/ValueCreation', {}, {
        query: { method: 'POST', isArray: true }
      }),
      ValueCreationGroup: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/ValueCreationGroup', {}, {
        query: { method: 'POST', isArray: false }
      }),
      replicationContributorDetails: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Replication/Contributors', {}, {
        query: { method: 'POST' }
      }),
      recentInterests: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/RecentInterests?t=' + (new Date().getTime()), {}, {
        query: { method: 'POST' }
      }),
      postTagging: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Tagging/Post'),
      create: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Create'),
      documentType: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/DocumentType'),
      saveFilter: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/SaveFilter'),
      collections: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/Collections'),
      latest: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Latest'),
      search: $resource(appConfig.SkillApi + 'api/Lookup/Search'),
      recommendedDiscipline: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetRecommendedDisciplineForMe', {}, {
        save: { method: 'POST', isArray: true }
      }),
      myDisciplines: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetMyDisciplines', {}, {
        save: { method: 'POST', isArray: true }
      }),
      updateMyInterestDisciplines: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/UpdateMyDisciplines'),

      getMyContributions: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetMyContributions'),
      getMySubmissions: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetMySubmissions'),
      getCountOfMySubmissions: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetCountOfMySubmissions'),
      getCountOfMyPendingActions: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetCountOfMyPendingActions'),
      GetMyKnowledgeLibrary: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetMyKnowledgeLibrary'),
      GetMyCollectionLibrary: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetMyCollectionLibrary'),
      getMyPendingValidation: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/GetKnowledgeDocumentsPendingByMe'),
      updateStatus: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Status/Update'),
      updateEndorseStatus: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/EndorseStatus/Update'),
      updateReviewerStatus: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/ReviewStatus/Update'),
      getAllSlide: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/Gets/request.skip=0'),
      getSlideById: $resource(appConfig.SkillApi + 'api/Admin/FeaturedContent/Get/:id'),
      SearchSuggestions: $resource(appConfig.SkillApi + 'api/Search/Suggestions', {}, {
        save: { method: 'POST', isArray: true }
      }),
      SearchSuggestionsText: $resource(appConfig.SkillApi + 'api/Search/SearchSuggestions'),
      getSelectedData: $resource(appConfig.SkillApi + 'api/KnowledgeDocument'),
      documentFilterByCurrentUser: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/DocumentFilterByCurrentUser'),
      collectionByCurrentUser: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/CollectionByCurrentUser'),
      getVideos: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/Videos'),

      getKDDisclaimer: $resource(appConfig.SkillApi + 'api/KnowledgeDiscovery/GetDisclaimerIntegrationKnowledge/:id', {}, {
        query: { method: 'GET', isArray: false }
      }),
      getRating: $resource(appConfig.SkillApi + 'api/KnowledgeShare/KnowledgeDocumentRating/GetTotalKDRating/', {}, {
        query: { method: 'GET', isArray: false }
      }),
      getAllRatingComments: $resource(appConfig.SkillApi + 'api/KnowledgeShare/KnowledgeDocumentRating/getKDComments/', {}, {
        query: { method: 'GET', isArray: true }
      }),
      saveRating: $resource(appConfig.SkillApi + 'api/KnowledgeShare/KnowledgeDocumentRating/SaveKnowledgeRating', {}, {
        save: { method: 'POST', isArray: false }
      }),
      addFeedbackloop: $resource(appConfig.SkillApi + 'api/KnowledgeShare/KnowledgeDocumentFeedbackLoop/addFeedbackloop', {}, {
        save: { method: 'POST', isArray: false }
      }),
      deleteAllDraftItem: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/DeleteMany', {}, {
          save: { method: 'POST', isArray: false }
      }),
      revertAllDraftItem: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/RevertToDraftMany', {}, {
          save: { method: 'POST', isArray: false }
      }),
      viewDocument: $resource(appConfig.SkillApi + 'api/KnowledgeDocument/View/Update', {}, {
        save: { method: 'POST', isArray: false }
    }),
    getTotalInterest: $resource(appConfig.SkillApi + 'api/KnowledgeShare/GetKdBookmarkFeedbackloops/', {}, {
      query: { method: 'GET', isArray: false }
    }),
    getPredefinedRatingComments : $resource(appConfig.SkillApi + 'api/Admin/MasterData/getPredefinedRatingComments/', {}, {
      query: { method: 'GET', isArray: false }
    }),
    getAllBusinessSectors : $resource(appConfig.SkillApi + 'api/Admin/MasterData/GetPredefinedBusinessSectors/', {}, {
      query: { method: 'GET', isArray: false }
    })
  
    };

    function deleteAllDraftItem(postData) {
        var deferred = $q.defer();
        api.deleteAllDraftItem.save({}, postData, function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });

        return deferred.promise;
    }

    function viewDocument(postData) {
      var deferred = $q.defer();
      api.viewDocument.save({}, postData, function (data) {
          deferred.resolve(data);
      }, function (data) {
          deferred.reject(data);
      });

      return deferred.promise;
  }

    function revertAllDraftItem(postData) {
        var deferred = $q.defer();
        api.revertAllDraftItem.save({}, postData, function (data) {
            deferred.resolve(data);
        }, function (data) {
            deferred.reject(data);
        });

        return deferred.promise;
    }
    function getKDDisclaimer(id) {
      var deferred = $q.defer();
      api.getKDDisclaimer.query({ id: id }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }

    function getRating(id , userID){
      var deferred = $q.defer();
      api.getRating.query({ KdId: id, userId: userID }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }

    function getTotalInterest(id , userID){
      var deferred = $q.defer();
      api.getTotalInterest.query({ KdId: id, userId: userID }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }

    function getAllRatingComments(id){
      vm.userInfo = UserProfileApi.getUserInfo();
      var deferred = $q.defer();
      api.getAllRatingComments.query({ KdId: id , userId: vm.userInfo.userId }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }

    function getPredefinedRatingComments(){
      
      var deferred = $q.defer();
      api.getPredefinedRatingComments.query({}, function (data) {
        deferred.resolve(data.data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }

    function getAllBusinessSectors(){
      
      var deferred = $q.defer();
      api.getAllBusinessSectors.query({}, function (data) {
        deferred.resolve(data.data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    } 
    

    

    function saveRating(ratingData){
      var deferred = $q.defer();
      api.saveRating.save({}, ratingData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function addFeedbackloop(postData){
      var deferred = $q.defer();
      api.addFeedbackloop.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getSelectedData(postData) {

      var deferred = $q.defer();
      api.getSelectedData.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function knowledgeDocument(postData) {

      var deferred = $q.defer();
      api.knowledgeDocument.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function SearchSuggestions(options) {
      var SearchText = _.get(options, 'data.filter.filters[0].value');
      api.SearchSuggestions.save({ SearchText: SearchText }).$promise.then(function (res) {
        options.success(res);
      }, function (err) {

        options.error(err);
      });
    }

    function SearchSuggestionsText(postData) {
      var deferred = $q.defer();
      api.SearchSuggestionsText.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getAllSlide() {
      var deferred = $q.defer();
      api.getAllSlide.get({}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getSlideById(id) {
      var deferred = $q.defer();
      api.getSlideById.get({ id: id }, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getNewDocumentsSummary() {

      var deferred = $q.defer();
      api.newDocumentsSummary.get({}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getSummary() {

      var deferred = $q.defer();
      api.summary.save({}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }


    function summary() {
      var deferred = $q.defer();
      api.summary.save({
      },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );
      return deferred.promise;
    }

    function contributors() {
      var deferred = $q.defer();
      api.contributors.query(
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );
      return deferred.promise;
    }

    function latest() {

      var deferred = $q.defer();
      api.latest.save({
      },
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function search(postdata) {

      var deferred = $q.defer();
      api.search.save(postdata,
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function documentType(PostData) {

      var deferred = $q.defer();
      api.documentType.save({}, PostData,
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function saveFilter(PostData) {

      var deferred = $q.defer();
      api.saveFilter.save({}, PostData,
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function collections(PostData) {

      var deferred = $q.defer();
      api.collections.save({
      }, PostData,
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }


    function getFeaturedDocuments() {
      var deferred = $q.defer();
      api.featuredDocuments.save({}, { accessToken: "64E7E6C7-DF6C-42B4-BB52-36F00B1614D4" }, function (data) {
        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getLatest() {

      var deferred = $q.defer();

      $timeout(function () {

        var obj_1 = {
          IsNew: true,
          KDId: 'id_001',
          KDTitle: 'Finding a solution for faster and easier fueling of natural gas vehicles',
          KDType: 'Lesson Learnt',
          Discipline: 'Instrumentation & Control',
          Image: '/assets/images/sample.jpg',
          Contributor: {
            Name: 'Aidil',
            Discipline: 'Aidil Discipline',
            Image: '/assets/images/NoAvatar.jpg'
          },
          ItemsCount: 100,
          LikesCount: 100,
          SaveLibraryCount: 3,
          CommentsCount: 20,
          ReplicatesCount: 10
        };

        var obj_2 = {
          IsNew: true,
          KDId: 'id_001',
          KDTitle: 'Finding a solution for faster and easier fueling of natural gas vehicles',
          KDType: 'Lesson Learnt',
          Discipline: 'Instrumentation & Control',
          Image: '/assets/images/sample.jpg',
          Contributor: {
            Name: 'Aidil',
            Discipline: 'Aidil Discipline',
            Image: '/assets/images/NoAvatar.jpg'
          },
          ItemsCount: 100,
          LikesCount: 100,
          SaveLibraryCount: 3,

        };

        deferred.resolve([obj_1, angular.copy(obj_2)]);

      }, 500);

      // api.latest.save({}, function (data) {

      //     deferred.resolve(data);
      // }, function (data) {

      //     deferred.reject(data);
      // });

      return deferred.promise;
    }

    function getTrending(divisionId, departmentId, skip, take) {
      var deferred = $q.defer();
      api.trending.save({}, { divisionId: divisionId, departmentId: departmentId, skip: skip, take: take }, function (data) {
        deferred.resolve(data);

      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function searchPopular() {

      var deferred = $q.defer();
      api.searchPopular.query({}, function (data) {
        var maxVal = null;
        for (var i = 0; i < data.length; i++) {
          if (maxVal == null) {
            maxVal = data[i].totalCount;
          }
          else {
            if (data[i].totalCount > maxVal) {
              maxVal = data[i].totalCount;
            }
          }
        }
        for (var i = 0; i < data.length; i++) {

          data[i].size = data[i].totalCount / maxVal * 30;
          if (data[i].size < 14) data[i].size = 14;
        }

        deferred.resolve(data);

      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function like(KnowledgeDocumentId, IsLiked) {

      var deferred = $q.defer();

      //$timeout(function () {
      //    deferred.resolve(true);
      //}, 200);

      api.like.save({ KnowledgeDocumentId: KnowledgeDocumentId, IsLiked: IsLiked }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function replicate(KnowledgeDocumentId, IsLiked) {

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve(true);
      }, 200);

      // api.replicate.save({ KnowledgeDocumentId: KnowledgeDocumentId, IsLiked: IsLiked }, function (data) {

      //     deferred.resolve(data);
      // }, function (data) {

      //     deferred.reject(data);
      // });

      return deferred.promise;
    }

    function share(KnowledgeDocumentId, IsLiked) {

      var deferred = $q.defer();

      $timeout(function () {
        deferred.resolve(true);
      }, 200);

      // api.share.save({ KnowledgeDocumentId: KnowledgeDocumentId, IsLiked: IsLiked }, function (data) {

      //     deferred.resolve(data);
      // }, function (data) {

      //     deferred.reject(data);
      // });

      return deferred.promise;
    }

    function create(obj) {

      var deferred = $q.defer();

      $timeout(function () {

        var returnVal = {
          result: true,
          IsSentToMyDepartment: true,
          IsSentToMyCOP: true,
          SendToEmailAddresses: [
            'demo1@gmail.com',
            'demo2@gmail.com',
            'demo3@gmail.com',
          ],
        };

        deferred.resolve(returnVal);
      }, 200);

      // api.create.save(obj, function (data) {

      //     deferred.resolve(data);
      // }, function (data) {

      //     deferred.reject(data);
      // });

      return deferred.promise;
    }

    function getRecommendedDisciplineForMe(searchKeyword, skip, take) {
      var deferred = $q.defer();

      api.recommendedDiscipline.save({}, { searchKeyword: searchKeyword, skip: skip, take: take }, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getMyDisciplines(searchKeyword, skip, take) {
      var deferred = $q.defer();

      api.myDisciplines.save({}, { searchKeyword: searchKeyword, skip: skip, take: take }, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function updateMyInterestDisciplines(postData) {
      var deferred = $q.defer();

      api.updateMyInterestDisciplines.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getMyContributions(postData) {
      var deferred = $q.defer();

      api.getMyContributions.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function GetMyKnowledgeLibrary(postData) {
      var deferred = $q.defer();

      api.GetMyKnowledgeLibrary.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    };

    function GetMyCollectionLibrary(postData) {
      var deferred = $q.defer();

      api.GetMyCollectionLibrary.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    };

    function getMySubmissions(postData) {
      var deferred = $q.defer();

      api.getMySubmissions.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getCountOfMySubmissions(postData) {
      var deferred = $q.defer();

      api.getCountOfMySubmissions.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getCountOfMyPendingActions(postData) {
      var deferred = $q.defer();

      api.getCountOfMyPendingActions.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function getMyPendingValidation(postData) {
      var deferred = $q.defer();

      api.getMyPendingValidation.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function postLike(kdId, isLiked) {

      var deferred = $q.defer();
      var likeRequest = { knowledgeDocumentId: kdId, taggingTypeName: 'Like', taggingTypeValue: isLiked };
      api.postTagging.save({}, likeRequest, function (response) {

        deferred.resolve(response);
      }, function (response) {

        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    };

    function postSave(kdId, isSavedToLibrary) {

      var deferred = $q.defer();
      var saveRequest = { knowledgeDocumentId: kdId, taggingTypeName: 'Save', taggingTypeValue: isSavedToLibrary };
      api.postTagging.save({}, saveRequest, function (response) {

        deferred.resolve(response);
      }, function (response) {

        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    };

    function postShare(kdId, isShared) {
      var deferred = $q.defer();
      var shareRequest = { knowledgeDocumentId: kdId, taggingTypeName: 'Share', taggingTypeValue: isShared };
      api.postTagging.save({}, shareRequest, function (response) {

        deferred.resolve(response);
      }, function (response) {

        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    };

    function documentFilterByCurrentUser() {
      return api.documentFilterByCurrentUser.query().$promise;
    }

    function collectionByCurrentUser(PostData) {
      var deferred = $q.defer();
      api.collectionByCurrentUser.save({
      }, PostData,
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );

      return deferred.promise;
    }

    function GetKnowledgeAdditionInfo(kdId) {
      var deferred = $q.defer();
      var postData = { knowledgeDocumentId: kdId };
      api.GetKnowledgeAdditionInfo.save({}, postData, function (response) {
        deferred.resolve(response);
      }, function (response) {
        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    }

    function GetKnowledgeRating(kdId) {
      var deferred = $q.defer();
      var postData = { knowledgeDocumentId: kdId };
      api.GetKnowledgeRating.save({}, postData, function (response) {
        deferred.resolve(response);
      }, function (response) {
        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    }
    function GetKnowledgeUserInfo(kdId) {
      var deferred = $q.defer();
      var postData = { knowledgeDocumentId: kdId };
      api.GetKnowledgeUserInfo.save({}, postData, function (response) {
        deferred.resolve(response);
      }, function (response) {
        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    }

    function ValueCreation(kdId) {
      var deferred = $q.defer();
      var postData = { knowledgeDocumentId: kdId };
      api.ValueCreation.query({}, postData, function (response) {
        deferred.resolve(response);
      }, function (response) {
        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    }
    function ValueCreationGroup(kdId) {
      var deferred = $q.defer();
      var postData = { knowledgeDocumentId: kdId };
      api.ValueCreationGroup.query({}, postData, function (response) {
        deferred.resolve(response);
      }, function (response) {
        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    }
    var _getVideos = function (id) {
      var defer = $q.defer();
      api.getVideos.query({ kdId: id },
        function (data) {
          defer.resolve(data);
        },
        function (data) {
          defer.reject(data);
        }
      );
      return defer.promise;
    };

    return {
      api: api,

      contributors: contributors,
      summary: summary,
      latest: latest,
      search: search,
      documentType: documentType,
      saveFilter: saveFilter,
      collections: collections,
      getNewDocumentsSummary: getNewDocumentsSummary,
      getSummary: getSummary,
      getFeaturedDocuments: getFeaturedDocuments,
      getLatest: getLatest,
      getTrending: getTrending,
      searchPopular: searchPopular,
      like: like,
      replicate: replicate,
      create: create,
      getRecommendedDisciplineForMe: getRecommendedDisciplineForMe,
      getMyDisciplines: getMyDisciplines,
      updateMyInterestDisciplines: updateMyInterestDisciplines,
      getMyContributions: getMyContributions,
      getMySubmissions: getMySubmissions,
      getCountOfMySubmissions: getCountOfMySubmissions,
      getCountOfMyPendingActions: getCountOfMyPendingActions,
      GetMyKnowledgeLibrary: GetMyKnowledgeLibrary,
      GetMyCollectionLibrary: GetMyCollectionLibrary,
      getMyPendingValidation: getMyPendingValidation,
      postLike: postLike,
      postSave: postSave,
      postShare: postShare,
      SearchSuggestions: SearchSuggestions,
      SearchSuggestionsText: SearchSuggestionsText,
      getAllSlide: getAllSlide,
      getSlideById: getSlideById,
      knowledgeDocument: knowledgeDocument,
      getSelectedData: getSelectedData,
      documentFilterByCurrentUser: documentFilterByCurrentUser,
      collectionByCurrentUser: collectionByCurrentUser,
      GetKnowledgeAdditionInfo: GetKnowledgeAdditionInfo,
      GetKnowledgeRating:GetKnowledgeRating,
      GetKnowledgeUserInfo: GetKnowledgeUserInfo,
      ValueCreation: ValueCreation,
      ValueCreationGroup: ValueCreationGroup,
      getVideos: _getVideos,
      getKDDisclaimer: getKDDisclaimer,
      deleteAllDraftItem: deleteAllDraftItem,
      revertAllDraftItem: revertAllDraftItem,
      viewDocument: viewDocument,
      getRating:getRating,
      getAllRatingComments:getAllRatingComments,
      saveRating:saveRating,
      addFeedbackloop:addFeedbackloop,
      getTotalInterest:getTotalInterest,
      getPredefinedRatingComments: getPredefinedRatingComments,
      getAllBusinessSectors:getAllBusinessSectors
    };
  }

})();
