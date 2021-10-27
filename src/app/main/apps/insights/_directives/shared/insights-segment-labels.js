/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.insights')
    .directive('insightsSegmentLabels', insightsSegmentLabels);
  /** @ngInject */
  function insightsSegmentLabels() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        pagename: '@'
      },
      controller: function ($scope, $rootScope, appConfig, InsightsCommonService, InsightsApi, $timeout) {
        // Declare variables
        $scope.arrClass = appConfig.arrClass;
        $scope.arrColor = appConfig.arrColor;
        $scope.totalValue = 0;
        $scope.segmentItems = [];
        $scope.allSegmentTypesPopup = [];
        $scope.allDisciplinesPopup = [];
        $scope.segmentTypeSelectedPopup = {};
        $scope.allDisciplinesSelectedPopup = {};
        $scope.segmentKeyword = "";
        $scope.FilterSources = [];
        $scope.segmentItemsChart = {};
        $scope.loading = false;
        $scope.isFirstSegmentLabels = true;
        $scope.level3Model = {};

        // Load data for segment labels
        $scope.loadData = function (isSave) {
          var segmentFromLocalStorage = localStorage.getItem("skillSegmentsSelected");

          $scope.loading = true;
          var segmentItemsInput = [];

          if (segmentFromLocalStorage != null) {
            var temp = JSON.parse(segmentFromLocalStorage);
            segmentItemsInput = temp.labelItemResponses;
          } else {
            if ($scope.isFirstSegmentLabels) {
              segmentItemsInput.push(InsightsCommonService.defaultAllUser());
              $scope.isFirstSegmentLabels = false;
            } else {
              segmentItemsInput = $scope.segmentItems;
            }
          }

          // console.log(segmentItemsInput);

          if ($scope.pagename == "knowledge") {
            InsightsApi.loadDataForTopLabels(segmentItemsInput).then(function (data) {
              renderPage(data, isSave);
            }, function (error) {
              $scope.loading = false;
              console.log(error);
            });
          } else {
            if ($scope.pagename == "value") {
              InsightsApi.loadDataForTopLabelsValue(segmentItemsInput).then(function (data) {
                renderPage(data, isSave);
              }, function (error) {
                $scope.loading = false;
                console.log(error);
              });
            } else {
              if ($scope.pagename == "people") {
                InsightsApi.loadDataForTopLabelsPeople(segmentItemsInput).then(function (data) {
                  renderPage(data, isSave);
                }, function (error) {
                  $scope.loading = false;
                  console.log(error);
                });
              }
            }
          }
        }
        function renderPage(data, isSave) {
          $scope.loading = false;
          if (data != null && data.labelItemResponses != null) {
            _.each(data.labelItemResponses, function (item, index) {
              item.percentage = (item.value * 100 / data.totalValue).toFixed(2) + "%";
            });
            InsightsCommonService.setAllSegmentLabels(data);
            var currentSegmentLabels = InsightsCommonService.getAllSegmentLabels();
            $rootScope.$broadcast('segmentLabelChanges', { data: currentSegmentLabels.labelItemResponses, isSave: isSave });

            _.orderBy(currentSegmentLabels, ['id'], ['asc']);
            $scope.totalValue = data.totalValue;
            $scope.segmentItems = currentSegmentLabels.labelItemResponses;

            window.setTimeout(function () {
              drawLabelChart(data.totalValue);
            });
          }
        }
        $scope.loadData(false);
        // Remove segment label
        $scope.removeSegmentItem = function (index) {
          $scope.segmentItems.splice(index, 1);
          // Store segment
          var currentSegmentLabels = InsightsCommonService.getAllSegmentLabels();
          currentSegmentLabels.labelItemResponses = $scope.segmentItems;
          InsightsCommonService.setAllSegmentLabels(currentSegmentLabels);

          $scope.loadData(true);
        }
        // Draw chart for segment label
        function drawLabelChart(value) {
          try {
            _.each($scope.segmentItems, function (item, index) {
              var value = item.value;
              var data = {
                datasets: [{
                  backgroundColor: [$scope.arrColor[index], '#e7e7eb'],
                  data: [value, $scope.totalValue - value],
                  borderWidth: 1,
                }]
              };
              var options = {
                plugins: {
                  centerLabel: false   // disable plugin 'centerLabel' for this instance
                },
                legend: { display: false },
                maintainAspectRatio: false,
                tooltips: { enabled: false },
                hover: { mode: null },
                cutoutPercentage: 60
              };
              var idText = '#ChartSegmentItem' + index;
              var ctx = $(idText).get(0).getContext('2d');
              new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: options
              });
            });
          } catch (e) {
            console.log(1);
          }
        }

        // Load data for popup
        $scope.loadMasterData = function () {
          $scope.loading = true;
          InsightsApi.allSegmentTypes().then(function (data) {
            _.each(data, function (value, index) {
              try {
                value.desc = appConfig.descriptionForSegmentPopup[index];
              } catch (e) {

              }
              try {
                value.desc2 = appConfig.description2ForSegmentPopup[index];
              } catch (e) {

              }
            });
            $scope.allSegmentTypesPopup = data;
          }, function (error) {
            $scope.loading = false;
            console.log(error);
          });
        }
        $scope.loadMasterData();

        // Add segment popup
        $scope.segmentTypeChange = function () {
          $scope.allDisciplinesPopup = [];
          if ($scope.segmentTypeSelectedPopup.value != "AllUsers" && $scope.segmentTypeSelectedPopup.value != "All") {
            InsightsApi.allDisciplines($scope.segmentTypeSelectedPopup.value).then(function (response) {
              $scope.allDisciplinesPopup = response;
              $scope.disciplineSelectedPopup = ($scope.allDisciplinesPopup != null && $scope.allDisciplinesPopup.length > 1) ? $scope.allDisciplinesPopup[0] : {};
              $scope.loading = false;
            }, function (error) {
              $scope.loading = false;
              console.log(error);
            });
          }
        }
        $scope.copSources = {
          dataTextField: "name",
          dataValueField: "id",
          filter: "contains",
          minLength: 0,
          delay: 500,
          dataSource: {
            serverFiltering: true,
            transport: {
              read: function (options) {
                var segmentItemsInput = [];
                _.each($scope.FilterSources, function (item, index) {
                  segmentItemsInput.push({
                    segmentTypeL1: $scope.segmentTypeSelectedPopup.value,
                    segmentTypeL2: $scope.disciplineSelectedPopup.value,
                    id: item.id
                  })
                });
                _.forEach($scope.segmentItems, function (item, index) {
                  var isExist = _.findIndex(segmentItemsInput, function (o) {
                    return o.id == item.id;
                  });
                  if (isExist == -1) {
                    segmentItemsInput.push({
                      id: item.id,
                      segmentTypeL1: item.segmentTypeL1,
                      segmentTypeL2: item.segmentTypeL2
                    });
                  }
                });

                var dataInput = {
                  segmentTypeL1: $scope.segmentTypeSelectedPopup.value,
                  segmentTypeL2: $scope.disciplineSelectedPopup.value,
                  keyword: $scope.segmentKeyword,
                  segmentItems: segmentItemsInput
                };
                return InsightsApi.searchSegmentSuggestions(options, dataInput);
              }
            },
          },
          open: function (e) {
            setTimeout(function () {
              e.sender.list.closest('.k-animation-container').find('.k-list-container').addClass('multiselect_panel');
            }, 100);
          },
          select: function (e) {
            $scope.$apply(function () {
              $scope.FilterSources.push(e.dataItem);
              $scope.FilterSources = $scope.FilterSources.sort();
              $scope.segmentKeyword = '';
            });
            window.setTimeout(function () {
              $scope.$apply(function () {
                $scope.segmentKeyword = '';
              });
            });
            $scope.loadChartSegment();
          },
        };
        $scope.removeFilter = function (id, type) {
          _.remove($scope.FilterSources, function (obj) {
            return obj.id === id;
          });
          $scope.loadChartSegment();
        }
        $scope.loadChartSegment = function () {
          if ($scope.pagename == "knowledge") {
            InsightsApi.getSegmentKDSummary($scope.FilterSources).then(function (data) {
              renderChart(data);
            }, function (error) {
              $scope.loading = false;
              console.log(error);
            });
          } else {
            if ($scope.pagename == "value") {
              InsightsApi.getSegmentValueSummary($scope.FilterSources).then(function (data) {
                renderChart(data);
              }, function (error) {
                $scope.loading = false;
                console.log(error);
              });
            }
            else {
              if ($scope.pagename == "people") {
                InsightsApi.getSegmentPeopleSummary($scope.FilterSources).then(function (data) {
                  renderChart(data);
                }, function (error) {
                  $scope.loading = false;
                  console.log(error);
                });
              }
            }
          }
        }
        function renderChart(data) {
          $scope.loading = false;
          // Proceed data
          _.each(data.summaryItemResponses, function (item, index) {
            try {
              item.percentage = (item.value * 100 / data.totalValue).toFixed(2) + "%";
            } catch (e) {
              item.percentage = "0%";
            }
          });
          $scope.segmentItemsChart = data;

          // Mapping label data
          var tempFilterSources = [];
          _.forEach($scope.FilterSources, function (value, index) {
            var obj = _.find(data.summaryItemResponses, function (item, index) {
              return value.name == item.name;
            });
            if (obj) {
              value.value = obj.value;
              value.percentage = obj.percentage;
            }
            tempFilterSources.push(value);
          });
          $scope.FilterSources = tempFilterSources;

          // Draw Chart 4
          var valueMax = $scope.segmentItemsChart.totalValue;
          var dataInput = [];
          var colorInput = [];
          var totalX = 0;
          if ($scope.segmentItemsChart.summaryItemResponses != null) {
            for (var i = 0; i < $scope.segmentItemsChart.summaryItemResponses.length; i++) {
              var item = $scope.segmentItemsChart.summaryItemResponses[i];
              dataInput.push(item.value);
              colorInput.push($scope.arrColor[i]);
              totalX += item.value;
            }
          }

          if (totalX <= valueMax) {
            dataInput.push(valueMax - totalX);
            colorInput.push("#ddd");
          }
          var data4 = {
            datasets: [{
              backgroundColor: colorInput,
              data: dataInput,
              borderWidth: 1,
            }]
          };
          var options4 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: { display: false },
            maintainAspectRatio: false,
            tooltips: { enabled: false },
            hover: { mode: null },
            cutoutPercentage: 60
          };
          try {
            var ctx4 = $('#Chart4').get(0).getContext('2d');
            new Chart(ctx4, {
              type: 'doughnut',
              data: data4,
              options: options4
            });
          } catch (e) {
            console.log(e);
          }
        }
        $scope.showAddSegmentClick = function () {
          $scope.segmentKeyword = "";
          $scope.FilterSources = [];

          _.forEach($scope.allSegmentTypesPopup, function (item, index) {
            var isExist = _.findIndex($scope.segmentItems, function (type) {
              return type.name.toLowerCase() == item.text.toLowerCase();
            });
            item.isHidden = isExist != -1;
          });

          $scope.segmentTypeSelectedPopup = {};
          for (var i = 0; i < $scope.allSegmentTypesPopup.length; i++) {
            if (!$scope.allSegmentTypesPopup[i].isHidden) {
              $scope.segmentTypeSelectedPopup = $scope.allSegmentTypesPopup[i];
              break;
            }
          }
          $scope.segmentTypeChange();
          $timeout(function () {
            var control = $scope.level3Model;
            var autocompleteInput = control.element;

            autocompleteInput.on('click', function (e) {
              control.search('');
            });
          }, 1000);
          // Show modal
          $('#ModalSegment').modal('show');
        }
        $scope.saveAddSegmentClick = function () {
          if ($scope.FilterSources != null && $scope.FilterSources.length > 0) {
            _.forEach($scope.FilterSources, function (item, index) {
              var isExist = _.findIndex($scope.segmentItems, function (segment) {
                return segment.name.toLowerCase() == item.name.toLowerCase();
              });
              if (isExist == -1) {
                $scope.segmentItems.push({
                  id: item.id,
                  value: item.value,
                  name: item.name,
                  text: item.text,
                  percentage: item.percentage,
                  segmentTypeL1: item.segmentTypeL1,
                  segmentTypeL2: item.segmentTypeL2,
                  segmentTypeL2Name: item.segmentTypeL2Name
                });
              }
            });
          } else {
            if ($scope.segmentTypeSelectedPopup.value != "AllUsers" && $scope.segmentTypeSelectedPopup.value != "All") {
              $scope.segmentItems.push({
                id: null,
                name: '',
                text: '',
                segmentTypeL1: $scope.segmentTypeSelectedPopup.value,
                segmentTypeL2: $scope.disciplineSelectedPopup.value,
                segmentTypeL2Name: $scope.disciplineSelectedPopup.text,
                value: 0,
                percentage: '100%'
              });
            } else {
              $scope.segmentItems.push({
                id: 0,
                name: 'All',
                text: 'All',
                segmentTypeL1: "All",
                segmentTypeL2: "",
                segmentTypeL2Name: "",
                value: 0,
                percentage: '100%'
              });
            }
          }
          // Store segment
          var currentSegmentLabels = InsightsCommonService.getAllSegmentLabels();
          currentSegmentLabels.labelItemResponses = $scope.segmentItems;
          InsightsCommonService.setAllSegmentLabels(currentSegmentLabels);

          $scope.loadData(true);
          $scope.closeAddSegmentClick();
        }
        $scope.closeAddSegmentClick = function () {
          $('#ModalSegment').modal('hide');
        }

        $scope.kmlFormatter = function (str) {
          return InsightsCommonService.kmlFormatter(str);
        }
      },
      templateUrl: 'app/main/apps/insights/_directives/shared/insights-segment-labels.html',
    };
  }
})();
