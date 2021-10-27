/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('app.home')
    .directive('skillDonutChart', skillDonutChart);

  /** @ngInject */
  function skillDonutChart() {
    return {
      restrict: 'AE',
      scope: {
        chartId: "@",
        data: "="
      },
      controller: function ($scope) {
        $scope.$watch('data', function (newVal, oldVal) {
          if (!_.isEmpty(newVal)) {
            draw(newVal);
          }
        });

        function draw(myDatas) {
          var width = 135,
            height = 50,
            radius = Math.min(width, height) / 2;

          var color = d3.scale.ordinal()
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

          var arc = d3.svg.arc()
            .outerRadius(radius - 0)
            .innerRadius(radius - 10);

          var pie = d3.layout.pie()
            .sort(null)
            .padAngle(.02)
            .value(function (d) { return d.value; });

          var div = d3.select("body").append("div").attr("class", "toolTip");

          var svg = d3.select("svg[chart-id='" + $scope.chartId + "']")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

          var g = svg.selectAll(".arc")
            .data(pie(myDatas))
            .enter().append("g")
            .attr("class", "arc");

          g.append("path")
            .attr("d", arc)
            .style("fill", function (d) { return '#fff'; })
            .on('mouseover', function (d) {
              div.style("left", d3.event.pageX + 10 + "px");
              div.style("top", d3.event.pageY - 25 + "px");
              div.style("display", "inline-block");
              div.html((d.data.name) + "<br>" + (d.data.value));
            })
            .on('mouseout', function (d) {
              div.style("display", "none");
            });
        }
      },
      template: '<svg chart-id={{chartId}}></svg>',
    };
  }
})();
