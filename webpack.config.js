module.exports = {
    entry: './src/awesomeSezzle.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: 'var',
      library: 'AwesomeSezzle'
    },
    module: {
        rules: [
            {
            test: /\.(css|scss)$/,
            use: [
                'style-loader',
                'css-loader',
                'sass-loader'
            ]
            },
            {
               test: /\.(png|svg|jpg|gif)$/,
               use: [
                 'file-loader'
               ]
            }
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
  };