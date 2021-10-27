(function () {
  'use strict';

  angular
    .module('app.expertInterview')
    .factory('ExpertInterviewApi', ExpertInterviewApi);

  /** @ngInject */
  function ExpertInterviewApi($resource, appConfig, $q, ExpertInterviewService) {
    var $q = $q;

    var api = {
      getStateByCountry: $resource(appConfig.SkillApi + '/api/ExpertInterview/GetStateByCountry/:id'),
      getExpertInterviewManagements: $resource(appConfig.SkillApi + '/api/ExpertInterview/SearchExpertInterview', {}, {
        query: { method: 'POST' }
      }),
      Upload: function (type) {
        return $resource(appConfig.SkillApi + 'api/ExpertInterview/Upload/' + type, {}, {
          save: {
            method: "POST",
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined,
              'Accept': 'application/octet-stream'
            },
            responseType: 'blob',
            transformResponse: function (data, headers) {
              return ExpertInterviewService.transform(type, data, headers);
            }
          }
        });
      },

      buildExpertInterview: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/:id'),
      saveExpertInterview: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/Save'),

      getState: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/GetState', {}, {
        save: { method: 'POST', isArray: true }
      }),

      submitExpertProfile: $resource(
        appConfig.SkillApi + "api/ExpertInterview/Build/SubmitExpertProfile",
        {},
        {
          save: {
            method: 'POST',
            cache: false
          }
        }
      ),

      searchUser: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/GetAllUser', {}, {
        save: { method: 'POST', isArray: true }
      }),

      GetCertificate: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/GetCertificate', {}, {
        save: { method: 'POST', isArray: true }
      }),
      GetExpertProfileInfo: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/InformationUserProfile?id=:id'),

      getComplete: $resource(appConfig.SkillApi + 'api/ExpertInterview/Build/Comleted/:id'),

      // DETAILS PAGE
      getDetails: $resource(appConfig.SkillApi + 'api/ExpertInterview/ExpertInterviewDetails?t=' + (new Date().getTime()), {}, {
        save: { method: 'POST' }
      }),
      postTagging: $resource(appConfig.SkillApi + 'api/ExpertInterview/Tagging/Post'),
      share: $resource(appConfig.SkillApi + 'api/ExpertInterview/Share'),
      getSimilar: $resource(appConfig.SkillApi + 'api/ExpertInterview/Similar', {}, {
        query: { method: 'POST', isArray: true }
      }),
      getExpertProfileDetails: $resource(appConfig.SkillApi + 'api/ExpertInterview/Profile'),
      recentInterests: $resource(appConfig.SkillApi + 'api/ExpertInterview/RecentInterests?t=' + (new Date().getTime()), {}, {
        query: { method: 'POST' }
      }),
      getVideos: $resource(appConfig.SkillApi + 'api/ExpertInterview/Videos'),
      trend: $resource(appConfig.SkillApi + 'api/ExpertInterview/Trend', {}, {
        query: { method: 'POST', isArray: true }
      }),
      attachments: $resource(appConfig.SkillApi + 'api/ExpertInterview/Attachments', {}, {
        query: { method: 'POST', isArray: true }
      }),
      attachment: $resource(appConfig.SkillApi + 'api/ExpertInterview/Attachment/:id', {}, {
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
      delete: $resource(appConfig.SkillApi + 'api/ExpertInterview/Delete'),

      getByUserId: $resource(appConfig.SkillApi + 'api/ExpertInterview/GetByUserId'),
    };
    function _getStateByCountry(id) {
      var deferred = $q.defer();
      api.getStateByCountry.query({ id: id }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }
    function searchUser(options, authors) {
      var deferred = $q.defer();
      var name = _.get(options, 'data.filter.filters[0].value');
      var exists = _.map(authors, function (o) { return o.name });

      api.searchUser.save({ name: name }, JSON.stringify(exists), function (res) {

        options.success(res);
      }, function (res) {

        options.error(res);
      });

      return deferred.promise;
    }

    function GetExpertProfileInfo(id) {
      var defer = $q.defer();
      api.GetExpertProfileInfo.get({ id: id },
        function (data) {
          defer.resolve(data);
        },
        function (data) {
          defer.reject(data);
        }
      );
      return defer.promise;
    };

    function uploadAttachment(type, fd) {
      var defer = $q.defer();
      api.Upload(type).save(fd,
        function (data) {
          defer.resolve(data);
        },
        function (data) {
          defer.reject(data);
        }
      );
      return defer.promise;
    };

    var _buildExpertInterview = function (id) {
      var deferred = $q.defer();
      api.buildExpertInterview.get({ id: id },
        function (data) {
          deferred.resolve(data);
        }, function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    function saveExpertInterview(data) {
      var deferred = $q.defer();
      api.saveExpertInterview.save(JSON.stringify(data),
        function (data) {
          deferred.resolve(data);
        }, function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    };

    var _getComplete = function (id) {
      var deferred = $q.defer();
      api.getComplete.get({ id: id },
        function (data) {
          deferred.resolve(data);
        }, function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    var _getExpertInterviewManagements = function (options, searchTerm, filterBy, total) {
      var queryObj = {
        searchTerm: searchTerm,
        filterBy: filterBy,
        skip: options.data.skip,
        take: options.data.take,
        sortField: _.get(options, 'options.data.sort[0].field', ''),
        sortDir: _.get(options, 'options.data.sort[0].dir', ''),
        isExport: (options.data.take === total)
      }

      api.getExpertInterviewManagements.query(queryObj).$promise.then(function (res) {
        options.success(res);
      }, function (err) {
        options.error(err);
      });
    };

    var _getDetails = function (expertInterviewId) {
      var deferred = $q.defer();
      api.getDetails.save({}, { expertInterviewId: expertInterviewId },
        function (data) {
          deferred.resolve(data);
        }, function (data) {
          deferred.reject(data);
        });
      return deferred.promise;
    }

    var _postLike = function (expertInterviewId, isLiked) {

      var deferred = $q.defer();
      var likeRequest = { expertInterviewId: expertInterviewId, taggingTypeName: 'Like', taggingTypeValue: isLiked };
      api.postTagging.save({}, likeRequest, function (response) {

        deferred.resolve(response);
      }, function (response) {

        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    };

    var _postSave = function (expertInterviewId, isSavedToLibrary) {

      var deferred = $q.defer();
      var saveRequest = { expertInterviewId: expertInterviewId, taggingTypeName: 'Save', taggingTypeValue: isSavedToLibrary };
      api.postTagging.save({}, saveRequest, function (response) {

        deferred.resolve(response);
      }, function (response) {

        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    };

    var _postShare = function (expertInterviewId, isShared) {
      var deferred = $q.defer();
      var shareRequest = { expertInterviewId: expertInterviewId, taggingTypeName: 'Share', taggingTypeValue: isShared };
      api.postTagging.save({}, shareRequest, function (response) {

        deferred.resolve(response);
      }, function (response) {

        logger.error(response.data.errorMessage);
      });
      return deferred.promise;
    };

    var _shareToEmail = function (postData) {
      var deferred = $q.defer();
      api.share.save({}, postData,
        function (data) {
          deferred.resolve(data);
        },
        function (data) {
          deferred.reject(data);
        }
      );
      return deferred.promise;
    }

    var _getSimilar = function (id) {
      var defer = $q.defer();
      api.getSimilar.query({ expertInterviewId: id },
        function (data) {
          defer.resolve(data);
        },
        function (data) {
          defer.reject(data);
        }
      );
      return defer.promise;
    };

    var _getExpertProfileDetails = function (id) {
      var defer = $q.defer();
      api.getExpertProfileDetails.get({ expertInterviewId: id },
        function (data) {
          defer.resolve(data);
        },
        function (data) {
          defer.reject(data);
        }
      );
      return defer.promise;
    };

    var _getVideos = function (id) {
      var defer = $q.defer();
      api.getVideos.query({ expertInterviewId: id },
        function (data) {
          defer.resolve(data);
        },
        function (data) {
          defer.reject(data);
        }
      );
      return defer.promise;
    };

    var _delete = function (ids) {
      var deferred = $q.defer();

      api.delete.save({}, ids, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    function _getByUserId(userId) {
      var deferred = $q.defer();

      api.getByUserId.get({ userId: userId }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    return {
      api: api,
      uploadAttachment: uploadAttachment,
      buildExpertInterview: _buildExpertInterview,
      saveExpertInterview: saveExpertInterview,
      GetExpertProfileInfo: GetExpertProfileInfo,
      searchUser: searchUser,

      getComplete: _getComplete,
      getExpertInterviewManagements: _getExpertInterviewManagements,
      getDetails: _getDetails,
      postLike: _postLike,
      postSave: _postSave,
      postShare: _postShare,
      getSimilar: _getSimilar,
      shareToEmail: _shareToEmail,
      getExpertProfileDetails: _getExpertProfileDetails,
      getVideos: _getVideos,
      delete: _delete,
      getByUserId: _getByUserId,
      getStateByCountry: _getStateByCountry
    };
  }

})();
