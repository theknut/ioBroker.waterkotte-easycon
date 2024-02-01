import { expect } from '@jest/globals';
import {
    AdapterError,
    CommonState,
    EnumState,
    HexAnalogState,
    IndicatorState,
    ReadOnlyEnumState,
    ReadOnlyState,
    RethrowError,
    State,
} from '../src/types';
import { getStates } from './../src/states';

describe('getStates', () => {
    it('Should return no states if empty array is provided', () => {
        expect(getStates([])).toHaveLength(0);
    });

    it('Should return no states if unknown identifier is used', () => {
        expect(getStates(['unknown'])).toHaveLength(0);
    });

    it('Should only return states of the provided identifiers', () => {
        const heizenStates = getStates(['Heizen']);
        expect(heizenStates).not.toHaveLength(0);

        for (const state of heizenStates) {
            expect(state.Path.startsWith('Heizen')).toBeTruthy();
        }
    });

    it('Should return all requested identifiers', () => {
        const states = getStates(['Heizen', 'Kühlen', 'Wasser', 'Energiebilanz', 'Messwerte', 'Status']);
        expect(states).not.toHaveLength(0);

        expect(states.some((x) => x.Path.includes('Heizen'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Kühlen'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Wasser'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Energiebilanz'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Messwerte'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Status'))).toBeTruthy();
    });

    it('All states should have valid names', () => {
        const states = getStates(['Heizen', 'Kühlen', 'Wasser', 'Energiebilanz', 'Messwerte', 'Status']);
        expect(states).not.toHaveLength(0);

        for (const state of states) {
            const text: string | StringOrTranslated = state.Text;

            if (typeof text == 'string') {
                if (text === '') {
                    throw Error(`State ${state.Id} has no name`);
                }
                continue;
            }

            if (!text.de || text.de === '' || !text.en || text.en === '' || !text.fr || text.fr === '') {
                throw Error(`Invalid translation received for ${state.Id}: ${JSON.stringify(text)}`);
            }
        }
    });
});

describe('getStates', () => {
    const readOnlyState = new ReadOnlyState('1', 'A1', 'Außentemperatur', '°C');
    const indicatorIState = new IndicatorState('2', 'I139', 'Aktiv');
    const indicatorDState = new IndicatorState('2', 'D251', 'Heizbetrieb');
    const enumState = new EnumState('3', 'I30', 'Betriebszustand', { 0: 'Aus', 1: 'Auto', 2: 'Manuell' }, undefined);
    const readOnlyEnumState = new ReadOnlyEnumState('3', 'I30', 'Betriebszustand', {
        0: 'Aus',
        1: 'Auto',
        2: 'Manuell',
    });
    const celsiusState = new State('4', 'A3', 'Außentemperatur Ø24h', '°C');
    const kelvinState = new State('5', 'A61', 'Schaltdifferenz Sollwert', 'K');
    const kWhState = new HexAnalogState('6', 'A458', 'A459', 'Elektrische Arbeit Gesamt');
    const noUnitState = new State('7', 'A460', 'Arbeitszahl Wärmepumpe');
    const barState = new State('8', 'A8', 'p Verdampfer', 'bar');
    const evuState = new IndicatorState('9', 'D581', 'Externe Abschaltung');

    it.each([
        { state: readOnlyState, expected: 'value.temperature' },
        { state: indicatorIState, expected: 'indicator' },
        { state: indicatorDState, expected: 'indicator' },
        { state: enumState, expected: 'value' },
        { state: celsiusState, expected: 'value.temperature' },
        { state: kelvinState, expected: 'value' },
        { state: kWhState, expected: 'value' },
        { state: barState, expected: 'value' },
    ])('Should get role $expected for $state.Id', ({ state, expected }) => {
        expect(state.getRole()).toBe(expected);
    });

    it('Should throw if state type is not supported', () => {
        try {
            CommonState.getIdParts('555');
            throw new Error('Invalid state type did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    });

    it.each([
        { state: readOnlyState, qualifier: 'A', number: 1 },
        { state: indicatorIState, qualifier: 'I', number: 139 },
        { state: indicatorDState, qualifier: 'D', number: 251 },
        { state: enumState, qualifier: 'I', number: 30 },
        { state: kelvinState, qualifier: 'A', number: 61 },
        { state: kWhState, qualifier: 'A', number: 458 },
    ])('Should get qualifier $qualifier and number $number for $state.Id', ({ state, qualifier, number }) => {
        expect(CommonState.getIdParts(state.Id)).toStrictEqual({ Qualifier: qualifier, Number: number });
    });

    it('Should get state id based on path and id', async () => {
        expect(celsiusState.getStateId()).toBe('4.A3');
    });

    it('Should throw if value is not boolean integer', () => {
        try {
            indicatorDState.normalizeValue(5);
            throw new Error('Invalid value did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    });

    it('Should throw if state type is not supported', () => {
        try {
            new IndicatorState('1', 'R555', '').normalizeValue(5);
            throw new Error('Invalid state type did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    });

    it('Should set default values', () => {
        const state = new CommonState('1', 'A1', '');
        expect(state.Unit).toBeUndefined();
        expect(state.Type).toBe('number');
        expect(state.ValueMap).toHaveLength(0);
    });

    it('Should create expected common object', () => {
        const commonReadOnlyObject = readOnlyState.getCommonObject();
        expect(commonReadOnlyObject).toStrictEqual({
            name: 'Außentemperatur',
            unit: '°C',
            type: 'number',
            read: true,
            write: false,
            role: 'value.temperature',
            states: [],
        });

        const commonEnumObject = enumState.getCommonObject();
        const expectedObject = {
            name: 'Betriebszustand',
            type: 'number',
            read: true,
            write: true,
            unit: undefined,
            role: 'value',
            states: { 0: 'Aus', 1: 'Auto', 2: 'Manuell' },
        };
        expect(commonEnumObject).toStrictEqual(expectedObject);

        const commonReadOnlyEnumObject = readOnlyEnumState.getCommonObject();
        expectedObject.write = false;
        expect(commonReadOnlyEnumObject).toStrictEqual(expectedObject);
    });

    it.each([
        { state: readOnlyState, value: 42, expected: 4.2 },
        { state: indicatorIState, value: 1, expected: true },
        { state: indicatorIState, value: 0, expected: false },
        { state: indicatorDState, value: 1, expected: true },
        { state: indicatorDState, value: 0, expected: false },
        { state: enumState, value: 1, expected: 1 },
        { state: celsiusState, value: 24, expected: 2.4 },
        { state: kelvinState, value: 20, expected: 2 },
        { state: barState, value: 99, expected: 9.9 },
        { state: noUnitState, value: 8247, expected: 824.7 },
    ])('Should normalize value to $expected for $state.Id', ({ state, value, expected }) => {
        expect(state.normalizeValue(value)).toBe(expected);
    });

    it('Should throw if normalizeValue is called on hex state value', () => {
        try {
            kWhState.normalizeValue(0);
            throw new Error('Did not throw error when normalizeValue was called on hex state');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    });

    it.each([
        { primary: 'A1', secondary: 'D1' },
        { primary: 'D1', secondary: 'A1' },
    ])('Should throw if non analog state is created with HexAnalogState', ({ primary, secondary }) => {
        try {
            new HexAnalogState('1', primary, secondary, 'Digital state');
            throw new Error('Did not throw error when normalizeValue was called on hex state');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    });

    it('Should normalize hex value to $expected for $state.Id', () => {
        expect(kWhState.normalizeHexValue(17587, -3808)).toBe(1439.5);
    });

    it.each([
        { primary: 0, secondary: 0 },
        { primary: undefined, secondary: 0 },
        { primary: 0, secondary: undefined },
        { primary: undefined, secondary: undefined },
    ])(
        'Should throw if primary ($primary) and/or secondary ($secondary) value are not provided',
        ({ primary, secondary }) => {
            try {
                kWhState.normalizeHexValue(primary!, secondary!);
                throw new Error('Invalid values did not throw error');
            } catch (e: unknown) {
                expect(e).toBeInstanceOf(AdapterError);
            }
        },
    );
});

describe('RethrowError', () => {
    it('Should fall back to message of inner error', () => {
        const message = 'Something went wrong';
        try {
            throw new Error(message);
        } catch (e: unknown) {
            if (e instanceof Error) {
                const rethrowError = new RethrowError(e);
                expect(rethrowError.message).toBe(message);
            }
        }
    });

    it('Should use custom message', () => {
        const message = 'Something went wrong';
        try {
            throw new Error('This message should not be used');
        } catch (e: unknown) {
            if (e instanceof Error) {
                const rethrowError = new RethrowError(e, message);
                expect(rethrowError.message).toBe(message);
            }
        }
    });
});

type Languages = 'en' | 'de' | 'fr';
type Translated = { en: string } & { [lang in Languages]?: string };
type StringOrTranslated = string | Translated;
