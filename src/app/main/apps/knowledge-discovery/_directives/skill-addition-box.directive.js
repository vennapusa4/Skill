/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillAdditionBox', skillAdditionBox);

  /** @ngInject */
  function skillAdditionBox() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        kdId: '<',
      },
      controller: function ($scope, KnowledgeDocumentApi, TranslatorApi, InsightsCommonService, $filter) {
        $scope.additionInfo = {};
        var additionInfoOriginal = {};

        $scope.Questions = {};
        $scope.Questions.discipline = $scope.$parent.Questions.discipline;
        $scope.Questions.location = $scope.$parent.Questions.location;
        $scope.Questions.project = $scope.$parent.Questions.project;
        $scope.Questions.equipment = $scope.$parent.Questions.equipment;
        $scope.Questions.wells = $scope.$parent.Questions.wells;
        $scope.Questions.keywords = $scope.$parent.Questions.keywords;

        $scope.$on('changeQuestionsLanguage', function (event, data) {
          $scope.Questions.discipline = $scope.$parent.Questions.discipline;
          $scope.Questions.location = $scope.$parent.Questions.location;
          $scope.Questions.project = $scope.$parent.Questions.project;
          $scope.Questions.equipment = $scope.$parent.Questions.equipment;
          $scope.Questions.wells = $scope.$parent.Questions.wells;
          $scope.Questions.keywords = $scope.$parent.Questions.keywords;
        });

        $scope.$on('changeDataLanguage', function (event, data) {
          $scope.selectedLanguage = $scope.$parent.selectedLanguage;
          $scope.originalLanguageCode = $scope.$parent.originalLanguageCode;
          if ($scope.selectedLanguage == $scope.originalLanguageCode) {
            $scope.additionInfo.keywords = angular.copy(additionInfoOriginal.keywords);
          }
          else {
            $scope.additionInfo.keywords = angular.copy(additionInfoOriginal.keywords);
            angular.forEach($scope.additionInfo.keywords, function (value, key) {
              if (value.keywordName != undefined && value.keywordName != null && value.keywordName != "") {
                TranslatorApi.api.TranslateSingleText.save({}, {
                  textToTranslate: value.keywordName,
                  fromLanguage: $scope.originalLanguageCode,
                  toLanguage: $scope.selectedLanguage
                },
                  function (response) {
                    value.keywordName = response.translatedText;
                  },
                  function (response) {
                    if (response.status !== 404)
                      logger.error(response.data.errorMessage);
                  });
              }
            });
          }
        });

        function _getKnowledgeAdditionInfo() {
          KnowledgeDocumentApi.GetKnowledgeAdditionInfo($scope.kdId).then(function (response) {
            $scope.additionInfo = response;
            additionInfoOriginal = angular.copy($scope.additionInfo);
            if (response.location != null && response.location.latitude != null && response.location.longitude != null) {
              window.setTimeout(function () {
                $("#mapKDDetail").kendoMap({
                  center: [response.location.latitude, response.location.longitude],
                  zoom: 6,
                  layers: [{
                      type: "tile",
                      urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
                    subdomains: ["a", "b", "c"],
                  }],
                  markers: [{
                    location: [response.location.latitude, response.location.longitude],
                    shape: "pinTarget",
                    tooltip: {
                        content: response.location.locationTypeName + ": " + response.location.locationName,
                        showOn: "click",
                        show: function () {
                            var filter = {
                                Locations: [],
                            }

                            if (response.location) {
                                filter.Locations.push({
                                    name: response.location.locationName,
                                    id: response.location.locationId
                                });
                            }
                            InsightsCommonService.applyFilter(
                                $filter('date')($scope.fromDate, "yyyy-MM-dd"),
                                $filter('date')($scope.toDate, "yyyy-MM-dd"),
                                null,
                                filter
                            );
                        }
                    },
                  }],
                });
              });

              window.setInterval(function () {
                try {
                  $("#mapKDDetail")
                    .css({ width: "330px", height: "200px" })
                    .data("kendoMap").resize();
                } catch (e) {

                }
              }, 2000);
            }
          });
        };



        $scope.getKnowledgeAdditionInfo = _getKnowledgeAdditionInfo;
        $scope.getKnowledgeAdditionInfo();
      },
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-addition-box.html',
    };
  }
})();
