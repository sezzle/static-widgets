var path = require('path')

module.exports = {
    entry: './src/awesomeSezzle.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: 'var',
      library: 'AwesomeSezzle',
      libraryExport: "default",
      publicPath:'dist/'
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
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',   
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              },

    
        
        ],
       
           
    }
  };                    