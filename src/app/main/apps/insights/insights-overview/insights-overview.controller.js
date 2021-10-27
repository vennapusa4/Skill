(function () {
  'use strict';

  angular
    .module('app.insights')
    .controller('InsightsOverviewController', InsightsOverviewController);

  /** @ngInject */
  function InsightsOverviewController($scope, $filter, $state, InsightsApi, UserProfileApi, appConfig, InsightsCommonService) {
    var vm = this;
    vm.arrClass = appConfig.arrClass;
    vm.arrColor = appConfig.arrColor;
    vm.loading = false;

    // variable
    vm.userInfo = { hasImage: false };
    var date = new Date();
    var firstDayInMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    vm.firstDayInYear = new Date(date.getFullYear(), 1, 1);
    vm.lastDayInYear = new Date(date.getFullYear(), 12, 0);
    vm.currentYear = (new Date()).getFullYear();

    vm.globalFromDate = new Date(1, 1, 1900);
    vm.globalToDate = new Date();
    vm.globalDefaultFilter = "year";
    vm.globalFilter = "All";
    vm.showGlobalDropdown = false;
    vm.globalCompareWith = "";

    function updateGlobalFilterDate() {
      vm.fromDate = vm.globalFromDate;
      vm.toDate = vm.globalToDate;
      vm.defaultFilter = vm.globalDefaultFilter;
      vm.contributionFilter = vm.globalFilter;
      vm.showDropdown = false;
      vm.compareWith = vm.globalCompareWith;

      vm.valueFromDate = vm.globalFromDate;
      vm.valueToDate = vm.globalToDate;
      vm.valueDefaultFilter = vm.globalDefaultFilter;
      vm.valueFilter = vm.globalFilter;
      vm.valueShowDropdown = vm.showGlobalDropdown;
      vm.valueCompareWith = vm.globalCompareWith;

      vm.userInfo = UserProfileApi.getUserInfo();
      loadKnowledgeSection();
      loadValueCreationSection();
      loadContributionSection();
      loadValueSection();
      loadPeopleSection();
      loadConnectionSection();
      loadActiveLocations();
      loadRecentActivitySection();
    }
    updateGlobalFilterDate();

    vm.globalFilterDate = function (startDate, endDate, period) {
      vm.globalFromDate = startDate._d;
      vm.globalToDate = endDate._d;

      vm.globalDefaultFilter = period;

      var month = vm.globalFromDate.getMonth() + 1;
      var year = vm.globalFromDate.getFullYear();
      switch (period) {
        case 'month': {
          vm.globalToDate = new Date(year, month, 0);
          vm.globalCompareWith = "last month";
          vm.globalFilter = month + "/" + year;
          break;
        }
        case 'quarter': {
          var quarter = getQuarter(vm.globalFromDate);
          vm.globalToDate = new Date(year, quarter * 3, 0);
          vm.globalCompareWith = "last quarter";
          vm.globalFilter = "Quarter " + quarter;
          break;
        }
        case 'year': {
          vm.globalToDate = new Date(year, 12, 0);
          vm.globalCompareWith = "last year";
          vm.globalFilter = "Year " + year;
          break;
        }
        default:
      }
      vm.showGlobalDropdown = false;
      updateGlobalFilterDate();
    }


    //== Section knowledge ==//
    // load data for knowledge section
    vm.knowledgeSectionObj = {
      total: 0,
      myContributed: 0,
      trendChart: []
    };
    function loadKnowledgeSection() {
      vm.loading = true;
      InsightsApi.overviewKnowledgeData($filter('date')(vm.fromDate, "MM/dd/yyyy"), $filter('date')(vm.toDate, "MM/dd/yyyy")).then(function (data) {
        vm.loading = false;

        vm.knowledgeSectionObj = {
          total: data.total,
          myContributed: data.myContributed,
          trendChart: data.trendChartResponses
        };

        // DRAW CHART
        // process data
        var labels = [];
        var dataNonZero = [];
        var dataZero = [];
        var max = 0;

        for (var i = 0; i < data.trendChartResponses.length; i++) {
          labels.push(data.trendChartResponses[i].key);
          //labels.push('');
          dataNonZero.push(data.trendChartResponses[i].value);
          if (data.trendChartResponses[i].value > max) {
            max = data.trendChartResponses[i].value;
          }
        }

        for (var i = 0; i < dataNonZero.length; i++) {
          dataZero.push((dataNonZero[i] > 0) ? 0 : 30);
        }

        // set datasource
        var data = {
          labels: labels,
          datasets: [{
            backgroundColor: 'rgb(97, 94, 153)',
            data: dataNonZero
          }, {
            backgroundColor: 'rgb(238, 238, 238)',
            data: dataZero
          }]
        };

        // config chart
        var options1 = {
          maintainAspectRatio: false,
          plugins: {
            centerLabel: false   // disable plugin 'centerLabel' for this instance
          },
          cornerRadius: 20,
          legend: { display: false },
          hover: { display: false },
          scales: {
            yAxes: [{
              display: false,
              ticks: {
                max: max,
                min: 0,
              },
            }],
            xAxes: [{
              gridLines: {
                display: false,
                drawBorder: false
              },
              ticks: {
                display: false,
              },
              stacked: true,
              barPercentage: 1,
              categoryPercentage: 0.5,
              position: 'top'
            }]
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                var value = data.datasets[0].data[tooltipItem.index];
                var label = data.labels[tooltipItem.index];

                if (value === 75) {
                  value = 0;
                }

                return label + ': ' + value;
              }
            }
          },
        };


        // draw chart
        try {
          var ctx = $('#Chart1').get(0).getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options1
          });
        } catch (e) {
          console.log(e);
        }

        window.setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }


    //== Section Value Creation ==//
    // load data for Value Creation section
    vm.valueCreationSectionObj = {
      total: 0,
      realizedByMe: 0,
      donutChartResponses: [],
      totalDisplay: ''
    };
    function loadValueCreationSection() {
      vm.loading = true;
      InsightsApi.overviewValueCreationData($filter('date')(vm.fromDate, "MM/dd/yyyy"), $filter('date')(vm.toDate, "MM/dd/yyyy")).then(function (data) {
        vm.loading = false;

        vm.valueCreationSectionObj = {
          total: data.total != null ? data.total : 0,
          totalDisplay: data.total != null ? $scope.kmlFormatter(data.total) : 0,
          realizedByMe: data.realizedByMe != null ? data.realizedByMe : 0,
          realizedByMeDisplay: data.realizedByMe != null ? $scope.kmlFormatter(data.realizedByMe) : 0,
          donutChartResponses: data.donutChartResponses
        };

        var dataInput = [];
        var labelInput = [];
        var colorBackground = [];
        if (vm.valueCreationSectionObj.donutChartResponses != null) {
          for (var i = 0; i < vm.valueCreationSectionObj.donutChartResponses.length; i++) {
            var itemx = vm.valueCreationSectionObj.donutChartResponses[i];
            dataInput.push(itemx.value);
            //labelInput.push('');
            labelInput.push(itemx.name);
            //colorBackground.push(getRandomColor(colorBackground));
            colorBackground.push(vm.arrColor[i]);
          }
        }

        // Chart 7
        // The data for our dataset
        Chart.pluginService.register({
          id: 'centerLabel',
          beforeDraw: function (chart) {
            var width = chart.chart.width,
              height = chart.chart.height,
              ctx = chart.chart.ctx;

            ctx.restore();
            var fontSize = (height / 200).toFixed(2);
            ctx.font = fontSize + "em 'museo_sans',sans-serif";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#444444";

            var text = vm.valueCreationSectionObj.totalDisplay,
              textX = Math.round((width - ctx.measureText(text).width) / 2),
              textY = height / 2;

            ctx.fillText(text, textX, textY);
            ctx.save();
          }
        });
        var data7 = {
          labels: labelInput,
          datasets: [{
            backgroundColor: colorBackground,

            data: dataInput,
            borderWidth: 0,
          }]
        };
        // Configuration options go here
        var options7 = {
          legend: { display: false },
          maintainAspectRatio: false,
        };

        try {
          var ctx7 = $('#Chart7').get(0).getContext('2d');
          new Chart(ctx7, {
            type: 'doughnut',
            data: data7,
            options: options7
          });
        } catch (e) {
          console.log(e);
        }

        window.setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });

      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }

    //== Section Contribution ==//
    // load data for Contribution section
    vm.contributionSectionObj = {};
    function loadContributionSection() {
      vm.loading = true;

      InsightsApi.overviewContributionData($filter('date')(vm.fromDate, "MM/dd/yyyy"), $filter('date')(vm.toDate, "MM/dd/yyyy")).then(function (data) {
        vm.loading = false;
        vm.contributionSectionObj = data;

        if (vm.contributionSectionObj != null) {
          // Chart 2
          // The data for our dataset
          var x2 = vm.contributionSectionObj.currentNewContributionCount != null ? vm.contributionSectionObj.currentNewContributionCount : 0;
          var y2 = vm.contributionSectionObj.previousNewContributionCount != null ? vm.contributionSectionObj.previousNewContributionCount : 0;
          var data2 = {
            datasets: [{
              labels: ['', ''],
              backgroundColor: '#f2f1fa',
              borderWidth: 2,
              borderColor: '#615e99',
              pointRadius: 0,
              data: [y2, x2],
            }]
          };
          // Configuration options go here
          var options2 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: { display: false },
            hover: { display: false },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                display: false,
              }]
            },
          };
          try {
            var ctx2 = $('#Chart2').get(0).getContext('2d');
            new Chart(ctx2, {
              type: 'line',
              data: data2,
              options: options2
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 3
          // The data for our dataset
          var x3 = vm.contributionSectionObj.currentTotalViewCount != null ? vm.contributionSectionObj.currentTotalViewCount : 0;
          var y3 = vm.contributionSectionObj.previousTotalViewCount != null ? vm.contributionSectionObj.previousTotalViewCount : 0;
          var data3 = {
            datasets: [{
              labels: ['', ''],
              backgroundColor: '#f2f1fa',
              borderWidth: 2,
              borderColor: '#615e99',
              pointRadius: 0,
              data: [y3, x3],
            }]
          };
          // Configuration options go here
          var options3 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: { display: false },
            hover: { display: false },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                display: false,
              }]
            },
          };
          try {
            var ctx3 = $('#Chart3').get(0).getContext('2d');
            new Chart(ctx3, {
              type: 'line',
              data: data3,
              options: options3
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 4
          // The data for our dataset
          var x4 = vm.contributionSectionObj.currentTotalShareCount != null ? vm.contributionSectionObj.currentTotalShareCount : 0;
          var y4 = vm.contributionSectionObj.previousTotalShareCount != null ? vm.contributionSectionObj.previousTotalShareCount : 0;
          var data4 = {
            datasets: [{
              labels: ['', ''],
              backgroundColor: '#f2f1fa',
              borderWidth: 2,
              borderColor: '#615e99',
              pointRadius: 0,
              data: [y4, x4],
            }]
          };
          // Configuration options go here
          var options4 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: { display: false },
            hover: { display: false },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                display: false,
              }]
            },
          };
          try {
            var ctx4 = $('#Chart4').get(0).getContext('2d');
            new Chart(ctx4, {
              type: 'line',
              data: data4,
              options: options4
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 5
          // The data for our dataset
          var value = vm.contributionSectionObj.myDepartmentCount != null ? vm.contributionSectionObj.myDepartmentCount.count : 0; // actual value
          var max = vm.contributionSectionObj.totalKdCount != null ? vm.contributionSectionObj.totalKdCount : 0; // max value
          var data = {
            labels: ['My Department'],
            datasets: [{
              data: [value],
              backgroundColor: '#615e99',
            }, {
              data: [max - value],
              backgroundColor: "#eeeeee"
            }]
          };
          // Configuration options go here
          var options = {
            maintainAspectRatio: false,
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
                ticks: {
                  max: max,
                  min: 0,
                },
                stacked: true,
              }],
              yAxes: [{
                display: false,
                stacked: true,
                barThickness: 12,
                categoryPercentage: 1,
              }],
            }
          };
          try {
            var ctx5 = $('#Chart5').get(0).getContext('2d');
            new Chart(ctx5, {
              type: 'horizontalBar',
              data: data,
              options: options
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 6
          // The data for our dataset
          var value1 = vm.contributionSectionObj.top3Department != null && vm.contributionSectionObj.top3Department.length >= 1 ? vm.contributionSectionObj.top3Department[0].count : 0; // actual value 1
          var value2 = vm.contributionSectionObj.top3Department != null && vm.contributionSectionObj.top3Department.length >= 2 ? vm.contributionSectionObj.top3Department[1].count : 0; // actual value 2
          var value3 = vm.contributionSectionObj.top3Department != null && vm.contributionSectionObj.top3Department.length >= 3 ? vm.contributionSectionObj.top3Department[2].count : 0; // actual value 3

          var label1 = vm.contributionSectionObj.top3Department != null && vm.contributionSectionObj.top3Department.length >= 1 ? vm.contributionSectionObj.top3Department[0].name : 0; // actual label 1
          var label2 = vm.contributionSectionObj.top3Department != null && vm.contributionSectionObj.top3Department.length >= 2 ? vm.contributionSectionObj.top3Department[1].name : 0; // actual label 2
          var label3 = vm.contributionSectionObj.top3Department != null && vm.contributionSectionObj.top3Department.length >= 3 ? vm.contributionSectionObj.top3Department[2].name : 0; // actual label 3
          var data6 = {
            labels: [label1, label2, label3],
            datasets: [{
              data: [value1, value2, value3],
              backgroundColor: '#93bfeb',
            }, {
              data: [max - value1, max - value2, max - value3],
              backgroundColor: "#eeeeee"
            }]
          };
          // Configuration options go here
          var options6 = {
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
                ticks: {
                  max: max,
                  min: 0,
                },
                stacked: true,
              }],
              yAxes: [{
                display: false,
                stacked: true,
                barThickness: 12,
                categoryPercentage: 1,
              }],
            }
          };
          try {
            var ctx6 = $('#Chart6').get(0).getContext('2d');
            new Chart(ctx6, {
              type: 'horizontalBar',
              data: data6,
              options: options6
            });
          } catch (e) {
            console.log(e);
          }

        }
        window.setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }
    vm.filterDate = function (startDate, endDate, period) {
      vm.fromDate = startDate._d;
      vm.toDate = endDate._d;

      vm.defaultFilter = period;

      var month = vm.fromDate.getMonth() + 1;
      var year = vm.fromDate.getFullYear();
      switch (period) {
        case 'month': {
          vm.toDate = new Date(year, month, 0);
          vm.compareWith = "last month";
          vm.contributionFilter = month + "/" + year;
          break;
        }
        case 'quarter': {
          var quarter = getQuarter(vm.fromDate);
          vm.toDate = new Date(year, quarter * 3, 0);
          vm.compareWith = "last quarter";
          vm.contributionFilter = "Quarter " + quarter;
          break;
        }
        case 'year': {
          vm.toDate = new Date(year, 12, 0);
          vm.compareWith = "last year";
          vm.contributionFilter = "Year " + year;
          break;
        }
        default:
      }
      vm.showDropdown = false;
      loadContributionSection();
    }


    //== Section Value ==//
    // load data for Value section
    vm.valueSectionObj = {};
    function loadValueSection() {
      vm.loading = true;

      InsightsApi.overviewValueData($filter('date')(vm.valueFromDate, "MM/dd/yyyy"), $filter('date')(vm.valueToDate, "MM/dd/yyyy")).then(function (data) {
        vm.loading = false;
        vm.valueSectionObj = data;

        if (vm.valueSectionObj != null) {
          vm.valueSectionObj.mostReplicatedDisplay = vm.valueSectionObj.mostReplicated != null && vm.valueSectionObj.mostReplicated != 0 ? $scope.kmlFormatter(vm.valueSectionObj.mostReplicated) : 0;
          vm.valueSectionObj.mostValueCreatedDisplay = vm.valueSectionObj.mostValueCreated != null && vm.valueSectionObj.mostValueCreated != 0 ? $scope.kmlFormatter(vm.valueSectionObj.mostValueCreated) : 0;
          // Chart 8
          // The data for our dataset
          var x8 = vm.valueSectionObj.currentReplications != null ? vm.valueSectionObj.currentReplications : 0;
          var y8 = vm.valueSectionObj.previousReplications != null ? vm.valueSectionObj.previousReplications : 0;
          var data8 = {
            datasets: [{
              labels: ['', ''],
              backgroundColor: '#f2f1fa',
              borderWidth: 2,
              borderColor: '#615e99',
              pointRadius: 0,
              data: [y8, x8],
            }]
          };
          // Configuration options go here
          var options8 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: { display: false },
            hover: { display: false },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                display: false,
              }]
            },
          };
          try {
            var ctx8 = $('#Chart8').get(0).getContext('2d');
            new Chart(ctx8, {
              type: 'line',
              data: data8,
              options: options8
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 9
          // The data for our dataset
          var x9 = vm.valueSectionObj.currentValueRealized != null ? vm.valueSectionObj.currentValueRealized : 0;
          var y9 = vm.valueSectionObj.previousValueRealized != null ? vm.valueSectionObj.previousValueRealized : 0;
          var data9 = {
            datasets: [{
              labels: ['', ''],
              backgroundColor: '#f2f1fa',
              borderWidth: 2,
              borderColor: '#615e99',
              pointRadius: 0,
              data: [y9, x9],
            }]
          };
          // Configuration options go here
          var options9 = {
            plugins: {
              centerLabel: false   // disable plugin 'centerLabel' for this instance
            },
            legend: { display: false },
            hover: { display: false },
            scales: {
              yAxes: [{
                display: false,
                ticks: {
                  beginAtZero: true
                }
              }],
              xAxes: [{
                display: false,
              }]
            },
          };
          try {
            var ctx9 = $('#Chart9').get(0).getContext('2d');
            new Chart(ctx9, {
              type: 'line',
              data: data9,
              options: options9
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 10
          // The data for our dataset
          var value = vm.valueSectionObj.myDepartmentValue != null ? vm.valueSectionObj.myDepartmentValue.value : 0; // actual value
          var max = vm.valueSectionObj.totalValue != null ? vm.valueSectionObj.totalValue : 1000000000; // max value

          var data = {
            labels: ['My Department'],
            datasets: [{
              data: [value],
              backgroundColor: '#615e99',
            }, {
              data: [max - value],
              backgroundColor: "#eeeeee"
            }]
          };
          // Configuration options go here
          var options = {
            maintainAspectRatio: false,
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
                ticks: {
                  max: max,
                  min: 0,
                },
                stacked: true,
              }],
              yAxes: [{
                display: false,
                stacked: true,
                barThickness: 12,
                categoryPercentage: 1,
              }],
            }
          };
          try {
            var ctx10 = $('#Chart10').get(0).getContext('2d');
            new Chart(ctx10, {
              type: 'horizontalBar',
              data: data,
              options: options
            });
          } catch (e) {
            console.log(e);
          }

          // Chart 11
          // The data for our dataset
          var value1 = vm.valueSectionObj.top3DepartmentValues != null && vm.valueSectionObj.top3DepartmentValues.length >= 1 ? vm.valueSectionObj.top3DepartmentValues[0].value : 0; // actual value 1
          var value2 = vm.valueSectionObj.top3DepartmentValues != null && vm.valueSectionObj.top3DepartmentValues.length >= 2 ? vm.valueSectionObj.top3DepartmentValues[1].value : 0; // actual value 2
          var value3 = vm.valueSectionObj.top3DepartmentValues != null && vm.valueSectionObj.top3DepartmentValues.length >= 3 ? vm.valueSectionObj.top3DepartmentValues[2].value : 0; // actual value 3

          var label1 = vm.valueSectionObj.top3DepartmentValues != null && vm.valueSectionObj.top3DepartmentValues.length >= 1 ? vm.valueSectionObj.top3DepartmentValues[0].name : 0; // actual label 1
          var label2 = vm.valueSectionObj.top3DepartmentValues != null && vm.valueSectionObj.top3DepartmentValues.length >= 2 ? vm.valueSectionObj.top3DepartmentValues[1].name : 0; // actual label 2
          var label3 = vm.valueSectionObj.top3DepartmentValues != null && vm.valueSectionObj.top3DepartmentValues.length >= 3 ? vm.valueSectionObj.top3DepartmentValues[2].name : 0; // actual label 3

          
          var max11 = ((value1 + value2 + value3) + 1000); // max value
          
          var data11 = {
            labels: [label1, label2, label3],
            datasets: [{
              data: [value1, value2, value3],
              backgroundColor: '#93bfeb',
            }, {
              data: [max11 - value1, max11 - value2, max11 - value3],
              backgroundColor: "#eeeeee"
            }]
          };
          // Configuration options go here
          var options11 = {
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
                ticks: {
                  max: max11,
                  min: 0,
                },
                stacked: true,
              }],
              yAxes: [{
                display: false,
                stacked: true,
                barThickness: 12,
                categoryPercentage: 1,
              }],
            }
          };
          try {
            var ctx11 = $('#Chart11').get(0).getContext('2d');
            new Chart(ctx11, {
              type: 'horizontalBar',
              data: data11,
              options: options11
            });
          } catch (e) {
            console.log(e);
          }

        }
      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }
    vm.valueFilterDate = function (startDate, endDate, period) {
      vm.valueFromDate = startDate._d;
      vm.valueToDate = endDate._d;

      vm.valueDefaultFilter = period;

      var month = vm.valueFromDate.getMonth() + 1;
      var year = vm.valueFromDate.getFullYear();
      switch (period) {
        case 'month': {
          vm.valueToDate = new Date(year, month, 0);
          vm.valueCompareWith = "last month";
          vm.valueFilter = month + "/" + year;
          break;
        }
        case 'quarter': {
          var quarter = getQuarter(vm.valueFromDate);
          vm.valueToDate = new Date(year, quarter * 3, 0);
          vm.valueCompareWith = "last quarter";
          vm.valueFilter = "Quarter " + quarter;
          break;
        }
        case 'year': {
          vm.valueToDate = new Date(year, 12, 0);
          vm.valueCompareWith = "last year";
          vm.valueFilter = "Year " + year;
          break;
        }
        default:
      }
      vm.valueShowDropdown = false;
      loadValueSection();

    }


    //== Section People ==//
    // load data for People section
    vm.peopleSectionObj = {};
    function loadPeopleSection() {
      vm.loading = true;

      InsightsApi.overviewPeopleData().then(function (data) {
        vm.loading = false;
        vm.peopleSectionObj = data;

        window.setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }

    //== Section Connection ==//
    // load data for Connection section
    vm.connectionSectionObj = {};
    function loadConnectionSection() {
      vm.loading = true;

      InsightsApi.overviewConnectionData().then(function (data) {
        vm.loading = false;
        vm.connectionSectionObj = data;
        window.setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }

    //== Section Active Locations ==//
    // load data for Active Locations section
    function loadActiveLocations() {
      $scope.loading = true;
      InsightsApi.getActiveLocation().then(function (data) {
        var postData = [];
        _.each(data, function (d, dIndex) {
          postData.push(d.id);
        });
        InsightsApi.getLocationOnMap(postData).then(function (response) {
          $scope.loading = false;
          if (response != null) {
            var mapData = [];
            _.each(response, function (x, xIndex) {
              if (x.location != null && x.location.latitude != null && x.location.longitude != null) {
                mapData.push({
                  id: x.value,
                  value: '2',
                  location: [x.location.latitude, x.location.longitude]
                });
              }
            });
            createMap(mapData);
          }
        }, function (error) {
          $scope.loading = false;
          console.log(error);
        });
      }, function (error) {
        $scope.loading = false;
        console.log(error);
      });
    }



    function createMap(data) {
      var activeShape;

      var maxObjValue = _.maxBy(data, function (o) { return parseInt(o.value); });

      //var maxSize = 50;
      //if (maxObjValue.value < 20) {
      //  maxSize = 20;
      //} else if (maxObjValue.value > 20 && maxObjValue.value < 30) {
      //  maxSize = 30;
      //}

      var maxSize = 10;
      vm.loadActiveLocationDetail = null;
      vm.isLoadMap = false;

      $("#map2").kendoMap({
        center: [4.2105, 101.9758],
        minZoom: 3,
        zoom: 4,
        wraparound: false,
        layerDefaults: {
          bubble: {
            maxSize: maxSize
          }
        },
        layers: [{
          type: "tile",
          urlTemplate: "https://tile.thunderforest.com/transport/#= zoom #/#= x #/#= y #.png?apikey=8373a9f2422b42ea8852bebb8a602fca",
          subdomains: ["a", "b", "c"],
        }, {
          type: "bubble",
          style: {
            fill: {
              color: "#00f",
              opacity: 0.4
            },
            stroke: {
              width: 0
            }
          },
          dataSource: {
            data: data
          },
          locationField: "location",
          valueField: "value"
        }],
        shapeClick: onShapeMouseEnter,
        reset: onShapeMouseLeave,
        pan: onShapeMouseLeave,
        panEnd: onShapeMouseLeave,
        zoomStart: onShapeMouseLeave,
        zoomEnd: onShapeMouseLeave
      });

      function onShapeMouseEnter(e) {
        if (activeShape) {
          activeShape.options.set("stroke", null);
        }
        activeShape = e.shape;
        activeShape.options.set("stroke", { width: 1.5, color: "#00f" });
        loadActiveLocationDetail(activeShape.dataItem.id);
      }
      function onShapeMouseLeave() {
        try {
          vm.loadActiveLocationDetail = null;
          $('.map-tooltip').css('display', 'none');
          activeShape.options.set("stroke", { width: 0, color: "#00f" });
          activeShape = null;
        } catch (e) {

        }
      }
      $scope.onShapeMouseLeave = function () {
        vm.loadActiveLocationDetail = null;
        $('.map-tooltip').css('display', 'none');
        activeShape.options.set("stroke", { width: 0, color: "#00f" });
        activeShape = null;
      }
    }

    var lastMouseX, lastMouseY;
    $(document).on("mousemove", function (e) {
      lastMouseX = e.pageX;
      lastMouseY = e.pageY;
    });

    function loadActiveLocationDetail(id) {
      vm.isLoadMap = true;
      vm.loadActiveLocationDetail = null;
      InsightsApi.getActiveLocationDetail(id).then(function (data) {
        vm.isLoadMap = false;
        vm.loadActiveLocationDetail = data;
        window.setTimeout(function () {
          var locationOffsetTop = $('.xlocation').offset().top;
          var locationOffsetLeft = $('.xlocation').offset().left;
          $('.map-tooltip').css({ 'left': (lastMouseX - locationOffsetLeft) + 'px', 'top': (lastMouseY - (locationOffsetTop - 168)) + 'px' });
          window.setTimeout(function () {
            $('.map-tooltip').css('display', 'block');
          }, 300);
        });
      }, function (error) {
        vm.isLoadMap = false;
        console.log(error);
      });
    }

    //== Section Recent Activity ==//
    // load data for Recent Activity section
    vm.recentActivitySectionObj = {};
    function loadRecentActivitySection() {
      vm.loading = true;

      InsightsApi.overviewRecentActivitieData().then(function (data) {
        vm.loading = false;
        vm.recentActivitySectionObj = data;
        window.setTimeout(function () {
          $('[data-toggle="tooltip"]').tooltip();
        });
      }, function (error) {
        vm.loading = false;
        console.log(error);
      });
    }


    // Common function
    function getRandomColor(arrColor) {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      if (arrColor.indexOf(color) > -1) {
        return getRandomColor(arrColor);
      }
      return color;
    }
    function getQuarter(date) {
      var quarter = Math.floor((date.getMonth() + 3) / 3);
      return quarter;
    }
    $scope.kmlFormatter = function (num) {
      var result = num > 999 ? (num / 1000).toFixed(3) + 'k' : num;
      if (num >= 1000000000) {
        return (num / 1000000000).toFixed(2) + 'b';
      } else {
        if (num >= 1000000) {
          return (num / 1000000).toFixed(2) + 'm';
        } else {
          if (num >= 1000) {
            return (num / 1000).toFixed(2) + 'k';
          } else {
            return num;
          }
        }
      }

      return result;
    }
    vm.dateCreatedFormat = function (str) {
      try {
        var date = new Date(str);
        var seconds = Math.floor((new Date() - date) / 1000);

        var interval = Math.floor(seconds / 31536000);

        if (interval > 1) {
          return interval + " years ago";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
          return interval + " months ago";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
          return interval + " days ago";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
          return interval + " hours ago";
        }
        interval = Math.floor(seconds / 60);
        if (interval > 1) {
          return interval + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
      } catch (e) {
        return str;
      }
    }

    $scope.goAllKnowledge = function () {
      $state.go('app.knowledgeDiscovery.allKnowledge');
    }

    $scope.viewAll = function (fromDate, toDate, item) {
      var filter = {
        Departments: []
      }
      if (item) {
        filter.Departments.push({
          name: item.name,
          id: item.departmentId
        });
      }
      InsightsCommonService.applyFilter(
        $filter('date')(fromDate, "yyyy-MM-dd"),
        $filter('date')(toDate, "yyyy-MM-dd"),
        null,
        filter);
    }

    $scope.exportPDF = function (element, fileName) {
      InsightsCommonService.exportPDF(element, fileName);
    }

    // DatNT38 - Remove date filter
    vm.removeFilter = function (type) {
      switch (type) {
        case 'global': {
          vm.globalFromDate = new Date(1, 1, 1900);
          vm.globalToDate = new Date();
          vm.globalDefaultFilter = "year";
          vm.globalFilter = "All";
          vm.showGlobalDropdown = false;
          vm.globalCompareWith = "";
          updateGlobalFilterDate();
          break;
        }
        case 'contribution': {
          vm.fromDate = new Date(1, 1, 1900);
          vm.toDate = new Date();
          vm.defaultFilter = "year";
          vm.contributionFilter = "All";
          vm.showDropdown = false;
          vm.compareWith = "";
          loadContributionSection();
          break;
        }
        case 'value': {
          vm.valueFromDate = new Date(1, 1, 1900);
          vm.valueToDate = new Date();
          vm.valueDefaultFilter = "year";
          vm.valueFilter = "All";
          vm.valueShowDropdown = false;
          vm.valueCompareWith = "";
          loadValueSection();
          break;
        }
      }

      $(".range_filter").find('.start-date:first').removeClass('start-date');
    }
  }

})();
