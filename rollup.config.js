import resolve from 'rollup-plugin-node-resolve';
 
export default {
    input: 'src/CanvasDataPlot.js',
    input: "src/CanvasTimeSeriesPlot.js",
    input: 'src/CanvasVectorSeriesPlot.js',
    input: 'src/CanvasDataPlotGroup.js',
    input: 'src/demo.js',
    
    output:{ 
        file:'src/DataPlotBundle.js',
        file:'src/TimeSeriesPlotBundle.js',
        file:'src/VectorSeriesPlotBundle.js',
        file: 'src/DataPlotGroupBundle.js',
        file: 'src/example.js',
        format: 'umd',
        name: "canvasplot"},
    plugins: [
        resolve({
            jsnext: true,
            main: true,
            module: true,
            browser: true
        })
    ],
    
};