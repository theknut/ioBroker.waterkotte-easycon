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
var types_exports = {};
__export(types_exports, {
  AdapterError: () => AdapterError,
  CommonState: () => CommonState,
  EnumState: () => EnumState,
  HexAnalogState: () => HexAnalogState,
  IndicatorState: () => IndicatorState,
  ReadOnlyEnumState: () => ReadOnlyEnumState,
  ReadOnlyState: () => ReadOnlyState,
  RethrowError: () => RethrowError,
  State: () => State,
  TagResponse: () => TagResponse,
  UnknownTagResponse: () => UnknownTagResponse,
  WaterkotteError: () => WaterkotteError
});
module.exports = __toCommonJS(types_exports);
class CommonState {
  static ID_PARTS_REGEXP = /(?<qualifier>[a-z])(?<number>\d+)/gim;
  type = "CommonState";
  Path;
  Id;
  Readonly;
  Unit;
  Text;
  Type;
  ValueMap;
  idParts = void 0;
  constructor(path, id, text, unit, readonly = true, valueMap = [], type = "number") {
    this.Path = path;
    this.Id = id;
    this.Text = text;
    this.Unit = unit;
    this.Readonly = readonly;
    this.ValueMap = valueMap;
    this.Type = type;
  }
  static getIdParts(id) {
    var _a, _b, _c;
    const groups = (_c = (_b = (_a = id.matchAll(CommonState.ID_PARTS_REGEXP)) == null ? void 0 : _a.next()) == null ? void 0 : _b.value) == null ? void 0 : _c.groups;
    if (!groups) {
      throw new AdapterError(`Tag id ${id} format not supported`);
    }
    return { Qualifier: groups.qualifier, Number: Number(groups.number) };
  }
  getStateId() {
    return `${this.Path}.${this.Id}`;
  }
  getRole() {
    if (this.Unit === "\xB0C") {
      return "value.temperature";
    } else if (this.Type === "boolean") {
      return "indicator";
    } else {
      return "value";
    }
  }
  getCommonObject() {
    const common = {
      name: this.Text,
      unit: this.Unit,
      type: this.Type,
      read: true,
      role: this.getRole(),
      write: !this.Readonly,
      states: this.ValueMap
    };
    return common;
  }
  normalizeValue(value) {
    switch (this.Id[0]) {
      case "D":
        return this.toBoolean(value);
      case "A":
        if (this.Unit === "kWh" || this instanceof HexAnalogState) {
          throw new AdapterError(
            "Cannot normalize hex value based on a single value. Use this.normalizeHexValue(any, any) instead."
          );
        }
        return Number(value) / 10;
      case "I":
        if (this.Type === "boolean") {
          return this.toBoolean(value);
        } else {
          return Number(value);
        }
      default:
        throw new AdapterError(`Type ${this.Type} not implemented`);
    }
  }
  toBoolean(value) {
    if (value > 1) {
      throw new AdapterError(`Received invalid value '${value}' for id '${this.Id}'`);
    }
    return value === 1;
  }
}
class HexAnalogState extends CommonState {
  constructor(path, idPrimary, idSecondary, text) {
    if (CommonState.getIdParts(idPrimary).Qualifier !== "A" || CommonState.getIdParts(idSecondary).Qualifier !== "A") {
      throw new AdapterError(`Only analog values can be hex (${idPrimary}, ${idSecondary})`);
    }
    super(path, idPrimary, text, "kWh", true, [], "number");
    this.idPrimary = idPrimary;
    this.idSecondary = idSecondary;
  }
  type = "HexAnalogState";
  normalizeHexValue(firstValue, secondaryValue) {
    if (!firstValue || !secondaryValue) {
      throw new AdapterError(
        `None or only one value was provided, but two are needed to normalize hex value (firstValue: ${firstValue}, secondaryValue: ${secondaryValue})`
      );
    }
    const value = firstValue << 16 >>> 0 | secondaryValue >>> 0 & 65535;
    return Number(this.IEEE754_Hex32ToDez(value, 1));
  }
  IEEE754_Hex32ToDez(param1, t) {
    const a = param1.toString(16);
    let e, i, n, l, o, r, s, d, g;
    const x = "00000000";
    return i = x + parseInt(a.substr(0, 2), 16).toString(2), n = x + parseInt(a.substr(2, 2), 16).toString(2), l = x + parseInt(a.substr(4, 2), 16).toString(2), o = x + parseInt(a.substr(6, 2), 16).toString(2), i = i.substr(i.length - 8, 8), n = n.substr(n.length - 8, 8), l = l.substr(l.length - 8, 8), o = o.substr(o.length - 8, 8), r = i + n + l + o, s = parseInt(r.charAt(0), 2), d = parseInt(r.substr(1, 8), 2), g = parseInt(r.substr(9, 23), 2), e = (1 - 2 * s) * Math.pow(2, d - 127) * (1 + g / Math.pow(2, 23)), e.toFixed(t);
  }
}
class ReadOnlyState extends CommonState {
  type = "ReadOnlyState";
  constructor(path, id, text, unit, type = "number") {
    super(path, id, text, unit, true, [], type);
  }
}
class State extends CommonState {
  type = "State";
  constructor(path, id, text, unit, type = "number") {
    super(path, id, text, unit, false, [], type);
  }
}
class EnumState extends CommonState {
  type = "EnumState";
  constructor(path, id, text, valueMap, unit) {
    super(path, id, text, unit, false, valueMap, "number");
  }
}
class ReadOnlyEnumState extends CommonState {
  type = "ReadOnlyEnumState";
  constructor(path, id, text, valueMap, unit) {
    super(path, id, text, unit, true, valueMap, "number");
  }
}
class IndicatorState extends ReadOnlyState {
  type = "Indicator";
  constructor(path, id, text) {
    super(path, id, text, void 0, "boolean");
  }
}
class TagResponse {
  constructor(response, state) {
    this.response = response;
    this.state = state;
  }
  static STATUS_OK = "S_OK";
}
class UnknownTagResponse extends TagResponse {
  constructor(response, state) {
    super(response, state);
  }
}
class WaterkotteError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
  static TOO_MANY_USERS = -37;
  static USER_DOES_NOT_EXIST = -49;
  static PASS_DONT_MATCH = -45;
}
class AdapterError extends Error {
  constructor(message) {
    super(message);
  }
}
class RethrowError extends AdapterError {
  constructor(innerError, message = innerError.message) {
    super(message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AdapterError,
  CommonState,
  EnumState,
  HexAnalogState,
  IndicatorState,
  ReadOnlyEnumState,
  ReadOnlyState,
  RethrowError,
  State,
  TagResponse,
  UnknownTagResponse,
  WaterkotteError
});
//# sourceMappingURL=types.js.map
