/*
 * Created with @iobroker/create-adapter v2.6.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from '@iobroker/adapter-core';
import { getStates } from './states';
import { CommonState, Login, TagResponse, WaterkotteError } from './types';
import { WaterkotteCgi } from './waterkotte';

// Load your modules here, e.g.:
// import * as fs from "fs";

class WaterkotteEasycon extends utils.Adapter {
    states: CommonState[] = [];
    api: WaterkotteCgi | undefined;
    updateParametersInterval: ioBroker.Interval | undefined;
    login: Login = <Login>{};
    public constructor(options: Partial<utils.AdapterOptions> = {}) {
        super({
            ...options,
            name: 'waterkotte-easycon',
        });
        this.on('ready', this.onReady.bind(this));
        //this.on('stateChange', this.onStateChange.bind(this));
        //this.on('objectChange', this.onObjectChange.bind(this));
        //this.on('message', this.onMessage.bind(this));
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    private async onReady(): Promise<void> {
        this.setStateAsync('info.connection', false, true);

        this.api = new WaterkotteCgi(this.config.ipAddress, this.log);

        try {
            this.login = await this.api.loginAsync(this.config.username, this.config.password);
            this.log.debug('Successfully logged in');
            await this.setStateAsync('info.connection', true, true);
            await this.setMessageStateAsync('');
        } catch (e: unknown) {
            let message = String(e);
            this.log.warn('error ' + message);
            if (e instanceof WaterkotteError) {
                message = `${e.code} - ${e.message}`;
            }

            this.log.error(message);
            await this.setMessageStateAsync(message);
            return;
        }

        this.states = getStates(
            this.config.pollStatesOf ?? ['Heizen', 'Kühlen', 'Wasser', 'Energiebilanz', 'Messwerte', 'Status'],
            this.language,
        );

        await this.updateParametersAsync(this.states);
        const interval = this.setInterval(
            async (states) => await this.updateParametersAsync(states as CommonState[]),
            this.config.pollingInterval,
            this.states,
        );

        if (interval) {
            this.updateParametersInterval = interval;
        }
    }

    private async updateParametersAsync(states: CommonState[]): Promise<void> {
        if (!this.api) {
            throw new Error('Unable to update parameters because api has not been initialized');
        }

        try {
            const tagResponses = await this.api.getTagsAsync(states, this.login);

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

                const id = tagResponse.state.getStateId();
                await this.extendObjectAsync(id, {
                    type: 'state',
                    common: tagResponse.state.getCommonObject(),
                    native: {},
                });

                await this.setStateAsync(
                    id,
                    tagResponse.state.normalizeValue(Number(tagResponse.response.value)),
                    true,
                );
            }
        } catch (e: unknown) {
            let message: string = 'unknown';
            if (e instanceof WaterkotteError) {
                message = `Received unknown error from heat pump: ${e.code} - ${e.message}`;
            } else if (typeof e === 'string') {
                message = e;
            } else if (e instanceof Error) {
                message = e.message;
            }
            this.log.warn(`Error during update: '${message}'`);
            await this.setMessageStateAsync(message);
        }
    }

    private async setMessageStateAsync(message: string): Promise<void> {
        await this.extendObjectAsync('info.message', {
            type: 'state',
            common: {
                write: false,
                type: 'string',
            },
            native: {},
        });
        await this.setStateAsync('info.message', message, true);
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    private onUnload(callback: () => void): void {
        try {
            clearInterval(this.updateParametersInterval);
            try {
                this.api?.logoutAsync().then().finally();
            } catch {} // fire and forget

            callback();
        } catch (e) {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  */
    // private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

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

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  */
    // private onMessage(obj: ioBroker.Message): void {
    //     if (typeof obj === 'object' && obj.message) {
    //         if (obj.command === 'send') {
    //             // e.g. send email or pushover or whatever
    //             this.log.info('send command');

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, 'Message received', obj.callback);
    //         }
    //     }
    // }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new WaterkotteEasycon(options);
} else {
    // otherwise start the instance directly
    (() => new WaterkotteEasycon())();
}
