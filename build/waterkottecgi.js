"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var waterkottecgi_exports = {};
__export(waterkottecgi_exports, {
  WaterkotteCgi: () => WaterkotteCgi
});
module.exports = __toCommonJS(waterkottecgi_exports);
var import_axios = __toESM(require("axios"));
var import_types = require("./types");
class WaterkotteCgi {
  constructor(ipAddress, log) {
    this.ipAddress = ipAddress;
    this.log = log;
    this.baseUrl = `http://${this.ipAddress}/`;
    this.cgiUrl = `${this.baseUrl}cgi/`;
  }
  static TAG_RESPONSE_REG_EXP = /\#(?<name>[\w\d]+)\s+(?<status>.*)\n(?:(?<unknown>\d+)\s+(?<value>.?\d+))?/gm;
  static LOGIN_REQUEST_REG_EXP = /(?:(?<status>\-?\d+)[\n\r]+)?(?<message>\#.*)/gm;
  cookieName = "IDALToken";
  baseUrl;
  cgiUrl;
  maximumTagsPerRequest = 75;
  async loginAsync(username = "waterkotte", password = "waterkotte") {
    const loginUrl = `${this.cgiUrl}login?username=${username}&password=${password}`;
    const cookie = await this.requestAsync(loginUrl, (response) => {
      var _a, _b, _c;
      try {
        this.validateLogInOutResult(response.data);
      } catch (e) {
        if (!(e instanceof import_types.WaterkotteError && e.message === import_types.WaterkotteError.RELOGIN_ATTEMPT_MSG)) {
          throw e;
        }
      }
      const cookie2 = (_c = (_b = (_a = response.headers["set-cookie"]) == null ? void 0 : _a.find((cookie3) => cookie3.includes(this.cookieName))) == null ? void 0 : _b.match(new RegExp(`^${this.cookieName}=(.+?);`))) == null ? void 0 : _c[1];
      if (!cookie2) {
        throw new import_types.AdapterError(
          `Unable to login: Could not find login token '${this.cookieName}' - Response: '${response.data}'`
        );
      }
      return cookie2;
    });
    return { token: cookie };
  }
  async logoutAsync() {
    const logoutUrl = `${this.cgiUrl}logout`;
    await this.requestAsync(logoutUrl, (x) => this.validateLogInOutResult(x.data));
  }
  validateLogInOutResult(response) {
    const extracted = this.extractWaterkotteInformation(response);
    if (extracted instanceof import_types.WaterkotteError) {
      throw extracted;
    } else if (extracted && extracted.code === 1) {
      return extracted;
    } else {
      throw new import_types.AdapterError(`Unhandled response from heat pump: ${response}`);
    }
  }
  extractWaterkotteInformation(response) {
    var _a, _b, _c;
    const match = (_b = (_a = String(response).matchAll(WaterkotteCgi.LOGIN_REQUEST_REG_EXP).next()) == null ? void 0 : _a.value) == null ? void 0 : _b.groups;
    if (!match) {
      return void 0;
    }
    const code = match.status != void 0 ? Number(match.status) : match.status;
    if ((_c = match.message) == null ? void 0 : _c.startsWith(import_types.WaterkotteError.ERROR_INDICATOR)) {
      return new import_types.WaterkotteError(match.message, code);
    }
    return { code, message: match.message };
  }
  async getTagsAsync(tags, login) {
    const tagResponses = [];
    for (let i = 0; i < tags.length; i += this.maximumTagsPerRequest) {
      const chunk = tags.slice(i, i + this.maximumTagsPerRequest);
      const record = chunk.reduce(
        (acc, item) => ({ ...acc, [item["Id"]]: item }),
        {}
      );
      const tagUrl = `${this.cgiUrl}readTags?n=${chunk.length + chunk.map((x, i2) => `&t${i2 + 1}=${x.Id}`).join("")}`;
      const response = await this.requestAsync(
        tagUrl,
        (response2) => {
          const waterkotteResponse = this.extractWaterkotteInformation(response2.data);
          if (waterkotteResponse instanceof import_types.WaterkotteError) {
            throw waterkotteResponse;
          }
          return String(response2.data).matchAll(WaterkotteCgi.TAG_RESPONSE_REG_EXP);
        },
        login
      );
      for (const match of response) {
        const parameter = match.groups;
        if (!parameter) {
          continue;
        }
        const ctor = parameter.status != import_types.TagResponse.STATUS_OK ? import_types.UnknownTagResponse : import_types.TagResponse;
        const state = record[parameter.name];
        if (!state) {
          this.log.warn(`Could not match tag resonse for ${parameter.name} to any requested tag`);
          continue;
        }
        tagResponses.push(
          new ctor(
            {
              name: parameter.name,
              value: parameter.value,
              status: parameter.status,
              unkown: parameter.unknown
            },
            state
          )
        );
      }
    }
    return tagResponses;
  }
  async requestAsync(url, processResponse, login) {
    try {
      const response = await import_axios.default.get(url, {
        headers: { Cookie: login ? `${this.cookieName}=${login.token}` : "" }
      });
      return processResponse(response);
    } catch (e) {
      if (e instanceof import_types.WaterkotteError || e instanceof import_types.AdapterError) {
        throw e;
      }
      const baseMessage = `Request ${url.includes("password") ? "" : `to '${url}' `}failed: `;
      if (e instanceof Error) {
        throw new import_types.RethrowError(e, `${baseMessage}${e.message}`);
      } else {
        throw new import_types.AdapterError(`${baseMessage}${String(e)}`);
      }
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WaterkotteCgi
});
//# sourceMappingURL=waterkottecgi.js.map
