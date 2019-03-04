import * as d3 from 'd3';
export class CanvasDataPlot {
    constructor(parentElement, canvasDimensions, config = {}) {
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
            .style("height", this.totalHeight + "px");
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
        this.setupXScaleAndAxis();
        this.setupYScaleAndAxis();
        this.yAxisGroup = this.svgTranslateGroup.append("g")
            .attr("class", "y axis")
            .call(this.yAxis);
        this.xAxisGroup = this.svgTranslateGroup.append("g")
            .attr("class", "x axis")
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
            this.div.on("mousemove", (this.updateTooltip).bind(this));
        }
        this.xAxisZoom = true;
        this.yAxisZoom = true;
        this.drawCanvas();
        this.resetZoomListenerAxes();
    }
    // to be implement later
    zoomFunction() { }
    addDataSet(uniqueID, label, dataSet, colorString, updateDomains, copyData) {
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
    }
    addDataPoint(uniqueID, dataPoint, updateDomains, copyData) {
        let i = this.dataIDs.indexOf(uniqueID);
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
    }
    removeDataSet(uniqueID) {
        let index = this.dataIDs.indexOf(uniqueID);
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
    }
    setZoomXAxis(zoomX) {
        if (this.xAxisZoom == zoomX) {
            return;
        }
        this.xAxisZoom = zoomX;
        this.resetZoomListenerAxes();
    }
    setZoomYAxis(zoomY) {
        if (this.yAxisZoom == zoomY) {
            return;
        }
        this.yAxisZoom = zoomY;
        this.resetZoomListenerAxes();
    }
    resize(dimensions) {
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
    }
    updateDomains(xDomain, yDomain, makeItNice) {
        this.xScale = d3.scaleLinear().domain(xDomain);
        this.yScale = d3.scaleLinear().domain(yDomain);
        if (makeItNice) {
            this.xScale = d3.scaleLinear().nice();
            this.yScale = d3.scaleLinear().nice();
        }
        this.updateDisplayIndices();
        this.resetZoomListenerAxes();
        this.redrawCanvasAndAxes();
    }
    getXDomain() {
        return this.xScale.domain();
    }
    getYDomain() {
        return this.yScale.domain();
    }
    calculateXDomain() {
        let nonEmptySets = [];
        this.data.forEach(ds => {
            if (ds && ds.length > 0) {
                nonEmptySets.push(ds);
            }
        });
        if (nonEmptySets.length < 1) {
            //return [new Date("2019-02-24"), new Date()]; 
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
            min.setTime((1000 * 60 * 60 * 24) * max.getTime());
            max.setTime(min.getTime() + (1000 * 60 * 60 * 24));
        }
        return [min, max];
    }
    calculateYDomain() {
        let nonEmptySets = [];
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
    }
    destroy() {
        this.div.remove();
    }
    setupXScaleAndAxis() {
        this.xScale = d3.scaleLinear()
            .domain(this.calculateXDomain())
            .range([0, this.width])
            .nice();
        this.xAxis = d3.axisBottom(this.xScale)
            .ticks(Math.round(this.xTicksPerPixel * this.width));
    }
    setupYScaleAndAxis() {
        this.yScale = d3.scaleLinear()
            .domain(this.calculateYDomain())
            .range(this.invertYAxis ? [0, this.height] : [this.height, 0])
            .nice();
        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(Math.round(this.yTicksPerPixel * this.height));
    }
    getDataID(index) {
        return (this.dataIDs.length > index ? String(this.dataIDs[index]) : "");
    }
    updateTooltip() {
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
    }
    getTooltipStringX(dataPoint) {
        return "x = " + dataPoint[0];
    }
    getTooltipStringY(dataPoint) {
        return "y = " + dataPoint[1];
    }
    showTooltip(position, color, xText, yText) {
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
    }
    removeTooltip() {
        if (!this.tooltip) {
            return;
        }
        this.tooltip.remove();
        this.tooltip = null;
    }
    updateLegend() {
        if (this.disableLegend) {
            return;
        }
        if (this.legend) {
            this.legend.remove();
            this.legend = null;
            this.legendWidth = 0;
        }
        if (this.data.length == 0) {
            return;
        }
        this.legend = this.svgTranslateGroup.append("g")
            .attr("class", "cvpLegend")
            .attr("transform", "translate(" + (this.width + this.margin.right + 1) + ", " + this.legendMargin + ")");
        this.legendBG = this.legend.append("rect")
            .attr("class", "cvpLegendBG")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", 250)
            .attr("height", this.legendYPadding + this.dataLabels.length * (this.legendYPadding + this.legendLineHeight) - 1);
        var maxTextLen = 0;
        this.dataLabels.forEach((s, i) => {
            this.legend.append("rect")
                .attr("x", this.legendXPadding)
                .attr("y", this.legendYPadding + i * (this.legendYPadding + this.legendLineHeight))
                .attr("width", this.legendLineHeight)
                .attr("height", this.legendLineHeight)
                .attr("fill", this.dataColors[i])
                .attr("stroke", "none");
            var textElem = this.legend.append("text")
                .attr("x", 2 * this.legendXPadding + this.legendLineHeight - 1)
                .attr("y", this.legendYPadding + this.legendLineHeight + i * (this.legendYPadding + this.legendLineHeight) - 1)
                .text(this.dataLabels[i].length > 0 ? this.dataLabels[i] : this.dataIDs[i]);
            maxTextLen = Math.max(maxTextLen, textElem.node().getComputedTextLength());
        });
        this.legendWidth = 3 * this.legendXPadding + this.legendLineHeight + maxTextLen - 1;
        this.legendBG.attr("width", this.legendWidth);
        this.legend
            .attr("transform", "translate(" + (this.width - this.legendWidth - this.legendMargin) + ", " + this.legendMargin + ")");
    }
    findLargestSmaller(d, ia, ib, v) {
        if (this.xScale(d[ia][0]) >= v || ib - ia <= 1) {
            return ia;
        }
        var imiddle = Math.floor(0.5 * (ia + ib));
        return this.xScale(d[imiddle][0]) <= v ? this.findLargestSmaller(d, imiddle, ib, v) : this.findLargestSmaller(d, ia, imiddle, v);
    }
    updateDisplayIndices() {
        var nDataSets = this.data.length;
        for (var i = 0; i < nDataSets; ++i) {
            var d = this.data[i];
            if (d.length < 1) {
                continue;
            }
            var iStart = this.findLargestSmaller(d, 0, d.length - 1, 0);
            var iEnd = this.findLargestSmaller(d, iStart, d.length - 1, this.width);
            this.displayIndexStart[i] = iStart;
            this.displayIndexEnd[i] = iEnd;
        }
    }
    redrawCanvasAndAxes() {
        /* this.xAxisGroup.call(this.xAxis);
        this.yAxisGroup.call(this.yAxis); */
        this.drawCanvas();
    }
    drawCanvas() {
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
        var nDataSets = this.data.length;
        for (var i = 0; i < nDataSets; ++i) {
            this.drawDataSet(i);
        }
    }
    drawGrid() {
        this.canvas.lineWidth = 0.9;
        this.canvas.strokeStyle = this.gridColor;
        this.canvas.beginPath();
        for (var i = 1; i <= Math.floor(this.width); i++) {
            var x = (i * 50);
            this.canvas.moveTo(0, x);
            this.canvas.lineTo(this.width, x);
        }
        for (var j = 1; j <= Math.floor(this.height); j++) {
            var y = (j * 100);
            this.canvas.moveTo(y, 0);
            this.canvas.lineTo(y, this.height);
        }
        this.canvas.stroke();
        this.canvas.closePath();
    }
    convertRange(value, r1, r2) {
        return (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }
    drawDataSet(dataIndex) {
        var d = this.data[dataIndex];
        if (d.length < 1) {
            return;
        }
        var iStart = this.displayIndexStart[dataIndex];
        var iEnd = this.displayIndexEnd[dataIndex];
        var iLast = Math.min(d.length - 1, iEnd + 1);
        this.canvas.strokeStyle = this.dataColors[dataIndex];
        this.canvas.lineWidth = this.markerLineWidth;
        for (var i = iStart; i <= iLast; ++i) {
            this.canvas.beginPath();
            this.canvas.arc(this.xScale(d[i][0]) * 40, this.yScale(d[i][1]) * 40, this.markerRadius, 0, 2 * Math.PI);
            this.canvas.stroke();
        }
    }
    resetZoomListenerAxes() {
        /* this.zoomListener.translateTo(this.div,
           (this.xAxisZoom ? this.xScale : d3.scaleLinear().domain([0,1]).range([0,1])),
           (this.yAxisZoom ? this.yScale : d3.scaleLinear().domain([0,1]).range([0,1]))); */
        //this.div.call(this.zoomListener.transform, d3.zoomIdentity);
    }
    updateZoomValues(scale, translate) {
        this.zoomListener
            .scale(scale)
            .translate(translate);
        this.updateDisplayIndices();
        this.redrawCanvasAndAxes();
    }
    CanvasPlot_shallowObjectCopy(inObj) {
        var original = inObj || {};
        var keys = Object.getOwnPropertyNames(original);
        var outObj = {};
        keys.forEach(function (k) {
            outObj[k] = original[k];
        });
        return outObj;
    }
    CanvasPlot_appendToObject(obj, objToAppend) {
        Object.keys(objToAppend).forEach(function (k) {
            if (!obj.hasOwnProperty(k)) {
                obj[k] = objToAppend[k];
            }
            else {
                if (obj[k] !== null && typeof obj[k] === "object" && !Array.isArray(obj[k])) {
                    //appendToObject(obj[k], objToAppend[k]); Not define
                }
                else if (Array.isArray(obj[k]) && Array.isArray(objToAppend[k])) {
                    objToAppend[k].forEach(function (d) {
                        if (obj[k].indexOf(d) < 0) {
                            obj[k].push(d);
                        }
                    });
                }
            }
        });
    }
}
//# sourceMappingURL=CanvasDataPlot.js.map