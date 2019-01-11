import * as d3 from 'd3';
import { CanvasTimeSeriesPlot } from './CanvasTimeSeriesPlot';
import { CanvasDataPlot } from './CanvasDataPlot';
export declare class CanvasVectorSeriesPlot extends CanvasTimeSeriesPlot {
    vectorScale: number;
    scaleUnits: string;
    scaleLength: number;
    showMarkerDensity: number;
    scaleTextElem: any;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, canvasDimensions: Array<number>, config?: CanvasDataPlot.Config);
    getTooltipStringY(dataPoint: [Date, number]): string;
    getMagnitudeScale(): number;
    drawCanvas(): void;
    drawDataSet(dataIndex: number): void;
    updateScaleText(): void;
    updateLegend(): void;
}
