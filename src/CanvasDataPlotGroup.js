import { CanvasDataPlot } from './CanvasDataPlot';
export class CanvasDataPlotGroup {
    constructor(parentElement, plotDimensions, multiplePlots, syncPlots, config = {}) {
        this.defaultConfig = CanvasDataPlot.prototype.CanvasPlot_shallowObjectCopy(null);
        CanvasDataPlot.prototype.width = plotDimensions[0];
        CanvasDataPlot.prototype.height = plotDimensions[1];
        this.zoomXAxis = true;
        this.zoomYAxis = true;
    }
}
//# sourceMappingURL=CanvasDataPlotGroup.js.map