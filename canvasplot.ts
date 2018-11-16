
import * as d3 from 'd3';
import { namespace } from 'd3';


export class CanvasDataPlot{

	parent: HTMLElement;
	canvasDimensions: Array<number>;
	config: CanvasDataPlot.Config;
	xAxisLabelText: 
	
	
	
	constructor(parentElement: HTMLElement, canvasDimensions: Array<number>, xAxisLabelText = "",
	 ){
		this.parent = parentElement;
		this.canvasDimensions = canvasDimensions;
		this.config =  config;
	
	}
	

}

export namespace CanvasDataPlot{
	export interface Config{
		xAxisLabel: string,
		yAxisLabel: string,
		markerLineWidth:Number,
		markerRadius: Number
	}
	
}

