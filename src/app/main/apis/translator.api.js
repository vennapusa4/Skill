(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('TranslatorApi', TranslatorApi);

    /** @ngInject */
  function TranslatorApi($resource, appConfig, $q) {
    var $q = $q;

    var api = {
      TranslateSingleText: $resource(appConfig.SkillApi + 'api/Translator/TranslateSingleText'),
      TranslateMultipleText: $resource(appConfig.SkillApi + 'api/Translator/TranslateMultipleText'),
      TranslateSingleHtmlText: $resource(appConfig.SkillApi + 'api/Translator/TranslateSingleHtmlText'),
      TranslateMultipleHtmlText: $resource(appConfig.SkillApi + 'api/Translator/TranslateMultipleHtmlText'),
      TranslateKnowledgeDetail: $resource(appConfig.SkillApi + 'api/Translator/TranslateKnowledgeDetail'),
      TranslateKnowledgeDetailRevert: $resource(appConfig.SkillApi + 'api/Translator/TranslateKnowledgeDetailRevert'),
      TranslationStatistics: $resource(appConfig.SkillApi + 'api/Translator/TranslationStatistics', {}, {
        save: { method: 'POST', isArray: true }
      })
    };

    function TranslateSingleText(postData) {

      var deferred = $q.defer();

      api.TranslateSingleText.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function TranslateMultipleText(postData) {

      var deferred = $q.defer();

      api.TranslateMultipleText.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function TranslateSingleHtmlText(postData) {

      var deferred = $q.defer();

      api.TranslateSingleHtmlText.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function TranslateMultipleHtmlText(postData) {

      var deferred = $q.defer();

      api.TranslateMultipleHtmlText.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function TranslateKnowledgeDetail(id, toLanguage,version) {

      var deferred = $q.defer();
      var postData = {
        kdId: id,
          toLanguage: toLanguage,
        version:version
      };

      api.TranslateKnowledgeDetail.save({}, postData, function (data) {

        deferred.resolve(data);
      }, function (data) {

        deferred.reject(data);
      });

      return deferred.promise;
    }

    function TranslationStatistics(input) {
      var deferred = $q.defer();
      api.TranslationStatistics.save({}, { fromDate: input.fromDate, toDate: input.toDate }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }


    return {
      api: api,

      TranslateSingleText: TranslateSingleText,
      TranslateMultipleText: TranslateMultipleText,

      TranslateSingleHtmlText: TranslateSingleHtmlText,
      TranslateMultipleHtmlText: TranslateMultipleHtmlText,

      TranslateKnowledgeDetail: TranslateKnowledgeDetail,
      TranslationStatistics: TranslationStatistics
    };
  }

})();
