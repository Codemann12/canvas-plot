import * as d3 from 'd3';
import {CanvasDataPlot} from './CanvasDataPlot';
import{CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot';
import{CanvasVectorSeriesPlot} from './CanvasVectorSeriesPlot';
import{CanvasDataPlotGroup} from './CanvasDataPlotGroup';

//const $ = require('jquery');


// Does not habe any use but i love to have it there
class Demo{
    constructor(){
    }   
}

function getDemoPlotSize() {
	return [window.innerWidth-100, Math.round(0.45*(window.innerWidth-100))];
}

function randomDate() {
    return new Date(new Date(2012, 0, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2012, 0, 1).getTime()));
}

$( document).ready( function(){
        var data1: Array<[Date, number]> = [[this.randomDate(),Math.floor(Math.random() * 100)],
        [this.randomDate(),Math.floor(Math.random() * 100)],
        [this.randomDate(),Math.floor(Math.random() * 100)],
        [this.randomDate(),Math.floor(Math.random() * 100)],
        [this.randomDate(),Math.floor(Math.random() * 100)],
        [this.randomDate(),Math.floor(Math.random() * 100)]];
    
        var plot1 = new CanvasDataPlot(d3.select("#maincontainer"), [1000, 900], {
		xAxisLabel: "IQ",
		yAxisLabel: "Test Score",
		markerLineWidth: 3,
		markerRadius: 5
	}); 


    plot1.addDataSet("ds1", "Test 1", data1, "orange", true, false);   
    plot1.addDataPoint("ds1", [randomDate(),0]);   
    plot1.addDataPoint("ds1", [this.randomDate(),10]);
    plot1.addDataPoint("ds1", [this.randomDate(),0]);
    plot1.updateDomains([this.randomDate(), this.randomDate()], [-60,15], true);
// Since we told addDataSet() not to copy our data, data1 is mutated by addDataPoint().



var ts1: Array<[Date, number]> = [];
var ts2: Array<[Date, number]> = [];
var now = new Date();
for(var i=0; i<100; ++i) {
    var time = new Date(now);
    time.setHours(i);
    ts1.push([time, Math.random()]);
    ts2.push([time, Math.random()]);
}


var plot2 = new CanvasTimeSeriesPlot(d3.select("#maincontainer"), this.getDemoPlotSize(), {
    yAxisLabel: "Voltage [V]"
});

plot2.addDataSet("ds1", "Signal 1", ts1, "orange", true, true);
plot2.addDataSet("ds2", "Signal 2", ts2, "steelblue", true, true);
plot2.setZoomYAxis(false);

});