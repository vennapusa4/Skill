/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.knowledgeDiscovery')
        .directive('skillReplicationHistory', skillReplicationHistory);

    /** @ngInject */
  function skillReplicationHistory() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        kdId: '<',
      },
      controller: function ($scope, logger, KnowledgeDocumentApi, InsightsCommonService) {

        var isFirstLoad = true;
        $scope.totalAll = 0;
        //$scope.hasReplicationSource = false;
        $scope.totalValueRealized = 0;
        $scope.totalPotentialValue = 0;
        $scope.replicationHistory = {};
        $scope.replicationSource = {};

        $scope.Questions = {};
        $scope.Questions.replicationHistory = $scope.$parent.Questions.replicationHistory;
        $scope.Questions.replicationSource = $scope.$parent.Questions.replicationSource;
        $scope.Questions.allReplications = $scope.$parent.Questions.allReplications;
        $scope.Questions.valueRealized = $scope.$parent.Questions.valueRealized;
        $scope.Questions.potentialValue = $scope.$parent.Questions.potentialValue;
        $scope.Questions.totalValue = $scope.$parent.Questions.totalValue;
        $scope.Questions.remarks = $scope.$parent.Questions.remarks;

        $scope.$on('changeQuestionsLanguage', function (event, data) {
          $scope.Questions.replicationHistory = $scope.$parent.Questions.replicationHistory;
          $scope.Questions.replicationSource = $scope.$parent.Questions.replicationSource;
          $scope.Questions.allReplications = $scope.$parent.Questions.allReplications;
          $scope.Questions.valueRealized = $scope.$parent.Questions.valueRealized;
          $scope.Questions.potentialValue = $scope.$parent.Questions.potentialValue;
          $scope.Questions.totalValue = $scope.$parent.Questions.totalValue;
          $scope.Questions.remarks = $scope.$parent.Questions.remarks;
        });

        function kmlFormatter(num, tofixed) {
          var result = num > 999 ? (num / 1000).toFixed(2) + 'K' : num;
          if (num >= 1000000000) {
              return (num / 1000000000).toFixed(2) + 'B';
          } else {
              if (num >= 1000000) {
                  return (num / 1000000).toFixed(2) + 'M';
              } else {
                  if (num >= 1000) {
                      return (num / 1000).toFixed(2) + 'K';
                  } else {
                      return num;
                  }
              }
          }
          return result;
      }
      $scope.kmlFormatter = function (str) {
        return kmlFormatter(str);
    }

        function _getReplicationHistory(filterBy) {
          $scope.replicationHistory = {};
          var replicationHistoryRequest = { knowledgeDocumentId: $scope.kdId, filterBy: filterBy };
          KnowledgeDocumentApi.api.replicationHistory.query({}, replicationHistoryRequest,
            function (response) {
              $scope.replicationHistory = response;
              console.log(response);
              if (isFirstLoad == true) {
                $scope.totalAll = $scope.replicationHistory.totalAll;
                console.log($scope.totalAll);
                $scope.totalValueRealized = $scope.replicationHistory.totalValueRealized;
                $scope.totalPotentialValue = $scope.replicationHistory.totalPotentialValue;
              }
              isFirstLoad = false;
            }, function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });


          $scope.replicationSource = {};
          KnowledgeDocumentApi.api.replicationSourceHistory.query({}, replicationHistoryRequest,
            function (response) {
              // For test
              //response = {
              //    "kdId": 17860,
              //    "kdTitle": "Every Wednesday, QA does report based on KPI report of project.",
              //    "discipline": "Fluid Engineering",
              //    "kdType": "Best Practice",
              //    "createdDate": "2018-09-01",
              //    "parentId": 0,
              //    "contributor": {
              //        "userId": 9796,
              //        "displayName": "Nghia Nguyen Ngoc (EXT/PET-ICT)",
              //        "image": null,
              //        "discipline": null,
              //        "division": null,
              //        "department": null,
              //        "imageUrl": "http://localhost:49768/api/Images/Preview/UserProfiles/9796/ThumbnailPhoto"
              //    },
              //    "replicationSourceChildItems": [
              //        {
              //            "kdId": 17860,
              //            "kdTitle": "Every Wednesday, QA does report based on KPI report of project.",
              //            "discipline": "Fluid Engineering",
              //            "kdType": "Best Practice",
              //            "createdDate": "2018-09-01",
              //            "parentId": 0,
              //            "contributor": {
              //                "userId": 9796,
              //                "displayName": "Nghia Nguyen Ngoc (EXT/PET-ICT)",
              //                "image": null,
              //                "discipline": null,
              //                "division": null,
              //                "department": null,
              //                "imageUrl": "http://localhost:49768/api/Images/Preview/UserProfiles/9796/ThumbnailPhoto"
              //            },
              //            "replicationSourceChildItems": [
              //                {
              //                    "kdId": 17860,
              //                    "kdTitle": "Every Wednesday, QA does report based on KPI report of project.",
              //                    "discipline": "Fluid Engineering",
              //                    "kdType": "Best Practice",
              //                    "createdDate": "2018-09-01",
              //                    "parentId": 0,
              //                    "contributor": {
              //                        "userId": 9796,
              //                        "displayName": "Nghia Nguyen Ngoc (EXT/PET-ICT)",
              //                        "image": null,
              //                        "discipline": null,
              //                        "division": null,
              //                        "department": null,
              //                        "imageUrl": "http://localhost:49768/api/Images/Preview/UserProfiles/9796/ThumbnailPhoto"
              //                    },
              //                    "replicationSourceChildItems": [

              //                    ],
              //                },
              //                {
              //                    "kdId": 17860,
              //                    "kdTitle": "Every Wednesday, QA does report based on KPI report of project.",
              //                    "discipline": "Fluid Engineering",
              //                    "kdType": "Best Practice",
              //                    "createdDate": "2018-09-01",
              //                    "parentId": 0,
              //                    "contributor": {
              //                        "userId": 9796,
              //                        "displayName": "Nghia Nguyen Ngoc (EXT/PET-ICT)",
              //                        "image": null,
              //                        "discipline": null,
              //                        "division": null,
              //                        "department": null,
              //                        "imageUrl": "http://localhost:49768/api/Images/Preview/UserProfiles/9796/ThumbnailPhoto"
              //                    },
              //                    "replicationSourceChildItems": [

              //                    ],
              //                }
              //            ],
              //        },
              //        {
              //            "kdId": 17860,
              //            "kdTitle": "Every Wednesday, QA does report based on KPI report of project.",
              //            "discipline": "Fluid Engineering",
              //            "kdType": "Best Practice",
              //            "createdDate": "2018-09-01",
              //            "parentId": 0,
              //            "contributor": {
              //                "userId": 9796,
              //                "displayName": "Nghia Nguyen Ngoc (EXT/PET-ICT)",
              //                "image": null,
              //                "discipline": null,
              //                "division": null,
              //                "department": null,
              //                "imageUrl": "http://localhost:49768/api/Images/Preview/UserProfiles/9796/ThumbnailPhoto"
              //            },
              //            "replicationSourceChildItems": [

              //            ],
              //        }
              //    ],
              //};

              $scope.replicationSource = response;
              // if (response.parentReplicationSources.length > 0){
              //     $scope.hasReplicationSource = true;
              // }
            }, function (response) {
              if (response.status !== 404)
                logger.error(response.data.errorMessage);
            });
        };

        $scope.getReplicationHistory = _getReplicationHistory;
        $scope.getReplicationHistory();

        $scope.dateTimeToText = function (str) {
          return InsightsCommonService.dateTimeToText(str);
        }
      },
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-replication-history.html',
    };
  }
})();
