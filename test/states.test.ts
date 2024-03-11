import { expect } from '@jest/globals';
import { getServicesStates, getStates } from './../src/states';

const allServicesArray = ['D23', 'D74', 'D117', 'D160', 'D196', 'D635'];

describe('getStates', () => {
    it('Should return basic states if empty array is provided', () => {
        const states = getStates([]);
        expect(states).not.toHaveLength(0);
        expect(states.some((x) => x.Id == 'I5')).toBeTruthy();
    });

    it('Should return not throw error if unknown identifier is used', () => {
        const states = getStates(['unknown']);
        expect(states).not.toHaveLength(0);
        expect(states.some((x) => x.Id == 'I5')).toBeTruthy();
    });

    it('Should only return states of the provided servies', () => {
        const heizenStates = getStates(['D23'], 'es'); // 'es' will fall back to English
        expect(heizenStates).not.toHaveLength(0);
        expect(heizenStates.some((x) => x.Id == 'I5')).toBeTruthy(); // includes basic states
        expect(heizenStates.some((x) => x.Path.startsWith('Heat'))).toBeTruthy();
        expect(heizenStates.some((x) => x.Path.startsWith('Cool'))).toBeFalsy();
    });

    it('Should return all requested identifiers', () => {
        const states = getStates(allServicesArray, 'de');
        expect(states).not.toHaveLength(0);

        expect(states.some((x) => x.Path.includes('Heizen'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Kühlen'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Warmwasser'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Pool'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Solar'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Photovoltaik'))).toBeTruthy();
        expect(states.some((x) => x.Path.includes('Energiebilanz'))).toBeTruthy(); // basic state
        expect(states.some((x) => x.Path.includes('Messwerte'))).toBeTruthy(); // basic state
        expect(states.some((x) => x.Path.includes('Status'))).toBeTruthy(); // basic state
    });

    it('All states should have valid names', () => {
        const states = getStates(allServicesArray);
        expect(states).not.toHaveLength(0);

        for (const state of states) {
            const text: string | ioBroker.StringOrTranslated = state.Text;

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

    it('Should return services indicator states', () => {
        const states = getServicesStates();
        expect(states).not.toHaveLength(0);
    });
});
