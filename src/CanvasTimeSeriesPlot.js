import * as d3 from 'd3';
export class CanvasTimeSeriesPlot {
    constructor(parentElement, canvasDimensions, config = {}) {
        this.config = config || {};
        this.informationDensity = [];
        this.plotLineWidth = config.plotLineWidth || 1;
        this.maxInformationDensity = config.maxInformationDensity || 2.0;
        this.showMarkerDensity = config.showMarkerDensity || 0.14;
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
        // this.zoom = d3.zoom()
        // .on("zoom", this.zoomFunction());
    }
    // zoomFunction(): ValueFn<Element, {}, void>{
    // 	var new_xScale = d3.event.transform.rescaleX(this.xScale)
    // 	var new_yScale = d3.event.transform.rescaleY(this.yScale)
    // 	console.log(d3.event.transform)
    // 	return new_xScale;
    // }
    addDataSet(uniqueID, label, dataSet, colorString, updateDomains, copyData) {
        this.informationDensity.push(1);
        this.dataIDs.push(uniqueID);
        this.dataLabels.push(label);
        this.dataColors.push(colorString);
        this.displayIndexStart.push(0);
        this.displayIndexEnd.push(0);
        dataSet = dataSet || [];
        this.data = [];
        if (copyData) {
            var dataIndex = this.data.length;
            dataSet.forEach(elem => {
                this.data.push(elem);
            });
            var dataSetLength = dataSet.length;
            for (var i = 0; i < dataSetLength; ++i) {
                var sliceData = jQuery.extend(true, {}, dataSet[i]); //deep copy --> arr.slice(0)
                this.data[dataIndex] = sliceData;
            }
        }
        else {
            dataSet.forEach(elem => {
                this.data.push(elem);
            });
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
        this.xScale = d3.scaleTime().rangeRound([0, this.width]);
        this.yScale = d3.scaleLinear().rangeRound([this.height, 0]);
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
        this.drawCanvas();
        console.log("resize");
    }
    updateDomains(xDomain, yDomain, makeItNice) {
        this.xScale = d3.scaleTime().domain(xDomain);
        this.yScale = d3.scaleLinear().domain(yDomain);
        if (makeItNice) {
            this.xScale = d3.scaleTime().nice();
            this.yScale = d3.scaleLinear().nice();
        }
        this.updateDisplayIndices();
        this.drawCanvas();
    }
    drawCanvas() {
        this.canvas.clearRect(0, 0, this.width, this.height);
        this.drawGrid();
        var nDataSets = this.data.length;
        // for(var i=0; i<nDataSets; ++i) {
        // 	this.drawDataSet(i);
        // 	}
        this.drawDataSet();
    }
    drawDataSet() {
        var line = d3.line()
            .x(d => { return this.xScale(d.xDate); })
            .y(d => { return this.yScale(d.yNum); })
            .curve(d3.curveMonotoneX);
        var color = this.dataColors.length > 1 ? this.dataColors[1] : this.dataColors[0];
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        this.svgTranslateGroup.append("path")
            .datum(this.data)
            .attr("class", "line")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", 2);
        var formatTime = d3.timeFormat("%d-%b-%y");
        this.svgTranslateGroup.selectAll("circle")
            .data(this.data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => { return this.xScale(d["xDate"]); })
            .attr("cy", d => { return this.yScale(d["yNum"]); })
            .attr("r", 4)
            .style("fill", color);
        this.svgTranslateGroup.selectAll(".dot")
            .data(this.data)
            .enter().append("circle")
            .attr("class", "circle")
            .attr("cx", d => { return this.xScale(d["xDate"]); })
            .attr("cy", d => { return this.yScale(d["yNum"]); })
            .attr("r", 4)
            .style("fill", color)
            .on("mouseover", d => {
            div.transition()
                .duration(200)
                .style("opacity", .9)
                .style("background-color", color);
            div.html("xCoord: " + formatTime(d["xDate"]) + "<br/>" + "yCoord: " + d["yNum"])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", () => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
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
    drawGrid() {
        this.canvas.lineWidth = 0.9;
        this.canvas.strokeStyle = this.gridColor;
        this.canvas.beginPath();
        for (var i = 1; i <= Math.floor(this.width); i++) {
            var x = (i * 10);
            this.canvas.moveTo(0, x);
            this.canvas.lineTo(this.width, x);
        }
        for (var j = 1; j <= Math.floor(this.height); j++) {
            var y = (j * 10);
            this.canvas.moveTo(y, 0);
            this.canvas.lineTo(y, this.height);
        }
        this.canvas.stroke();
        this.canvas.closePath();
    }
    removeDataSet(uniqueID) {
        var index = this.dataIDs.indexOf(uniqueID);
        if (index >= 0) {
            this.informationDensity.splice(index, 1);
        }
        this.removeDataSet.call(this, uniqueID);
    }
    calculateXDomain() {
        if (this.data.length <= 1) {
            for (var i = 0; i < 365; ++i) {
                this.data.push({ xDate: this.addDays(new Date(2017, 0, 1), i), yNum: Math.random() });
            }
        }
        return d3.extent(this.data, function (d) { return d.xDate; });
    }
    calculateYDomain() {
        return d3.extent(this.data, function (d) { return d.yNum; });
    }
    destroy() {
        this.div.remove();
    }
    updateDisplayIndices() {
        // var nDataSets = this.data.length;
        // for(var i=0; i<nDataSets; ++i) {
        //     var d = this.data[i];
        //     if(d.length < 1) {
        //         continue;
        //     }
        //     var iStart = this.displayIndexStart[i];
        //     var iEnd = this.displayIndexEnd[i];
        //     var iLength = iEnd - iStart + 1;
        //     var scaleLength =  Math.max(1, this.xScale(d[iEnd][0]) - this.xScale(d[iStart][0]));
        //     this.informationDensity[i] = iLength/scaleLength;
        // }
    }
    removeTooltip() {
        if (!this.tooltip) {
            return;
        }
        this.tooltip.remove();
        this.tooltip = null;
    }
    updateTooltip() {
        // var mouse = d3.mouse(this.div.node());
        // var mx = mouse[0] - this.margin.left;
        // var my = mouse[1] - this.margin.top;
        // if(mx <= 0 || mx >= this.width || my <= 0 || my >= this.height) {
        //     this.removeTooltip();
        //     return;
        // }
        // var nDataSets = this.data.length;
        // var hitMarker = false;
        // TimeSeriesPlot_updateTooltip_graph_loop:
        // for(var i=0; i<nDataSets; ++i) {
        //     if(this.informationDensity[i] > this.showMarkerDensity) {
        //         continue;
        //     }
        //     var d = this.data[i];
        //     var iStart = this.displayIndexStart[i];
        //     var iEnd = Math.min(d.length-1, this.displayIndexEnd[i]+1);
        //     for(var j=iStart; j<=iEnd; ++j) {
        //         var dx = this.xScale(d[j][0]) - mx;
        //         var dy = this.yScale(d[j][1]) - my;
        //         if(dx*dx + dy*dy <= this.tooltipRadiusSquared) {
        //             hitMarker = true;
        //             this.showTooltip([this.xScale(d[j][0]), 
        //             this.yScale(d[j][1])], this.dataColors[i],
        //             this.getTooltipStringX(d[j]), this.getTooltipStringY(d[j]));
        //             break TimeSeriesPlot_updateTooltip_graph_loop;
        //         }
        //     }
        // }
        // if(!hitMarker){
        //     this.removeTooltip();
        // }
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
    getTooltipStringX(dataPoint) {
        var zeroPad2 = function (n) {
            return n < 10 ? ("0" + n) : n.toString();
        };
        var date = dataPoint[0];
        var Y = date.getUTCFullYear();
        var M = zeroPad2(date.getUTCMonth());
        var D = zeroPad2(date.getUTCDay());
        var h = zeroPad2(date.getUTCHours());
        var m = zeroPad2(date.getUTCMinutes());
        var s = zeroPad2(date.getUTCSeconds());
        return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
    }
    getTooltipStringY(dataPoint) {
        return "y = " + dataPoint[1];
    }
    addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    randomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    setupXScaleAndAxis() {
        this.xScale = d3.scaleTime()
            .domain(this.calculateXDomain())
            .rangeRound([0, this.width])
            .nice()
            .clamp(true);
        var formatMilliSecond = d3.timeFormat(".%L"), formatSecond = d3.timeFormat(":%S"), formatHour = d3.timeFormat("%I:%p"), formatWeek = d3.timeFormat("%b %d"), formatMonth = d3.timeFormat("%B"), formatYear = d3.timeFormat("%Y");
        let multiFormat = (date) => {
            return (d3.timeSecond(date) < date ? formatMilliSecond
                : d3.timeMinute(date) < date ? formatSecond
                    : d3.timeDay(date) < date ? formatHour
                        : d3.timeWeek(date) < date ? formatWeek
                            : d3.timeYear(date) < date ? formatMonth
                                : formatYear)(date);
        };
        var xFormat = "%d-%b-%y";
        this.xAxis = d3.axisBottom(this.xScale)
            // .tickFormat(multiFormat)
            .tickFormat(d3.timeFormat(xFormat));
        // .ticks(d3.timeDay.every(4))
    }
    setupYScaleAndAxis() {
        this.yScale = d3.scaleLinear()
            .domain(this.calculateYDomain())
            .rangeRound(this.invertYAxis ? [0, this.height] : [this.height, 0])
            .nice()
            .clamp(true);
        this.yAxis = d3.axisLeft(this.yScale)
            .ticks(Math.round(this.yTicksPerPixel * this.height));
    }
}
//# sourceMappingURL=CanvasTimeSeriesPlot.js.map