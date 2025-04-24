const path = require('path');
const process = require('process');
const pathBuilder = (subpath) => path.join(process.cwd(), subpath);

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        turbopack: {
            rules: [
                {
                    test: /\.(json|png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'cesium/[path][name][ext]'
                    }
                }
            ],
            resolve: {
                alias: {
                    '@cesium/engine': pathBuilder('node_modules/@cesium/engine'),
                    cesium: pathBuilder('node_modules/cesium')
                }
            }
        }
    },
    env: {
        CESIUM_BASE_URL: '/cesium'
    }
};

module.exports = nextConfig; 