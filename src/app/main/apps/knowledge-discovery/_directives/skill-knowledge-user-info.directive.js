/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillKnowledgeUserInfo', skillKnowledgeUserInfo);

  /** @ngInject */
  function skillKnowledgeUserInfo() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        kdId: '<',
      },
      controller: function ($scope, KnowledgeDocumentApi, InsightsCommonService, $filter, $state) {
        $scope.allUserInfo = {};
        $scope.KDDisclaimer = null;

        $scope.Questions = {};
        $scope.Questions.author = $scope.$parent.Questions.author;
        $scope.Questions.coauthor = $scope.$parent.Questions.coauthor;
        $scope.Questions.source = $scope.$parent.Questions.source;
        $scope.Questions.externalauthor = $scope.$parent.Questions.externalauthor;
        $scope.Questions.submittedby = $scope.$parent.Questions.submittedby;
        $scope.Questions.endorsedby = $scope.$parent.Questions.endorsedby;

        $scope.$on('changeQuestionsLanguage', function (event, data) {
          $scope.Questions.author = $scope.$parent.Questions.author;
          $scope.Questions.coauthor = $scope.$parent.Questions.coauthor;
          $scope.Questions.source = $scope.$parent.Questions.source;
          $scope.Questions.externalauthor = $scope.$parent.Questions.externalauthor;
          $scope.Questions.submittedby = $scope.$parent.Questions.submittedby;
          $scope.Questions.endorsedby = $scope.$parent.Questions.endorsedby;
        });

        function _getKnowledgeUserInfo() {
          // Call api disclaimer
          KnowledgeDocumentApi.getKDDisclaimer($scope.kdId).then(function (response) {
            $scope.loading = false;
            $scope.KDDisclaimer = response;
          }, function (error) {
            $scope.loading = false;
            $scope.KDDisclaimer = null;
            //console.log(error);
          });
          KnowledgeDocumentApi.GetKnowledgeUserInfo($scope.kdId).then(function (response) {
            $scope.allUserInfo = response;
          });
        };

        $scope.getKnowledgeUserInfo = _getKnowledgeUserInfo;
        $scope.getKnowledgeUserInfo();

        $scope.$on('UpdateStatus', function (event, data) {
          _getKnowledgeUserInfo();
        });

        $scope.applyFilter = function (guid, name) {
          var filter = {
            Sources: [{
              name: name,
              id: 0,
              itemGuid: guid
            }]
          }

          InsightsCommonService.applyFilter(
            $filter('date')($scope.fromDate, "yyyy-MM-dd"),
            $filter('date')($scope.toDate, "yyyy-MM-dd"),
            null,
            filter,
            null
          );
        }
      },
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-knowledge-user-info.html',
    };
  }
})();
