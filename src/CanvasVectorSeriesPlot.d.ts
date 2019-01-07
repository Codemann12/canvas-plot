import * as d3 from 'd3';
import { CanvasDataPlot } from './CanvasDataPlot';
export declare class CanvasVectorSeriesPlot {
    vectorScale: number;
    scaleUnits: string;
    scaleLength: number;
    showMarkerDensity: number;
    scaleTextElem: any;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, canvasDimensions: Array<number>, config?: CanvasDataPlot.Config);
}
