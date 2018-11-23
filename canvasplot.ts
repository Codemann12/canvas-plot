
import * as d3 from 'd3';
import * as d3Axis from 'd3-axis';
import { namespace, D3ZoomEvent, ZoomBehavior, ZoomTransform, Selection } from 'd3';


export class CanvasDataPlot {

	parent: d3.Selection<HTMLElement, any , HTMLElement , any>;
	canvasDimensions: Array<number>;
	config: CanvasDataPlot.Config;
	data : Array<Array<[number, number]>>;
	dataIDs: Array<number>;
	dataLabels: Array<String>;
	displayIndexStart: Array<number>; 
	displayIndexEnd: Array<number>;
	dataColors : Array<string>;
	xAxisLabelText: string;
	yAxisLabelText: string;
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
	legendWidth: number;
	height: number;
	zoomListener: any;  //ZoomBehavior

	div: d3.Selection<any, {} , any , {}>;
	d3Canvas: d3.Selection<any, {} , any , {}>;
	canvas: d3.Selection<any, {} , any , {}>;
	svg: d3.Selection<any, {} , any , {}>;
	svgTranslateGroup: d3.Selection<any, {} , any , {}>;

	xScale: d3Axis.AxisScale<number>;
	yScale: d3Axis.AxisScale<number>;
	xAxis: d3Axis.Axis<number>;
	yAxis: d3Axis.Axis<number>;
	xAxisLabel: d3.Selection<any, {} , any , {}>;
	yAxisLabel: d3.Selection<any, {} , any , {}>;
	yAxisGroup: d3.Selection<any, {} , any , {}>;
	xAxisGroup: d3.Selection<any, {} , any , {}>;

	tooltip: d3.Selection<any, {} , any , {}> ;
	legend: d3.Selection<any, {} , any , {}>;
	legendBG: d3.Selection<any, {} , any , {}>;

	showTooltips: boolean;
	xAxisZoom: boolean;
	yAxisZoom: boolean; 

	
	
	
	constructor(parentElement: d3.Selection<HTMLElement, any , HTMLElement , any>, canvasDimensions: Array<number>, config: CanvasDataPlot.Config = {}){
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

		//Append to the selected HTMLElement a div with the listed properties
        this.div = this.parent.append("div")
	   	    .attr("class", "cvpChart")
		    .style("width", this.totalWidth + "px")
		    .style("width", this.totalHeight + "px")

	   this.d3Canvas = this.div.append("canvas")
		   .attr("class", "cvpCanvas")
		   .attr("width", this.width)
		   .attr("height", this.height)
		   .style("padding", this.margin.top + "px " + this.margin.right + "px " + this.margin.bottom + "px " + this.margin.left + "px");

	   this.canvas = this.d3Canvas.node().getContext("2d");

	   this.svg = this.div.append("svg")
		   .attr("class", "cvpSVG")
		   .attr("width", this.totalWidth)
		   .attr("height", this.totalHeight);

	   this.svgTranslateGroup = this.svg.append("g")
		   .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
		  

		this.xScale = null;
		this.yScale = null;
		this.xAxis  = null;
		this.yAxis  = null;

	this.yAxisGroup = this.svgTranslateGroup.append("g")
		.attr("class", "y cvpAxis")
		.call(this.yAxis);

	this.xAxisGroup = this.svgTranslateGroup.append("g")
		.attr("class", "x cvpAxis")
		.attr("transform", "translate(0,"+this.height+")")
		.call(this.xAxis);

	this.xAxisLabel = null;
	this.yAxisLabel = null;
	if(this.xAxisLabelText.length > 0) {
		this.xAxisLabel = this.svgTranslateGroup.append("text")
			.attr("class", "cvpLabel")
			.attr("x", Math.round(0.5*this.width))
			.attr("y", this.height + 40)
			.attr("text-anchor", "middle")
			.text(this.xAxisLabelText);
	}


	if(this.yAxisLabelText.length > 0) {
		this.yAxisLabel = this.svg.append("text")
			.attr("class", "cvpLabel")
			.attr("x", Math.round(-0.5*this.height - this.margin.top))
			.attr("y", 15)
			.attr("transform", "rotate(-90)")
			.attr("text-anchor", "middle")
			.text(this.yAxisLabelText);
	}

	this.tooltip = null;
	this.legend = null;
	this.legendBG = null;
	this.legendWidth = 0;
	

	if(this.showTooltips) {
		//define updateTooltip later
		//this.div.on("mousemove", (this.updateTooltip).bind(this));
	}

	this.xAxisZoom = true;
	this.yAxisZoom = true;
	
	/*this.resetZoomListenerAxes();
	setupXScaleAndAxis(): void{};
	setupYScaleAndAxis(): void{};
	drawCanvas(): void {};
	
	*/	
	
	}
	zoomFunction(): void {}
	drawCanvas(): void {};

    addDataSet(uniqueID: number, label: string, dataSet: Array<[number, number]>, colorString: string, updateDomains: boolean, copyData: boolean){
    	this.dataIDs.push(uniqueID);
		this.dataLabels.push(label);
		this.dataColors.push(colorString);
		this.displayIndexStart.push(0);
		this.displayIndexEnd.push(0);
		dataSet = dataSet || [];
		if(copyData) {
			var dataIndex = this.data.length;
			this.data.push(); // this is not secure 
			var dataSetLength = dataSet.length;
			for(var i=0; i<dataSetLength; ++i) {
				this.data[dataIndex].push(dataSet[i].slice();  // slice return array 
			}
		}
		else {
			this.data.push(dataSet);
		}

		this.updateLegend();

		if(updateDomains) {
			this.updateDomains(this.calculateXDomain(), this.calculateYDomain(), true);
		}
		else {
			this.updateDisplayIndices();
			this.drawCanvas();
		}
	}





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

