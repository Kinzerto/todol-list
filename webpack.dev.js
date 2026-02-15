import { merge } from 'webpack-merge';
import common from './webpack.common.js';

export default merge(common, {
    mode: "development",
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ],
            }
        ]
    },
    devServer: {
        watchFiles: ["./src/template.html"],
    },
});