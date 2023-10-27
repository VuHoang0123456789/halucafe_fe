const webpack = require('webpack');

module.exports = {
    plugins: [
        // add this line to plugins
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
    resolve: {
        fallback: {
            // add this line to resolve.fallback
            buffer: require.resolve('buffer'),
        },
    },
};
