module.exports = {
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Compiles Sass to CSS
              "sass-loader"
            ],
          },
        ],
    },
};