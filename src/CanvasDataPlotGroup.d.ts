import * as d3 from 'd3';
import { CanvasDataPlot } from './CanvasDataPlot';
export declare class CanvasDataPlotGroup {
    defaultConfig: CanvasDataPlotGroup.defaultConfig;
    container: d3.Selection<any, {}, HTMLElement, {}>;
    plots: Array<CanvasDataPlot>;
    firstPlotType: string;
    multiplePlots: boolean;
    syncPlots: boolean;
    syncTranslateX: boolean;
    syncTranslateY: boolean;
    lastZoomedPlot: CanvasDataPlot;
    zoomXAxis: boolean;
    zoomYAxis: boolean;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, plotDimensions: Array<number>, multiplePlots: boolean, syncPlots: boolean, defaultConfig?: CanvasDataPlotGroup.defaultConfig);
    addDataSet(plotType: string, uniqueID: string, displayName: string, dataSet: Array<[Date, number]>, color: string, plotConfig: boolean): void;
    removeDataSet(uniqueID: string): void;
    setSyncViews(sync: boolean, translateX: boolean, translateY: boolean): void;
    setZoomXAxis(zoomX: boolean): void;
    setZoomYAxis(zoomY: boolean): void;
    fitDataInViews(): void;
    resizePlots(dimensions: Array<number>): void;
    destroy(): void;
    private createPlot;
    private setViews;
}
export declare namespace CanvasDataPlotGroup {
    interface defaultConfig {
        [key: string]: any;
    }
}
