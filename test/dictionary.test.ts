import { expect } from '@jest/globals';
import { WaterkotteDictionary } from '../src/dictionary';
import { AdapterError } from '../src/types';

describe('WaterkotteDictionary', () => {
    const dict = new WaterkotteDictionary();
    it('Should return identifier if no translation found', () => {
        expect(dict.getTranslation('🍉')).toStrictEqual({
            de: '🍉',
            en: '🍉',
            fr: '🍉',
        });
    });

    it.each([
        {
            identifiers: ['A1'],
            expected: {
                de: 'Au\xdfentemperatur',
                en: 'Ext temperature',
                fr: 'Temp\xe9rature ext\xe9rieure',
            },
        },
        {
            identifiers: ['Heat', 'Settings'],
            expected: {
                de: 'Heizen.Einstellungen',
                en: 'Heating.Settings',
                fr: 'Chauffage.R\xe9glage',
            },
        },
    ])('Should return translation for $identifiers', ({ identifiers, expected }) => {
        expect(dict.getTranslation(identifiers)).toStrictEqual(expected);
    });

    it.each([
        {
            identifiers: ['A1'],
            language: 'fr',
            seperator: undefined,
            expected: 'Temp\xe9rature ext\xe9rieure',
        },
        {
            identifiers: ['Heat', 'Settings'],
            language: 'de',
            seperator: undefined,
            expected: 'Heizen.Einstellungen',
        },
        {
            identifiers: ['Heat', 'Settings'],
            language: 'es',
            seperator: '-',
            expected: 'Heating-Settings',
        },
    ])(
        'Should return translation for $identifier and language $language',
        ({ identifiers, language, seperator, expected }) => {
            expect(dict.getTranslations(identifiers, language as ioBroker.Languages, seperator)).toBe(expected);
        },
    );

    it('Should fall back to English if language is missing', () => {
        expect(dict.getTranslation('Disabled')).toStrictEqual({
            de: 'Inaktiv',
            en: 'Disabled',
            fr: 'Disabled',
        });
    });

    it('Should fall back to German if language is missing', () => {
        expect(dict.getTranslation('Desc')).toStrictEqual({
            de: 'Beschreibung',
            en: 'Beschreibung',
            fr: 'Beschreibung',
        });
    });

    it('Should fall back to English if requested language is missing', () => {
        expect(dict.getTranslations('Disabled', 'es')).toBe('Disabled');
    });

    it('Should throw if no language is provided', () => {
        let language: any;
        expect(() => dict.getTranslations('Disabled', language)).toThrowError(AdapterError);
    });
});
