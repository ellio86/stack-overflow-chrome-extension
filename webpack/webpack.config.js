const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
   mode: "production",
   entry: {
      // Each ts file goes here
      background: path.resolve(__dirname, "..", "src", "background.ts"),
      popup: path.resolve(__dirname, "..", "src", "popup.ts"),
      alert: path.resolve(__dirname, "..", "src", "alert.ts"),
   },
   output: {
      path: path.join(__dirname, "../dist/scripts"),
      filename: "[name].js",
   },
   resolve: {
      extensions: [".ts", ".js"],
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "ts-loader",
            exclude: /node_modules/,
         },
      ],
   },
   plugins: [
      new CopyPlugin({
         // The output gets set to /dist/scripts for the ts above, so copy from public to the parent folder of ./dist/scripts (dist)
         patterns: [{from: ".", to: "../", context: "public"}]
      }),
   ],
};