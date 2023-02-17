import _ from "lodash"
import { readFileSync } from "fs"
import { LOG } from "./loggin"

type Env = {
    compilation: {
        input: {
            main: string,
            preload: string,
            renderers: {
                [renderer in string]: string;
            }
        }
        outDirs: {
            dev: string,
            prod: string,
            packed: string,
        },
    },
    debug: boolean,
}

const ENV_FILES = [
    '.env.default.json',
    '.env.json',
];

function loadEnv(): Env {
    LOG.info('Loading env...');

    const env: Env = {
        compilation: {
            input: {
                main: 'packages/main/src/index.ts',
                preload: 'packages/main/src/preload.ts',
                renderers: {}
            },
            outDirs: {
                dev: 'build',
                prod: 'release/app/dist',
                packed: 'release/packed'
            }
        },
        debug: false
    };

    _.each(
        ENV_FILES,
        (envFileName) => {
            let envFileContent;
            try {
                envFileContent = readFileSync(envFileName, { encoding: 'utf-8' });
            } catch (e) {
                LOG.error(`Cannot read env file '${envFileName}'`);
                return;
            }

            const envFile: Env = JSON.parse(envFileContent);
            _.merge(env, envFile);
        }
    );

    return env;
}

export const ENV = loadEnv();