import { CanvasDataPlot } from './canvasplot';
import * as d3 from 'd3';
console.log("test");
function getDemoPlotSize() {
    return [window.innerWidth - 100, Math.round(0.45 * (window.innerWidth - 100))];
}
var data1 = [[-1, 5], [0.5, 6], [5, -2.5], [6, 1], [10, 9], [20, -55]];
var plot1 = new CanvasDataPlot(d3.select("#maincontainer"), [1000, 900]);
//# sourceMappingURL=demo.js.map