"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var states_exports = {};
__export(states_exports, {
  getServicesStates: () => getServicesStates,
  getStates: () => getStates
});
module.exports = __toCommonJS(states_exports);
var import_dictionary = require("./dictionary");
var import_types = require("./types");
const dict = new import_dictionary.WaterkotteDictionary();
const heatingIndicatorState = getServiceIndicator("D23");
const coolingIndicatorState = getServiceIndicator("D74");
const waterIndicatorState = getServiceIndicator("D117");
const poolIndicatorState = getServiceIndicator("D160");
const solarIndicatorState = getServiceIndicator("D196");
const mischer1IndicatorState = getServiceIndicator("D248");
const mischer2IndicatorState = getServiceIndicator("D291");
const mischer3IndicatorState = getServiceIndicator("D334");
const extHeaterIndicatorState = getServiceIndicator("D232");
const pumpIndicatorState = getServiceIndicator("D377");
const pvIndicatorState = getServiceIndicator("D635");
function getServicesStates() {
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
    pvIndicatorState
  ];
}
function getServiceIndicator(id) {
  return new import_types.IndicatorState("", id, dict.getTranslation(id));
}
function getIndicator(path, id) {
  return new import_types.IndicatorState(path, id, dict.getTranslation(id));
}
function getState(path, id, unit) {
  return new import_types.State(path, id, dict.getTranslation(id), unit);
}
function getReadOnlyState(path, id, unit, text) {
  return new import_types.ReadOnlyState(path, id, text != null ? text : dict.getTranslation(id), unit);
}
function getEnumState(path, id, valueMap, unit) {
  return new import_types.EnumState(path, id, dict.getTranslation(id), valueMap, unit);
}
function getStates(pollStatesOf, language = "en") {
  const states = [];
  if (pollStatesOf.includes(heatingIndicatorState.Id)) {
    const heatingSettings = dict.getTranslations(["Heat", "Settings"], language);
    states.push(
      getEnumState(
        heatingSettings,
        "I263",
        { 0: "-2.0", 1: "-1.5", 2: "-1.0", 3: "-0.5", 4: "0.0", 5: "0.5", 6: "1.0", 7: "1.5", 8: "2.0" },
        "\xB0C"
      )
    );
    states.push(getState(heatingSettings, "A32", "\xB0C"));
    states.push(getEnumState(heatingSettings, "I30", dict.offAutoManuell));
    states.push(getReadOnlyState(heatingSettings, "A30", "\xB0C"));
    states.push(getReadOnlyState(heatingSettings, "A31", "\xB0C"));
    states.push(getState(heatingSettings, "A61", "K"));
    const heatingCurve = dict.getTranslations(["Heat", "Curve"], language);
    states.push(getReadOnlyState(heatingCurve, "A90", "\xB0C"));
    states.push(getState(heatingCurve, "A93", "\xB0C"));
    states.push(getState(heatingCurve, "A94", "\xB0C"));
    states.push(getState(heatingCurve, "A91", "\xB0C"));
    states.push(getState(heatingCurve, "A92", "\xB0C"));
    states.push(getReadOnlyState(heatingCurve, "A96", "\xB0C"));
    const heatingInfluence = dict.getTranslations(["Heat", "Influence"], language);
    states.push(getReadOnlyState(heatingInfluence, "A98", "\xB0C"));
    states.push(getState(heatingInfluence, "A100", "\xB0C"));
    states.push(getEnumState(heatingInfluence, "A101", { 0: "0", 1: "50", 2: "100", 3: "150", 4: "200" }, "%"));
    states.push(getState(heatingInfluence, "A102", "K"));
    states.push(getState(heatingInfluence, "A103", "K"));
    states.push(getReadOnlyState(heatingInfluence, "A99", "K"));
    const heatingStatus = dict.getTranslations(["Heat", "Status"], language);
    states.push(getIndicator(heatingStatus, "I137"));
    states.push(getIndicator(heatingStatus, "D24"));
  }
  if (pollStatesOf.includes(coolingIndicatorState.Id)) {
    const coolingSettings = dict.getTranslations(["Cool", "Settings"], language);
    states.push(getState(coolingSettings, "A109", "\xB0C"));
    states.push(getEnumState(coolingSettings, "I31", dict.offAutoManuell));
    states.push(getReadOnlyState(coolingSettings, "A33", "\xB0C"));
    states.push(getReadOnlyState(coolingSettings, "A34", "\xB0C"));
    states.push(getState(coolingSettings, "A108", "\xB0C"));
    states.push(getState(coolingSettings, "A107", "K"));
    const coolingStatus = dict.getTranslations(["Cool", "Status"], language);
    states.push(getIndicator(coolingStatus, "I138"));
    states.push(getIndicator(coolingStatus, "D75"));
  }
  if (pollStatesOf.includes(waterIndicatorState.Id)) {
    const waterSettings = dict.getTranslations(["Hh2o", "Settings"], language);
    states.push(getState(waterSettings, "A38", "\xB0C"));
    states.push(getEnumState(waterSettings, "I32", dict.offAutoManuell));
    states.push(getReadOnlyState(waterSettings, "A19", "\xB0C"));
    states.push(getReadOnlyState(waterSettings, "A37", "\xB0C"));
    states.push(getState(waterSettings, "A139", "K"));
    const waterThermalDis = dict.getTranslations(["Hh2o", "ThermalDis"], language);
    states.push(getState(waterThermalDis, "A168", "\xB0C"));
    states.push(getReadOnlyState(waterThermalDis, "I505", "Uhr"));
    states.push(getState(waterThermalDis, "I507", "h"));
    states.push(getEnumState(waterThermalDis, "I508", dict.noneDayAll));
    const waterSolarSupp = dict.getTranslations(["Hh2o", "SolarSupp"], language);
    states.push(getState(waterSolarSupp, "A169", "\xB0C"));
    states.push(getState(waterSolarSupp, "I517", ""));
    states.push(getReadOnlyState(waterSolarSupp, "I518"));
    const waterStatus = dict.getTranslations(["Hh2o", "Status"], language);
    states.push(getIndicator(waterStatus, "I139"));
    states.push(getIndicator(waterStatus, "D118"));
  }
  if (pollStatesOf.includes(poolIndicatorState.Id)) {
    const poolSettings = dict.getTranslations(["Pool", "Settings"], language);
    states.push(getState(poolSettings, "A41", "\xB0C"));
    states.push(
      getEnumState(
        poolSettings,
        "I1740",
        { 0: "-2.0", 1: "-1.5", 2: "-1.0", 3: "-0.5", 4: "0.0", 5: "0.5", 6: "1.0", 7: "1.5", 8: "2.0" },
        "\xB0C"
      )
    );
    states.push(getEnumState(poolSettings, "I33", dict.offAutoManuell));
    states.push(getReadOnlyState(poolSettings, "A20", "\xB0C"));
    states.push(getReadOnlyState(poolSettings, "A40", "\xB0C"));
    states.push(getState(poolSettings, "A174", "K"));
    const poolCurve = dict.getTranslations(["Pool", "Curve"], language);
    states.push(getReadOnlyState(poolCurve, "A746", "\xB0C"));
    states.push(getState(poolCurve, "A749", "\xB0C"));
    states.push(getState(poolCurve, "A749", "\xB0C"));
    states.push(getState(poolCurve, "A750", "\xB0C"));
    states.push(getState(poolCurve, "A747", "\xB0C"));
    states.push(getState(poolCurve, "A748", "\xB0C"));
    states.push(getState(poolCurve, "A752", "\xB0C"));
  }
  if (pollStatesOf.includes(solarIndicatorState.Id)) {
    const solarSettings = dict.getTranslations(["Solar", "Settings"], language);
    states.push(getState(solarSettings, "A205", "K"));
    states.push(getState(solarSettings, "A206", "K"));
    states.push(getState(solarSettings, "A207", "K"));
    states.push(getEnumState(solarSettings, "I34", dict.offAutoManuell));
    states.push(getReadOnlyState(solarSettings, "A21", "\xB0C"));
    states.push(getReadOnlyState(solarSettings, "A1101", "\xB0C"));
    states.push(getReadOnlyState(solarSettings, "A22", "\xB0C"));
    states.push(getReadOnlyState(solarSettings, "A209", "\xB0C"));
    const solarRegen = dict.getTranslations(["Solar", "SolarRegen"], language);
    states.push(getEnumState(solarSettings, "I42", dict.offAutoManuell));
    states.push(getReadOnlyState(solarRegen, "A686", "\xB0C"));
    states.push(getState(solarRegen, "A687", "\xB0C"));
    states.push(getState(solarRegen, "A688", "K"));
    states.push(getEnumState(solarRegen, "I2253", dict.openClosed));
  }
  if (pollStatesOf.includes(pvIndicatorState.Id)) {
    const pvSettings = dict.getTranslations(["PV", "Settings"], language);
    states.push(getEnumState(pvSettings, "I41", dict.offAutoManuell));
    states.push(getReadOnlyState(pvSettings, "A1223", "kW"));
    states.push(getReadOnlyState(pvSettings, "A1194", "kW"));
    states.push(getReadOnlyState(pvSettings, "A1224", "kW"));
    const pvChange = dict.getTranslations(["PV", "PVChange"], language);
    states.push(getState(pvChange, "A682", "K"));
    states.push(getState(pvChange, "A683", "K"));
    states.push(getState(pvChange, "A684", "K"));
    states.push(getState(pvChange, "A685", "K"));
  }
  const energySettings = dict.getTranslations(["CPD", "Status"], language);
  states.push(getReadOnlyState(energySettings, "A25", "kW"));
  states.push(getReadOnlyState(energySettings, "A26", "kW"));
  states.push(getReadOnlyState(energySettings, "A28"));
  states.push(getReadOnlyState(energySettings, "A27", "kW"));
  states.push(getReadOnlyState(energySettings, "A29"));
  const measurements = dict.getTranslations(["MValues"], language);
  states.push(getReadOnlyState(measurements, "A1", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A2", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A3", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A4", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A5", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A6", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A7", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A8", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A10", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A699", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A700", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A701", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A702", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A12", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2017", "bar"));
  states.push(getReadOnlyState(measurements, "I2018", "bar"));
  states.push(getReadOnlyState(measurements, "I2019", "bar"));
  states.push(getReadOnlyState(measurements, "I2020", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2021", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2022", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2025", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2024", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2023", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2032", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2033", "K"));
  states.push(getReadOnlyState(measurements, "I2034", "\xB0C"));
  states.push(getReadOnlyState(measurements, "I2039", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A13", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A14", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A15", "bar"));
  states.push(getReadOnlyState(measurements, "A17", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A18", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A19", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A20", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A21", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A16", "\xB0C"));
  states.push(getReadOnlyState(measurements, "A1022", "l/s"));
  states.push(getReadOnlyState(measurements, "A1023", "\xB0C"));
  const status = "Status";
  states.push(getIndicator(status, "D581"));
  states.push(getIndicator(status, "D701"));
  states.push(getIndicator(status, "D71"));
  states.push(getReadOnlyState(status, "I5", "dd", dict.getTranslation(["I5", "I1260"], " ")));
  states.push(getReadOnlyState(status, "I6", "mmm", dict.getTranslation(["I5", "Day"], " ")));
  states.push(getReadOnlyState(status, "I7", "yy", dict.getTranslation(["I5", "I1261"], " ")));
  states.push(getReadOnlyState(status, "I8", "h"));
  states.push(getReadOnlyState(status, "I9", "min", dict.getTranslation("I8")));
  const statusDI = `${status}.DigitalInputs`;
  states.push(getIndicator(statusDI, "D1010"));
  states.push(getIndicator(statusDI, "D815"));
  states.push(getIndicator(statusDI, "D816"));
  states.push(getIndicator(statusDI, "D817"));
  states.push(getIndicator(statusDI, "D818"));
  states.push(getIndicator(statusDI, "D821"));
  states.push(getIndicator(statusDI, "D822"));
  states.push(getIndicator(statusDI, "D823"));
  states.push(getIndicator(statusDI, "D824"));
  return states;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getServicesStates,
  getStates
});
//# sourceMappingURL=states.js.map
