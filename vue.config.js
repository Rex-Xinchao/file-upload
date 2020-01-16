const webpack = require('webpack');
const path = require('path');
const resolve = dir => {
    return path.join(__dirname, dir)
};
module.exports = {
    outputDir: './dist',
    integrity: true,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('@page', resolve('src/views'))
            .set('@component', resolve('src/components'))
            .set('@interface', resolve('src/interfaces'))
            .set('@lib', resolve('src/libs'))
            .set('@file', resolve('src/assets/files'))
            .set('@image', resolve('src/assets/images'))
            .set('@style', resolve('src/assets/styles'))
    },
    css: {
        extract: false,
        loaderOptions: {
            sass: {
                prependData: `@import "@/assets/styles/common.scss";`
            }
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js'
            }
        }
    },
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}
