(function () {
    'use strict';

    angular
        .module('app.home')
        .factory('ChartService', ChartService);

    /** @ngInject */
    function ChartService() {
        var service = {};
        service.draw = function (canvasOptions, data) {
            var myCanvas = document.getElementById(canvasOptions.elementId);
            myCanvas.width = canvasOptions.width;
            myCanvas.height = canvasOptions.height;
            var ctx = myCanvas.getContext("2d");
            function drawBar(ctx, upperLeftCornerX, upperLeftCornerY, width, height, color) {
                ctx.save();
                ctx.fillStyle = color;
                ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
                ctx.restore();
            }
            function drawLine(ctx, startX, startY, endX, endY, color) {
                ctx.save();
                ctx.strokeStyle = color;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                ctx.restore();
            }

            $("#" + canvasOptions.elementId).mousemove(function (e) { handleMouseMove(e); });

            function handleMouseMove(e) {
                var mouseX = parseInt(e.clientX - e.offsetX);
                var mouseY = parseInt(e.clientY - e.offsetY);
                console.log(mouseX + ' - ' + mouseY);
            }

            var barChart = function (options) {
                this.options = options;
                this.canvas = options.canvas;
                this.ctx = this.canvas.getContext("2d");

                this.draw = function () {
                    var maxValue = 0;
                    for (var categ in this.options.data) {
                        maxValue = Math.max(maxValue, this.options.data[categ]);
                    }
                    var canvasActualHeight = this.canvas.height - this.options.padding * 2;
                    var canvasActualWidth = this.canvas.width - this.options.padding * 2;

                    //drawing the grid lines
                    var gridValue = 0;
                    while (gridValue <= maxValue) {
                        var gridY = canvasActualHeight * (1 - gridValue / maxValue) + this.options.padding;
                        this.ctx.save();
                        this.ctx.restore();
                        gridValue += this.options.gridScale;
                    }

                    //drawing the bars
                    var barIndex = 0;
                    var numberOfBars = Object.keys(this.options.data).length;
                    // var barSize = (canvasActualWidth) / numberOfBars;
                    var barSize = 5;
                    for (categ in this.options.data) {
                        var val = this.options.data[categ];
                        var barHeight = Math.round(canvasActualHeight * val / maxValue);
                        drawBar(
                            this.ctx,
                            this.options.padding + barIndex * barSize,
                            this.canvas.height - barHeight - this.options.padding,
                            barSize,
                            barHeight,
                            "#FFF"
                        );
                        barIndex++;
                        // drawBar(this.ctx, 0, 0, 0, barHeight, "#00a19c");
                        drawBar(this.ctx, 0, 0, 0, 100, "#FFF");
                        barIndex++;
                    }
                }
            }

            new barChart(
                 {
                     canvas: myCanvas,
                     seriesName: "",
                     padding: 10,
                     gridScale: 10,
                     gridColor: "",
                     data: data
                 }).draw();
        }
        return service;
    }
})();