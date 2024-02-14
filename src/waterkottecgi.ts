import axios from 'axios';
import {
    AdapterError,
    CommonState,
    ILogProvider,
    Login,
    RethrowError,
    TagResponse,
    UnknownTagResponse,
    WaterkotteError,
} from './types';

export class WaterkotteCgi {
    private static readonly TAG_RESPONSE_REG_EXP =
        /\#(?<name>[\w\d]+)\s+(?<status>.*)\n(?:(?<unknown>\d+)\s+(?<value>.?\d+))?/gm;
    private static readonly LOGIN_REQUEST_REG_EXP = /(?:(?<status>\-?\d+)[\n\r]+)?(?<message>\#.*)/gm;
    private readonly cookieName = 'IDALToken';
    private baseUrl: string;
    private cgiUrl: string;
    private maximumTagsPerRequest = 75;

    constructor(
        private ipAddress: string,
        private log: ILogProvider,
    ) {
        this.baseUrl = `http://${this.ipAddress}/`;
        this.cgiUrl = `${this.baseUrl}cgi/`;
    }

    async loginAsync(username: string = 'waterkotte', password: string = 'waterkotte'): Promise<Login> {
        const loginUrl = `${this.cgiUrl}login?username=${username}&password=${password}`;
        const cookie = await this.requestAsync(loginUrl, (response) => {
            try {
                this.validateLogInOutResult(response.data);
            } catch (e: unknown) {
                if (!(e instanceof WaterkotteError && e.message === WaterkotteError.RELOGIN_ATTEMPT_MSG)) {
                    throw e;
                }
            }
            const cookie = (response.headers['set-cookie'] as string[])
                ?.find((cookie) => cookie.includes(this.cookieName))
                ?.match(new RegExp(`^${this.cookieName}=(.+?);`))?.[1];

            if (!cookie) {
                throw new AdapterError(
                    `Unable to login: Could not find login token '${this.cookieName}' - Response: '${response.data}'`,
                );
            }

            return cookie;
        });

        return <Login>{ token: cookie };
    }

    async logoutAsync(): Promise<void> {
        const logoutUrl = `${this.cgiUrl}logout`;
        await this.requestAsync(logoutUrl, (x) => this.validateLogInOutResult(x.data));
    }

    validateLogInOutResult(response: string): any {
        const extracted = this.extractWaterkotteInformation(response);
        if (extracted instanceof WaterkotteError) {
            throw extracted;
        } else if (extracted && extracted.code === 1) {
            return extracted;
        } else {
            throw new AdapterError(`Unhandled response from heat pump: ${response}`);
        }
    }

    extractWaterkotteInformation(response: string): { code: number; message: string } | undefined | WaterkotteError {
        const match = String(response).matchAll(WaterkotteCgi.LOGIN_REQUEST_REG_EXP).next()?.value?.groups;
        if (!match) {
            return undefined;
        }

        const code = match.status != undefined ? Number(match.status) : match.status;
        if (match.message?.startsWith(WaterkotteError.ERROR_INDICATOR)) {
            return new WaterkotteError(match.message, code);
        }

        return { code: code, message: match.message };
    }

    async getTagsAsync(tags: CommonState[], login: Login): Promise<TagResponse[]> {
        const tagResponses: TagResponse[] = [];
        for (let i = 0; i < tags.length; i += this.maximumTagsPerRequest) {
            const chunk = tags.slice(i, i + this.maximumTagsPerRequest);
            const record = chunk.reduce(
                (acc, item) => ({ ...acc, [item['Id']]: item }),
                {} as Record<string, CommonState>,
            );

            const tagUrl = `${this.cgiUrl}readTags?n=${chunk.length + chunk.map((x, i) => `&t${i + 1}=${x.Id}`).join('')}`;
            const response = await this.requestAsync(
                tagUrl,
                (response) => {
                    const waterkotteResponse = this.extractWaterkotteInformation(response.data);
                    if (waterkotteResponse instanceof WaterkotteError) {
                        throw waterkotteResponse;
                    }

                    return String(response.data).matchAll(WaterkotteCgi.TAG_RESPONSE_REG_EXP);
                },
                login,
            );

            for (const match of response) {
                const parameter = match.groups;
                if (!parameter) {
                    continue;
                }

                const ctor = parameter.status != TagResponse.STATUS_OK ? UnknownTagResponse : TagResponse;

                const state = record[parameter.name];

                if (!state) {
                    this.log.warn(`Could not match tag resonse for ${parameter.name} to any requested tag`);
                    continue;
                }

                tagResponses.push(
                    new ctor(
                        {
                            name: parameter.name,
                            value: parameter.value,
                            status: parameter.status,
                            unkown: parameter.unknown,
                        },
                        state,
                    ),
                );
            }
        }

        return tagResponses;
    }

    public async requestAsync<TResult>(
        url: string,
        processResponse: (response: axios.AxiosResponse<any, any>) => TResult,
        login?: Login,
    ): Promise<TResult> {
        try {
            const response = await axios.get(url, {
                headers: { Cookie: login ? `${this.cookieName}=${login.token}` : '' },
            });

            return processResponse(response);
        } catch (e: unknown) {
            // rethrow own errors
            if (e instanceof WaterkotteError || e instanceof AdapterError) {
                throw e;
            }

            const baseMessage = `Request ${url.includes('password') ? '' : `to '${url}' `}failed: `;
            if (e instanceof Error) {
                throw new RethrowError(e, `${baseMessage}${e.message}`);
            } else {
                throw new AdapterError(`${baseMessage}${String(e)}`);
            }
        }
    }

    /* async writeTags(tags: CommonState[], login: Login): Promise<void> {
        if (tags.length > 75) {
            throw new Error(`Maximum amount of tags per request exceeded (${tags.length}/75)`);
        }
        throw new Error(`Not implemented`);
        const record = tags.reduce((acc, item) => ({ ...acc, [item['Id']]: item }), {} as Record<string, CommonState>);
        var tagUrl =
            baseUrl +
            'writeTags?returnValue=true&n=' +
            tags.length +
            tags.map((x, i) => '&t' + (i + 1) + '=' + x.Id).join('');
        const response = await axios.get(tagUrl, {
            headers: { 'User-Agent': 'ioBroker', Cookie: 'IDALToken=' + login.token },
        });

        if (response.status === 200) {
            for (let match of String(response.data).matchAll(regex)) {
                const parameter = match.groups;
                console.log(`${parameter.name} ${record[parameter.name].Text} = ${parameter.value}`);
                const state = record[parameter.name];
                setOrCreate(
                    '0_userdata.0.Waterkotte.' + state.Path + '.' + state.Id,
                    state.normalizeValue(parameter.value),
                    true,
                    state.getCommonObject(),
                );
            }
        } else {
            log('Axios Status - Requesting locales: ' + response.state, 'warn');
        }
    }*/
}
