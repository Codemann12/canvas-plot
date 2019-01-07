import {CanvasDataPlot} from './CanvasDataPlot'
import{CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot'
import{CanvasVectorSeriesPlot} from './CanvasVectorSeriesPlot'
import * as d3 from 'd3';

console.log("test")

function getDemoPlotSize() {
	return [window.innerWidth-100, Math.round(0.45*(window.innerWidth-100))];
}

let data1: Array<[number, number]> = [[-1,5], [0.5,6], [5,-2.5], [6,1], [10,9], [20,-55]]; 
var html = d3.select("div").append("p");
console.log(html)

var plot1 = new CanvasDataPlot(html, [1000, 900], {
    xAxisLabel: "IQ",
    yAxisLabel: "Test Score",
    markerLineWidth: 3,
    markerRadius: 5
});

plot1.addDataSet("ds1", "Test 1", data1, "orange", true, false);
plot1.addDataPoint("ds1", [15,0]); // Will not be added! (x values have to be in ascending order)
plot1.addDataPoint("ds1", [20,10]); // Will be added.
plot1.addDataPoint("ds1", [21,0]);
plot1.updateDomains([-2,22], [-60,15], true);
// Since we told addDataSet() not to copy our data, data1 is mutated by addDataPoint().
console.log(data1);

var ts1: Array<[Date, number]> = [];
var ts2: Array<[Date, number]> = [];
var now = new Date();
for(var i=0; i<100; ++i) {
    var time = new Date(now);
    time.setHours(i);
    ts1.push([time, Math.random()]);
    ts2.push([time, Math.random()]);
}


var plot2 = new CanvasTimeSeriesPlot(d3.select("#maincontainer"), getDemoPlotSize(), {
    yAxisLabel: "Voltage [V]"
});

plot2.addDataSet("ds1", "Signal 1", ts1, "orange", true, true);
plot2.addDataSet("ds2", "Signal 2", ts2, "steelblue", true, true);
