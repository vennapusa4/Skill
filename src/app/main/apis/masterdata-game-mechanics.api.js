(function () {
  'use strict';

  angular
    .module('app.gameMechanics')
    .factory('MasterDataGameMechanicsApi', MasterDataGameMechanicsApi);

  /** @ngInject */
  function MasterDataGameMechanicsApi($resource, appConfig, $q) {
    var $q = $q;

    var api = {
      getAllPoints: $resource(appConfig.SkillApi + 'api/Admin/GameMechanics/PointsManagement/GetAll'),
      addNewPoint: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/PointsManagement/Add'),
      getPointById: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/PointsManagement/Get'),
      updatePoint: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/PointsManagement/Update'),
      deleteMultiPoints: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/PointsManagement/Delete'),
      validateRule: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/PointsManagement/ValidateRule'),
      checkRuleName: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/PointsManagement/CheckRuleName', {}, {
        query: { method: 'GET', isArray: false }
      }),

      getAllChallenges: $resource(appConfig.SkillApi + 'api/Admin/GameMechanics/Challenge/GetAll/:isActive'),
      addNewChallenge: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/Add'),
      getChallengeById: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/Get'),
      updateChallenge: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/Update'),
      deleteMultiChallenges: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Challenge/Delete'),
      getCommunitysByType: $resource(appConfig.SkillApi + 'api/Admin/GameMechanics/Challenge/GetCommunityNames'),

      getAllLevels: $resource(appConfig.SkillApi + 'api/Admin/GameMechanics/Level/GetAll'),
      getAllLevelChoice: $resource(appConfig.SkillApi + '/api/Level/AllLevelChoice'),
      getAllLevelConditionTypes: $resource(appConfig.SkillApi + '/api/Level/AllLevelConditionTypes'),
      saveLevel: $resource(appConfig.SkillApi + '/api/Level/Save'),
      getLevelById: $resource(appConfig.SkillApi + '/api/Level/CreateUpdate?id=:id'),
      deleteMultiLevels: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Level/Delete'),

      // Master Data For Create, Update GameMechanics
      feedUserTypes: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/UserTypes'),
      feedKnowledgeDocumentTypes: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/KnowledgeDocumentTypes'),
      feedConditions: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/Conditions'),
      feedChallengeConditions: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/ChallengeConditions'),
      feedRewardTypes: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/RewardTypes'),
      feedChallengeTypes: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/ChallengeTypes'),
      feedCommunityTypes: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/CommunityTypes'),
      feedLogicalOperators: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/LogicalOperators'),
      feedChallengeDifficultyLevels: $resource(appConfig.SkillApi + '/api/Admin/GameMechanics/ChallengeDifficultyLevels'),
    };

    function getAllPoints(option, keyword) {
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
      var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
      var keyword = keyword !== undefined ? keyword : "";
      var skip = option.data.skip !== undefined ? option.data.skip : 0;
      var take = option.data.take !== undefined ? option.data.take : 10;
      api.getAllPoints.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
        option.success(data);
      }, function (data) {
        option.error(data);
      });
    }

    function getPointById(id) {
      return api.getPointById.get({ id: id }).$promise;
    }

    function addNewPoint(postData) {
      return api.addNewPoint.save(postData).$promise;
    }
    function validateRule(postData) {
      return api.validateRule.save(postData).$promise;
    }

    function checkRuleName(ruleName) {
      var deferred = $q.defer();
      api.checkRuleName.query({ ruleName: ruleName }, function (data) {
        deferred.resolve(data);
      }, function (data) {
        deferred.reject(data);
      });
      return deferred.promise;
    }

    function updatePoint(postData) {
      return api.updatePoint.save(postData).$promise;
    }

    function getAllChallenges(option, keyword, isActive, fromDate, toDate) {
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
      var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
      var keyword = keyword !== undefined ? keyword : "";
      var skip = option.data.skip !== undefined ? option.data.skip : 0;
      var take = option.data.take !== undefined ? option.data.take : 10;
      api.getAllChallenges.save({ isActive: isActive }, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false, fromDate: fromDate, toDate: toDate }, function (data) {
        option.success(data);
      }, function (data) {
        option.error(data);
      });
    }

    function getChallengeById(id) {
      return api.getChallengeById.get({ id: id }).$promise;
    }

    function addNewChallenge(postData) {
      return api.addNewChallenge.save(postData).$promise;
    }

    function updateChallenge(postData) {
      return api.updateChallenge.save(postData).$promise;
    }

    function getAllLevels(option, keyword) {
      var sortField = option.data.sort !== undefined ? option.data.sort[0].field : "name";
      var sortDir = option.data.sort !== undefined ? option.data.sort[0].dir : "asc";
      var keyword = keyword !== undefined ? keyword : "";
      var skip = option.data.skip !== undefined ? option.data.skip : 0;
      var take = option.data.take !== undefined ? option.data.take : 10;
      api.getAllLevels.save({}, { searchTerm: keyword, skip: skip, take: take, sortField: sortField, sortDir: sortDir, isExport: false }, function (data) {
        option.success(data);
      }, function (data) {
        option.error(data);
      });
    }

    function getCommunitysByType(communityType) {
      return api.getCommunitysByType.query({ communityType: communityType }).$promise;
    }
    function getAllLevelChoice() {
      return api.getAllLevelChoice.query({}).$promise;
    }

    function getAllLevelConditionTypes() {
      return api.getAllLevelConditionTypes.query({}).$promise;
    }

    function getLevelById(id) {
      return api.getLevelById.get({ id: id }).$promise;
    }

    function saveLevel(postData) {
      return api.saveLevel.save(postData).$promise;
    }

    function updateLevel(postData) {
      return api.updateLevel.save(postData).$promise;
    }

    function feedUserTypes() {
      return api.feedUserTypes.query().$promise;
    }

    function feedKnowledgeDocumentTypes() {
      return api.feedKnowledgeDocumentTypes.query().$promise;
    }

    function feedConditions() {
      return api.feedConditions.query().$promise;
    }

    function feedChallengeConditions() {
      return api.feedChallengeConditions.query().$promise;
    }

    function feedRewardTypes() {
      return api.feedRewardTypes.query().$promise;
    }

    function feedChallengeTypes() {
      return api.feedChallengeTypes.query().$promise;
    }

    function feedCommunityTypes() {
      return api.feedCommunityTypes.query().$promise;
    }

    function feedLogicalOperators() {
      return api.feedLogicalOperators.query().$promise;
    }

    function feedChallengeDifficultyLevels() {
      return api.feedChallengeDifficultyLevels.query().$promise;
    }

    return {
      api: api,
      getAllPoints: getAllPoints,
      addNewPoint: addNewPoint,
      validateRule: validateRule,
      checkRuleName: checkRuleName,
      updatePoint: updatePoint,
      getPointById: getPointById,
      deleteMultiPoints: function (postData) {
        return api.deleteMultiPoints.save(postData).$promise;
      },

      getAllChallenges: getAllChallenges,
      addNewChallenge: addNewChallenge,
      updateChallenge: updateChallenge,
      getChallengeById: getChallengeById,
      deleteMultiChallenges: function (postData) {
        return api.deleteMultiChallenges.save(postData).$promise;
      },
      getCommunitysByType: getCommunitysByType,

      getAllLevels: getAllLevels,
      getAllLevelChoice: getAllLevelChoice,
      getAllLevelConditionTypes: getAllLevelConditionTypes,
      saveLevel: saveLevel,
      updateLevel: updateLevel,
      getLevelById: getLevelById,
      deleteMultiLevels: function (postData) {
        return api.deleteMultiLevels.save(postData).$promise;
      },

      feedUserTypes: feedUserTypes,
      feedKnowledgeDocumentTypes: feedKnowledgeDocumentTypes,
      feedConditions: feedConditions,
      feedChallengeConditions: feedChallengeConditions,
      feedRewardTypes: feedRewardTypes,
      feedChallengeTypes: feedChallengeTypes,
      feedCommunityTypes: feedCommunityTypes,
      feedLogicalOperators: feedLogicalOperators,
      feedChallengeDifficultyLevels: feedChallengeDifficultyLevels
    };
  }

})();
