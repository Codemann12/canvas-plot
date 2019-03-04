import * as d3 from 'd3';
import {CanvasDataPlot} from './CanvasDataPlot';
import{CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot';
import{CanvasVectorSeriesPlot} from './CanvasVectorSeriesPlot';
import{CanvasDataPlotGroup} from './CanvasDataPlotGroup';


function getDemoPlotSize() {
	return [window.innerWidth-100, Math.round(0.45*(window.innerWidth-100))];
}

function randomDate(): Date {
    return new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()));
}

$(document).ready( function(){
        var data1: Array<[Date, number]> = [[randomDate(),Math.floor(Math.random() * 100)],
        [randomDate(),Math.floor(Math.random() * 100)],
        [randomDate(),Math.floor(Math.random() * 100)],
        [randomDate(),Math.floor(Math.random() * 100)],
   
        [randomDate(),Math.floor(Math.random() * 100)]];
        console.log(data1.length+"length of data")
    
        var plot1 = new CanvasDataPlot(d3.select("#maincontainer"), [1000, 900], {
		xAxisLabel: "IQ",
		yAxisLabel: "Test Score",
		markerLineWidth: 3,
		markerRadius: 5
	}); 


plot1.addDataSet("ds1", "Test 1", data1, "orange", true, false);   
plot1.addDataPoint("ds1", [randomDate(),0]);   
plot1.addDataPoint("ds1", [randomDate(),10]);
plot1.addDataPoint("ds1", [randomDate(),0]);
plot1.updateDomains([randomDate(), randomDate()], [-60,15], true);





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
plot2.setZoomYAxis(false);

$(window).resize(function() {
    plot2.resize(getDemoPlotSize());
});
var time = new Date(now);
time.setHours(101);
var newDataPoint:[Date, number] = [time, 1.5];
plot2.addDataPoint("ds1", newDataPoint, true, true);
// newDataPoint[1] = 3.0; // Has no effect since we told addDataPoint() to copy the new value.



var tsPlotGroup = new CanvasDataPlotGroup(d3.select("#maincontainer"), [550, 350], true, true, {});
tsPlotGroup.addDataSet("CanvasTimeSeriesPlot", "ds1", "Signal 1", ts1, "orange", {
    yAxisLabel: "Voltage [V]"
});


tsPlotGroup.addDataSet("CanvasTimeSeriesPlot", "ds2", "Signal 2", ts2, "steelblue", {
    yAxisLabel: "Voltage [V]",
    plotLineWidth: 1.5
});


tsPlotGroup.addDataSet("CanvasDataPlot", "ds3", "Signal 3", ts2, "blue", {
    yAxisLabel: "Voltage [V]"
});


tsPlotGroup.removeDataSet("ds3");
tsPlotGroup.setSyncViews(true, true, false);

var plot3 = new CanvasVectorSeriesPlot(d3.select("#maincontainer"), [750, 500], {
    yAxisLabel: "Depth [m]",
    maxInformationDensity: 0.3,
    plotLineWidth: 1.5,
    vectorScale: 7.0e5,
    scaleUnits: "mm/s"
});


var tsVector1:Array<[Date, number]> = [];
for(var i=0; i<1000; ++i) {
    var time = new Date(now);
    time.setHours(i);
    // tsVector1.push([time, 50, 0.01*i*Math.PI, 100]);
    tsVector1.push([time, 0.01*i*Math.PI]);
}


plot3.addDataSet("ts1", "Velocity", tsVector1, "steelblue", true);
plot3.setZoomYAxis(false);
});
