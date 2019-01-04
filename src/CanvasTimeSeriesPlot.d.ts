import * as d3 from 'd3';
import { CanvasDataPlot } from './CanvasDataPlot';
export declare class CanvasTimeSeriesPlot {
    informationDensity: Array<number>;
    plotLineWidth: number;
    maxInformationDensity: number;
    showMarkerDensity: number;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, canvasDimensions: Array<number>, config?: CanvasDataPlot.Config);
    addDataSet(uniqueID: string, label: string, dataSet: Array<[Date, number]>, colorString: string, updateDomains: boolean, copyData: boolean): void;
    removeDataSet(uniqueID: string): void;
    updateDisplayIndices(): void;
    updateTooltipn(): void;
    getTooltipStringX(dataPoint: Array<Date>): string;
}
