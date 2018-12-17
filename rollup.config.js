import resolve from 'rollup-plugin-node-resolve';
 
export default {
    input: 'src/canvasplot.js',
    input: 'src/demo.js',
    output:{ 
        file:'src/bundle.js',
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