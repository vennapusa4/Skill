/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.knowledgeDiscovery')
    .directive('skillValueCreation', skillValueCreation);

  /** @ngInject */
  function skillValueCreation() {
    return {
      restrict: 'AE',
      scope: {
        kdId: '<',
      },
      controller: function ($scope, KnowledgeDocumentApi, TranslatorApi) {

        $scope.valueCreationPV = [];
        $scope.valueCreationRV = [];
        $scope.remarks = [];
        $scope.remarksRV = [];
        $scope.selectedChart;

        $scope.Questions = {};
        $scope.Questions.valueAmplified = $scope.$parent.Questions.valueAmplified;
        if($scope.$parent.Questions.vlPotentialValue && $scope.$parent.Questions.vlValueRealised){
          $scope.Questions.potentialValue = $scope.$parent.Questions.vlPotentialValue;
          $scope.Questions.valueRealised = $scope.$parent.Questions.vlValueRealised;
        }
        else{
          $scope.Questions.potentialValue = "Potential Value";
          $scope.Questions.valueRealised = "Value Realised";
        }
    
        $scope.Questions.valueAmplifiedByType = $scope.$parent.Questions.valueAmplifiedByType;
        $scope.Questions.remarks = $scope.$parent.Questions.remarks;

        $scope.$on('changeQuestionsLanguage', function (event, data) {
          $scope.Questions.valueAmplified = $scope.$parent.Questions.valueAmplified;
          $scope.Questions.valueAmplifiedByType = $scope.$parent.Questions.valueAmplifiedByType;
          $scope.Questions.potentialValue = $scope.$parent.Questions.vlPotentialValue;
          $scope.Questions.valueRealised = $scope.$parent.Questions.vlValueRealised;
          $scope.Questions.remarks = $scope.$parent.Questions.remarks;
        });

        var donutChart;
        $scope.$on('chart-create', function (evt, chart) {
          if (chart.config.type == 'doughnut') donutChart = chart;
        });
        $scope.valueCreationLabels = [];
        $scope.valueCreationColors = [{
          backgroundColor: '#FD1F5E',
          pointBackgroundColor: '#FD1F5E'
        }, {
          backgroundColor: '#9400D3',
          pointBackgroundColor: '#9400D3'
        }, {
          backgroundColor: '#6B8E23',
          pointBackgroundColor: '#6B8E23'
        }, {
          backgroundColor: '#68F000',
          pointBackgroundColor: '#68F000'
        }];
        $scope.valueCreationRvLabels = [];
        $scope.valueCreationRvColors = [
          {
            backgroundColor: '#9400D3',
            pointBackgroundColor: '#9400D3'
          },
          {
            backgroundColor: '#6B8E23',
            pointBackgroundColor: '#6B8E23'
          },
          {
            backgroundColor: '#68F000',
            pointBackgroundColor: '#68F000'
          },
          {
          backgroundColor: '#FD1F5E',
          pointBackgroundColor: '#FD1F5E'
        }];
        $scope.valueCreationData = [];
        $scope.valueCreationOptions = {
          legend: { display: true, position: 'top', labels: {fontColor: "#fff"} },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var allData = data.datasets[tooltipItem.datasetIndex].data;
                var tooltipLabel = data.labels[tooltipItem.index];
                var tooltipData = allData[tooltipItem.index];
                return tooltipLabel + ': RM ' + tooltipData + ' K';
              }
            }
          },
          onClick: function (event, elements) {
            $scope.$apply(function () {
              //$scope.remarks = $scope.valueCreation[elements[0]._index].remarks;
            });
          },
          onHover: function (event, elements) {
          },
          events: ["mousemove", "touchstart", "touchmove", "click"]
        };
        $scope.changeChartView = function(data) {
          $scope.selectedChart = data;
        }
        $scope.valueCreationRvData = [];
        $scope.valueCreationRvOptions = {
          legend: { display: true, position: 'top', labels: {fontColor: "#fff"} },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var allData = data.datasets[tooltipItem.datasetIndex].data;
                var tooltipLabel = data.labels[tooltipItem.index];
                var tooltipData = allData[tooltipItem.index];
                return tooltipLabel + ': RM ' + tooltipData + ' K';
              }
            }
          },
          onClick: function (event, elements) {
            $scope.$apply(function () {
              //$scope.remarks = $scope.valueCreation[elements[0]._index].remarks;
            });
          },
          onHover: function (event, elements) {
          },
          events: ["mousemove", "touchstart", "touchmove", "click"]
        };

        var _getValueCreation = function () {
          KnowledgeDocumentApi.ValueCreationGroup($scope.kdId).then(function (response) {
            $scope.valueCreationPV = response.potentialValue;
            $scope.valueCreationRV = response.valueRealized;
            if($scope.valueCreationRV.length > 0) {
              $scope.selectedChart = 'rv';
            }
            else{
              $scope.selectedChart = 'pv';
            }
            for (var i = 0; i < response.potentialValue.length; i++) {
              $scope.valueCreationLabels.push(response.potentialValue[i].valueTypeName);
              $scope.valueCreationData.push(response.potentialValue[i].impactValue);
              $scope.remarks.push({
                  valueTypeName: response.potentialValue[i].valueTypeName,
                remarks: response.potentialValue[i].remarks,
                translatedvalueTypeName: response.potentialValue[i].valueTypeName,
                translatedremarks: response.potentialValue[i].remarks
              });
            }
            for (var i = 0; i < response.valueRealized.length; i++) {
      
              $scope.valueCreationRvLabels.push(response.valueRealized[i].valueTypeName);
              $scope.valueCreationRvData.push(response.valueRealized[i].impactValue);
              $scope.remarksRV.push({
                  valueTypeName: response.valueRealized[i].valueTypeName,
                remarks: response.valueRealized[i].remarks,
                translatedvalueTypeName: response.valueRealized[i].valueTypeName,
                translatedremarks: response.valueRealized[i].remarks
              });
            }

         
            // for (var i = 0; i < response.length; i++) {
            //   $scope.valueCreationLabels.push(response[i].valueTypeName);
            //   $scope.valueCreationData.push(response[i].impactValue);
            //   $scope.remarks.push({
            //       valueTypeName: response[i].valueTypeName,
            //     remarks: response[i].remarks,
            //     translatedvalueTypeName: response[i].valueTypeName,
            //     translatedremarks: response[i].remarks
            //   });
            // }
            $scope.remarksOriginal = $scope.remarks;
            $scope.remarksOriginalRV = $scope.remarksRV;
          });
        };

        $scope.getValueCreation = _getValueCreation;
        $scope.getValueCreation();

        $scope.$on('changeInputLanguage', function (event, data) {
          var inputLanguage = data.inputLanguage;
          var originalLanguage = data.originalLanguage;
          _languageChange(inputLanguage, originalLanguage);
        });

        function _languageChange(inputLanguage, originalLanguage) {
          if (inputLanguage == originalLanguage) {
            angular.forEach($scope.remarksOriginal, function (value, key) {
              value.translatedvalueTypeName = value.valueTypeName;
              value.translatedremarks = value.remarks;
            });
            angular.forEach($scope.remarksOriginalRV, function (value, key) {
              value.translatedvalueTypeName = value.valueTypeName;
              value.translatedremarks = value.remarks;
            });
            return;
          }
          angular.forEach($scope.remarksOriginal, function (value, key) {
            if (value.remarks != null && value.remarks != undefined && value.remarks != '') {
              TranslatorApi.api.TranslateSingleText.save({}, {
                textToTranslate: value.remarks,
                fromLanguage: originalLanguage,
                toLanguage: inputLanguage
              },
                function (response) {
                  value.translatedremarks = response.translatedText;
                },
                function (response) {
                  if (response.status !== 404)
                    logger.error(response.data.errorMessage);
                });
            }
            if (value.valueTypeName != null && value.valueTypeName != undefined && value.valueTypeName != '') {
              TranslatorApi.api.TranslateSingleText.save({}, {
                textToTranslate: value.valueTypeName,
                fromLanguage: originalLanguage,
                toLanguage: inputLanguage
              },
                function (response) {
                  value.translatedvalueTypeName = response.translatedText;
                },
                function (response) {
                  if (response.status !== 404)
                    logger.error(response.data.errorMessage);
                });
            }
          });
          angular.forEach($scope.remarksOriginalRV, function (value, key) {
            if (value.remarks != null && value.remarks != undefined && value.remarks != '') {
              TranslatorApi.api.TranslateSingleText.save({}, {
                textToTranslate: value.remarks,
                fromLanguage: originalLanguage,
                toLanguage: inputLanguage
              },
                function (response) {
                  value.translatedremarks = response.translatedText;
                },
                function (response) {
                  if (response.status !== 404)
                    logger.error(response.data.errorMessage);
                });
            }
            if (value.valueTypeName != null && value.valueTypeName != undefined && value.valueTypeName != '') {
              TranslatorApi.api.TranslateSingleText.save({}, {
                textToTranslate: value.valueTypeName,
                fromLanguage: originalLanguage,
                toLanguage: inputLanguage
              },
                function (response) {
                  value.translatedvalueTypeName = response.translatedText;
                },
                function (response) {
                  if (response.status !== 404)
                    logger.error(response.data.errorMessage);
                });
            }
          });

          $scope.$on('chart-create', function (evt, chart) {
            if (chart.config.type == 'pie') donutChart = chart;
          });
        }
      },
      templateUrl: 'app/main/apps/knowledge-discovery/_directives/skill-value-creation.html',
    };
  }
})();
