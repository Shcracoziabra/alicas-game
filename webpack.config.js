const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./index.js",
  devtool: "source-map",
  context: path.resolve(__dirname, "src"),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  plugins : [
    new HtmlWebpackPlugin({template: "./index.html"}),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/image/*.*",
          to: "assets/image/[name][ext]",
          globOptions: {
            ignore: ["**/*.webp"]
          }
        },
        {
          from: "assets/sound/*.*",
          to: "assets/sound/[name][ext]"
        },
        {
          from: "assets/image/minified/*.*",
          to: "assets/image/[name].min[ext]"
        },
        {
          from: "css/*.css",
          to: "style.css"
        },
      ],
    }), 
  ],
  optimization: {
      minimizer: [
        "...",
        new ImageMinimizerPlugin({
            loader: true,
            minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                    plugins: [
                        ["imagemin-gifsicle"],
                        ["imagemin-mozjpeg", { quality: 15}],
                        ["imagemin-pngquant", { quality: [0.3, 0.5]}]
                    ],
                },
            },
            generator: [
                {
                    type: "asset",
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                          ["imagemin-gifsicle"],
                          ["imagemin-mozjpeg", { quality: 15}],
                          ["imagemin-pngquant", { quality: [0.3, 0.5]}]
                        ],
                    },
                },
            ],
        }),
      ],
  },
  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', { targets: ">0.25%, not dead" }]
            ]
          }
          
        }     
      },
      {
        test: /\.(scss)$/i,
        use: [
          "css-loader", "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "[name][ext]",
        }
      }
    ]
  }
}

