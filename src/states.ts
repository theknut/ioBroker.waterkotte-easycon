import { WaterkotteDictionary } from './dictionary';
import { CommonState, EnumState, IndicatorState, ReadOnlyState, State } from './types';

const dict = new WaterkotteDictionary();

const heatingIndicatorState = getServiceIndicator('D23');
const coolingIndicatorState = getServiceIndicator('D74');
const waterIndicatorState = getServiceIndicator('D117');
const poolIndicatorState = getServiceIndicator('D160');
const solarIndicatorState = getServiceIndicator('D196');
const mischer1IndicatorState = getServiceIndicator('D248');
const mischer2IndicatorState = getServiceIndicator('D291');
const mischer3IndicatorState = getServiceIndicator('D334');
const extHeaterIndicatorState = getServiceIndicator('D232');
const pumpIndicatorState = getServiceIndicator('D377');
const pvIndicatorState = getServiceIndicator('D635');

export function getServicesStates(): CommonState[] {
    return [
        heatingIndicatorState,
        coolingIndicatorState,
        waterIndicatorState,
        poolIndicatorState,
        solarIndicatorState,
        mischer1IndicatorState,
        mischer2IndicatorState,
        mischer3IndicatorState,
        extHeaterIndicatorState,
        pumpIndicatorState,
        pvIndicatorState,
    ];
}

function getServiceIndicator(id: string): IndicatorState {
    return new IndicatorState('', id, dict.getTranslation(id));
}

function getIndicator(path: string, id: string): IndicatorState {
    return new IndicatorState(path, id, dict.getTranslation(id));
}

function getState(path: string, id: string, unit: string): State {
    return new State(path, id, dict.getTranslation(id), unit);
}

function getReadOnlyState(path: string, id: string, unit?: string): State {
    return new ReadOnlyState(path, id, dict.getTranslation(id), unit);
}

function getEnumState(
    path: string,
    id: string,
    valueMap: Record<number, ioBroker.StringOrTranslated>,
    unit?: string,
): State {
    return new EnumState(path, id, dict.getTranslation(id), valueMap, unit);
}

