/*
 * Created with @iobroker/create-adapter v2.6.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import { AdapterError, RethrowError, TagResponse, WaterkotteError } from './types';
import { WaterkotteHeatPump } from './waterkotteheatpump';

class WaterkotteEasycon extends utils.Adapter {
    api: WaterkotteHeatPump | undefined;
    updateParametersInterval: ioBroker.Interval | undefined;
    knownObjects: Record<string, CacheItem> = {};
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'waterkotte-easycon',
        });
        this.on('ready', this.onReady.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        this.setStateAsync('info.connection', false, true);

        this.knownObjects = {};
        if (this.updateParametersInterval) {
            this.clearInterval(this.updateParametersInterval);
        }

        if (!(await this.updateAndHandleConfigAsync())) {
            return;
        }

        this.api = new WaterkotteHeatPump(this.config.ipAddress, this.config.username, this.config.password, this.log);

        try {
            const response = await this.updateParametersAsync();
            if (response instanceof Error) {
                let message: string | undefined = undefined;
                if (response instanceof WaterkotteError) {
                    message = `${response.code} - ${response.message}`;
                }

                this.log.error(`Unhandled error on adapter startup: ${(message ??= String(response))}`);
                this.log.error(`Callstack: ${response.stack}`);
                await this.setMessageStateAsync(message);
                return;
            }

            this.log.info('Successfully logged in');
            await this.setStateAsync('info.connection', true, true);
            await this.setMessageStateAsync('');

            const limitedUpdateInterval = Math.min(86400, Math.max(20, this.config.updateInterval));
            const interval = this.setInterval(
                async () => await this.updateParametersAsync(),
                limitedUpdateInterval * 1000,
            );

            if (interval) {
                this.updateParametersInterval = interval;
            }

            if (this.config.updateInterval != limitedUpdateInterval) {
                this.log.warn(`Limited update interval to ${limitedUpdateInterval} seconds`);
            } else {
                this.log.info('Interval ' + limitedUpdateInterval);
            }
        } catch (e: unknown) {
            this.log.error(`Unhandled error on adapter startup: ${e}`);
            if (e instanceof Error) {
                this.log.error(`Callstack: ${e.stack}`);
            }
            await this.setMessageStateAsync(`Unhandled error on adapter startup: ${String(e)}`);
            return;
        }
    }

    private async checkConfig(): Promise<boolean> {
        let configName: string = '';

        if (!this.config.ipAddress) {
            configName = 'ip address';
        } else if (!this.config.username) {
            configName = 'username';
        } else if (!this.config.password) {
            configName = 'password';
        }

        if (!configName) {
            return true;
        }

        const message = `Unable to connect to heat pump: missing ${configName}`;
        this.log.warn(message);
        await this.setMessageStateAsync(message);

        return false;
    }

    private async updateAndHandleConfigAsync(): Promise<boolean> {
        if (!(await this.checkConfig())) {
            return false;
        }

        const info = await this.getObjectAsync('info');
        const lastConfig: ioBroker.AdapterConfig = <ioBroker.AdapterConfig>info?.native;

        if (lastConfig) {
            if (
                lastConfig.pathFlavor != this.config.pathFlavor ||
                lastConfig.removeWhitespace != this.config.removeWhitespace
            ) {
                this.log.debug('Config changed, delete all states');
                await this.deleteAllObjectsAsync();
            }
        }

        await this.extendObjectAsync('info', {
            native: <ioBroker.AdapterConfig>{
                pathFlavor: this.config.pathFlavor,
                removeWhitespace: this.config.removeWhitespace,
            },
        });
        return true;
    }

    private async deleteAllObjectsAsync(): Promise<boolean> {
        const objects = await this.getObjectListAsync({
            startkey: this.namespace,
        });

        if (objects.rows) {
            const idRoot = this.namespace + '.';
            const rootObjects = Array.from(
                new Set(
                    objects.rows
                        .filter((x) => x.id.includes(idRoot))
                        .map((x) => x.id.replace(idRoot, '').split('.')[0]),
                ),
            ).filter((x) => !x.startsWith('info'));

            for (const obj of rootObjects) {
                this.log.debug('delete ' + obj);
                await this.delObjectAsync(obj, { recursive: true });
            }
        }
        return true;
    }

    private async updateParametersAsync(): Promise<void | Error> {
        if (!this.api) {
            throw new AdapterError('Unable to update parameters because api has not been initialized');
        }

        try {
            const tagResponses = await this.api.requestTagsAsync();

            for (const tagResponse of tagResponses) {
                if (tagResponse.response.status != TagResponse.STATUS_OK) {
                    this.log.warn(
                        `Unable to get parameter '${tagResponse.response.name}'. Received '${tagResponse.response.status}' instead.`,
                    );
                    continue;
                }

                if (!tagResponse.state) {
                    continue;
                }

                const path = await this.createObjectIfNotExists(
                    tagResponse.state.Id,
                    () => {
                        let path = tagResponse.state.getPath(
                            this.config.pathFlavor,
                            this.FORBIDDEN_CHARS,
                            this.language ?? 'en',
                        );
                        if (this.config.removeWhitespace) {
                            path = path.replaceAll(/\s/g, '_');
                        }
                        return path;
                    },
                    () =>
                        <ioBroker.PartialObject>{
                            type: 'state',
                            common: tagResponse.state.getCommonObject(),
                            native: {
                                id: tagResponse.state.Id,
                            },
                        },
                    tagResponse.state,
                );

                await this.setStateAsync(path, tagResponse.state.normalizeValue(tagResponse.response.value), true);
            }

            await this.setMessageStateAsync('');
        } catch (e: unknown) {
            let returnError: Error;

            if (e instanceof Error) {
                if (e instanceof WaterkotteError) {
                    returnError = e;
                } else {
                    returnError = new RethrowError(e);
                }
            } else {
                returnError = new AdapterError(`Error during update: '${e}'`);
            }

            this.log.warn(returnError.message);
            await this.setMessageStateAsync(returnError.message);
            return returnError;
        }
    }

    private async setMessageStateAsync(message: string): Promise<void> {
        await this.createObjectIfNotExists(
            'info.message',
            () => 'info.message',
            () =>
                <ioBroker.PartialObject>{
                    type: 'state',
                    common: {
                        write: false,
                        type: 'string',
                    },
                    native: {},
                },
            message,
        );
        await this.setStateAsync('info.message', message, true);
    }

    private async createObjectIfNotExists(
        id: string,
        getPath: () => string,
        getObjPart: () => ioBroker.PartialObject,
        item: any,
    ): Promise<string> {
        const cachedItem = this.knownObjects[id];
        const cachedItemPath = cachedItem?.['path'];
        if (!cachedItemPath) {
            const path = getPath();
            await this.extendObjectAsync(path, getObjPart());
            this.knownObjects[id] = { path: path, item: item };
            this.log.silly(`${path} added to cache`);
            return path;
        } else {
            this.log.silly(`${cachedItemPath} found in cache`);
            return cachedItemPath;
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            this.clearInterval(this.updateParametersInterval);
            try {
                this.api
                    ?.disconnectAsync()
                    .then(() => {
                        this.log.info('Successfully logged out');
                    })
                    .finally();
            } catch {} // fire and forget

            callback();
        } catch (e) {
            callback();
        }
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new WaterkotteEasycon(options);
} else {
    // otherwise start the instance directly
    (() => new WaterkotteEasycon())();
}

type CacheItem = {
    path: string;
    item: any;
};
