/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillAdditionWell', skillAdditionWell);

  /** @ngInject */
  function skillAdditionWell(SearchApi, $timeout) {

    return {
      restrict: 'AE',
      scope: {
        data: '=',
        total: '=',
        disabled: '='
      },
      controller: function ($scope, TranslatorApi) {
        $scope.IsWellPhaseRequired = null;
        // Clone 'data'
        $scope.dataChange = angular.copy($scope.data);

        $scope.QuestionsEnglish = {};
        $scope.Questions = {};
        $scope.QuestionsEnglish.well = 'Well';
        $scope.QuestionsEnglish.wellName = 'Well Name';
        $scope.QuestionsEnglish.wellType = 'Well Type';
        $scope.QuestionsEnglish.wellPhase = 'Well Phase';
        $scope.QuestionsEnglish.wellActivity = 'Well Activity';
        $scope.Questions = $scope.QuestionsEnglish;

        $scope.$on('changeInputLanguage', function (event, data) {
          var inputLanguage = data.inputLanguage;
          if (inputLanguage == "en") {
            $scope.Questions = $scope.QuestionsEnglish;
          }
          else {
            TranslatorApi.api.TranslateMultipleHtmlText.save({}, {
              textToTranslate: $scope.QuestionsEnglish,
              fromLanguage: "en",
              toLanguage: inputLanguage
            },
              function (response) {
                $scope.Questions = response.translatedText;
              },
              function (response) {
                if (response.status !== 404)
                  logger.error(response.data.errorMessage);
              });
          }
          // do what you want to do
        });

        $scope.$watch('data', function (newVal, oldVal) {
          $scope.dataChange = angular.copy(newVal);
          $scope.$emit("wellsAdded", $scope.dataChange);
        });

        $scope.WellNameSource = {
          dataTextField: "name",
          dataValueField: "id",
          filter: "contains",
          minLength: 1,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                return SearchApi.SearchWell(options);
              }
            },
            group: { field: "type" }
          },
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
            });
          },
          select: function (e) {
            $scope.dataChange.WellName = e.dataItem;
          }
        };

        $scope.WellTypeSource = {
          dataTextField: "name",
          dataValueField: "id",
          filter: "contains",
          minLength: 1,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                return SearchApi.SearchWellType(options);
              }
            },
            group: { field: "type" }
          },
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
            });
          },
          select: function (e) {
            $scope.dataChange.WellType = e.dataItem;
          }
        };

        $scope.WellPhaseSource = {
          dataTextField: "name",
          dataValueField: "id",
          filter: "contains",
          minLength: 1,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                return SearchApi.SearchWellPhase(options);
              }
            },
            group: { field: "type" }
          },
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
            });
          },
          select: function (e) {
            $scope.dataChange.WellPhase = e.dataItem;
          }
        };

        $scope.WellOperationsSource = {
          dataTextField: "name",
          dataValueField: "id",
          filter: "contains",
          minLength: 1,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                var wellPhaseId = -1;
                if ($scope.dataChange.WellPhase.name != '') {
                  wellPhaseId = $scope.dataChange.WellPhase.id || 0;
                }
                $scope.IsWellPhaseRequired = false;
                if ($scope.dataChange.WellPhase.id == null || $scope.dataChange.WellPhase.id == -1 || $scope.dataChange.WellPhase.id == 0) {
                  $scope.IsWellPhaseRequired = true;
                  return;
                }
                return SearchApi.SearchWellOperationByWellPhase(options, wellPhaseId);
              }
            },
            group: { field: "type" }
          },
          open: function (e) {
            $timeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
            });
          },
          select: function (e) {
            $scope.dataChange.WellOperations = e.dataItem;
          }
        };

        $timeout(function () {
          var wtInput = $scope.WellTypeControl.element;
          wtInput.on('click', function () {
            var val = wtInput.val();
            $scope.WellTypeControl.search();
          });

          var wpInput = $scope.WellPhaseControl.element;
          wpInput.on('click', function () {
            var val = wpInput.val();
            $scope.WellPhaseControl.search();
          });

          var woInput = $scope.WellOperationControl.element;
          woInput.on('click', function () {
            var val = woInput.val();
            $scope.WellOperationControl.search();
          });
        }, 1000);

        $scope.Delete = function (wellNameId) {
          _.remove($scope.total, function (obj) {
            return obj.WellName.id === wellNameId;
          });
          
          $scope.$emit("deletedWells", wellNameId);

        };

        $scope.Cancel = function () {
          $scope.dataChange = angular.copy($scope.data);
          $scope.ClosePanel();
        };

        $scope.Apply = function () {
          $scope.IsWellPhaseRequired = false;
          if ($scope.dataChange.WellPhase.id == null || $scope.dataChange.WellPhase.id == -1 || $scope.dataChange.WellPhase.id == 0) {
            $scope.IsWellPhaseRequired = true;
            return;
          }
          $scope.data = angular.copy($scope.dataChange);
          $scope.ClosePanel();

          return false;
        };
      },
      templateUrl: 'app/main/directives/skill-addition-well.html',
      link: function ($scope, $element) {

        $scope.ClosePanel = function () {
          $($element).find(".k-header").click();
        }
      }
    };
  }
})();
