/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.insights')
    .directive('insightsKnowledgeAddedAndValidatedChart', insightsKnowledgeAddedAndValidatedChart);
  /** @ngInject */
  function insightsKnowledgeAddedAndValidatedChart() {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        data: '=',
        idx: '@',
        typex: '@',
      },
      controller: function ($scope) {
        var myChart;
        $scope.drawChart = function () {
          var dataInput = $scope.data;
          var typex = $scope.typex;
          var dataChart = [];
          var labels = [];
          var dataAdded = [];
          var dataVaidated = [];
          var maxValue = 0;
          _.each(dataInput, function (item, index) {
            if (item.type == typex) {
              dataChart.push(item.newKnowledgeItem);
            }
          });

          _.each(dataChart, function (item, index) {
            if (item.length > 0) {
              var totalValue = (item[0].added || 0 + item[0].validated || 0);
              if (maxValue <= totalValue) {
                maxValue = totalValue;
              }
              labels.push(item[0].validated);
              dataAdded.push(item[0].added);
              dataVaidated.push(item[0].validated);
            } else {
              labels.push(0);
              dataAdded.push(0);
              dataVaidated.push(0);
            }
          });

          // The data for our dataset
          var data28 = {
            labels: labels,
            datasets: [{
              data: dataVaidated,
              backgroundColor: '#b0de09',
            }, {
              data: dataAdded,
              backgroundColor: '#fcd202',
            }]
          };
          // Configuration options go here
          var options28 = {
            maintainAspectRatio: false,
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: {
              display: false
            },
            tooltips: {
              enabled: false
            },
            hover: {
              mode: null
            },
            scales: {
              xAxes: [{
                display: false,
                stacked: true,
              }],
              yAxes: [{
                position: 'right',
                fontStyle: '300',
                barThickness: 12,
                categoryPercentage: 0.5,
                barPercentage: 1.0,
                stacked: true,
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
                ticks: { beginAtZero: true }
              }],
            }
          };
          var idChart = $scope.idx;
          window.setTimeout(function () {
            if (myChart) {
              myChart.destroy();
            }
            var ctx28 = $(idChart).get(0).getContext('2d');
            myChart = new Chart(ctx28, {
              type: 'horizontalBar',
              data: data28,
              options: options28
            });
          });
          window.setTimeout(function () {
            $('[data-toggle="tooltip"]').tooltip();
          }, 1000);

          window.setTimeout(function () {
            $('.data_tab_nav a:first').tab('show');
            $('#Compare-0').addClass('active');
          });
        }
        $scope.drawChart();
        $scope.$on('knowledgeAddedAndValidatedDrawChart', function (event, data) {
          $scope.data = data.data;
          $scope.drawChart();
        });
      },
      templateUrl: 'app/main/apps/insights/_directives/knowledge/insights-knowledge-added-and-validated-chart.html',
    };
  }
})();
