/* eslint comma-dangle: ["error",
  {"functions": "never", "arrays": "only-multiline", "objects":
"only-multiline"} ] */

const webpack = require("webpack")
const path = require("path")

const devBuild = process.env.NODE_ENV !== "production"
const nodeEnv = devBuild ? "development" : "production"

const config = {
  entry: [
    "es5-shim/es5-shim",
    "es5-shim/es5-sham",
    "babel-polyfill",
    "./client/app/bundles/Zoon/react_on_rails",
  ],

  output: {
    filename: "webpack-bundle.js",
    path: "./app/assets/webpack",
  },

  externals: [
    {
      "isomorphic-fetch": {
        root: "isomorphic-fetch",
        commonjs2: "isomorphic-fetch",
        commonjs: "isomorphic-fetch",
        amd: "isomorphic-fetch"
      }
    },
  ],

  resolve: {
    extensions: ["", ".js", ".jsx"],
    alias: {
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: require.resolve("react"),
        loader: "imports?shim=es5-shim/es5-shim&sham=es5-shim/es5-sham",
      },
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
}

module.exports = config

if (devBuild) {
  console.log("Webpack dev build for Rails") // eslint-disable-line no-console
  module.exports.devtool = "eval-source-map"
  module.exports.module.loaders.push(
    {
      enforce: "pre",
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: "eslint-loader",
      options: {
        cache: true
      }
    }
  )
  module.exports.plugins.push(new webpack.NoErrorsPlugin())
  module.exports.plugins.push(
    function() {
      this.plugin('watch-run', function(watching, callback) {
        console.log('Began compiling at ' + new Date());
        callback();
      })
    }
  )
} else {
  config.plugins.push(
    new webpack.optimize.DedupePlugin()
  )
  console.log("Webpack production build for Rails") // eslint-disable-line no-console
}
