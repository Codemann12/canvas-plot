
import * as d3 from 'd3';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as $ from "jquery";
import { namespace, D3ZoomEvent, ZoomBehavior, ZoomTransform, Selection, ticks } from 'd3';
import {CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot'
import {CanvasDataPlot} from './CanvasDataPlot'
import {CanvasVectorSeriesPlot} from './CanvasVectorSeriesPlot'


export class CanvasDataPlotGroup{
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

   
	
    constructor(parentElement: d3.Selection<any, {} , HTMLElement , {}>, plotDimensions: Array<number>, 
        multiplePlots: Array<any>, syncPlots: any, config: CanvasDataPlot.Config = {}){
            CanvasDataPlot.prototype.width = plotDimensions[0];
            CanvasDataPlot.prototype.height = plotDimensions[1];
            this.zoomXAxis = true;
           this.zoomYAxis = true;
           this.defaultConfig = CanvasDataPlot.prototype.CanvasPlot_shallowObjectCopy(defaultConfig)
            

        
    }

}