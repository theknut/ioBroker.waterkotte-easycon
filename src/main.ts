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
    knownObjects: Record<string, any> = {};
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'waterkotte-easycon',
        });
        this.on('ready', this.onReady.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        this.setStateAsync('info.connection', false, true);

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

            const interval = this.setInterval(
                async () => await this.updateParametersAsync(),
                this.config.pollingInterval,
            );

            if (interval) {
                this.updateParametersInterval = interval;
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
                await this.deleteAllObjectsAsync();
            }
        }

        await this.extendObjectAsync('info', { native: this.config });
        return true;
    }

    private async deleteAllObjectsAsync(): Promise<void> {
        const objects = await this.getObjectListAsync({
            startkey: this.namespace,
        });

        if (objects.rows) {
            const infoObjectId = `${this.namespace}.info`;
            for (const obj of objects.rows.filter(
                (x) => x.id.startsWith(this.namespace) && !x.id.replace(this.namespace + '.', '').includes('.'),
            )) {
                if (obj.id.startsWith(infoObjectId)) {
                    this.log.info('delete ' + obj.id);
                }
            }
            return;
        }
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

                let id = tagResponse.state.getPath(this.config.pathFlavor, this.FORBIDDEN_CHARS, this.language ?? 'en');
                if (this.config.removeWhitespace) {
                    id = id.replaceAll(/\s/g, '_');
                }

                //id = id.trim('.');

                await this.createObjectIfNotExists(
                    id,
                    {
                        type: 'state',
                        common: tagResponse.state.getCommonObject(),
                        native: {
                            id: tagResponse.state.Id,
                        },
                    },
                    tagResponse.state,
                );

                await this.setStateAsync(id, tagResponse.state.normalizeValue(tagResponse.response.value), true);
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
            {
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

    private async createObjectIfNotExists(id: string, objPart: ioBroker.PartialObject, item: any): Promise<void> {
        if (!this.knownObjects[id]) {
            await this.extendObjectAsync(id, objPart);
            this.knownObjects[id] = item;
        }
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            clearInterval(this.updateParametersInterval);
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

    /**
     * Is called if a subscribed state changes
     */
    private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
        if (state) {
            // The state was changed
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        } else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
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
