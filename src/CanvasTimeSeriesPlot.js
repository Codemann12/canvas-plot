import * as d3 from 'd3';
import { CanvasDataPlot as CDP } from './CanvasDataPlot';
export class CanvasTimeSeriesPlot extends CDP {
    constructor(parentElement, canvasDimensions, config = {}) {
        super(parentElement, canvasDimensions, config);
        this.config = config || {};
        this.informationDensity = [];
        this.plotLineWidth = config.plotLineWidth || 1;
        this.maxInformationDensity = config.maxInformationDensity || 2.0;
        this.showMarkerDensity = config.showMarkerDensity || 0.14;
    }
    addDataSet(uniqueID, label, dataSet, colorString, updateDomains, copyData) {
        this.informationDensity.push(1);
        CDP.prototype.addDataSet.call(this, uniqueID, label, dataSet, colorString, updateDomains, copyData);
    }
    removeDataSet(uniqueID) {
        var index = this.dataIDs.indexOf(uniqueID);
        if (index >= 0) {
            this.informationDensity.splice(index, 1);
        }
        this.removeDataSet.call(this, uniqueID);
    }
    updateDisplayIndices() {
        CDP.prototype.updateDisplayIndices.call(this);
        var nDataSets = this.data.length;
        for (var i = 0; i < nDataSets; ++i) {
            var d = this.data[i];
            if (d.length < 1) {
                continue;
            }
            var iStart = this.displayIndexStart[i];
            var iEnd = this.displayIndexEnd[i];
            var iLength = iEnd - iStart + 1;
            var scaleLength = Math.max(1, this.xScale(d[iEnd][0]) - this.xScale(d[iStart][0]));
            this.informationDensity[i] = iLength / scaleLength;
        }
    }
    updateTooltipn() {
        var mouse = d3.mouse(this.div.node());
        var mx = mouse[0] - this.margin.left;
        var my = mouse[1] - this.margin.top;
        if (mx <= 0 || mx >= this.width || my <= 0 || my >= this.height) {
            this.removeTooltip();
            return;
        }
        var nDataSets = this.data.length;
        var hitMarker = false;
        TimeSeriesPlot_updateTooltip_graph_loop: for (var i = 0; i < nDataSets; ++i) {
            if (this.informationDensity[i] > this.showMarkerDensity) {
                continue;
            }
            var d = this.data[i];
            var iStart = this.displayIndexStart[i];
            var iEnd = Math.min(d.length - 1, this.displayIndexEnd[i] + 1);
            for (var j = iStart; j <= iEnd; ++j) {
                var dx = this.xScale(d[j][0]) - mx;
                var dy = this.yScale(d[j][1]) - my;
                if (dx * dx + dy * dy <= this.tooltipRadiusSquared) {
                    hitMarker = true;
                    this.showTooltip([this.xScale(d[j][0]),
                        this.yScale(d[j][1])], this.dataColors[i], this.getTooltipStringX(d[j]), this.getTooltipStringY(d[j]));
                    break TimeSeriesPlot_updateTooltip_graph_loop;
                }
            }
        }
        if (!hitMarker) {
            this.removeTooltip();
        }
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
    setupXScaleAndAxis() {
        this.xScale = d3.scaleTime()
            .domain(this.calculateXDomain())
            .range([0, this.width])
            .nice();
        var formatMilliSecond = d3.timeFormat(".%L"), formatSecond = d3.timeFormat(":%S"), formatHour = d3.timeFormat("%I:%p"), formatWeek = d3.timeFormat("%b %d"), formatMonth = d3.timeFormat("%B"), formatYear = d3.timeFormat("%Y");
        let multiFormat = (date) => {
            return (d3.timeSecond(date) < date ? formatMilliSecond
                : d3.timeMinute(date) < date ? formatSecond
                    : d3.timeDay(date) < date ? formatHour
                        : d3.timeWeek(date) < date ? formatWeek
                            : d3.timeYear(date) < date ? formatMonth
                                : formatYear)(date);
        };
        this.xAxis = d3.axisBottom(this.xScale)
            .tickFormat(multiFormat)
            .ticks(Math.round(this.xTicksPerPixel * this.width));
    }
    drawDataSet(dataIndex) {
        var d = this.data[dataIndex];
        if (d.length < 1) {
            return;
        }
        var iStart = this.displayIndexStart[dataIndex];
        var iEnd = this.displayIndexEnd[dataIndex];
        var informationDensity = this.informationDensity[dataIndex];
        var drawEvery = 1;
        if (informationDensity > this.maxInformationDensity) {
            drawEvery = Math.floor(informationDensity / this.maxInformationDensity);
        }
        // Make iStart divisivble by drawEvery to prevent flickering graphs while panning
        iStart = Math.max(0, iStart - iStart % drawEvery);
        this.canvas.beginPath();
        this.canvas.moveTo(this.xScale(d[iStart][0]), this.yScale(d[iStart][1]));
        for (var i = iStart; i <= iEnd; i = i + drawEvery) {
            this.canvas.lineTo(this.xScale(d[i][0]), this.yScale(d[i][1]));
        }
        var iLast = Math.min(d.length - 1, iEnd + drawEvery);
        this.canvas.lineTo(this.xScale(d[iLast][0]), this.yScale(d[iLast][1]));
        this.canvas.lineWidth = this.plotLineWidth;
        this.canvas.strokeStyle = this.dataColors[dataIndex];
        this.canvas.stroke();
        if (informationDensity <= this.showMarkerDensity) {
            this.canvas.lineWidth = this.markerLineWidth;
            for (var i = iStart; i <= iLast; ++i) {
                this.canvas.beginPath();
                this.canvas.arc(this.xScale(d[i][0]), this.yScale(d[i][1]), this.markerRadius, 0, 2 * Math.PI);
                this.canvas.stroke();
            }
        }
    }
}
//# sourceMappingURL=CanvasTimeSeriesPlot.js.map