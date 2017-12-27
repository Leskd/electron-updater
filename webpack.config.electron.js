import path from 'path';

export default {
    // devtool: 'source-map',

    target: 'electron-main',

    entry: './src/main/main.js',

    // 'main.js' in root
    output: {
        path: __dirname,
        // filename: './src/main/main.prod.js'
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['env']
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json'],
        modules: [
            path.join(__dirname, 'src'),
            'node_modules',
        ],
    },

    /**
     * Disables webpack processing of __dirname and __filename.
     * If you run the bundle in node.js it falls back to these values of node.js.
     * https://github.com/webpack/webpack/issues/2010
     */
    node: {
        __dirname: false,
        __filename: false
    },
};
