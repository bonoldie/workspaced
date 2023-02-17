import esbuild from 'esbuild';
import _ from 'lodash';
import { LOG } from '../../loggin';
import { CountQueuingStrategy } from 'stream/web';

type LogginPluginOptions = {
    name?: string;
};

export const logginPlugin = (options?: LogginPluginOptions): esbuild.Plugin => {
    return {
        name: 'loggin',
        setup(build) {
            let startTime = 0;
            let endTime = 0;

            build.onStart(() => {
                startTime = Date.now();

                LOG.info(
                    `${options?.name ? `[${options?.name}]` : ''} Changes detected`,
                );

            });

            build.onEnd((buildRes) => {
                endTime = Date.now();

                _.each(buildRes.errors, (error) => {
                    if (error.location) {
                        LOG.error(
                            `${options?.name ? `[${options?.name}]` : ''} Error ${error.id}`,
                            `at ${error.location.file ?? '???'}:${error.location.line}:${error.location.column}`,
                            `message ${error.text}`,
                        );
                    } else {
                        LOG.error(
                            `${options?.name ? `[${options?.name}]` : ''} Error ${error.id}`,
                            `message ${error.text}`,
                        );
                    }
                });

                _.each(buildRes.warnings, (warning) => {
                    if (warning.location) {
                        LOG.warning(
                            `${options?.name ? `[${options?.name}]` : ''} Warning ${warning.id}`,
                            `at ${warning.location?.file ?? '???'}:${warning.location?.line}:${warning.location?.column}`,
                            `message ${warning.text}`,
                        );
                    }
                    else {
                        LOG.warning(
                            `${options?.name ? `[${options?.name}]` : ''} Warning ${warning.id}`,
                            `message ${warning.text}`,
                        );
                    }


                });

                if(startTime) {
                    LOG.info(`${options?.name ? `[${options?.name}]` : ''} Build finished in ${endTime - startTime}ms`);
                } else {
                    LOG.warning(`${options?.name ? `[${options?.name}]` : ''} Errors in the compilation setup...`);
                }
            })
        },
    };
}
