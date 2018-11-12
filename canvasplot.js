"use strict";
exports.__esModule = true;
//d3.select('body');
var CanvasDataPlot = /** @class */ (function () {
    //let pair: [Number, Number]
    //data:Array<pair>;
    // Not sure if the enum Config would work like this but .
    /* usage!
       import{CanvasDataPlot} from './CanvasDataPlot';
       let canva = new CanvasDataPlot();
       canva.config = CanvasDataPlot.Config.xAxisLabel
    */
    function CanvasDataPlot(parentElement, canvasDimensions, config) {
        this.parentElement = parentElement;
        this.canvasDimensions = canvasDimensions;
        var x;
        this.config = config;
        //	this.data = [];
    }
    return CanvasDataPlot;
}());
exports.CanvasDataPlot = CanvasDataPlot;
(function (CanvasDataPlot) {
    var Config;
    (function (Config) {
        Config[Config["xAxisLabel"] = 0] = "xAxisLabel";
        Config[Config["yAxisLabel"] = 1] = "yAxisLabel";
        Config[Config["markerLineWidth"] = 2] = "markerLineWidth";
        Config[Config["markerRadius"] = 3] = "markerRadius";
    })(Config = CanvasDataPlot.Config || (CanvasDataPlot.Config = {}));
})(CanvasDataPlot = exports.CanvasDataPlot || (exports.CanvasDataPlot = {}));
exports.CanvasDataPlot = CanvasDataPlot;
