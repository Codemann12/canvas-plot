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
    updateTooltipn(): void;
    getTooltipStringX(dataPoint: [Date, number]): string;
    setupXScaleAndAxis(): void;
    drawDataSet(dataIndex: number): void;
}
