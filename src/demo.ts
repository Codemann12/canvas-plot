import * as d3 from 'd3';
import {CanvasDataPlot} from './CanvasDataPlot';
import{CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot';
import{CanvasVectorSeriesPlot} from './CanvasVectorSeriesPlot';
import{CanvasDataPlotGroup} from './CanvasDataPlotGroup';


function getDemoPlotSize() {
	return [window.innerWidth-100, Math.round(0.45*(window.innerWidth-100))];
}

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

$(document).ready( function(){
        var data1: Array<[any, number]> =
           [[1,5], [0.5,6], [5,25], [6,1], [10,9],
            [20,55], [10,32], [15,25], [16,19], [10,89],
            [27,56],[18,5], [15,6], [72,41]];
    
        var plot1 = new CanvasDataPlot(d3.select("#maincontainer"), [1000, 900], {
		xAxisLabel: "IQ",
		yAxisLabel: "Test Score",
		markerLineWidth: 3,
		markerRadius: 5
	}); 

    plot1.addDataSet("ds1", "Test 1", data1, "orange", false, false);   
	plot1.addDataPoint("ds1", [15,0]); // Will not be added! (x values have to be in ascending order)
	plot1.addDataPoint("ds1", [20,10]); // Will be added.
	plot1.addDataPoint("ds1", [21,0]);
	plot1.updateDomains([-2,22], [-60,15], true);



var ts1: Array<[Date, number]> = [];
var ts2: Array<[Date, number]> = [];

// var now = new Date();
// for(var i=0; i<100; ++i) {
//     var time = new Date(now);
//     time.setHours(i);
//     ts1.push([time, Math.random()]);
//     ts2.push([time, Math.random()]);
// }


for(var i=0; i<100; ++i) {
    ts1.push([randomDate(new Date(2010, 1, 1),new Date()), Math.random()]);
    ts2.push([randomDate(new Date(2015, 12, 11),new Date()), Math.random()]);
}

var plot2 = new CanvasTimeSeriesPlot(d3.select("#maincontainer"), getDemoPlotSize(), {
    yAxisLabel: "Voltage [V]"
});

plot2.addDataSet("ds1", "Signal 1", ts1, "orange", false, false);
plot2.addDataSet("ds2", "Signal 2", ts2, "steelblue", false, false);
plot2.setZoomYAxis(false);

$(window).resize(function() {
    plot2.resize(getDemoPlotSize());
});

// var time = new Date(now);
// time.setHours(101);
// var newDataPoint:[Date, number] = [time, 1.5];
// plot2.addDataPoint("ds1", newDataPoint, true, true);
// newDataPoint[1] = 3.0; // Has no effect since we told addDataPoint() to copy the new value.


var tsPlotGroup = new CanvasDataPlotGroup(d3.select("#maincontainer"), getDemoPlotSize(), true, true, {});
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
    var time = new Date(new Date());
    time.setHours(i);
   // tsVector1.push([time, 50, 0.01*i*Math.PI, 100]);
   tsVector1.push([time, 0.01*i*Math.PI]);
}


plot3.addDataSet("ts1", "Velocity", tsVector1, "steelblue", true);
plot3.setZoomYAxis(false);

});
