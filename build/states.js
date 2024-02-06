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
  getStates: () => getStates
});
module.exports = __toCommonJS(states_exports);
var import_dictionary = require("./dictionary");
var import_types = require("./types");
function getStates(pollStatesOf, language = "en") {
  const states = [];
  const dict = new import_dictionary.WaterkotteDictionary();
  if (pollStatesOf.includes("Heizen")) {
    const heatingSettings = dict.getTranslations(["Heat", "Settings"], language);
    states.push(
      new import_types.EnumState(
        heatingSettings,
        "I263",
        dict.getTranslation("I263"),
        { 0: "-2.0", 1: "-1.5", 2: "-1.0", 3: "-0.5", 4: "0.0", 5: "0.5", 6: "1.0", 7: "1.5", 8: "2.0" },
        "\xB0C"
      )
    );
    states.push(new import_types.State(heatingSettings, "A32", dict.getTranslation("A32"), "\xB0C"));
    states.push(new import_types.EnumState(heatingSettings, "I30", dict.getTranslation("I30"), dict.offAutoManuell));
    states.push(new import_types.ReadOnlyState(heatingSettings, "A30", dict.getTranslation("A30"), "\xB0C"));
    states.push(new import_types.ReadOnlyState(heatingSettings, "A31", dict.getTranslation("A31"), "\xB0C"));
    states.push(new import_types.State(heatingSettings, "A61", dict.getTranslation("A61"), "K"));
    const heatingCurve = dict.getTranslations(["Heat", "Curve"], language);
    states.push(new import_types.ReadOnlyState(heatingCurve, "A90", dict.getTranslation("A90"), "\xB0C"));
    states.push(new import_types.State(heatingCurve, "A93", dict.getTranslation("A93"), "\xB0C"));
    states.push(new import_types.State(heatingCurve, "A94", dict.getTranslation("A94"), "\xB0C"));
    states.push(new import_types.State(heatingCurve, "A91", dict.getTranslation("A91"), "\xB0C"));
    states.push(new import_types.State(heatingCurve, "A92", dict.getTranslation("A92"), "\xB0C"));
    states.push(new import_types.ReadOnlyState(heatingCurve, "A96", dict.getTranslation("A96"), "\xB0C"));
    const heatingInfluence = dict.getTranslations(["Heat", "Influence"], language);
    states.push(new import_types.ReadOnlyState(heatingInfluence, "A98", dict.getTranslation("A98"), "\xB0C"));
    states.push(new import_types.State(heatingInfluence, "A100", dict.getTranslation("A100"), "\xB0C"));
    states.push(
      new import_types.EnumState(
        heatingInfluence,
        "A101",
        dict.getTranslation("A101"),
        { 0: "0", 1: "50", 2: "100", 3: "150", 4: "200" },
        "%"
      )
    );
    states.push(new import_types.State(heatingInfluence, "A102", dict.getTranslation("A102"), "K"));
    states.push(new import_types.State(heatingInfluence, "A103", dict.getTranslation("A103"), "K"));
    states.push(new import_types.ReadOnlyState(heatingInfluence, "A99", dict.getTranslation("A99"), "K"));
    const heatingStatus = dict.getTranslations(["Heat    ", "Status"], language);
    states.push(new import_types.IndicatorState(heatingStatus, "I137", dict.getTranslation("I137")));
    states.push(new import_types.IndicatorState(heatingStatus, "D24", dict.getTranslation("D24")));
  }
  if (pollStatesOf.includes("K\xFChlen")) {
    states.push(new import_types.State("K\xFChlen.Einstellungen", "A109", dict.getTranslation("A109"), "\xB0C"));
    states.push(new import_types.EnumState("K\xFChlen.Einstellungen", "I31", dict.getTranslation("I31"), dict.offAutoManuell));
    states.push(new import_types.ReadOnlyState("K\xFChlen.Einstellungen", "A33", dict.getTranslation("A33"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("K\xFChlen.Einstellungen", "A34", dict.getTranslation("A34"), "\xB0C"));
    states.push(new import_types.State("K\xFChlen.Einstellungen", "A108", dict.getTranslation("A108"), "\xB0C"));
    states.push(new import_types.State("K\xFChlen.Einstellungen", "A107", dict.getTranslation("A107"), "K"));
    states.push(new import_types.IndicatorState("K\xFChlen.Status", "I138", dict.getTranslation("I138")));
    states.push(new import_types.IndicatorState("K\xFChlen.Status", "D75", dict.getTranslation("D75")));
  }
  if (pollStatesOf.includes("Wasser")) {
    states.push(new import_types.State("Wasser.Einstellungen", "A38", dict.getTranslation("A38"), "\xB0C"));
    states.push(new import_types.EnumState("Wasser.Einstellungen", "I32", dict.getTranslation("I32"), dict.offAutoManuell));
    states.push(new import_types.ReadOnlyState("Wasser.Einstellungen", "A19", dict.getTranslation("A19"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Wasser.Einstellungen", "A37", dict.getTranslation("A37"), "\xB0C"));
    states.push(new import_types.State("Wasser.Einstellungen", "A139", dict.getTranslation("A139"), "K"));
    states.push(new import_types.State("Wasser.ThermischeDesinfektion", "A168", dict.getTranslation("A168"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Wasser.ThermischeDesinfektion", "I505", dict.getTranslation("I505")));
    states.push(new import_types.State("Wasser.ThermischeDesinfektion", "I507", dict.getTranslation("I507"), "h"));
    states.push(
      new import_types.EnumState("Wasser.ThermischeDesinfektion", "I508", dict.getTranslation("I508"), dict.noneDayAll)
    );
    states.push(new import_types.State("Wasser.Solarunterst\xFCtzung", "I508", dict.getTranslation("I508"), "\xB0C"));
    states.push(new import_types.State("Wasser.Solarunterst\xFCtzung", "I517", dict.getTranslation("I517")));
    states.push(new import_types.ReadOnlyState("Wasser.Solarunterst\xFCtzung", "I518", dict.getTranslation("I518")));
    states.push(new import_types.IndicatorState("Wasser.Status", "I139", dict.getTranslation("I139")));
    states.push(new import_types.IndicatorState("Wasser.Status", "D118", dict.getTranslation("D117")));
  }
  if (pollStatesOf.includes("Energiebilanz")) {
    states.push(new import_types.ReadOnlyState("Energiebilanz.Leistungsbilanz", "A25", dict.getTranslation("A25"), "kW"));
    states.push(new import_types.ReadOnlyState("Energiebilanz.Leistungsbilanz", "A26", dict.getTranslation("A26"), "kW"));
    states.push(new import_types.ReadOnlyState("Energiebilanz.Leistungsbilanz", "A28", dict.getTranslation("A28")));
    states.push(new import_types.ReadOnlyState("Energiebilanz.Leistungsbilanz", "A27", dict.getTranslation("A27"), "kW"));
    states.push(new import_types.ReadOnlyState("Energiebilanz.Leistungsbilanz", "A29", dict.getTranslation("A29")));
  }
  if (pollStatesOf.includes("Messwerte")) {
    states.push(new import_types.ReadOnlyState("Messwerte", "A1", dict.getTranslation("A1"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A2", dict.getTranslation("A2"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A3", dict.getTranslation("A3"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A4", dict.getTranslation("A4"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A5", dict.getTranslation("A5"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A6", dict.getTranslation("A6"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A7", dict.getTranslation("A7"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A8", dict.getTranslation("A8"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A10", dict.getTranslation("A10"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A699", dict.getTranslation("A699"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A700", dict.getTranslation("A700"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A701", dict.getTranslation("A701"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A702", dict.getTranslation("A702"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A12", dict.getTranslation("A12"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2017", dict.getTranslation("I2017"), "bar"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2018", dict.getTranslation("I2018"), "bar"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2019", dict.getTranslation("I2019"), "bar"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2020", dict.getTranslation("I2020"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2021", dict.getTranslation("I2021"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2022", dict.getTranslation("I2022"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2025", dict.getTranslation("I2025"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2024", dict.getTranslation("I2024"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2023", dict.getTranslation("I2023"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2032", dict.getTranslation("I2032"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2033", dict.getTranslation("I2033"), "K"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2034", dict.getTranslation("I2034"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "I2039", dict.getTranslation("I2039"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A13", dict.getTranslation("A13"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A14", dict.getTranslation("A14"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A15", dict.getTranslation("A15"), "bar"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A17", dict.getTranslation("A17"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A18", dict.getTranslation("A18"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A19", dict.getTranslation("A19"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A20", dict.getTranslation("A20"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A21", dict.getTranslation("A21"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A16", dict.getTranslation("A16"), "\xB0C"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A1022", dict.getTranslation("A1022"), "l/s"));
    states.push(new import_types.ReadOnlyState("Messwerte", "A1023", dict.getTranslation("A1023"), "\xB0C"));
  }
  if (pollStatesOf.includes("Status")) {
    states.push(new import_types.IndicatorState("Status", "D581", dict.getTranslation("D581")));
    states.push(new import_types.IndicatorState("Status", "D701", dict.getTranslation("D701")));
    states.push(new import_types.IndicatorState("Status", "D71", dict.getTranslation("D71")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D1010", dict.getTranslation("D1010")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D815", dict.getTranslation("D815")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D816", dict.getTranslation("D816")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D817", dict.getTranslation("D817")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D818", dict.getTranslation("D818")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D821", dict.getTranslation("D821")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D822", dict.getTranslation("D822")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D823", dict.getTranslation("D823")));
    states.push(new import_types.IndicatorState("Status.DigitalEing\xE4nge", "D824", dict.getTranslation("D824")));
  }
  return states;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getStates
});
//# sourceMappingURL=states.js.map
