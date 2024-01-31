import { expect } from '@jest/globals';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
    AdapterError,
    CommonState,
    EnumState,
    IndicatorState,
    Login,
    ReadOnlyState,
    RethrowError,
    State,
    TagResponse,
    UnknownTagResponse,
    WaterkotteError,
} from '../src/types';
import { WaterkotteCgi } from './../src/waterkotte';

let useMocks = true;

let api: WaterkotteCgi;
let anyApi: any;
let mock: MockAdapter;

beforeEach(() => {
    api = new WaterkotteCgi('192.168.178.46', console);
    anyApi = api;
    if (useMocks) {
        mock = new MockAdapter(axios);
    }
});

afterEach(() => {
    if (useMocks) {
        mock.reset();
    }
});

describe('Waterkotte API - login', () => {
    it('Should login with proper credentials', async () => {
        mockLogin();

        const login = await api.loginAsync();
        expect(login).not.toBeUndefined();

        if (useMocks) {
            expect(login.token).toBe(`😘`);
        } else {
            expect(login.token).not.toHaveLength(0);
        }
    }, 30000);

    it('Should not login with invalid credentials', async () => {
        applyMock(() => {
            const data = '-49\n#E_USER_DONT_EXIST';
            mock.onGet(/.*/).reply(200, data);
        });

        try {
            await api.loginAsync('john doe', 'jane');
            throw new Error('Login with invalid credentials did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(WaterkotteError);
            const waterkotteError = e as WaterkotteError;

            expect(waterkotteError.message).toEqual('#E_USER_DONT_EXIST');
            expect(waterkotteError.code).toBe(-49);
        }
    }, 30000);

    it('Should handle re-login attempt', async () => {
        expect(useMocks).toBeTruthy();

        const data = '#E_RE-LOGIN_ATTEMPT';
        mock.onGet(/.*/).reply(200, data);

        try {
            await api.loginAsync();
            throw new Error('Login with invalid credentials did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
            const adapterError = e as AdapterError;
            expect(adapterError.message.includes(data)).toBeTruthy();
        }
    });

    it('Should throw if cookie was not returned', async () => {
        mockLogin(false);

        try {
            await api.loginAsync();
            throw new Error('Login with invalid credentials did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
            const adapterError = e as AdapterError;

            expect(adapterError.message.includes('Could not find login token')).toBeTruthy();
        }
    });

    it('Should logout', async () => {
        expect(useMocks).toBeTruthy();

        const data = '1\n#S_OK';
        mock.onGet(/.*logout/).reply(200, data);

        await api.logoutAsync();
    });

    it('Should handle logout error', async () => {
        expect(useMocks).toBeTruthy();

        const data = '-49\n#E_USER_DONT_EXIST';
        mock.onGet(/.*/).reply(200, data);

        try {
            await api.logoutAsync();
            throw new Error('Logout did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(WaterkotteError);
            const waterkotteError = e as WaterkotteError;

            expect(waterkotteError.message).toEqual('#E_USER_DONT_EXIST');
            expect(waterkotteError.code).toBe(-49);
        }
    });

    it('Should handle logout error', async () => {
        expect(useMocks).toBeTruthy();

        const data = '#E_RE-LOGIN_ATTEMPT';
        mock.onGet(/.*/).reply(200, data);

        try {
            await api.logoutAsync();
            throw new Error('Logout did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
            const adapterError = e as AdapterError;

            expect(adapterError.message.includes(data)).toBeTruthy();
        }
    });

    it('Should throw if login response can not be parsed', async () => {
        expect(useMocks).toBeTruthy();
        const data = 'Something unexpected was returned';
        mock.onGet(/.*/).reply(200, data);

        try {
            await api.loginAsync('john doe', 'jane');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
            const adapterError = e as AdapterError;

            expect(adapterError.message.includes(data)).toBeTruthy();
        }
    });

    it('Should not expose credentials in error message', async () => {
        expect(useMocks).toBeTruthy();
        const data = 'Something unexpected was returned';
        mock.onGet(/.*/).reply(404, data);

        try {
            await api.loginAsync();
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(RethrowError);
            const rethrowError = e as RethrowError;

            expect(rethrowError.message.startsWith('Request failed:')).toBeTruthy();
        }
    });

    it('Should log request url in error message', async () => {
        expect(useMocks).toBeTruthy();
        const data = 'Something unexpected was returned';
        mock.onGet(/.*/).reply(404, data);

        try {
            await api.requestAsync('http://');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(RethrowError);
            const rethrowError = e as RethrowError;

            expect(rethrowError.message.startsWith(`Request to 'http://`)).toBeTruthy();
        }
    });

    it('Should throw if heat pump can not be contacted', async () => {
        applyMock(() => {
            const data = 'Something unexpected was returned';
            mock.onGet(/.*/).reply(404, data);
        });

        api = new WaterkotteCgi('192.168.178.55', console);

        try {
            await api.loginAsync('john doe', 'jane');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    }, 30000);
});

describe('Waterkotte API - getTags', () => {
    it('Should handle parameter request response', async () => {
        mockLogin();
        applyMock(() => {
            mock.onGet(/.*readTags\?.*/).reply(200, tagResponseWithUnknownTag);
        });

        const login = await api.loginAsync();
        expect(login).not.toBeUndefined();
        expect(login.token).not.toBeUndefined();

        const states: CommonState[] = [];
        states.push(new ReadOnlyState('1', 'A1', 'Außentemperatur', '°C'));
        states.push(new IndicatorState('2', 'I139', 'Aktiv'));
        states.push(new EnumState('3', 'A101', 'Raumeinfluss', { 0: '0', 1: '50', 2: '100', 3: '150', 4: '200' }, '%'));
        states.push(new State('6', 'BEEF', 'Unknown Tag'));
        states.push(new ReadOnlyState('5', 'I2017', 'p1 Sauggas', 'bar'));
        states.push(new State('4', 'A3', 'Außentemperatur Ø24h', '°C'));

        const tagResponses = await api.getTagsAsync(states, login);
        expect(tagResponses).not.toBeUndefined();
        expect(tagResponses).toHaveLength(states.length);

        const sortedTagResponses = tagResponses.sort((current, next) =>
            Number(current.state.Path) < Number(next.state.Path) ? -1 : 1,
        );

        const failedTagRequest = sortedTagResponses.pop();
        expect(failedTagRequest).not.toBeUndefined();
        expect(failedTagRequest).toBeInstanceOf(UnknownTagResponse);
        expect(failedTagRequest!.response.status).toBe('E_UNKNOWNTAG');
        expect(failedTagRequest!.state).not.toBeUndefined();
        expect(failedTagRequest!.response.name).toBe(failedTagRequest!.state.Id);
        expect(failedTagRequest!.state).toBeInstanceOf(State);

        for (const tagResponse of sortedTagResponses) {
            expect(tagResponse.response.status).toBe(TagResponse.STATUS_OK);
            expect(tagResponse.state).not.toBeUndefined();
            expect(tagResponse.response.name).toBe(tagResponse.state.Id);
        }

        expect(tagResponses[0].state).toBeInstanceOf(ReadOnlyState);
        expect(tagResponses[1].state).toBeInstanceOf(IndicatorState);
        expect(tagResponses[2].state).toBeInstanceOf(EnumState);
        expect(tagResponses[3].state).toBeInstanceOf(State);
    }, 30000);

    it.each([
        { numberOfTags: 38, expectedCalls: 8 },
        { numberOfTags: 35, expectedCalls: 7 },
        { numberOfTags: 3, expectedCalls: 1 },
        { numberOfTags: 0, expectedCalls: 0 },
    ])(
        'Should get split $numberOfTags tags into $expectedCalls chunks',
        async ({ numberOfTags, expectedCalls }) => {
            applyMock(() => {
                mock.onGet(/.*/).reply(200, tagResponseWithUnknownTag);
            });

            (api as any).maximumTagsPerRequest = 5;

            const states: CommonState[] = [];
            for (let i = 0; i < numberOfTags; i++) {
                states.push(new State('Heizen.Einstellungen', 'A32', 'Heiztemperatur', '°C'));
            }

            const response = await api.getTagsAsync(states, <Login>{ token: '🥑' });
            expect(mock.history.get.length).toBe(expectedCalls);

            for (const tag of response) {
                expect(tag.state).not.toBeUndefined();
            }
        },
        30000,
    );
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
                'set-cookie': [`${anyApi.cookieName}=😘;`],
            };
            mock.onGet(/.*login\?.*/).reply(200, data, returnCookie ? headers : {});
        });
    }
}

const tagResponseWithUnknownTag = `#A32\tS_OK\n192\t-22\n#I139\tS_OK\n192\t0\n#A101\tS_OK\n192\t0\n#BEEF\tE_UNKNOWNTAG\n#A3\tS_OK\n192\t-4\n`;
const requestedTags = `[{"type":"EnumState","Path":"Heizen.Einstellungen","Id":"I263","Readonly":false,"Unit":"°C","Text":{"de":"Temperaturanpassung","en":"Temperature adjustment","fr":"Adaptation de température"},"Type":"number","ValueMap":{"0":"-2.0","1":"-1.5","2":"-1.0","3":"-0.5","4":"0.0","5":"0.5","6":"1.0","7":"1.5","8":"2.0"}},{"type":"State","Path":"Heizen.Einstellungen","Id":"A32","Readonly":false,"Unit":"°C","Text":{"de":"Heiztemperatur","en":"Heiztemperatur","fr":"Heiztemperatur"},"Type":"number","ValueMap":[]},{"type":"EnumState","Path":"Heizen.Einstellungen","Id":"I30","Readonly":false,"Text":{"de":"Betriebsmodus","en":"Betriebsmodus","fr":"Betriebsmodus"},"Type":"number","ValueMap":{"0":"Off","1":"Auto","2":"Manual"}},{"type":"ReadOnlyState","Path":"Heizen.Einstellungen","Id":"A30","Readonly":true,"Unit":"°C","Text":{"de":"aktuelle Temperatur","en":"Current temperature","fr":"Température actuelle"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Heizen.Einstellungen","Id":"A31","Readonly":true,"Unit":"°C","Text":{"de":"geforderte Temperatur","en":"Required temperature","fr":"Température de consigne"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Einstellungen","Id":"A61","Readonly":false,"Unit":"K","Text":{"de":"Schaltdifferenz Sollwert","en":"Target value switching difference","fr":"Hystérésis consigne"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Heizen.Kennlinie","Id":"A90","Readonly":true,"Unit":"°C","Text":{"de":"T Außen Ø1h","en":"T External Ø1h","fr":"T extérieure Ø1h"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Kennlinie","Id":"A93","Readonly":false,"Unit":"°C","Text":{"de":"T Heizgrenze","en":"T out begin","fr":"T encl. ext."},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Kennlinie","Id":"A94","Readonly":false,"Unit":"°C","Text":{"de":"T Heizgrenze Soll","en":"T base setpoint","fr":"T encl. chauffage"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Kennlinie","Id":"A91","Readonly":false,"Unit":"°C","Text":{"de":"T Norm-Außen","en":"T outdoor norm","fr":"T base-ext."},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Kennlinie","Id":"A92","Readonly":false,"Unit":"°C","Text":{"de":"T Heizkreis Norm","en":"T heat norm","fr":"T base-chauf.fage"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Heizen.Kennlinie","Id":"A96","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Soll","en":"Temp. calc.","fr":"Temp. consigne"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Heizen.Raumeinfluss","Id":"A98","Readonly":true,"Unit":"°C","Text":{"de":"Raumtemperatur &Oslash;1h","en":"T room 1h","fr":"T-pièce 1h"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Raumeinfluss","Id":"A100","Readonly":false,"Unit":"°C","Text":{"de":"Raumtemperatur Soll","en":"T room setpoint","fr":"T-pièce consigne"},"Type":"number","ValueMap":[]},{"type":"EnumState","Path":"Heizen.Raumeinfluss","Id":"A101","Readonly":false,"Unit":"%","Text":{"de":"Raumeinfluss","en":"Room influence","fr":"Influence pièce"},"Type":"number","ValueMap":{"0":"0","1":"50","2":"100","3":"150","4":"200"}},{"type":"State","Path":"Heizen.Raumeinfluss","Id":"A102","Readonly":false,"Unit":"K","Text":{"de":"kleinster Wert","en":"kleinster Wert","fr":"kleinster Wert"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Heizen.Raumeinfluss","Id":"A103","Readonly":false,"Unit":"K","Text":{"de":"grösster Wert","en":"grösster Wert","fr":"grösster Wert"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Heizen.Raumeinfluss","Id":"A99","Readonly":true,"Unit":"K","Text":{"de":"aktueller Wert","en":"aktueller Wert","fr":"aktueller Wert"},"Type":"number","ValueMap":[]},{"type":"Indicator","Path":"Heizen.Status","Id":"I137","Readonly":true,"Text":{"de":"Heizbetrieb","en":"Heating","fr":"Chauffage"},"Type":"boolean","ValueMap":[]},{"type":"Indicator","Path":"Heizen.Status","Id":"D24","Readonly":true,"Text":{"de":"Zeitprogramm","en":"Zeitprogramm","fr":"Zeitprogramm"},"Type":"boolean","ValueMap":[]},{"type":"State","Path":"Kühlen.Einstellungen","Id":"A109","Readonly":false,"Unit":"°C","Text":{"de":"Kühltemperatur","en":"T Cooling","fr":"T Rafraichissement"},"Type":"number","ValueMap":[]},{"type":"EnumState","Path":"Kühlen.Einstellungen","Id":"I31","Readonly":false,"Text":{"de":"Betriebsmodus","en":"Betriebsmodus","fr":"Betriebsmodus"},"Type":"number","ValueMap":{"0":"Off","1":"Auto","2":"Manual"}},{"type":"ReadOnlyState","Path":"Kühlen.Einstellungen","Id":"A33","Readonly":true,"Unit":"°C","Text":{"de":"aktuelle Temperatur","en":"Current temperature","fr":"Température actuelle"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Kühlen.Einstellungen","Id":"A34","Readonly":true,"Unit":"°C","Text":{"de":"geforderte Temperatur","en":"Required temperature","fr":"Température de consigne"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Kühlen.Einstellungen","Id":"A108","Readonly":false,"Unit":"°C","Text":{"de":"T Au&szlig;en Einsatzgrenze","en":"T out begin","fr":"T extérieure limite d'application"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Kühlen.Einstellungen","Id":"A107","Readonly":false,"Unit":"K","Text":{"de":"Schaltdifferenz Sollwert","en":"Hysteresis","fr":"Hystérésis Consigne"},"Type":"number","ValueMap":[]},{"type":"Indicator","Path":"Kühlen.Status","Id":"I138","Readonly":true,"Text":{"de":"Kühlung","en":"Cooling","fr":"Rafraichissement"},"Type":"boolean","ValueMap":[]},{"type":"Indicator","Path":"Kühlen.Status","Id":"D75","Readonly":true,"Text":"D75","Type":"boolean","ValueMap":[]},{"type":"State","Path":"Wasser.Einstellungen","Id":"A38","Readonly":false,"Unit":"°C","Text":{"de":"Sollwert","en":"Target value","fr":"Consigne"},"Type":"number","ValueMap":[]},{"type":"EnumState","Path":"Wasser.Einstellungen","Id":"I32","Readonly":false,"Text":{"de":"Betriebsmodus","en":"Betriebsmodus","fr":"Betriebsmodus"},"Type":"number","ValueMap":{"0":"Off","1":"Auto","2":"Manual"}},{"type":"ReadOnlyState","Path":"Wasser.Einstellungen","Id":"A19","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Warmwasser","en":"Actual temperature","fr":"Température actuelle"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Wasser.Einstellungen","Id":"A37","Readonly":true,"Unit":"°C","Text":{"de":"geforderte Temperatur","en":"Required temperature","fr":"Température de consigne"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Wasser.Einstellungen","Id":"A139","Readonly":false,"Unit":"K","Text":{"de":"Schaltdifferenz Sollwert","en":"Target value switching difference","fr":"Hystérésis consigne"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Wasser.ThermischeDesinfektion","Id":"A168","Readonly":false,"Unit":"°C","Text":{"de":"geforderte Temperatur","en":"Required temperature","fr":"Température de consigne"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Wasser.ThermischeDesinfektion","Id":"I505","Readonly":true,"Text":{"de":"Startzeit","en":"Start time","fr":"Début"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Wasser.ThermischeDesinfektion","Id":"I507","Readonly":false,"Unit":"h","Text":{"de":"max.Laufzeit","en":"Max. runtime for","fr":"Temps d'exéc. maxi."},"Type":"number","ValueMap":[]},{"type":"EnumState","Path":"Wasser.ThermischeDesinfektion","Id":"I508","Readonly":false,"Text":{"de":"Wochenprogramm","en":"Schedule","fr":"Programme hebdomadaire"},"Type":"number","ValueMap":{"0":"None","1":"Day","2":"All"}},{"type":"State","Path":"Wasser.Solarunterstützung","Id":"I508","Readonly":false,"Unit":"°C","Text":{"de":"Wochenprogramm","en":"Schedule","fr":"Programme hebdomadaire"},"Type":"number","ValueMap":[]},{"type":"State","Path":"Wasser.Solarunterstützung","Id":"I517","Readonly":false,"Text":{"de":"Verzögerung Kompressorstart","en":"Delay for compressor during solar heating","fr":"Temps de retard pour Start compresseur"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Wasser.Solarunterstützung","Id":"I518","Readonly":true,"Text":{"de":"Zeit bis Kompressorstart","en":"Compressor starting in...","fr":"Le compresseur démarre dans"},"Type":"number","ValueMap":[]},{"type":"Indicator","Path":"Wasser.Status","Id":"I139","Readonly":true,"Text":{"de":"Warmwasser","en":"Hot water","fr":"ECS"},"Type":"boolean","ValueMap":[]},{"type":"Indicator","Path":"Wasser.Status","Id":"D118","Readonly":true,"Text":"D118","Type":"boolean","ValueMap":[]},{"type":"ReadOnlyState","Path":"Energiebilanz.Leistungsbilanz","Id":"A25","Readonly":true,"Unit":"kW","Text":{"de":"Elektrische Leistung","en":"Electrical energy","fr":"Puissance électrique"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Energiebilanz.Leistungsbilanz","Id":"A26","Readonly":true,"Unit":"kW","Text":{"de":"Thermische Leistung","en":"Thermal energy","fr":"Puissance thermique"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Energiebilanz.Leistungsbilanz","Id":"A28","Readonly":true,"Text":{"de":"COP","en":"COP","fr":"COP"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Energiebilanz.Leistungsbilanz","Id":"A27","Readonly":true,"Unit":"kW","Text":{"de":"Kälteleistung","en":"Cooling energy","fr":"Puissance frigorifique"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Energiebilanz.Leistungsbilanz","Id":"A29","Readonly":true,"Text":{"de":"COP Kälteleistung","en":"COP cooling output","fr":"EER"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A1","Readonly":true,"Unit":"°C","Text":{"de":"Außentemperatur","en":"Ext. temperature","fr":"Température extérieure"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A2","Readonly":true,"Unit":"°C","Text":{"de":"Außentemperatur &Oslash;1h","en":"Ext.temperature 1h","fr":"Température extérieure 1h"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A3","Readonly":true,"Unit":"°C","Text":{"de":"Außentemperatur &Oslash;24h","en":"Ext.temperature 24h","fr":"Température extérieure 24h"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A4","Readonly":true,"Unit":"°C","Text":{"de":"T Quelle Ein","en":"T Source In","fr":"T entrée captage"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A5","Readonly":true,"Unit":"°C","Text":{"de":"T Quelle Aus","en":"T Source Out","fr":"T sortie captage"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A6","Readonly":true,"Unit":"°C","Text":{"de":"T Verdampfer","en":"T Evaporation","fr":"T évaporation"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A7","Readonly":true,"Unit":"°C","Text":{"de":"T Saugleitung","en":"T Suction line","fr":"T gaz aspiré"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A8","Readonly":true,"Unit":"°C","Text":{"de":"p Verdampfer","en":"p Evaporation","fr":"p évaporation"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A10","Readonly":true,"Unit":"°C","Text":{"de":"T Sollwert","en":"T Sollwert","fr":"T Sollwert"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A699","Readonly":true,"Unit":"°C","Text":"A699","Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A700","Readonly":true,"Unit":"°C","Text":"A700","Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A701","Readonly":true,"Unit":"°C","Text":"A701","Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A702","Readonly":true,"Unit":"°C","Text":"A702","Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A12","Readonly":true,"Unit":"°C","Text":{"de":"T Vorlauf","en":"T flow","fr":"T départ"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2017","Readonly":true,"Unit":"bar","Text":{"de":"p1 Sauggas","en":"p1 Sauggas","fr":"p1 Sauggas"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2018","Readonly":true,"Unit":"bar","Text":{"de":"p2 Austritt","en":"p2 Austritt","fr":"p2 Austritt"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2019","Readonly":true,"Unit":"bar","Text":{"de":"p3 Zwischeneinspritzung","en":"p3 Zwischeneinspritzung","fr":"p3 Zwischeneinspritzung"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2020","Readonly":true,"Unit":"°C","Text":{"de":"T2 Umgebung","en":"T2 Umgebung","fr":"T2 Umgebung"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2021","Readonly":true,"Unit":"°C","Text":{"de":"T3 Sauggas","en":"T3 Sauggas","fr":"T3 Sauggas"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2022","Readonly":true,"Unit":"°C","Text":{"de":"T4 Verdichter","en":"T4 Verdichter","fr":"T4 Verdichter"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2025","Readonly":true,"Unit":"°C","Text":{"de":"T5 EVI","en":"T5 EVI","fr":"T5 EVI"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2024","Readonly":true,"Unit":"°C","Text":{"de":"T6 Flüssig","en":"T6 Flüssig","fr":"T6 Flüssig"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2023","Readonly":true,"Unit":"°C","Text":{"de":"T7 Ölsumpf","en":"T7 Ölsumpf","fr":"T7 Ölsumpf"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2032","Readonly":true,"Unit":"°C","Text":{"de":"T Verdampfer","en":"T Verdampfer","fr":"T Verdampfer"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2033","Readonly":true,"Unit":"K","Text":{"de":"Überhitzung","en":"Überhitzung","fr":"Überhitzung"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2034","Readonly":true,"Unit":"°C","Text":{"de":"T Kondensation","en":"T Kondensation","fr":"T Kondensation"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"I2039","Readonly":true,"Unit":"°C","Text":{"de":"T Druckgas","en":"T Druckgas","fr":"T Druckgas"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A13","Readonly":true,"Unit":"°C","Text":{"de":"T Kondensation","en":"T Condensation","fr":"T condensation"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A14","Readonly":true,"Unit":"°C","Text":{"de":"Tc Bubble-Point","en":"T Bubble Point","fr":"T Bubble Point"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A15","Readonly":true,"Unit":"bar","Text":{"de":"p Kondensator","en":"p Condensation","fr":"p condensation"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A17","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Raum","en":"Room temperature","fr":"Température pièce pilote"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A18","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Raum &Oslash;1h","en":"Temperatur Raum &Oslash;1h","fr":"Temperatur Raum &Oslash;1h"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A19","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Warmwasser","en":"Actual temperature","fr":"Température actuelle"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A20","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Pool","en":"Current temperature","fr":"Température actuelle"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A21","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Solar","en":"Temperatur Solar","fr":"Temperatur Solar"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A16","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur Pufferspeicher","en":"Temperatur Pufferspeicher","fr":"Temperatur Pufferspeicher"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A1022","Readonly":true,"Unit":"l/s","Text":{"de":"Durchfluss (Vortex Sensor)","en":"Durchfluss (Vortex Sensor)","fr":"Durchfluss (Vortex Sensor)"},"Type":"number","ValueMap":[]},{"type":"ReadOnlyState","Path":"Messwerte","Id":"A1023","Readonly":true,"Unit":"°C","Text":{"de":"Temperatur (Vortex Sensor)","en":"Temperatur (Vortex Sensor)","fr":"Temperatur (Vortex Sensor)"},"Type":"number","ValueMap":[]},{"type":"Indicator","Path":"Status","Id":"D581","Readonly":true,"Text":{"de":"Externe Abschaltung","en":"Ext. off","fr":"Coupure externe"},"Type":"boolean","ValueMap":[]},{"type":"Indicator","Path":"Status","Id":"D701","Readonly":true,"Text":"D701","Type":"boolean","ValueMap":[]}]`;

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
192     0
#D701   S_OK`;