export function getStates(pollStatesOf: string[], language: ioBroker.Languages = 'en'): CommonState[] {
    const states: CommonState[] = [];

    if (pollStatesOf.includes(heatingIndicatorState.Id)) {
        const heatingSettings = dict.getTranslations(['Heat', 'Settings'], language);
        states.push(
            getEnumState(
                heatingSettings,
                'I263',
                { 0: '-2.0', 1: '-1.5', 2: '-1.0', 3: '-0.5', 4: '0.0', 5: '0.5', 6: '1.0', 7: '1.5', 8: '2.0' },
                '°C',
            ),
        );

        states.push(getState(heatingSettings, 'A32', '°C'));
        states.push(getEnumState(heatingSettings, 'I30', dict.offAutoManuell));
        states.push(getReadOnlyState(heatingSettings, 'A30', '°C'));
        states.push(getReadOnlyState(heatingSettings, 'A31', '°C'));
        states.push(getState(heatingSettings, 'A61', 'K'));

        const heatingCurve = dict.getTranslations(['Heat', 'Curve'], language);
        states.push(getReadOnlyState(heatingCurve, 'A90', '°C'));
        states.push(getState(heatingCurve, 'A93', '°C'));
        states.push(getState(heatingCurve, 'A94', '°C'));
        states.push(getState(heatingCurve, 'A91', '°C'));
        states.push(getState(heatingCurve, 'A92', '°C'));
        states.push(getReadOnlyState(heatingCurve, 'A96', '°C'));

        const heatingInfluence = dict.getTranslations(['Heat', 'Influence'], language);
        states.push(getReadOnlyState(heatingInfluence, 'A98', '°C'));
        states.push(getState(heatingInfluence, 'A100', '°C'));
        states.push(getEnumState(heatingInfluence, 'A101', { 0: '0', 1: '50', 2: '100', 3: '150', 4: '200' }, '%'));
        states.push(getState(heatingInfluence, 'A102', 'K'));
        states.push(getState(heatingInfluence, 'A103', 'K'));
        states.push(getReadOnlyState(heatingInfluence, 'A99', 'K'));

        const heatingStatus = dict.getTranslations(['Heat', 'Status'], language);
        states.push(getIndicator(heatingStatus, 'I137'));
        states.push(getIndicator(heatingStatus, 'D24'));
    }

    if (pollStatesOf.includes(coolingIndicatorState.Id)) {
        const coolingSettings = dict.getTranslations(['Cool', 'Settings'], language);
        states.push(getState(coolingSettings, 'A109', '°C'));
        states.push(getEnumState(coolingSettings, 'I31', dict.offAutoManuell));
        states.push(getReadOnlyState(coolingSettings, 'A33', '°C'));
        states.push(getReadOnlyState(coolingSettings, 'A34', '°C'));
        states.push(getState(coolingSettings, 'A108', '°C'));
        states.push(getState(coolingSettings, 'A107', 'K'));
        const coolingStatus = dict.getTranslations(['Cool', 'Status'], language);
        states.push(getIndicator(coolingStatus, 'I138'));
        states.push(getIndicator(coolingStatus, 'D75'));
    }

    if (pollStatesOf.includes(waterIndicatorState.Id)) {
        const waterSettings = dict.getTranslations(['Hh2o', 'Settings'], language);
        states.push(getState(waterSettings, 'A38', '°C'));
        states.push(getEnumState(waterSettings, 'I32', dict.offAutoManuell));
        states.push(getReadOnlyState(waterSettings, 'A19', '°C'));
        states.push(getReadOnlyState(waterSettings, 'A37', '°C'));
        states.push(getState(waterSettings, 'A139', 'K'));

        //TODO
        const waterThermalDis = dict.getTranslations(['Hh2o', 'ThermalDis'], language);
        states.push(getState(waterThermalDis, 'A168', '°C'));
        states.push(getReadOnlyState(waterThermalDis, 'I505'));
        states.push(getState(waterThermalDis, 'I507', 'h'));
        states.push(getEnumState(waterThermalDis, 'I508', dict.noneDayAll));

        const waterSolarSupp = dict.getTranslations(['Hh2o', 'SolarSupp'], language);
        states.push(getState(waterSolarSupp, 'I508', '°C'));
        states.push(getState(waterSolarSupp, 'I517', ''));
        states.push(getReadOnlyState(waterSolarSupp, 'I518'));

        const waterStatus = dict.getTranslations(['Hh2o', 'Status'], language);
        states.push(getIndicator(waterStatus, 'I139'));
        states.push(getIndicator(waterStatus, 'D118'));
    }

    const energySettings = dict.getTranslations(['CPD', 'CPDPower'], language);
    states.push(getReadOnlyState(energySettings, 'A25', 'kW'));
    states.push(getReadOnlyState(energySettings, 'A26', 'kW'));
    states.push(getReadOnlyState(energySettings, 'A28'));
    states.push(getReadOnlyState(energySettings, 'A27', 'kW'));
    states.push(getReadOnlyState(energySettings, 'A29'));

    const measurements = dict.getTranslations(['MValues'], language);
    states.push(getReadOnlyState(measurements, 'A1', '°C'));
    states.push(getReadOnlyState(measurements, 'A2', '°C'));
    states.push(getReadOnlyState(measurements, 'A3', '°C'));
    states.push(getReadOnlyState(measurements, 'A4', '°C'));
    states.push(getReadOnlyState(measurements, 'A5', '°C'));
    states.push(getReadOnlyState(measurements, 'A6', '°C'));
    states.push(getReadOnlyState(measurements, 'A7', '°C'));
    states.push(getReadOnlyState(measurements, 'A8', '°C'));
    states.push(getReadOnlyState(measurements, 'A10', '°C'));
    states.push(getReadOnlyState(measurements, 'A699', '°C'));
    states.push(getReadOnlyState(measurements, 'A700', '°C'));
    states.push(getReadOnlyState(measurements, 'A701', '°C'));
    states.push(getReadOnlyState(measurements, 'A702', '°C'));
    states.push(getReadOnlyState(measurements, 'A12', '°C'));
    states.push(getReadOnlyState(measurements, 'I2017', 'bar'));
    states.push(getReadOnlyState(measurements, 'I2018', 'bar'));
    states.push(getReadOnlyState(measurements, 'I2019', 'bar'));
    states.push(getReadOnlyState(measurements, 'I2020', '°C'));
    states.push(getReadOnlyState(measurements, 'I2021', '°C'));
    states.push(getReadOnlyState(measurements, 'I2022', '°C'));
    states.push(getReadOnlyState(measurements, 'I2025', '°C'));
    states.push(getReadOnlyState(measurements, 'I2024', '°C'));
    states.push(getReadOnlyState(measurements, 'I2023', '°C'));
    states.push(getReadOnlyState(measurements, 'I2032', '°C'));
    states.push(getReadOnlyState(measurements, 'I2033', 'K'));
    states.push(getReadOnlyState(measurements, 'I2034', '°C'));
    states.push(getReadOnlyState(measurements, 'I2039', '°C'));
    states.push(getReadOnlyState(measurements, 'A13', '°C'));
    states.push(getReadOnlyState(measurements, 'A14', '°C'));
    states.push(getReadOnlyState(measurements, 'A15', 'bar'));
    states.push(getReadOnlyState(measurements, 'A17', '°C'));
    states.push(getReadOnlyState(measurements, 'A18', '°C'));
    states.push(getReadOnlyState(measurements, 'A19', '°C'));
    states.push(getReadOnlyState(measurements, 'A20', '°C'));
    states.push(getReadOnlyState(measurements, 'A21', '°C'));
    states.push(getReadOnlyState(measurements, 'A16', '°C'));
    states.push(getReadOnlyState(measurements, 'A1022', 'l/s'));
    states.push(getReadOnlyState(measurements, 'A1023', '°C'));

    const status = 'Status';
    states.push(getIndicator(status, 'D581'));
    states.push(getIndicator(status, 'D701'));
    states.push(getIndicator(status, 'D71'));

    const statusDI = `${status}.DigitalInputs`;
    states.push(getIndicator(statusDI, 'D1010'));
    states.push(getIndicator(statusDI, 'D815'));
    states.push(getIndicator(statusDI, 'D816'));
    states.push(getIndicator(statusDI, 'D817'));
    states.push(getIndicator(statusDI, 'D818'));
    states.push(getIndicator(statusDI, 'D821'));
    states.push(getIndicator(statusDI, 'D822'));
    states.push(getIndicator(statusDI, 'D823'));
    states.push(getIndicator(statusDI, 'D824'));

    return states;
}
