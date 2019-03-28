import * as d3 from 'd3';
import { CanvasTimeSeriesPlot } from './CanvasTimeSeriesPlot';
function getDemoPlotSize() {
    return [window.innerWidth - 100, Math.round(0.45 * (window.innerWidth - 100))];
}
function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
$(document).ready(function () {
    var ts1 = [];
    var ts2 = [];
    for (var i = 0; i < 100; ++i) {
        ts1.push([addDays(new Date(2010, 1, 1), i), Math.random()]);
        ts2.push([addDays(new Date(2015, 12, 11), i), Math.random()]);
    }
    var plot2 = new CanvasTimeSeriesPlot(d3.select("#maincontainer"), getDemoPlotSize(), {
        yAxisLabel: "Voltage [V]"
    });
    plot2.addDataSet("ds1", "Signal 1", ts1, "orange", true, false);
    plot2.addDataSet("ds2", "Signal 2", ts2, "steelblue", true, false);
    $(window).resize(function () {
        plot2.resize(getDemoPlotSize());
    });
});
//# sourceMappingURL=demo.js.map