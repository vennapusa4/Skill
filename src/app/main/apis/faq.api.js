(function () {
  'use strict';

  angular
    .module('app.faq')
    .factory('FaqApi', FaqApi);

  /** @ngInject */
  function FaqApi($resource, appConfig, $q) {
    var $q = $q;

    var api = {
      topics: $resource(appConfig.SkillApi + 'api/FAQ/Topics'),
      faq: $resource(appConfig.SkillApi + 'api/FAQ/All', {}, {
        query: { method: 'POST' }
      }),
      //tagging: $resource(appConfig.SkillApi + 'api/FAQ/Tagging', {}, {
      //  save: { method: 'POST' }
      //}),
      tagging: $resource(appConfig.SkillApi + 'api/FAQ/Tagging'),

      // getAll: $resource(appConfig.SkillApi + 'api/Admin/Faq/GetAll'),
      // save: $resource(appConfig.SkillApi + 'api/Admin/Faq/Save'),
      // update: $resource(appConfig.SkillApi + 'api/Admin/Faq/Update'),
      // delete: $resource(appConfig.SkillApi + 'api/Admin/Faq/Delete', {}, {
      //   delete: {
      //     method: 'POST',
      //   }
      // }),
      DeleteTopic: $resource(appConfig.SkillApi + 'api/Admin/FaqTopics/Delete'),

      // FAQ Topics
      FaqTopicsAddNew: $resource(appConfig.SkillApi + 'api/Admin/FaqTopics/AddNew'),
      FaqTopicsDelete: $resource(appConfig.SkillApi + 'api/Admin/FaqTopics/Delete'),

      // FAQ Details
      GetFaqDetailsByTopicId: $resource(appConfig.SkillApi + 'api/Admin/FaqDetails/GetFaqDetailsByTopicId'),
      FaqDetailsUpdate: $resource(appConfig.SkillApi + 'api/Admin/FaqDetails/Update'),
      FaqDetailsDelete: $resource(appConfig.SkillApi + 'api/Admin/FaqDetails/Delete'),
    };

    // function getAll() {

    //   var deferred = $q.defer();
    //   api.getAll.query({}, function (data) {

    //     deferred.resolve(data);
    //   }, function (data) {

    //     deferred.reject(data);
    //   });

    //   return deferred.promise;
    // }

    function GetAllTopic() {

      var deferred = $q.defer();
      api.topics.get({}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    // function save(postData) {

    //   var deferred = $q.defer();
    //   api.save.save({}, postData, function (data) {

    //     deferred.resolve(data);
    //   }, function (data) {

    //     deferred.reject(data);
    //   });

    //   return deferred.promise;
    // }

    // function update(postData) {

    //   var deferred = $q.defer();
    //   api.update.save({}, postData, function (data) {

    //     deferred.resolve(data);
    //   }, function (data) {

    //     deferred.reject(data);
    //   });

    //   return deferred.promise;
    // }

    // function deleteItem(header) {

    //   var deferred = $q.defer();
    //   api.delete.delete({ header: header }, {}, function (data) {

    //     deferred.resolve(data);
    //   }, function (data) {

    //     deferred.reject(data);
    //   });

    //   return deferred.promise;
    // }

    function FaqTopicsAddNew(postData) {

      var deferred = $q.defer();
      api.FaqTopicsAddNew.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function FaqTopicsDelete(topicId) {

      var deferred = $q.defer();
      api.FaqTopicsDelete.save({ id: topicId }, {}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function GetFaqDetailsByTopicId(topicId) {
      var deferred = $q.defer();
      api.GetFaqDetailsByTopicId.query({ id: topicId }, {}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function FaqDetailsUpdate(postData) {
      var deferred = $q.defer();
      api.FaqDetailsUpdate.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function FaqDetailsDelete(id) {
      var deferred = $q.defer();
      api.FaqDetailsDelete.save({ id: id }, {}, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    return {
      api: api,

      // getAll: getAll,
      // save: save,
      // update: update,
      // deleteItem: deleteItem,
      GetAllTopic: GetAllTopic,
      FaqTopicsAddNew: FaqTopicsAddNew,
      FaqTopicsDelete: FaqTopicsDelete,

      GetFaqDetailsByTopicId: GetFaqDetailsByTopicId,
      FaqDetailsUpdate: FaqDetailsUpdate,
      FaqDetailsDelete: FaqDetailsDelete
    };
  }

})();
