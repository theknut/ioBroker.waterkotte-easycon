import { WaterkotteDictionary } from './dictionary';
import { CommonState, EnumState, IndicatorState, ReadOnlyState, State } from './types';

export function getStates(pollStatesOf: string[]): CommonState[] {
    const states: CommonState[] = [];
    const dict = new WaterkotteDictionary();

    if (pollStatesOf.includes('Heizen')) {
        states.push(
            new EnumState(
                'Heizen.Einstellungen',
                'I263',
                dict.getTranslation('I263'),
                { 0: '-2.0', 1: '-1.5', 2: '-1.0', 3: '-0.5', 4: '0.0', 5: '0.5', 6: '1.0', 7: '1.5', 8: '2.0' },
                '°C',
            ),
        );
        states.push(new State('Heizen.Einstellungen', 'A32', dict.getTranslation('A32'), '°C'));
        states.push(new EnumState('Heizen.Einstellungen', 'I30', dict.getTranslation('I30'), dict.offAutoManuell));
        states.push(new ReadOnlyState('Heizen.Einstellungen', 'A30', dict.getTranslation('A30'), '°C'));
        states.push(new ReadOnlyState('Heizen.Einstellungen', 'A31', dict.getTranslation('A31'), '°C'));
        states.push(new State('Heizen.Einstellungen', 'A61', dict.getTranslation('A61'), 'K'));
        states.push(new ReadOnlyState('Heizen.Kennlinie', 'A90', dict.getTranslation('A90'), '°C'));
        states.push(new State('Heizen.Kennlinie', 'A93', dict.getTranslation('A93'), '°C'));
        states.push(new State('Heizen.Kennlinie', 'A94', dict.getTranslation('A94'), '°C'));
        states.push(new State('Heizen.Kennlinie', 'A91', dict.getTranslation('A91'), '°C'));
        states.push(new State('Heizen.Kennlinie', 'A92', dict.getTranslation('A92'), '°C'));
        states.push(new ReadOnlyState('Heizen.Kennlinie', 'A96', dict.getTranslation('A96'), '°C'));
        states.push(new ReadOnlyState('Heizen.Raumeinfluss', 'A98', dict.getTranslation('A98'), '°C'));
        states.push(new State('Heizen.Raumeinfluss', 'A100', dict.getTranslation('A100'), '°C'));
        states.push(
            new EnumState(
                'Heizen.Raumeinfluss',
                'A101',
                dict.getTranslation('A101'),
                { 0: '0', 1: '50', 2: '100', 3: '150', 4: '200' },
                '%',
            ),
        );
        states.push(new State('Heizen.Raumeinfluss', 'A102', dict.getTranslation('A102'), 'K'));
        states.push(new State('Heizen.Raumeinfluss', 'A103', dict.getTranslation('A103'), 'K'));
        states.push(new ReadOnlyState('Heizen.Raumeinfluss', 'A99', dict.getTranslation('A99'), 'K'));
        states.push(new IndicatorState('Heizen.Status', 'I137', dict.getTranslation('I137')));
        states.push(new IndicatorState('Heizen.Status', 'D24', dict.getTranslation('D24')));
    }

    if (pollStatesOf.includes('Kühlen')) {
        states.push(new State('Kühlen.Einstellungen', 'A109', dict.getTranslation('A109'), '°C'));
        states.push(new EnumState('Kühlen.Einstellungen', 'I31', dict.getTranslation('I31'), dict.offAutoManuell));
        states.push(new ReadOnlyState('Kühlen.Einstellungen', 'A33', dict.getTranslation('A33'), '°C'));
        states.push(new ReadOnlyState('Kühlen.Einstellungen', 'A34', dict.getTranslation('A34'), '°C'));
        states.push(new State('Kühlen.Einstellungen', 'A108', dict.getTranslation('A108'), '°C'));
        states.push(new State('Kühlen.Einstellungen', 'A107', dict.getTranslation('A107'), 'K'));
        states.push(new IndicatorState('Kühlen.Status', 'I138', dict.getTranslation('I138')));
        states.push(new IndicatorState('Kühlen.Status', 'D75', dict.getTranslation('D75')));
    }

    if (pollStatesOf.includes('Wasser')) {
        states.push(new State('Wasser.Einstellungen', 'A38', dict.getTranslation('A38'), '°C'));
        states.push(new EnumState('Wasser.Einstellungen', 'I32', dict.getTranslation('I32'), dict.offAutoManuell));
        states.push(new ReadOnlyState('Wasser.Einstellungen', 'A19', dict.getTranslation('A19'), '°C'));
        states.push(new ReadOnlyState('Wasser.Einstellungen', 'A37', dict.getTranslation('A37'), '°C'));
        states.push(new State('Wasser.Einstellungen', 'A139', dict.getTranslation('A139'), 'K'));
        states.push(new State('Wasser.ThermischeDesinfektion', 'A168', dict.getTranslation('A168'), '°C'));

        //TODO
        states.push(new ReadOnlyState('Wasser.ThermischeDesinfektion', 'I505', dict.getTranslation('I505')));
        states.push(new State('Wasser.ThermischeDesinfektion', 'I507', dict.getTranslation('I507'), 'h'));
        states.push(
            new EnumState('Wasser.ThermischeDesinfektion', 'I508', dict.getTranslation('I508'), dict.noneDayAll),
        );
        states.push(new State('Wasser.Solarunterstützung', 'I508', dict.getTranslation('I508'), '°C'));
        states.push(new State('Wasser.Solarunterstützung', 'I517', dict.getTranslation('I517')));
        states.push(new ReadOnlyState('Wasser.Solarunterstützung', 'I518', dict.getTranslation('I518')));

        states.push(new IndicatorState('Wasser.Status', 'I139', dict.getTranslation('I139')));
        states.push(new IndicatorState('Wasser.Status', 'D118', dict.getTranslation('D117')));
    }

    if (pollStatesOf.includes('Energiebilanz')) {
        states.push(new ReadOnlyState('Energiebilanz.Leistungsbilanz', 'A25', dict.getTranslation('A25'), 'kW'));
        states.push(new ReadOnlyState('Energiebilanz.Leistungsbilanz', 'A26', dict.getTranslation('A26'), 'kW'));
        states.push(new ReadOnlyState('Energiebilanz.Leistungsbilanz', 'A28', dict.getTranslation('A28')));
        states.push(new ReadOnlyState('Energiebilanz.Leistungsbilanz', 'A27', dict.getTranslation('A27'), 'kW'));
        states.push(new ReadOnlyState('Energiebilanz.Leistungsbilanz', 'A29', dict.getTranslation('A29')));
    }

    if (pollStatesOf.includes('Messwerte')) {
        states.push(new ReadOnlyState('Messwerte', 'A1', dict.getTranslation('A1'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A2', dict.getTranslation('A2'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A3', dict.getTranslation('A3'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A4', dict.getTranslation('A4'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A5', dict.getTranslation('A5'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A6', dict.getTranslation('A6'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A7', dict.getTranslation('A7'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A8', dict.getTranslation('A8'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A10', dict.getTranslation('A10'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A699', dict.getTranslation('A699'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A700', dict.getTranslation('A700'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A701', dict.getTranslation('A701'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A702', dict.getTranslation('A702'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A12', dict.getTranslation('A12'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2017', dict.getTranslation('I2017'), 'bar'));
        states.push(new ReadOnlyState('Messwerte', 'I2018', dict.getTranslation('I2018'), 'bar'));
        states.push(new ReadOnlyState('Messwerte', 'I2019', dict.getTranslation('I2019'), 'bar'));
        states.push(new ReadOnlyState('Messwerte', 'I2020', dict.getTranslation('I2020'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2021', dict.getTranslation('I2021'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2022', dict.getTranslation('I2022'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2025', dict.getTranslation('I2025'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2024', dict.getTranslation('I2024'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2023', dict.getTranslation('I2023'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2032', dict.getTranslation('I2032'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2033', dict.getTranslation('I2033'), 'K'));
        states.push(new ReadOnlyState('Messwerte', 'I2034', dict.getTranslation('I2034'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'I2039', dict.getTranslation('I2039'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A13', dict.getTranslation('A13'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A14', dict.getTranslation('A14'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A15', dict.getTranslation('A15'), 'bar'));
        states.push(new ReadOnlyState('Messwerte', 'A17', dict.getTranslation('A17'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A18', dict.getTranslation('A18'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A19', dict.getTranslation('A19'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A20', dict.getTranslation('A20'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A21', dict.getTranslation('A21'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A16', dict.getTranslation('A16'), '°C'));
        states.push(new ReadOnlyState('Messwerte', 'A1022', dict.getTranslation('A1022'), 'l/s'));
        states.push(new ReadOnlyState('Messwerte', 'A1023', dict.getTranslation('A1023'), '°C'));
    }

    if (pollStatesOf.includes('Status')) {
        states.push(new IndicatorState('Status', 'D581', dict.getTranslation('D581')));
        states.push(new IndicatorState('Status', 'D701', dict.getTranslation('D701')));
        states.push(new IndicatorState('Status', 'D71', dict.getTranslation('D71')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D1010', dict.getTranslation('D1010')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D815', dict.getTranslation('D815')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D816', dict.getTranslation('D816')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D817', dict.getTranslation('D817')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D818', dict.getTranslation('D818')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D821', dict.getTranslation('D821')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D822', dict.getTranslation('D822')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D823', dict.getTranslation('D823')));
        states.push(new IndicatorState('Status.DigitalEingänge', 'D824', dict.getTranslation('D824')));
    }

    return states;
}
