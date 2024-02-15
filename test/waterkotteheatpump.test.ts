import { expect } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { WaterkotteError } from '../src/types';
import { WaterkotteHeatPump } from '../src/waterkotteheatpump';

// don't run all tests with useMocks = true
// the api will return #E_TOO_MANY_USERS for a couple of minutes
let useMocks = true;

let heatPump: WaterkotteHeatPump;
let anyApi: any;
let mock: MockAdapter;

beforeEach(() => {
    heatPump = new WaterkotteHeatPump('192.168.178.46', 'waterkotte', 'waterkotte', console);
    anyApi = heatPump;
    if (useMocks) {
        mock = new MockAdapter(axios);
    }
});

afterEach(() => {
    if (useMocks) {
        mock.reset();
    }
});

describe('Waterkotte Heat Pump - login / logout', () => {
    it('Should login with proper credentials', async () => {
        mockLogin();
        const login = await heatPump.connectAsync();
        expect(login).toBeTruthy();
    }, 30000);

    it('Should logout', async () => {
        expect(useMocks).toBeTruthy();

        const data = '1\n#S_OK';
        mock.onGet(/.*logout/).reply(200, data);

        const response = await heatPump.disconnectAsync();
        expect(response).toBeTruthy();
    }, 30000);

    it('Should return error when logout fails', async () => {
        expect(useMocks).toBeTruthy();

        const data = '#E_NEED_LOGIN';
        mock.onGet(/.*logout/).reply(200, data);

        const response = await heatPump.disconnectAsync();
        expect(response).toBeInstanceOf(WaterkotteError);
    }, 30000);

    it('Should not login with wrong credentials', async () => {
        applyMock(() => {
            const data = '-49\n#E_USER_DONT_EXIST';
            mock.onGet(/.*/).reply(200, data);
        });

        const api = new WaterkotteHeatPump('192.168.178.46', 'john doe', 'jane', console);
        const error = await api.connectAsync();
        expect(error).toBeInstanceOf(WaterkotteError);
        const waterkotteError = error as WaterkotteError;

        expect(waterkotteError.message).toEqual('#E_USER_DONT_EXIST');
        expect(waterkotteError.code).toBe(-49);
    }, 30000);

    it('Should login if not connected yet', async () => {
        expect(useMocks).toBeTruthy();

        mockLogin();
        applyMock(() => {
            mock.onGet(/.*readTags\?.*/).reply(200, requestedTagsResponse);
        });

        await heatPump.requestTagsAsync();

        expect(mock.history.get.length).toBe(3);
        let loginRequest = mock.history.get[0];
        expect(loginRequest.url?.includes('login')).toBeTruthy();
        let activeServicesRequest = mock.history.get[1];
        expect(activeServicesRequest.url?.includes('readTags')).toBeTruthy();
        expect(activeServicesRequest.url?.includes('D23')).toBeTruthy();
        let getTagsRequest = mock.history.get[2];
        expect(getTagsRequest.url?.includes('readTags')).toBeTruthy();
    }, 30000);

    it('Should re-login if token is expired', async () => {
        expect(useMocks).toBeTruthy();

        mockLogin();
        applyMock(() => {
            mock.onGet(/.*readTags\?.*/).reply(200, requestedTagsResponse);
        });

        await heatPump.requestTagsAsync();

        expect(mock.history.get.length).toBe(3); // login, services, data

        mock.reset();

        mockLogin();
        applyMock(() => {
            let onGetCount = 0;
            mock.onGet(/.*readTags\?.*/).reply(function (response) {
                if (onGetCount == 0) {
                    onGetCount++;
                    return [200, WaterkotteError.NEED_LOGIN_MSG];
                } else if (onGetCount == 1) {
                    onGetCount++;
                    return [200, requestedTagsResponse];
                } else {
                    throw new Error('Too many calls');
                }
            });
        });

        const response = await heatPump.requestTagsAsync();
        expect(response).not.toHaveLength(0);
    }, 30000);
});

describe('Waterkotte Heat Pump - requestTagsAsync', () => {
    it('Should skip if too many users', async () => {
        expect(useMocks).toBeTruthy();

        mockLogin();
        applyMock(() => {
            mock.onGet(/.*readTags\?.*/).reply(200, `${WaterkotteError.TOO_MANY_USERS}\n#E_TOO_MANY_USERS`);
        });

        const response = await heatPump.requestTagsAsync();
        expect(response).toHaveLength(0);
    }, 30000);

    it('Should save credentials after successful login', async () => {
        expect(useMocks).toBeTruthy();

        mockLogin();
        applyMock(() => {
            mock.onGet(/.*readTags\?.*/).reply(200, requestedTagsResponse);
        });

        await heatPump.requestTagsAsync();
        await heatPump.requestTagsAsync();

        expect(mock.history.get.filter((x) => x.url?.includes('login'))).toHaveLength(1);
    }, 30000);

    it('Should get requested tags', async () => {
        expect(useMocks).toBeTruthy();

        mockLogin();
        applyMock(() => {
            let onGetCount = 0;
            mock.onGet(/.*readTags\?.*/).reply(function (response) {
                if (onGetCount == 0) {
                    onGetCount++;
                    return [200, getServicesReponse];
                } else if (onGetCount == 1 || onGetCount == 2) {
                    // tags are split into two calls
                    onGetCount++;
                    return [200, requestedTagsResponse];
                } else {
                    throw new Error('Too many calls');
                }
            });
        });

        await heatPump.requestTagsAsync();
    }, 30000);

    it('Should rethrow errors', async () => {
        expect(useMocks).toBeTruthy();

        const data = 'Request failed with status code 404';
        mock.onGet(/.*/).reply(404, data);

        try {
            await heatPump.requestTagsAsync();
            throw new Error('Connecting to wrong IP address did not throw error');
        } catch (e: unknown) {
            console.log('');
        }
    });
});

