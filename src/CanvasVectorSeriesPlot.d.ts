import { CanvasTimeSeriesPlot as CTP } from './CanvasTimeSeriesPlot';
import { CanvasDataPlot as CDP } from './CanvasDataPlot';
export declare class CanvasVectorSeriesPlot extends CTP {
    vectorScale: number;
    scaleUnits: string;
    scaleLength: number;
    showMarkerDensity: number;
    scaleTextElem: any;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, canvasDimensions: Array<number>, config?: CDP.Config);
    getTooltipStringY(dataPoint: [Date, number]): string;
    getMagnitudeScale(): number;
    drawCanvas(): void;
    drawDataSet(dataIndex: number): void;
    updateScaleText(): void;
    updateLegend(): void;
}
