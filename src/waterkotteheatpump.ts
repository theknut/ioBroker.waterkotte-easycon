import { getServicesStates, getStates } from './states';
import { CommonState, ILogProvider, IndicatorState, Login, TagResponse } from './types';
import { WaterkotteCgi } from './waterkottecgi';

export class WaterkotteHeatPump {
    api: WaterkotteCgi;
    login: Login = <Login>{};
    tags: CommonState[] = [];

    constructor(
        ipAddress: string,
        private log: ILogProvider,
    ) {
        this.api = new WaterkotteCgi(ipAddress, log);
    }

    async connect(username: string = 'waterkotte', password: string = 'waterkotte'): Promise<boolean> {
        this.login = await this.api.loginAsync(username, password);
        return true;
    }

    async disconect(): Promise<void> {
        await this.api.logoutAsync();
    }

    async requestTagsAsync(): Promise<TagResponse[]> {
        if (this.tags.length == 0) {
            this.tags = await this.getTagsToRequest();
        }

        const tagResponses = await this.api.getTagsAsync(this.tags, this.login);
        return tagResponses;
    }

    private async getTagsToRequest(): Promise<CommonState[]> {
        const response = await this.api.getTagsAsync(getServicesStates(), this.login);
        const enabledServices = response
            .filter(
                (x) =>
                    x instanceof TagResponse &&
                    x.state instanceof IndicatorState &&
                    x.state.normalizeValue(x.response.value) === true,
            )
            .map((x) => x.state.Id);
        const states = getStates(enabledServices);
        return states;
    }
}
