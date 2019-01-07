import { CanvasTimeSeriesPlot } from './CanvasTimeSeriesPlot';
import { CanvasDataPlot } from './CanvasDataPlot';
export class CanvasVectorSeriesPlot {
    constructor(parentElement, canvasDimensions, config = {}) {
        this.vectorScale = config.vectorScale || 2.0e5;
        this.scaleUnits = config.scaleUnits || "units";
        this.scaleLength = config.scaleLength || 75;
        this.scaleTextElem = null;
        var configCopy = CanvasDataPlot.prototype.CanvasPlot_shallowObjectCopy(config);
        //configCopy["showTooltips"] = false;
        if (!("invertYAxis" in configCopy)) {
            configCopy["invertYAxis"] = true;
        }
        CanvasTimeSeriesPlot.call(this, parentElement, canvasDimensions, configCopy);
    }
}
//# sourceMappingURL=CanvasVectorSeriesPlot.js.map