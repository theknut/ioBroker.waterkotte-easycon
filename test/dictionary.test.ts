import { expect } from '@jest/globals';
import { WaterkotteDictionary } from '../src/dictionary';

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
                en: 'Ext. temperature',
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
            expected: 'Temp\xe9rature ext\xe9rieure',
        },
        {
            identifiers: ['Heat', 'Settings'],
            language: 'de',
            expected: 'Heizen.Einstellungen',
        },
    ])('Should return translation for $identifier and language $language', ({ identifiers, language, expected }) => {
        expect(dict.getTranslations(identifiers, language as ioBroker.Languages)).toBe(expected);
    });

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
});
