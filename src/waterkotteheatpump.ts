import { getServicesStates, getStates } from './states';
import { AdapterError, CommonState, ILogProvider, IndicatorState, Login, TagResponse, WaterkotteError } from './types';
import { WaterkotteCgi } from './waterkottecgi';

export class WaterkotteHeatPump {
    api: WaterkotteCgi;
    login?: Login;
    tags: CommonState[] = [];

    constructor(
        ipAddress: string,
        private username: string,
        private password: string,
        private log: ILogProvider,
    ) {
        this.api = new WaterkotteCgi(ipAddress, log);
    }

    async connectAsync(): Promise<boolean | Error> {
        try {
            this.login = await this.api.loginAsync(this.username, this.password);
            return true;
        } catch (e: unknown) {
            if (e instanceof Error) {
                return e;
            }
            return false;
        }
    }

    async disconnectAsync(): Promise<boolean | Error> {
        try {
            await this.api.logoutAsync();
            return true;
        } catch (e: unknown) {
            if (e instanceof Error) {
                return e;
            }
            return false;
        }
    }

    async requestTagsAsync(): Promise<TagResponse[]> {
        try {
            if (!this.login) {
                const loginResult = await this.connectAsync();
                if (typeof loginResult == 'boolean') {
                    if (loginResult) {
                        this.log.debug('Successfully (re-)logged in');
                        return await this.requestTagsAsync();
                    } else {
                        this.log.error('Unhandled result when logging in');
                        return [];
                    }
                } else {
                    throw loginResult;
                }
            }

            if (this.tags.length == 0) {
                this.tags = await this.getTagsToRequest();
            }

            const tagResponses = await this.api.getTagsAsync(this.tags, this.login);
            return tagResponses;
        } catch (e: unknown) {
            if (e instanceof WaterkotteError) {
                switch (e.code) {
                    case WaterkotteError.LOGIN_REQUIRED:
                        this.login = undefined;
                        return await this.requestTagsAsync();
                    case WaterkotteError.TOO_MANY_USERS:
                        this.login = undefined;
                        this.log.warn(`Too many users, skip this request`);
                        return [];
                }
            }

            throw e;
        }
    }

    private async getTagsToRequest(): Promise<CommonState[]> {
        if (!this.login) {
            throw new AdapterError('getTagsToRequest: Not logged in');
        }

        const response = await this.api.getTagsAsync(getServicesStates(), this.login);
        const activeServices = response
            .filter(
                (x) =>
                    x instanceof TagResponse &&
                    x.state instanceof IndicatorState &&
                    x.state.normalizeValue(x.response.value) === true,
            )
            .map((x) => {
                this.log.debug(`Active service: ${JSON.stringify(x.state.Text)}`);
                return x.state.Id;
            });
        const states = getStates(activeServices);

        return states;
    }
}
