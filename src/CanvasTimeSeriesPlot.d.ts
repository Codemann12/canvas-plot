import * as d3 from 'd3';
import { CanvasDataPlot as CDP } from './CanvasDataPlot';
export declare class CanvasTimeSeriesPlot extends CDP {
    informationDensity: Array<number>;
    plotLineWidth: number;
    maxInformationDensity: number;
    showMarkerDensity: number;
    constructor(parentElement: d3.Selection<any, {}, HTMLElement, {}>, canvasDimensions: Array<number>, config?: CDP.Config);
    addDataSet(uniqueID: string, label: string, dataSet: Array<[Date, number]>, colorString: string, updateDomains: boolean, copyData?: boolean): void;
    removeDataSet(uniqueID: string): void;
    updateDisplayIndices(): void;
    updateTooltip(): void;
    getTooltipStringX(dataPoint: [Date, number]): string;
    addDays(date: Date, days: number): Date;
    randomDate(start: Date, end: Date): Date;
    calculateXDomain(): Array<Date>;
    setupXScaleAndAxis(): void;
    drawDataSet(dataIndex: number): void;
}
