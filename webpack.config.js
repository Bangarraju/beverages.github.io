const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssextractPlugin = require("mini-css-extract-plugin");
const path = require("path")

module.exports={
    entry:{
        main: './src/js/index.js',
        form:'./src/js/form.js'
    },
    output:{
        path: path.resolve(__dirname,'dist'),
        filename: '[name].js'
    },
    module:{
        rules:[
            {
                test:/\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: "babel-loader"
                }
            },
            {
                test:/\.html$/,
                use:[
                    {
                        loader:"html-loader",
                        options:{minimize: true}
                    }
                ]
            },
            {
                test:/\.scss$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            chunks:['main']
        }),
        new HtmlWebPackPlugin({
            template: "./src/form.html",
            filename: "./form.html",
            chunks : ['form']
        }),
        new MiniCssextractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        
    ]
}