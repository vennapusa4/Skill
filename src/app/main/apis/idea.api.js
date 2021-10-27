(function () {
  'use strict';

  angular
    .module('app.home')
    .factory('IdeaApi', IdeaApi);

  /** @ngInject */
  function IdeaApi($resource, appConfig, $q, $timeout) {
    var $q = $q;
    var $timeout = $timeout;

    var api = {
      getAll: $resource(appConfig.SkillApi + 'api/Idea/All'),
      getConfirmInfo: $resource(appConfig.SkillApi + 'api/Idea/GetConfirmInfo'),
      addIdea: $resource(appConfig.SkillApi + 'api/Idea/Add'),
      deleteIdea: $resource(appConfig.SkillApi + 'api/Idea/Delete'),
      replyIdea: $resource(appConfig.SkillApi + 'api/Idea/Reply'),
      deleteIdeaReply: $resource(appConfig.SkillApi + 'api/Idea/DeleteReply'),

      getAllIdeaCategories: $resource(appConfig.SkillApi + 'api/Lookup/IdeaCategories', {}, {
        save: { method: 'POST', isArray: true }
      }),
    };

    function _getAll(kdId) {
      return api.getAll.save({}, { kdId: kdId }).$promise;
    }

    function _getConfirmInfo() {
      return api.getConfirmInfo.get({}).$promise;
    }

    function _addIdea(ideaItem) {
      return api.addIdea.save({}, ideaItem).$promise;
    }

    function _deleteIdea(ideaId) {
      var deleteRequest = { ideaId: ideaId };
      return api.addIdea.save({}, deleteRequest).$promise;
    }

    function _getAllIdeaCategories() {
      var deferred = $q.defer();
      api.getAllIdeaCategories.save({}, {}, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });

      return deferred.promise;
    }

    return {
      api: api,

      getAll: _getAll,
      getConfirmInfo: _getConfirmInfo,
      addIdea: _addIdea,
      deleteIdea: _deleteIdea,
      getAllIdeaCategories: _getAllIdeaCategories
    };
  }

})();