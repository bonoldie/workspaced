import esbuild from 'esbuild';
import _ from 'lodash';

import { ENV } from '../env';
import packageJson from '../../package.json';
import { logginPlugin } from './plugins/loggin.plugin';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8081;

function generateRenderersDefines(renderers: string[],) {
    return {
        __RENDERERS__:
            JSON.stringify(
                _.fromPairs(
                    _.map(
                        renderers,
                        (renderer) => [
                            _.upperCase(_.snakeCase(renderer)),
                            `${renderer}.renderer.html`
                        ])
                )
            )
    }
}

const define = {
    __VERSION__: JSON.stringify(packageJson.version),
    __DEBUG__: JSON.stringify(ENV.debug),
};

export const MAIN_ESBUILD_DEV_CONFIGS: esbuild.BuildOptions = {
    entryPoints: {
        'main': ENV.compilation.input.main,
        'preload': ENV.compilation.input.preload,
    },
    outdir: ENV.compilation.outDirs.dev,
    platform: 'node',
    packages: 'external',
    bundle: true,
    plugins: [
        logginPlugin({
            name: 'Main'
        }),
    ],
    sourcemap: ENV.debug,
    define: {
        ...define,
        ...{
            // Node env
            'process.env.NODE_ENV': JSON.stringify('development'),
            __NODE_ENV__: JSON.stringify('development'),

            // Dev server
            __DEV_SERVER__: JSON.stringify({
                HOST,
                PORT,
            }),

            // Renderers
            ...generateRenderersDefines(_.keys(ENV.compilation.input.renderers)),
        }
    },
}

export const MAIN_ESBUILD_PROD_CONFIGS: esbuild.BuildOptions = {
    entryPoints: {
        'main': ENV.compilation.input.main,
        'preload': ENV.compilation.input.preload,
    },
    outdir: ENV.compilation.outDirs.prod,
    platform: 'node',
    packages: 'external',
    bundle: true,
    minify: true,
    plugins: [
        logginPlugin({
            name: 'Main'
        })
    ],
    sourcemap: false,
    define: {
        ...define,
        ...{
            // Node env
            'process.env.NODE_ENV': JSON.stringify('production'),
            __NODE_ENV__: JSON.stringify('production'),

            // Renderers
            ...generateRenderersDefines(_.keys(ENV.compilation.input.renderers)),
        }
    },
    jsx: 'automatic',
}