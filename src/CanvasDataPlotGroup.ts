import {CanvasTimeSeriesPlot} from './CanvasTimeSeriesPlot'
import {CanvasDataPlot} from './CanvasDataPlot'
import {CanvasVectorSeriesPlot} from './CanvasVectorSeriesPlot'


export class CanvasDataPlotGroup {
    defaultConfig: CanvasDataPlotGroup.defaultConfig;
	container: d3.Selection<any, {} , HTMLElement , {}>;
	plots: Array<CanvasDataPlot>;
	firstPlotType: string;
	multiplePlots: boolean;
	syncPlots: boolean;
	syncTranslateX: boolean;
	syncTranslateY: boolean;
    lastZoomedPlot: CanvasDataPlot;
    zoomXAxis: boolean;
    zoomYAxis: boolean;

   
	
    constructor(parentElement: d3.Selection<any, {} , HTMLElement , {}>, plotDimensions:Array<number>, 
        multiplePlots: boolean, syncPlots: boolean, defaultConfig: CanvasDataPlotGroup.defaultConfig = {}){
            this.defaultConfig = CanvasDataPlot.prototype.CanvasPlot_shallowObjectCopy(defaultConfig);
            this.container = parentElement;
            CanvasDataPlot.prototype.width = plotDimensions[0];
            CanvasDataPlot.prototype.height = plotDimensions[1];
            this.plots = [];
            this.firstPlotType = "";
            this.multiplePlots = multiplePlots;
            this.syncPlots = syncPlots;
            this.syncTranslateX = true;
            this.syncTranslateY = false;
            this.lastZoomedPlot = null;
            this.zoomXAxis = true;
            this.zoomYAxis = true;    
            this.defaultConfig["updateViewCallback"] = (this.multiplePlots ? (this.setViews).bind(this) : null);    
    }

    addDataSet(plotType: string, uniqueID: string, displayName: string, dataSet: Array<[Date, number]> , color: string, plotConfig: CanvasDataPlot.Config): void {
        if(this.multiplePlots || this.plots.length < 1) {
            var config: CanvasDataPlot.Config = null;
         if(<any>plotConfig) {
                config = CanvasDataPlot.prototype.CanvasPlot_shallowObjectCopy(plotConfig);
                CanvasDataPlot.prototype.CanvasPlot_appendToObject(config, this.defaultConfig);
            }
            else {
                config = this.defaultConfig;
            }
            if(<any>plotConfig && this.multiplePlots) {
                config["updateViewCallback"] = (this.setViews).bind(this);
            }
            var p: CanvasDataPlot = this.createPlot(plotType, config);
            p.addDataSet(uniqueID, displayName, dataSet, color, false);
            p.setZoomXAxis(this.zoomXAxis);
            p.setZoomYAxis(this.zoomYAxis);
            this.plots.push(p);
            this.firstPlotType = plotType;
            this.fitDataInViews();
        }
        else if(plotType === this.firstPlotType) {
            this.plots[0].addDataSet(uniqueID, displayName, dataSet, color, true);
        }
    }


    removeDataSet(uniqueID: string){
        if(this.multiplePlots) {
            var nPlots = this.plots.length;
            for(var i=0; i<nPlots; ++i) {
                if(this.plots[i].getDataID(0) === uniqueID) {
                    if(this.lastZoomedPlot === this.plots[i]) {
                        this.lastZoomedPlot = null;
                    }
                    this.plots[i].destroy();
                    this.plots.splice(i, 1);
                    break;
                }
            }
        }
        else if(this.plots.length > 0) {
            this.plots[0].removeDataSet(uniqueID);
        }
    }

    
    setSyncViews(sync: boolean, translateX: boolean, translateY: boolean) {
        this.syncPlots = sync;
        this.syncTranslateX = translateX;
        this.syncTranslateY = translateY;
        if(sync) {
            if(this.lastZoomedPlot) {
                var xDomain = this.lastZoomedPlot.getXDomain();
                var yDomain = this.lastZoomedPlot.getYDomain();
                this.plots.forEach((function(p: CanvasDataPlot) {
                    if(p != this.lastZoomedPlot) {
                        p.updateDomains(this.syncTranslateX ? xDomain : p.getXDomain(),
                            this.syncTranslateY ? yDomain : p.getYDomain(),
                            false);
                    }
                }).bind(this));
            }
            else {
                this.fitDataInViews();
            }
        }
    }

 

    setZoomXAxis(zoomX: boolean): void{
        this.zoomXAxis = zoomX;
        this.plots.forEach(function(p: CanvasDataPlot) {
            p.setZoomXAxis(zoomX);
        });
    }
    
    setZoomYAxis(zoomY: boolean): void{
        this.zoomYAxis = zoomY;
        this.plots.forEach(function(p: CanvasDataPlot) {
            p.setZoomYAxis(zoomY);
        });
    }

    fitDataInViews(): void{
        if(this.plots.length < 1) {
            return;
        }
    
        var xDomain = this.plots[0].calculateXDomain();
        var yDomain = this.plots[0].calculateYDomain();
    
        for(var i=1; i<this.plots.length; ++i) {
            var xDomainCandidate = this.plots[i].calculateXDomain();
            var yDomainCandidate = this.plots[i].calculateYDomain();
            if(xDomainCandidate[0] < xDomain[0]) { xDomain[0] = xDomainCandidate[0]; }
            if(xDomainCandidate[1] > xDomain[1]) { xDomain[1] = xDomainCandidate[1]; }
            if(yDomainCandidate[0] < yDomain[0]) { yDomain[0] = yDomainCandidate[0]; }
            if(yDomainCandidate[1] > yDomain[1]) { yDomain[1] = yDomainCandidate[1]; }
        }
    
        this.plots.forEach(function(p: CanvasDataPlot) {
            p.updateDomains(xDomain, yDomain, true);
        });
    }


    resizePlots(dimensions: Array<number>): void{
        CanvasDataPlot.prototype.width = dimensions[0];
        CanvasDataPlot.prototype.height = dimensions[1];
        this.plots.forEach(function(p) {
            p.resize(dimensions);
        });
    }
    
    destroy(): void{
        this.plots.forEach(function(p) {
            p.destroy();
        });
        this.lastZoomedPlot = null;
        this.plots = [];
    }


    private createPlot (plotType: string, plotConfig: CanvasDataPlot.Config): any {
        if(plotType === "CanvasTimeSeriesPlot") {
            return new CanvasTimeSeriesPlot(this.container, [CanvasDataPlot.prototype.width, CanvasDataPlot.prototype.height], plotConfig);
        }
        if(plotType === "CanvasVectorSeriesPlot") {
            return new CanvasVectorSeriesPlot(this.container, [CanvasDataPlot.prototype.width, CanvasDataPlot.prototype.height], plotConfig);
        }
        return new CanvasDataPlot(this.container, [CanvasDataPlot.prototype.width, CanvasDataPlot.prototype.height], plotConfig);
    }

    
    private setViews(except: CanvasDataPlot, xDomain: Array<Date>, yDomain: Array<number>): void{
        this.lastZoomedPlot = except;
        if(!this.syncPlots) {
            return;
        }
        this.plots.forEach((function(p: CanvasDataPlot) {
            if(p != except) {
                p.updateDomains(this.syncTranslateX ? xDomain : p.getXDomain(),
                    this.syncTranslateY ? yDomain : p.getYDomain(),
                    false);
            }
        }).bind(this));
    }
    
    

}


export namespace CanvasDataPlotGroup{
	export interface defaultConfig{
        [key: string]: any
    }
}