
import * as d3 from 'd3';
import { namespace } from 'd3';
//d3.select('body');

export class CanvasDataPlot{

	parentElement: HTMLElement;
	canvasDimensions: Array<number>;
	config: CanvasDataPlot.Config;
	//let pair: [Number, Number]
	//data:Array<pair>;
	
	
	 // Not sure if the enum Config would work like this but .
	 /* usage!
		import{CanvasDataPlot} from './CanvasDataPlot';
		let canva = new CanvasDataPlot();
		canva.config = CanvasDataPlot.Config.xAxisLabel
	 */
	constructor(parentElement: HTMLElement, canvasDimensions: Array<number>, config:CanvasDataPlot.Config){
		this.parentElement = parentElement;
		this.canvasDimensions = canvasDimensions;
		let x : [Number]
		this.config =  config;
	//	this.data = [];

	}

}
export namespace CanvasDataPlot
{
	export enum Config{
		xAxisLabel,
		yAxisLabel,
		markerLineWidth,
		markerRadius
	}
}

