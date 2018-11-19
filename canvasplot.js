"use strict";
exports.__esModule = true;
var d3 = require("d3");
var CanvasDataPlot = /** @class */ (function () {
    function CanvasDataPlot(parentElement, canvasDimensions, config) {
        if (config === void 0) { config = {}; }
        this.parent = parentElement;
        this.canvasDimensions = canvasDimensions;
        this.config = config;
        this.data = [];
        this.dataIDs = [];
        this.dataLabels = [];
        this.displayIndexStart = [];
        this.displayIndexEnd = [];
        this.dataColors = [];
        this.xAxisLabelText = config.xAxisLabel || "";
        this.yAxisLabelText = config.yAxisLabel || "";
        this.updateViewCallback = config.updateViewCallback || null;
        this.disableLegend = config.disableLegend || false;
        this.invertYAxis = config.invertYAxis || false;
        this.gridColor = config.gridColor || "#DFDFDF";
        this.markerLineWidth = config.markerLineWidth || 1;
        this.markerRadius = config.markerRadius || 3.0;
        this.xTicksPerPixel = config.xTicksPerPixel || 1.0 / 92.0;
        this.yTicksPerPixel = config.yTicksPerPixel || 1.0 / 40.0;
        this.minCancasWidth = config.minCancasWidth || 250;
        this.minCancasHeigth = config.minCancasHeigth || 150;
        this.legendMargin = config.legendMargin || 10;
        this.legendXPadding = config.legendXPadding || 5;
        this.legendYPadding = config.legendYPadding || 6;
        this.legendLineHeight = config.legendLineHeight || 11;
        this.margin = config.plotMargins || { top: 20, right: 20, bottom: (this.xAxisLabelText.length > 0 ? 60 : 30),
            left: (this.yAxisLabelText.length > 0) ? 65 : 50 };
        this.showToolstips = (config.hasOwnProperty("showTooltips") ? config.showToolstips : true);
        this.tooltipRadiusSquared = config.tooltipRadius || 5.5;
        this.tooltipRadiusSquared *= this.tooltipRadiusSquared;
        this.totalWidth = Math.max(this.minCancasWidth, canvasDimensions[0]);
        this.totalHeight = Math.max(this.minCancasHeigth, canvasDimensions[1]);
        this.width = this.totalWidth - this.margin.left - this.margin.right;
        this.height = this.totalHeight - this.margin.top - this.margin.bottom;
        this.zoomListener = d3.zoom().on("zoom", this.zoomFunction);
        this.parent.append("div");
        this.parent.setAttribute("class", "cvpChart");
        this.parent.style.width = this.totalWidth + "px";
        this.parent.style.height = this.totalHeight + "px";
        this.div = this.parent;
        this.div.append("canvas");
        this.div.setAttribute("class", "cvpCanvas");
        this.div.style.width = this.width + "px";
        this.div.style.height = this.height + "px";
        this.div.style.padding = this.margin.top + "px " + this.margin.bottom + "px " + this.margin.left + "px";
        this.d3Canvas = this.div;
        this.canvas = this.d3Canvas.getContext("2d");
    }
    //coming soon...
    CanvasDataPlot.prototype.zoomFunction = function () { };
    return CanvasDataPlot;
}());
exports.CanvasDataPlot = CanvasDataPlot;
