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
        this.minCanvasWidth = config.minCanvasWidth || 250;
        this.minCanvasHeight = config.minCanvasHeight || 150;
        this.legendMargin = config.legendMargin || 10;
        this.legendXPadding = config.legendXPadding || 5;
        this.legendYPadding = config.legendYPadding || 6;
        this.legendLineHeight = config.legendLineHeight || 11;
        this.margin = config.plotMargins || { top: 20, right: 20, bottom: (this.xAxisLabelText.length > 0 ? 60 : 30),
            left: (this.yAxisLabelText.length > 0) ? 65 : 50 };
        this.showToolstips = (config.hasOwnProperty("showTooltips") ? config.showToolstips : true);
        this.tooltipRadiusSquared = config.tooltipRadius || 5.5;
        this.tooltipRadiusSquared *= this.tooltipRadiusSquared;
        this.totalWidth = Math.max(this.minCanvasWidth, canvasDimensions[0]);
        this.totalHeight = Math.max(this.minCanvasHeight, canvasDimensions[1]);
        this.width = this.totalWidth - this.margin.left - this.margin.right;
        this.height = this.totalHeight - this.margin.top - this.margin.bottom;
        this.zoomListener = d3.zoom().on("zoom", this.zoomFunction);
        //Append to the selected HTMLElement a div with the listed properties
        this.div = this.parent.append("div")
            .attr("class", "cvpChart")
            .style("width", this.totalWidth + "px")
            .style("width", this.totalHeight + "px");
        this.d3Canvas = this.div.append("canvas")
            .attr("class", "cvpCanvas")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("padding", this.margin.top + "px " + this.margin.right + "px " + this.margin.bottom + "px " + this.margin.left + "px");
        this.canvas = this.d3Canvas.node().getContext("2d");
        this.svg = this.div.append("svg")
            .attr("class", "cvpSVG")
            .attr("width", this.totalWidth)
            .attr("height", this.totalHeight);
        this.svgTranslateGroup = this.svg.append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
        this.xScale = null;
        this.yScale = null;
        this.xAxis = null;
        this.yAxis = null;
        this.yAxisGroup = this.svgTranslateGroup.append("g")
            .attr("class", "y cvpAxis")
            .call(this.yAxis);
        this.xAxisGroup = this.svgTranslateGroup.append("g")
            .attr("class", "x cvpAxis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis);
        this.xAxisLabel = null;
        this.yAxisLabel = null;
        if (this.xAxisLabelText.length > 0) {
            this.xAxisLabel = this.svgTranslateGroup.append("text")
                .attr("class", "cvpLabel")
                .attr("x", Math.round(0.5 * this.width))
                .attr("y", this.height + 40)
                .attr("text-anchor", "middle")
                .text(this.xAxisLabelText);
        }
        if (this.yAxisLabelText.length > 0) {
            this.yAxisLabel = this.svg.append("text")
                .attr("class", "cvpLabel")
                .attr("x", Math.round(-0.5 * this.height - this.margin.top))
                .attr("y", 15)
                .attr("transform", "rotate(-90)")
                .attr("text-anchor", "middle")
                .text(this.yAxisLabelText);
        }
        this.tooltip = null;
        this.legend = null;
        this.legendBG = null;
        this.legendWidth = 0;
        if (this.showTooltips) {
            //define updateTooltip later
            //this.div.on("mousemove", (this.updateTooltip).bind(this));
        }
        this.xAxisZoom = true;
        this.yAxisZoom = true;
        /*this.resetZoomListenerAxes();
        setupXScaleAndAxis(): void{};
        setupYScaleAndAxis(): void{};
        drawCanvas(): void {};
        
        */
    }
    // to be implement later
    CanvasDataPlot.prototype.zoomFunction = function () { };
    CanvasDataPlot.prototype.drawCanvas = function () { };
    ;
    CanvasDataPlot.prototype.updateLegend = function () { };
    ;
    CanvasDataPlot.prototype.updateDisplayIndices = function () { };
    ;
    CanvasDataPlot.prototype.resetZoomListenerAxes = function () { };
    ;
    CanvasDataPlot.prototype.redrawCanvasAndAxes = function () { };
    ;
    CanvasDataPlot.prototype.addDataSet = function (uniqueID, label, dataSet, colorString, updateDomains, copyData) {
        this.dataIDs.push(uniqueID);
        this.dataLabels.push(label);
        this.dataColors.push(colorString);
        this.displayIndexStart.push(0);
        this.displayIndexEnd.push(0);
        dataSet = dataSet || [];
        if (copyData) {
            var dataIndex = this.data.length;
            this.data.push([]);
            var dataSetLength = dataSet.length;
            for (var i = 0; i < dataSetLength; ++i) {
                var sliceData = jQuery.extend(true, {}, dataSet[i]); //deep copy --> arr.slice(0)
                this.data[dataIndex].push(sliceData);
            }
        }
        else {
            this.data.push(dataSet);
        }
        this.updateLegend();
        if (updateDomains) {
            this.updateDomains(this.calculateXDomain(), this.calculateYDomain(), true);
        }
        else {
            this.updateDisplayIndices();
            this.drawCanvas();
        }
    };
    CanvasDataPlot.prototype.addDataPoint = function (uniqueID, dataPoint, updateDomains, copyData) {
        var i = this.dataIDs.indexOf(uniqueID);
        if (i < 0 || (this.data[i].length > 0 && this.data[i][this.data[i].length - 1][0] > dataPoint[0])) {
            return;
        }
        this.data[i].push(copyData ? jQuery.extend(true, {}, dataPoint) : dataPoint);
        if (updateDomains) {
            this.updateDomains(this.calculateXDomain(), this.calculateYDomain(), true);
        }
        else {
            this.updateDisplayIndices();
            this.drawCanvas();
        }
    };
    CanvasDataPlot.prototype.removeDataSet = function (uniqueID) {
        var index = this.dataIDs.indexOf(uniqueID);
        if (index >= 0) {
            this.data.splice(index, 1);
            this.dataIDs.splice(index, 1);
            this.dataLabels.splice(index, 1);
            this.displayIndexStart.splice(index, 1);
            this.displayIndexEnd.splice(index, 1);
            this.dataColors.splice(index, 1);
            this.updateLegend();
            this.drawCanvas();
        }
    };
    CanvasDataPlot.prototype.setZoomXAxis = function (zoomX) {
        if (this.xAxisZoom == zoomX) {
            return;
        }
        this.xAxisZoom = zoomX;
        this.resetZoomListenerAxes();
    };
    CanvasDataPlot.prototype.setZoomYAxis = function (zoomY) {
        if (this.yAxisZoom == zoomY) {
            return;
        }
        this.yAxisZoom = zoomY;
        this.resetZoomListenerAxes();
    };
    CanvasDataPlot.prototype.resize = function (dimensions) {
        this.totalWidth = Math.max(this.minCanvasWidth, dimensions[0]);
        this.totalHeight = Math.max(this.minCanvasHeight, dimensions[1]);
        this.width = this.totalWidth - this.margin.left - this.margin.right;
        this.height = this.totalHeight - this.margin.top - this.margin.bottom;
        this.div.style("width", this.totalWidth + "px")
            .style("height", this.totalHeight + "px");
        this.d3Canvas.attr("width", this.width)
            .attr("height", this.height);
        this.svg.attr("width", this.totalWidth)
            .attr("height", this.totalHeight);
        //check this if something going wrong with the scale
        this.xScale = d3.scaleLinear().range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);
        this.xAxis
            .ticks(Math.round(this.xTicksPerPixel * this.width));
        this.yAxis
            .ticks(Math.round(this.yTicksPerPixel * this.height));
        this.xAxisGroup
            .attr("transform", "translate(0," + this.height + ")");
        if (this.xAxisLabel) {
            this.xAxisLabel
                .attr("x", Math.round(0.5 * this.width))
                .attr("y", this.height + 40);
        }
        if (this.yAxisLabel) {
            this.yAxisLabel
                .attr("x", Math.round(-0.5 * this.height - this.margin.top));
        }
        if (this.legend) {
            this.legend
                .attr("transform", "translate(" + (this.width - this.legendWidth - this.legendMargin) + ", " + this.legendMargin + ")");
        }
        this.updateDisplayIndices();
        this.resetZoomListenerAxes();
        this.redrawCanvasAndAxes();
    };
    CanvasDataPlot.prototype.updateDomains = function (xDomain, yDomain, makeItNice) {
        this.xScale = d3.scaleLinear().domain(xDomain);
        this.yScale = d3.scaleLinear().domain(yDomain);
        if (makeItNice) {
            this.xScale = d3.scaleLinear().nice();
            this.yScale = d3.scaleLinear().nice();
        }
        this.updateDisplayIndices();
        this.resetZoomListenerAxes();
        this.redrawCanvasAndAxes();
    };
    CanvasDataPlot.prototype.getXDomain = function () {
        return this.xScale.domain();
    };
    CanvasDataPlot.prototype.getYDomain = function () {
        return this.yScale.domain();
    };
    CanvasDataPlot.prototype.calculateXDomain = function () {
        var nonEmptySets = [];
        this.data.forEach(function (ds) {
            if (ds && ds.length > 0) {
                nonEmptySets.push(ds);
            }
        });
        if (nonEmptySets.length < 1) {
            return [0, 1];
        }
        var min = nonEmptySets[0][0][0];
        var max = nonEmptySets[0][nonEmptySets[0].length - 1][0];
        for (var i = 1; i < nonEmptySets.length; ++i) {
            var minCandidate = nonEmptySets[i][0][0];
            var maxCandidate = nonEmptySets[i][nonEmptySets[i].length - 1][0];
            min = minCandidate < min ? minCandidate : min;
            max = max < maxCandidate ? maxCandidate : max;
        }
        if (max - min <= 0) {
            min = 1 * max; //NOTE: 1* is neceseccary to handle Dates in derived classes.
            max = min + 1;
        }
        return [min, max];
    };
    //data : Array<Array<[number, number]>>;
    CanvasDataPlot.prototype.calculateYDomain = function () {
        var nonEmptySets = [];
        this.data.forEach(function (ds) {
            if (ds && ds.length > 0) {
                nonEmptySets.push(ds);
            }
        });
        if (nonEmptySets.length < 1) {
            return [0, 1];
        }
        var min = d3.min(nonEmptySets[0], function (d) { return d[1]; });
        var max = d3.max(nonEmptySets[0], function (d) { return d[1]; });
        for (var i = 1; i < nonEmptySets.length; ++i) {
            min = Math.min(min, d3.min(nonEmptySets[i], function (d) { return d[1]; }));
            max = Math.max(max, d3.max(nonEmptySets[i], function (d) { return d[1]; }));
        }
        if (max - min <= 0) {
            min = max - 1;
            max += 1;
        }
        return [min, max];
    };
    CanvasDataPlot.prototype.destroy = function () {
        this.div.remove();
    };
    CanvasDataPlot.prototype.setupXScaleAndAxis = function () {
        this.xScale = d3.scaleLinear()
            .domain(this.calculateXDomain())
            .range([0, this.width])
            .nice();
        this.xAxis = d3.axisBottom(this.xScale)
            .ticks(Math.round(this.xTicksPerPixel * this.width));
    };
    CanvasDataPlot.prototype.setupYScaleAndAxis = function () {
        this.yScale = d3.scaleLinear()
            .domain(this.calculateYDomain())
            .range(this.invertYAxis ? [0, this.height] : [this.height, 0])
            .nice();
        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(Math.round(this.yTicksPerPixel * this.height));
    };
    // check return type later ..
    CanvasDataPlot.prototype.getDataID = function (index) {
        return (this.dataIDs.length > index ? String(this.dataIDs[index]) : "");
    };
    CanvasDataPlot.prototype.updateTooltip = function () {
        var mouse = d3.mouse(this.div.node());
        var mx = mouse[0] - this.margin.left;
        var my = mouse[1] - this.margin.top;
        if (mx <= 0 || mx >= this.width || my <= 0 || my >= this.height) {
            this.removeTooltip();
            return;
        }
        var nDataSets = this.data.length;
        var hitMarker = false;
        CanvasDataPlot_updateTooltip_graph_loop: for (var i = 0; i < nDataSets; ++i) {
            var d = this.data[i];
            var iStart = this.displayIndexStart[i];
            var iEnd = Math.min(d.length - 1, this.displayIndexEnd[i] + 1);
            for (var j = iStart; j <= iEnd; ++j) {
                var dx = this.xScale(d[j][0]) - mx;
                var dy = this.yScale(d[j][1]) - my;
                if (dx * dx + dy * dy <= this.tooltipRadiusSquared) {
                    hitMarker = true;
                    this.showTooltip([this.xScale(d[j][0]), this.yScale(d[j][1])], this.dataColors[i], this.getTooltipStringX(d[j]), this.getTooltipStringY(d[j]));
                    break CanvasDataPlot_updateTooltip_graph_loop;
                }
            }
        }
        if (!hitMarker) {
            this.removeTooltip();
        }
    };
    CanvasDataPlot.prototype.getTooltipStringX = function (dataPoint) {
        return "x = " + dataPoint[0];
    };
    CanvasDataPlot.prototype.getTooltipStringY = function (dataPoint) {
        return "y = " + dataPoint[1];
    };
    CanvasDataPlot.prototype.showTooltip = function (position, color, xText, yText) {
        if (this.tooltip) {
            this.tooltip.remove();
            this.tooltip = null;
        }
        this.tooltip = this.svgTranslateGroup.append("g")
            .attr("class", "cvpTooltip")
            .attr("transform", "translate(" + position[0] + ", " + (position[1] - this.markerRadius - 2) + ")");
        var tooltipBG = this.tooltip.append("path")
            .attr("class", "cvpTooltipBG")
            .attr("d", "M0 0 L-10 -10 L-100 -10 L-100 -45 L100 -45 L100 -10 L10 -10 Z")
            .attr("stroke", color)
            .attr("vector-effect", "non-scaling-stroke");
        var xTextElem = this.tooltip.append("text")
            .attr("x", 0)
            .attr("y", -32)
            .attr("text-anchor", "middle")
            .text(xText);
        var yTextElem = this.tooltip.append("text")
            .attr("x", 0)
            .attr("y", -15)
            .attr("text-anchor", "middle")
            .text(yText);
        var nodeX = xTextElem.node(); //using assertion
        var nodeY = yTextElem.node();
        tooltipBG.attr("transform", "scale(" + (1.1 * Math.max(nodeX.getComputedTextLength(), nodeY.getComputedTextLength()) / 200) + ",1)");
    };
    CanvasDataPlot.prototype.removeTooltip = function () {
        if (!this.tooltip) {
            return;
        }
        this.tooltip.remove();
        this.tooltip = null;
    };
    return CanvasDataPlot;
}());
exports.CanvasDataPlot = CanvasDataPlot;
