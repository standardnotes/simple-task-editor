const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    path.resolve(__dirname, 'app/main.js'),
    path.resolve(__dirname, 'app/stylesheets/main.scss'),
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: './bundle.js'
  },
  module: {
    loaders: [
      { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader' },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            { loader: 'sass-loader', query: { sourceMap: false } },
          ],
          publicPath: '../'
        }),
      },
      { test: /\.js[x]?$/, include: [
        path.resolve(__dirname, 'app'),
        path.resolve(__dirname, 'node_modules/sortablejs/Sortable.min.js'),
        path.resolve(__dirname, 'node_modules/sn-components-api/dist/dist.js')
      ], exclude: /node_modules/, loader: 'babel-loader' }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
    new uglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CopyWebpackPlugin([
      { from: './app/index.html', to: 'index.html' },
    ])
  ]
};


// const webpack = require('webpack');
// const path = require('path');
// const OpenBrowserPlugin = require('open-browser-webpack-plugin');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
//
// const extractSass = new ExtractTextPlugin("styles.css");
//
// module.exports = {
//   devServer: {
//     historyApiFallback: true,
//     hot: true,
//     inline: true,
//     contentBase: './app',
//     port: 8080
//   },
//   entry: path.resolve(__dirname, 'app/main.js'),
//   output: {
//     path: path.resolve(__dirname, 'build'),
//     publicPath: '/',
//     filename: './bundle.js'
//   },
//   module: {
//     loaders: [
//       { test: /\.css$/, include: path.resolve(__dirname, 'app'), loader: 'style-loader!css-loader' },
//       {
//         test: /\.scss$/,
//         use: extractSass.extract({
//             use: [{
//                 loader: "css-loader"
//             }, {
//                 loader: "sass-loader"
//             }],
//             // use style-loader in development
//             fallback: "style-loader"
//         })
//       },
//       { test: /\.js[x]?$/, include: [
//         path.resolve(__dirname, 'app'),
//         path.resolve(__dirname, 'node_modules/sortablejs/Sortable.min.js'),
//         path.resolve(__dirname, 'node_modules/sn-components-api/dist/dist.js')
//       ], exclude: /node_modules/, loader: 'babel-loader' }
//     ],
//   },
//
//   plugins: [
//     extractSass,
//     new webpack.HotModuleReplacementPlugin(),
//     new OpenBrowserPlugin({ url: 'http://localhost:8080' })
//   ]
// };
