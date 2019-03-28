import resolve from 'rollup-plugin-node-resolve';
 
export default {
    input: "src/CanvasTimeSeriesPlot.js",
    input: 'src/demo.js',
    
    output:{ 
       
        file:'src/TimeSeriesPlotBundle.js',
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