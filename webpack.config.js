const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  devServer: {
    static: { 
      directory: path.resolve(__dirname, 'dist'),
 },
    open: true,
    hot: true,  
    port: 8080,   
  }
};