import esbuild from 'esbuild';
import _ from 'lodash';

import { sassPlugin } from 'esbuild-sass-plugin';
import { htmlPlugin } from '@craftamap/esbuild-plugin-html';
import { logginPlugin } from './plugins/loggin.plugin';

import { ENV } from '../env';
import packageJson from '../../package.json';

const define = {
    __VERSION__: JSON.stringify(packageJson.version),
    __DEBUG__: JSON.stringify(ENV.debug),

    global: 'window',
};

const loader: esbuild.BuildOptions['loader'] = {
    ".png": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl",
    ".eot": "dataurl",
    ".ttf": "dataurl",
    ".svg": "dataurl",
};


export const RENDERERS_ESBUILD_DEV_CONFIGS: esbuild.BuildOptions = {
    entryPoints: _.map(ENV.compilation.input.renderers, (inputFile, renderer) => ({ in: inputFile, out: renderer + '.renderer' })),
    outdir: ENV.compilation.outDirs.dev,
    platform: 'browser',
    bundle: true,
    plugins: [
        sassPlugin(),
        htmlPlugin({
            files: _.map(ENV.compilation.input.renderers, (inputFile, renderer) => ({
                entryPoints: [inputFile],
                filename: renderer + '.renderer.html',
                define
            }
            )),
        }),
        logginPlugin({
            name: 'Renderers',
        }),
    ],
    sourcemap: ENV.debug,
    define: {
        ...define,
        ...{
            // Node env
            'process.env.NODE_ENV': JSON.stringify('development'),
            __NODE_ENV__: JSON.stringify('development'),
        }
    },
    jsx: 'automatic',
    loader,
    metafile: true,
}

export const RENDERERS_ESBUILD_PROD_CONFIGS: esbuild.BuildOptions = {
    entryPoints: _.map(ENV.compilation.input.renderers, (inputFile, renderer) => ({ in: inputFile, out: renderer + '.renderer' })),
    outdir: ENV.compilation.outDirs.prod,
    platform: 'browser',
    bundle: true,
    minify: true,
    plugins: [
        sassPlugin(),
        htmlPlugin({
            files: _.map(ENV.compilation.input.renderers, (inputFile, renderer) => ({
                entryPoints: [inputFile],
                filename: renderer + '.renderer.html',
                define
            }
            )),
        }),
        logginPlugin({
            name: 'Renderers'
        }),
    ],
    sourcemap: false,
    define: {
        ...define,
        ...{
            // Node env
            'process.env.NODE_ENV': JSON.stringify('production'),
            __NODE_ENV__: JSON.stringify('production'),
        }
    },
    jsx: 'automatic',
    loader,
    metafile: true,

}