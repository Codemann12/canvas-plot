import {CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot'
import {CanvasDataPlot} from './CanvasDataPlot'


export class CanvasVectorSeriesPlot extends CanvasTimeSeriesPlot{
    vectorScale: number;
    scaleUnits: string;
    scaleLength: number;
    showMarkerDensity: number;
    scaleTextElem: any;
   
	
	constructor(parentElement: d3.Selection<any, {} , HTMLElement , {}>, canvasDimensions: Array<number>, config: CanvasDataPlot.Config = {}){
        super(parentElement, canvasDimensions, config);
        this.vectorScale = config.vectorScale || 2.0e5;
        this.scaleUnits = config.scaleUnits || "units";
        this.scaleLength = config.scaleLength || 75;
        this.scaleTextElem = null;
        
        var configCopy = this.CanvasPlot_shallowObjectCopy(config);
        //configCopy["showTooltips"] = false;
        if(!("invertYAxis" in configCopy)) {
            configCopy["invertYAxis"] = true;
        }
        
        CanvasTimeSeriesPlot.call(this, parentElement, canvasDimensions, configCopy);
        Object.setPrototypeOf(CanvasVectorSeriesPlot.prototype, Object.create(CanvasTimeSeriesPlot.prototype));
        
    }

    // the coordinates access is different to the original function in js! 2 -> 1 and 3 -> 1
    getTooltipStringY(dataPoint: [Date, number]): string {
        var roundConst = 100;
        var dir = Math.round(roundConst * 180/Math.PI * (dataPoint[1] % (2*Math.PI))) / roundConst;
        var mag = Math.round(roundConst * dataPoint[1]) / roundConst;
        return "y = " + dataPoint[1] + "; dir = " + dir + "; mag = " + mag;
    }


    getMagnitudeScale(): number {
        var xDomain = this.getXDomain();
        return this.vectorScale * this.width / (xDomain[1].getTime() - xDomain[0].getTime());
    }
    
    //Due to the  wrong reference this can throw exception
    drawCanvas(): void{
        this.updateScaleText();
        this.drawCanvas.call(this); 
    }

    drawDataSet(dataIndex: number): void{ 
        var d = this.data[dataIndex];
        if(d.length < 1) {
            return;
        }
        var iStart = this.displayIndexStart[dataIndex];
        var iEnd = this.displayIndexEnd[dataIndex];
        var informationDensity = this.informationDensity[dataIndex];
    
        var drawEvery = 1;
        if(informationDensity > this.maxInformationDensity) {
            drawEvery = Math.floor(informationDensity / this.maxInformationDensity);
        }
    
        // Make iStart divisivble by drawEvery to prevent flickering graphs while panning
        iStart = Math.max(0, iStart - drawEvery - iStart%drawEvery);
        iEnd = Math.min(d.length-1 , iEnd+drawEvery)
    
        this.canvas.lineWidth = this.plotLineWidth;
        this.canvas.strokeStyle = this.dataColors[dataIndex];
        var magScale = this.getMagnitudeScale();
        var tipSize = 10*magScale;
        for(var i=iStart; i<=iEnd; i=i+drawEvery) {
            var startX = this.xScale(d[i][0]);
            var startY = this.yScale(d[i][1]);
            var dir = -1.0*d[i][1] + 0.5*Math.PI; // second index of d change to 1: get the data instead of the date 
            var mag = magScale*d[i][1];
            
            var cosDir = Math.cos(dir);
            var sinDir = Math.sin(dir);
            
            var endX = startX+mag*cosDir;
            var endY = startY-mag*sinDir;
            
            //var tipAngle = 0.1*Math.PI;
            this.canvas.beginPath();
            this.canvas.moveTo(startX, startY);
            this.canvas.lineTo(endX, endY);
            this.canvas.stroke();
            
            this.canvas.beginPath();
            this.canvas.moveTo(startX+(mag-tipSize)*cosDir - 0.5*tipSize*sinDir,
                startY-((mag-tipSize)*sinDir + 0.5*tipSize*cosDir));
                this.canvas.lineTo(endX, endY);
                this.canvas.lineTo(startX+(mag-tipSize)*cosDir + 0.5*tipSize*sinDir,
                startY-((mag-tipSize)*sinDir - 0.5*tipSize*cosDir));
                this.canvas.stroke();
        }

    }

    updateScaleText(): void{
        if(this.disableLegend || !this.scaleTextElem) {
            return;
        }
        var newLabel = (this.scaleLength/this.getMagnitudeScale()).toFixed(1) + this.scaleUnits;
        this.scaleTextElem.text(newLabel);
        var newLength = this.scaleTextElem.node().getComputedTextLength() + this.scaleLength + 3*this.legendXPadding;
        var lengthDiff = this.legendWidth - newLength; 
        if(lengthDiff < 0) {
            this.legendWidth -= lengthDiff;
            this.legendBG.attr("width", this.legendWidth);
            this.legend
                .attr("transform", "translate("+(this.width - this.legendWidth -
                     this.legendMargin)+", "+this.legendMargin+")");
        }
    }


    updateLegend(): void {
        if(this.disableLegend) {
            return;
        }
        this.updateLegend.call(this);
    
        if(!this.legend) {
            return;
        }
    
        var oldHeight = parseInt(this.legendBG.attr("height"));
        var newHeight = oldHeight + this.legendYPadding + this.legendLineHeight;
        this.legendBG.attr("height", newHeight);
    
        this.legend.append("rect")
                .attr("x", this.legendXPadding)
                .attr("y", newHeight - Math.floor((this.legendYPadding+0.5*this.legendLineHeight)) + 1)
                .attr("width", this.scaleLength)
                .attr("height", 2)
                .attr("fill", "black")
                .attr("stroke", "none");
        this.scaleTextElem = this.legend.append("text")
                .attr("x", 2*this.legendXPadding + this.scaleLength)
                .attr("y", newHeight - this.legendYPadding);
        this.updateScaleText();
    }


   
	
}


