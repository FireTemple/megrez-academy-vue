const webpack = require('webpack')


module.exports = {
    // baseUrl: './',
    // productionSourceMap: false,
    chainWebpack: config => {
        config.plugin('provide').use(webpack.ProvidePlugin, [{
            $: 'jquery',
            jquery: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }])
    },
    devServer: {
        proxy: {
            '/test': {
                target: 'http://localhost:8081',
                pathReWrite:{
                    '^/test': ''
                },
                changeOrigin: true,
                secure:false
            },
            '/api': {
                target: 'http://localhost:5000',
                pathReWrite:{
                    '^/api': ''
                },
                changeOrigin: true,
                secure:false
            },
            // '/index': {
            //     target: 'http://localhost:8081',
            //     pathReWrite:{
            //         '^/index': ''
            //     },
            //     changeOrigin: true,
            //     secure:false
            // },
        }
    }
}
