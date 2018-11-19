
import * as d3 from 'd3';
import { namespace, D3ZoomEvent, ZoomBehavior, ZoomTransform } from 'd3';


export class CanvasDataPlot{

	parent: HTMLCanvasElement;
	canvasDimensions: Array<number>;
	config: CanvasDataPlot.Config;
	data : Array<[number, number]>;
	dataIDs: Array<number>;
	dataLabels: Array<String>;
	displayIndexStart: Array<number>; 
	displayIndexEnd: Array<number>;
	dataColors : Array<String>;
	xAxisLabelText: String;
	yAxisLabelText: String;
	updateViewCallback: undefined; //check the type later 
	
	disableLegend: boolean;
	invertYAxis: boolean;
	gridColor: String;
	markerLineWidth: number;
	markerRadius: number;
	xTicksPerPixel: number;
	yTicksPerPixel: number;
	minCancasWidth: number;
	minCancasHeigth: number;
	legendMargin: number;
	legendXPadding: number;
	legendYPadding: number;
	legendLineHeight: number;
	margin: CanvasDataPlot.PlotMargins;
	showToolstips: boolean;
	tooltipRadiusSquared: number;
	totalWidth: number;
	totalHeight: number;
	width: number;
	height: number;
	zoomListener: any;  //ZoomBehavior

	div: HTMLCanvasElement;
	d3Canvas: HTMLCanvasElement;
	canvas: CanvasRenderingContext2D;
	svg: HTMLCanvasElement;
	svgTranslateGroup: HTMLCanvasElement;

	
	
	
	constructor(parentElement: HTMLCanvasElement, canvasDimensions: Array<number>, config: CanvasDataPlot.Config = {}){
		this.parent = parentElement;
		this.canvasDimensions = canvasDimensions;
		this.config = config;
		this.data = [];
		this.dataIDs = [];
		this.dataLabels = [];
		this.displayIndexStart = [];
		this.displayIndexEnd = [];
		this.dataColors = [];
		this.xAxisLabelText = config.xAxisLabel || "";
		this.yAxisLabelText = config.yAxisLabel || "";
		this.updateViewCallback = config.updateViewCallback || null;

		this.disableLegend = config.disableLegend || false;
		this.invertYAxis = config.invertYAxis || false;
		this.gridColor = config.gridColor || "#DFDFDF";
		this.markerLineWidth = config.markerLineWidth || 1;
		this.markerRadius = config.markerRadius || 3.0;
		this.xTicksPerPixel = config.xTicksPerPixel || 1.0/92.0;
		this.yTicksPerPixel = config.yTicksPerPixel || 1.0/40.0;
		this.minCancasWidth = config.minCancasWidth || 250;
		this.minCancasHeigth = config.minCancasHeigth || 150;
		this.legendMargin = config.legendMargin || 10;
		this.legendXPadding = config.legendXPadding || 5;
		this.legendYPadding = config.legendYPadding || 6;
		this.legendLineHeight = config.legendLineHeight || 11;
		this.margin = config.plotMargins || {top: 20, right: 20, bottom: (this.xAxisLabelText.length > 0 ? 60 : 30), 
			left:(this.yAxisLabelText.length > 0) ? 65 : 50};
		this.showToolstips = (config.hasOwnProperty("showTooltips") ? config.showToolstips : true) ;
		this.tooltipRadiusSquared = config.tooltipRadius || 5.5
		this.tooltipRadiusSquared *= this.tooltipRadiusSquared;

		this.totalWidth = Math.max(this.minCancasWidth, canvasDimensions[0]);
		this.totalHeight = Math.max(this.minCancasHeigth, canvasDimensions[1]);
		this.width = this.totalWidth - this.margin.left - this.margin.right;
		this.height = this.totalHeight - this.margin.top - this.margin.bottom;

		this.zoomListener = d3.zoom().on("zoom", this.zoomFunction);

        this.parent.append("div");
		this.parent.setAttribute("class", "cvpChart");
		this.parent.style.width = this.totalWidth + "px";
		this.parent.style.height = this.totalHeight + "px";
		this.div = this.parent;

		this.div.append("canvas");
		this.div.setAttribute("class", "cvpCanvas");
		this.div.style.width = this.width + "px";
		this.div.style.height = this.height + "px";
		this.div.style.padding = this.margin.top + "px " + this.margin.bottom +"px " + this.margin.left + "px" ; 
		this.d3Canvas = this.div;

		this.canvas = this.d3Canvas.getContext("2d");
 
			
	
		
	
	}
	
	//coming soon...
	 zoomFunction(): void {}

}

export namespace CanvasDataPlot{
	export interface Config{
		xAxisLabel?: string,
		yAxisLabel?: string,
		markerLineWidth?:number,
		markerRadius?: number,
		updateViewCallback?: undefined,
		disableLegend?: boolean,
		invertYAxis?: boolean,
		gridColor?: String,
		xTicksPerPixel?: number,
		yTicksPerPixel?: number,
		minCancasWidth?: number,
		minCancasHeigth?: number,
		legendMargin?: number,
		legendXPadding?: number,
		legendYPadding?: number,
		legendLineHeight?: number,
		plotMargins?: PlotMargins,
		showToolstips?: boolean,
		hasOwnProperty?(prop: string): boolean,
		tooltipRadius?: number
	}

	export interface PlotMargins{
		top?: number,
		right?: number,
		bottom?: number,
		left?: number
	}
	
}

