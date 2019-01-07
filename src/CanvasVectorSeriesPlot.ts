
import * as d3 from 'd3';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as $ from "jquery";
import { namespace, D3ZoomEvent, ZoomBehavior, ZoomTransform, Selection, ticks } from 'd3';
import {CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot'
import {CanvasDataPlot} from './CanvasDataPlot'


export class CanvasVectorSeriesPlot{
    vectorScale: number;
    scaleUnits: string;
    scaleLength: number;
    showMarkerDensity: number;
    scaleTextElem: any;
   
	
	constructor(parentElement: d3.Selection<any, {} , HTMLElement , {}>, canvasDimensions: Array<number>, config: CanvasDataPlot.Config = {}){
        this.vectorScale = config.vectorScale || 2.0e5;
        this.scaleUnits = config.scaleUnits || "units";
        this.scaleLength = config.scaleLength || 75;
        this.scaleTextElem = null;
        
        var configCopy = CanvasDataPlot.prototype.CanvasPlot_shallowObjectCopy(config);
        //configCopy["showTooltips"] = false;
        if(!("invertYAxis" in configCopy)) {
            configCopy["invertYAxis"] = true;
        }
        
        CanvasTimeSeriesPlot.call(this, parentElement, canvasDimensions, configCopy);
        
    }
   
	
}


