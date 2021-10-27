/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.translationEngagement')
        .directive('translationEngagementChartSummary', translationEngagementChartSummary);
    /** @ngInject */
  function translationEngagementChartSummary() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        data: '@',
        idx: '@'
      },
      controller: function ($scope, appConfig) {
        var arrColor = appConfig.arrColor;
        console.log($scope.data);
        $scope.drawChart = function () {
          var labels = [];
          var datasets = [];
          var maxValue = 0;
          var dataInput = JSON.parse($scope.data);
          var dataItem = [];
          _.each(dataInput.knowledgeChartResponses, function (c, idx) {
            var isExists = _.findIndex(labels, function (label) {
              return label == c.timeDistance;
            });
            if (isExists == -1) {
              labels.push(c.timeDistance);
            }
            if (c.count > maxValue) {
              maxValue = c.count;
            }
            dataItem.push(c.count);
          });
          datasets.push({
            data: dataItem,
            label: "Knowledge Discovery",
            borderColor: arrColor[0],
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            lineTension: 0,
          });

          dataItem = [];
          _.each(dataInput.shareExperienceChartResponses, function (c, idx) {
            var isExists = _.findIndex(labels, function (label) {
              return label == c.timeDistance;
            });
            if (isExists == -1) {
              labels.push(c.timeDistance);
            }
            if (c.count > maxValue) {
              maxValue = c.count;
            }
            dataItem.push(c.count);
          });
          datasets.push({
            data: dataItem,
            label: "Share Experience",
            borderColor: arrColor[1],
            fill: false,
            pointRadius: 0,
            borderWidth: 2,
            lineTension: 0,
          });

          // Chart 8
          // The data for our dataset
          var data8 = {
            labels: labels,
            datasets: datasets,
          };
          // Configuration options go here
          var options8 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            maintainAspectRatio: false,
            legend: {
              display: true
              },
              showAllTooltips: true,
            tooltips: {
                enabled: true
            },
            hover: {
              mode: null
            },
            scales: {
              xAxes: [{
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: {
                  maxRotation: 0,
                  minRotation: 0,
                },
              }],
              yAxes: [{
                position: 'left',
                ticks: {
                  max: maxValue,
                  min: 0,
                  stepSize: maxValue / 4,
                  callback: function (value, index, values) {
                    if (value % (maxValue / 2) === 0) {
                      return value.toLocaleString();
                    } else {
                      return ' ';
                    }
                  },
                },

                gridLines: {
                  drawBorder: false,
                },
              }],
              },
              afterDraw: function (chart, easing) {
                  if (chart.config.options.showAllTooltips) {
                      // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                      if (!chart.allTooltipsOnce) {
                          if (easing !== 1)
                              return;
                          chart.allTooltipsOnce = true;
                      }

                      // turn on tooltips
                      chart.options.tooltips.enabled = true;
                      Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                          tooltip.initialize();
                          tooltip.update();
                          // we don't actually need this since we are not animating tooltips
                          tooltip.pivot();
                          tooltip.transition(easing).draw();
                      });
                      chart.options.tooltips.enabled = false;
                  }
              }
          };
          
          window.setTimeout(function () {
            var idz = $scope.idx;
            var ctx8 = $(idz).get(0).getContext('2d');
            new Chart(ctx8, {
              type: 'line',
              data: data8,
              options: options8
            });
          }, 1500);
        }
        $scope.drawChart();
      },
      templateUrl: 'app/main/apps/translation-engagement/directives/translation-engagement-chart-summary.html',
    };
  }
})();
