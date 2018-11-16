"use strict";
exports.__esModule = true;
var CanvasDataPlot = /** @class */ (function () {
    function CanvasDataPlot(parentElement, canvasDimensions, config) {
        this.parent = parentElement;
        this.canvasDimensions = canvasDimensions;
        this.config = config;
        console.log("test");
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
