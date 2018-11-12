export declare class CanvasDataPlot {
    parentElement: HTMLElement;
    canvasDimensions: Array<number>;
    config: CanvasDataPlot.Config;
    constructor(parentElement: HTMLElement, canvasDimensions: Array<number>, config: CanvasDataPlot.Config);
}
export declare namespace CanvasDataPlot {
    enum Config {
        xAxisLabel = 0,
        yAxisLabel = 1,
        markerLineWidth = 2,
        markerRadius = 3
    }
}
