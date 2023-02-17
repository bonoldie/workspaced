/**
 * Start the development setup
 */

import { argv } from 'process';

import _ from 'lodash';
import proc from 'child_process';
import * as esbuild from 'esbuild';
import { startDevServer } from '@web/dev-server';

import { ENV } from './env';
import path from 'path';
import { RENDERERS_ESBUILD_DEV_CONFIGS } from './configs/renderers.esbuild';
import { MAIN_ESBUILD_DEV_CONFIGS } from './configs/main.esbuilt';
import { LOG } from './loggin';

const host = process.env.HOST || 'localhost';
const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;

const electronArgs = [
    '--enable-source-maps',
    'node_modules/electron/cli.js',
    '--inspect=9222',
    '--trace-warnings',
    path.join(ENV.compilation.outDirs.dev, 'main.js'),
];

const targetsArg = argv.slice(2);

if (targetsArg.length === 0) {
    targetsArg.push('renderers', 'main');
}

if (targetsArg.includes('renderers')) {
    startRenderers();
}

if (targetsArg.includes('main')) {
    startMain();
}

async function startRenderers() {
    // Compile each renderer

    const buildContext = await esbuild
        .context(RENDERERS_ESBUILD_DEV_CONFIGS);

    await buildContext.watch();

    LOG.info('ESBuild watching for changes...');

    // Serve the compiled renderers's bundles locally
    // @web/dev-server has live reloading ootb
    startDevServer({
        config: {
            hostname: host,
            port,
            rootDir: ENV.compilation.outDirs.dev,
            watch: true,
            clearTerminalOnReload: false,
        },
    }).catch((e) => {
        console.log(e);
    });
}

async function startMain() {
    esbuild.build(MAIN_ESBUILD_DEV_CONFIGS).then((build) => {
        if (build.errors.length === 0) {
            // Launch the main electron script
            proc.spawn('node', electronArgs, { stdio: 'inherit' });
        }
    });
}
