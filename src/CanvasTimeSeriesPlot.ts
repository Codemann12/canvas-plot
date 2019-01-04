
import * as d3 from 'd3';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';
import * as $ from "jquery";
import { namespace, D3ZoomEvent, ZoomBehavior, ZoomTransform, Selection, ticks } from 'd3';
import {CanvasDataPlot} from './CanvasDataPlot'


export class CanvasTimeSeriesPlot{
    informationDensity: Array<number>;
    plotLineWidth: number;
    maxInformationDensity: number;
    showMarkerDensity: number;
   
	
	constructor(parentElement: d3.Selection<any, {} , HTMLElement , {}>, canvasDimensions: Array<number>, config: CanvasDataPlot.Config = {}){
        config = config || {};
        this.informationDensity = [];
        this.plotLineWidth = config.plotLineWidth || 1;
        this.maxInformationDensity = config.maxInformationDensity || 2.0;
        this.showMarkerDensity = config.showMarkerDensity || 0.14;
        CanvasDataPlot.call(this, parentElement, canvasDimensions, config);
        Object.setPrototypeOf(CanvasTimeSeriesPlot.prototype, Object.create(CanvasDataPlot.prototype));
    }
   
    
    addDataSet (uniqueID: string, label: string, dataSet: Array<[Date, number]>, colorString: string, updateDomains: boolean, copyData: boolean): void{
        this.informationDensity.push(1);
        CanvasDataPlot.prototype.addDataSet.call(this, uniqueID, label, dataSet, colorString, updateDomains, copyData);      
    }


    removeDataSet(uniqueID: string): void{
        var index = CanvasDataPlot.prototype.dataIDs.indexOf(uniqueID);
        if(index >= 0) {
            this.informationDensity.splice(index, 1);
        }
        CanvasDataPlot.prototype.removeDataSet.call(this, uniqueID);
    }


    updateDisplayIndices(): void{
        CanvasDataPlot.prototype.updateDisplayIndices.call(this);
    
        var nDataSets = CanvasDataPlot.prototype.data.length;
        for(var i=0; i<nDataSets; ++i) {
            var d = CanvasDataPlot.prototype.data[i];
            if(d.length < 1) {
                continue;
            }
            var iStart = CanvasDataPlot.prototype.displayIndexStart[i];
            var iEnd = CanvasDataPlot.prototype.displayIndexEnd[i];
            var iLength = iEnd - iStart + 1;
            var scaleLength =  Math.max(1, CanvasDataPlot.prototype.xScale(d[iEnd][0]) - CanvasDataPlot.prototype.xScale(d[iStart][0]));
            this.informationDensity[i] = iLength/scaleLength;
        }
    }


    updateTooltipn(): void{
        var mouse = d3.mouse(CanvasDataPlot.prototype.div.node());
        var mx = mouse[0] - CanvasDataPlot.prototype.margin.left;
        var my = mouse[1] - CanvasDataPlot.prototype.margin.top;
        if(mx <= 0 || mx >= CanvasDataPlot.prototype.width || my <= 0 || my >= CanvasDataPlot.prototype.height) {
            CanvasDataPlot.prototype.removeTooltip();
            return;
        }
    
        var nDataSets = CanvasDataPlot.prototype.data.length;
        var hitMarker = false;
        TimeSeriesPlot_updateTooltip_graph_loop:
        for(var i=0; i<nDataSets; ++i) {
            if(this.informationDensity[i] > this.showMarkerDensity) {
                continue;
            }
            var d = CanvasDataPlot.prototype.data[i];
            var iStart = CanvasDataPlot.prototype.displayIndexStart[i];
            var iEnd = Math.min(d.length-1, CanvasDataPlot.prototype.displayIndexEnd[i]+1);
            for(var j=iStart; j<=iEnd; ++j) {
                var dx = CanvasDataPlot.prototype.xScale(d[j][0]) - mx;
                var dy = CanvasDataPlot.prototype.yScale(d[j][1]) - my;
                if(dx*dx + dy*dy <= CanvasDataPlot.prototype.tooltipRadiusSquared) {
                    hitMarker = true;
                    CanvasDataPlot.prototype.showTooltip([CanvasDataPlot.prototype.xScale(d[j][0]), 
                    CanvasDataPlot.prototype.yScale(d[j][1])], CanvasDataPlot.prototype.dataColors[i],
                    CanvasDataPlot.prototype.getTooltipStringX(d[j]), CanvasDataPlot.prototype.getTooltipStringY(d[j]));
                    break TimeSeriesPlot_updateTooltip_graph_loop;
                }
            }
        }
        if(!hitMarker){
            CanvasDataPlot.prototype.removeTooltip();
        }
    }
    

    getTooltipStringX(dataPoint: Array<Date>): string{
        var zeroPad2 = function(n: number): string{
            return n<10 ? ("0"+n) : n.toString();
        };
        var date = dataPoint[0];
        var Y = date.getUTCFullYear();
        var M = zeroPad2(date.getUTCMonth());
        var D = zeroPad2(date.getUTCDay());
        var h = zeroPad2(date.getUTCHours());
        var m = zeroPad2(date.getUTCMinutes());
        var s = zeroPad2(date.getUTCSeconds());
        return Y+"-"+M+"-"+D+" "+h+":"+m+":"+s;
    }



	
}


