module.exports = {
    module: {
        loaders: [
            {
                test: /\.(glsl|vert|frag)$/,
                loader: 'ts-shader-loader'
            }
        ]
    }
}
