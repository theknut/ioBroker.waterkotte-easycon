import { expect } from '@jest/globals';
import { getStates } from './../src/states';

describe('getStates', () => {
    it('Should return no states if empty array is provided', () => {
        expect(getStates([])).toHaveLength(0);
    });

    it('Should return no states if unknown identifier is used', () => {
        expect(getStates(['unknown'])).toHaveLength(0);
    });

    it('Should only return states of the provided identifiers', () => {
        const heizenStates = getStates(['Heizen'], 'es');
        expect(heizenStates).not.toHaveLength(0);

        for (const state of heizenStates) {
            expect(state.Path.startsWith('Heating')).toBeTruthy();
        }
    });

    it('Should return all requested identifiers', () => {
        const states = getStates(['Heizen', 'Kühlen', 'Wasser', 'Energiebilanz', 'Messwerte', 'Status'], 'de');
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

type Languages = 'en' | 'de' | 'fr';
type Translated = { en: string } & { [lang in Languages]?: string };
type StringOrTranslated = string | Translated;
