/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('app.home')
        .directive('skillBarChart', skillBarChart);

    /** @ngInject */
    function skillBarChart() {
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
                    var svg = d3.select("svg[chart-id='" + $scope.chartId + "']"),
                        margin = { top: 5, right: 5, bottom: 5, left: 5 },
                        width = +svg.attr("width") - margin.left - margin.right,
                        height = +svg.attr("height") - margin.top - margin.bottom;

                    var x = d3.scale.ordinal().rangeRoundBands([0, width], .5);
                    var y = d3.scale.linear().range([height, 0]);
                    var tip = d3.tip()
                        .attr('class', 'd3-tip')
                        .offset([-10, 0])
                        .html(function (d) {
                            return d.name + ", " + d.year + " (" + d.value + ")";
                        });
                    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                    svg.call(tip);
                    x.domain(myDatas.map(function (d) { return d.name; }));
                    y.domain([0, d3.max(myDatas, function (d) { return d.value; })]);

                    g.selectAll(".bar")
                        .data(myDatas)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function (d) { return x(d.name); })
                        .attr("y", function (d) { return y(d.value); })
                        .attr("width", 5)
                        .attr("height", function (d) {
                            var hvalue = height - y(d.value);
                            if (hvalue > 0 && hvalue < 1) hvalue = 1;
                            return hvalue;
                        })
                        .on('mouseover', tip.show)
                        .on('mouseout', tip.hide);
                }
            },
            template: '<svg chart-id={{chartId}} width="135" height="50"></svg>',
        };
    }
})();
