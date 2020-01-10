const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const StatsPlugin = require('stats-webpack-plugin');

function resolve (dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: false,
    publicPath: process.env.NODE_ENV === 'production' ? '//localhost:9002/' : '//localhost:9080/',
    productionSourceMap: false,
    configureWebpack: {
        externals: {
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'vuex': 'Vuex',
            'vue-router': 'VueRouter',
            'echarts': 'echarts',
            'ycloud-ui': 'YCLOUD'
        },
        plugins: [
            new StatsPlugin('manifest.json', {
                chunkModules: false,
                entrypoints: true,
                source: false,
                chunks: false,
                modules: false,
                assets: false,
                children: false,
                exclude: [/node_modules/]
            })
        ]
    },
    chainWebpack: config => {
        config.resolve.alias
            .set('~', resolve('src/utils/custom'))
            .set('@', resolve('src'));
        config.output.set('library', 'singleVue');
        config.output.set('libraryTarget', 'window');
        if (IS_PRODUCTION) {
            config
                .plugin('compression')
                .use(CompressionPlugin, {
                    asset: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                    cache: true
                })
                .tap(args => { });
        }
    },
    css: {
        extract: false,
        loaderOptions: {
            sass: {
                data: '@import "@/style/common.scss";'
            }
        }
    },
    devServer: {
        port: 9080,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
};