import * as d3 from 'd3';
import { CanvasDataPlot } from './CanvasDataPlot';
export declare class CanvasDataPlotGroup {
    defaultConfig: any;
    container: any;
    plots: any;
    firstPlotType: string;
    multiplePlots: any;
    syncPlots: any;
    syncTranslateX: boolean;
    syncTranslateY: boolean;
    lastZoomedPlot: any;
    zoomXAxis: boolean;
    zoomYAxis: boolean;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, plotDimensions: Array<number>, multiplePlots: Array<any>, syncPlots: any, config?: CanvasDataPlot.Config);
}