function applyMock(onMock: () => void) {
    if (useMocks) {
        onMock();
    }
}

function mockLogin(returnCookie: boolean = true) {
    if (useMocks) {
        applyMock(() => {
            const data = '1\n#S_OK\nIDALToken=454c65c6d74cbdd3a60ae7d548aff5a6';
            const headers: any = {
                'set-cookie': [`${anyApi.api.cookieName}=😘;`],
            };
            mock.onGet(/.*login\?.*/).reply(200, data, returnCookie ? headers : {});
        });
    }
}

const getActiveServicesResponse = `
#D23	S_OK
192	1
#D74	S_OK
192	1
#D117	S_OK
192	1
#D160	S_OK
192	0
#D196	S_OK
192	0
#D248	S_OK
192	0
#D291	S_OK
192	0
#D334	S_OK
192	0
#D232	S_OK
192	1
#D377	S_OK
192	0
#D635	S_OK
192	1
`;

const requestedTagsResponse = `#I263       S_OK
192     3
#A32    S_OK
192     0
#I30    S_OK
192     1
#A30    S_OK
192     257
#A31    S_OK
192     251
#A61    S_OK
192     20
#A90    S_OK
192     61
#A93    S_OK
192     180
#A94    S_OK
192     240
#A91    S_OK
192     -120
#A92    S_OK
192     280
#A96    S_OK
192     256
#A98    S_OK
192     -400
#A100   S_OK
192     225
#A101   S_OK
192     0
#A102   S_OK
192     -20
#A103   S_OK
192     20
#A99    S_OK
192     0
#I137   S_OK
192     0
#D24    S_OK
192     0
#A109   S_OK
192     200
#I31    S_OK
192     1
#A33    S_OK
192     257
#A34    S_OK
192     150
#A108   S_OK
192     220
#A107   S_OK
192     20
#I138   S_OK
192     0
#D75    S_OK
192     0
#A38    S_OK
192     480
#I32    S_OK
192     1
#A19    S_OK
192     439
#A37    S_OK
192     430
#A139   S_OK
192     50
#A168   S_OK
192     600
#I505   S_OK
192     12
#I507   S_OK
192     1
#I508   S_OK
192     0
#I508   S_OK
192     0
#I517   S_OK
192     0
#I518   S_OK
192     0
#I139   S_OK
192     0
#D118   S_OK
192     1
#A25    S_OK
192     0
#A26    S_OK
192     0
#A28    S_OK
192     0
#A27    S_OK
192     0
#A29    S_OK
192     0
#A1     S_OK
192     58
#A2     S_OK
192     61
#A3     S_OK
192     66
#A4     S_OK
192     104
#A5     S_OK
192     120
#A6     S_OK
192     114
#A7     S_OK
192     182
#A8     S_OK
192     103
#A10    S_OK
192     480
#A699   S_OK
192     0
#A700   S_OK
192     0
#A701   S_OK
192     0
#A702   S_OK
192     0
#A12    S_OK
192     202
#I2017  S_OK
192     0
#I2018  S_OK
192     0
#I2019  S_OK
192     0
#I2020  S_OK
192     0
#I2021  S_OK
192     0
#I2022  S_OK
192     0
#I2025  S_OK
192     0
#I2024  S_OK
192     0
#I2023  S_OK
192     0
#I2032  S_OK
192     0
#I2033  S_OK
192     0
#I2034  S_OK
192     0
#I2039  S_OK
192     0
#A13    S_OK
192     213
#A14    S_OK
192     213
#A15    S_OK
192     141
#A17    S_OK
192     -400
#A18    S_OK
192     -400
#A19    S_OK
192     439
#A20    S_OK
192     0
#A21    S_OK
192     0
#A16    S_OK
192     -400
#A1022  S_OK
192     0
#A1023  S_OK
192     0
#D581   S_OK
192     1`;

const getServicesReponse = `
#D23	S_OK
192	1
#D74	S_OK
192	1
#D117	S_OK
192	1
#D160	S_OK
192	0
#D196	S_OK
192	0
#D248	S_OK
192	0
#D291	S_OK
192	0
#D334	S_OK
192	0
#D232	S_OK
192	1
#D377	S_OK
192	0
#D635	S_OK
192	1
`;
