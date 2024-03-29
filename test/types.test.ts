import { expect } from '@jest/globals';
import { WaterkotteDictionary } from '../src/dictionary';
import {
    AdapterError,
    CommonState,
    EnumState,
    HexAnalogState,
    IndicatorState,
    PathFlavor,
    ReadOnlyEnumState,
    ReadOnlyState,
    RethrowError,
    State,
    WaterkotteError,
} from '../src/types';

const dict = new WaterkotteDictionary();

describe('Types test', () => {
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
    const translatedState = new HexAnalogState('6', 'A458', 'A459', dict.getTranslation('A461'));
    const noUnitState = new State('7', 'A460', 'Arbeitszahl Wärmepumpe');
    const barState = new State('8', 'A8', 'p Verdampfer', 'bar');
    const evuState = new IndicatorState(
        dict.getTranslations(['Hh2o', 'ThermalDis'], 'en'),
        'D581',
        dict.getTranslations(['MinPower'], 'en'),
    );

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
            new IndicatorState('1', '555', '').getIdParts();
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
        expect(state.getIdParts()).toStrictEqual({ Qualifier: qualifier, Number: number });
    });

    it.each([
        { state: indicatorDState, value: 1, expected: true },
        { state: indicatorDState, value: '1', expected: true },
        { state: indicatorDState, value: true, expected: true },
        { state: indicatorDState, value: 0, expected: false },
        { state: indicatorDState, value: '0', expected: false },
        { state: indicatorDState, value: false, expected: false },
        { state: indicatorIState, value: 1, expected: true },
        { state: indicatorIState, value: '1', expected: true },
        { state: indicatorIState, value: true, expected: true },
        { state: indicatorIState, value: 0, expected: false },
        { state: indicatorIState, value: '0', expected: false },
        { state: indicatorIState, value: false, expected: false },
    ])('Should normalize $value to $expected for $state.Id', ({ state, value, expected }) => {
        expect(state.normalizeValue(value as any)).toBe(expected);
    });

    it.each([
        { value: 2 },
        { value: -1 },
        { value: [] },
        { value: null },
        { value: undefined },
        { value: '' },
        { value: ' ' },
    ])('Should throw when trying to normalize unsupported type or value $1 to boolean', (value) => {
        try {
            indicatorIState.normalizeValue(value as any);
            throw new Error('Invalid value did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
    });

    it.each([
        { state: kWhState, flavor: undefined, replaceRegExp: undefined, language: 'de', expected: '6.A458' },
        { state: kWhState, flavor: PathFlavor.Id, replaceRegExp: undefined, language: 'de', expected: '6.A458' },
        { state: kWhState, flavor: PathFlavor.Id, replaceRegExp: /A/g, language: 'fr', expected: '6._458' },
        { state: kWhState, flavor: PathFlavor.Id, replaceRegExp: /A/g, language: undefined, expected: '6._458' },
        { state: kWhState, flavor: PathFlavor.Id, replaceRegExp: /A/g, language: 'es', expected: '6._458' },
        {
            state: evuState,
            flavor: PathFlavor.Description,
            replaceRegExp: /A/g,
            language: 'es',
            expected: 'Hot water.Therm sterilisation.Min power',
        },
        {
            state: kWhState,
            flavor: PathFlavor.Description,
            replaceRegExp: undefined,
            language: 'de',
            expected: '6.Elektrische Arbeit Gesamt',
        },
        {
            state: translatedState,
            flavor: PathFlavor.Description,
            replaceRegExp: undefined,
            language: 'de',
            expected: '6.Arbeitszahl Gesamtsystem',
        },
        {
            state: translatedState,
            flavor: PathFlavor.Description,
            replaceRegExp: /\s/g,
            language: 'en',
            expected: '6.Performance_total_system',
        },
        {
            state: translatedState,
            flavor: PathFlavor.Description,
            replaceRegExp: /\s/g,
            language: undefined,
            expected: '6.Performance_total_system',
        },
        {
            state: translatedState,
            flavor: PathFlavor.Description,
            replaceRegExp: /\s/g,
            language: 'es',
            expected: '6.Performance_total_system',
        },
    ])(
        "Should get state id '$expected' for flavor '$flavor', replace regular expression '$replaceRegExp' and language '$language'",
        async ({ state, flavor, replaceRegExp, language, expected }) => {
            const lang: ioBroker.Languages = <ioBroker.Languages>language;
            expect(state.getPath(flavor, replaceRegExp, lang)).toBe(expected);
        },
    );

    it('Should throw on invalid path flavor', () => {
        try {
            //@ts-expect-error
            kWhState.getPath(null);
            throw new Error('Invalid flavor did not throw error');
        } catch (e: unknown) {
            expect(e).toBeInstanceOf(AdapterError);
        }
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

    it('Should set code depending on message if code is undefined', () => {
        expect(new WaterkotteError('#E_NEED_LOGIN').code).toBe(WaterkotteError.LOGIN_REQUIRED);
    });
});
