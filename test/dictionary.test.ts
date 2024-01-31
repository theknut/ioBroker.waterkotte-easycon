import { expect } from '@jest/globals';
import { WaterkotteDictionary } from '../src/dictionary';

const dict = new WaterkotteDictionary();

describe('WaterkotteDictionary', () => {
    it('Should return identifier if no translation found', () => {
        expect(dict.getTranslation('🍉')).toBe('🍉');
    });

    it('Should return translation for the given identifier', () => {
        expect(dict.getTranslation('A1')).toStrictEqual({
            de: 'Au\xdfentemperatur',
            en: 'Ext. temperature',
            fr: 'Temp\xe9rature ext\xe9rieure',
        });
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
});
