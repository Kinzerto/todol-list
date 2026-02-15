import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {

    entry: {
        app: "./src/index.js"
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/template.html",
        }),
    ],
    output: {
        filename: "main.js",
        path: path.resolve(import.meta.dirname, "dist"),
        clean: true,
    },
    module: {
        rules: [
            {
                // IMAGES
                test: /\.(png|svg|webp|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                //FONTS
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ],
    },
};