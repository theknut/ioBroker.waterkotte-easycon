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
var waterkotte_exports = {};
__export(waterkotte_exports, {
  WaterkotteCgi: () => WaterkotteCgi
});
module.exports = __toCommonJS(waterkotte_exports);
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
  static LOGIN_REQUEST_REG_EXP = /(?<status>-?\d+)[\n\r]+(?<message>.*)/gm;
  cookieName = "IDALToken";
  baseUrl;
  cgiUrl;
  maximumTagsPerRequest = 75;
  async loginAsync(username = "waterkotte", password = "waterkotte") {
    var _a, _b, _c, _d, _e;
    const loginUrl = `${this.cgiUrl}login?username=${username}&password=${password}`;
    const response = await this.requestAsync(loginUrl);
    const result = (_b = (_a = String(response.data).matchAll(WaterkotteCgi.LOGIN_REQUEST_REG_EXP).next()) == null ? void 0 : _a.value) == null ? void 0 : _b.groups;
    switch (Number(result == null ? void 0 : result.status)) {
      case 1:
        this.log.debug("Successfully logged in");
        break;
      default:
        if (result) {
          throw new import_types.WaterkotteError(Number(result.status), result.message);
        } else {
          throw new import_types.AdapterError(`Unhandled response from heat pump: ${response.data}`);
        }
    }
    const cookie = (_e = (_d = (_c = response.headers["set-cookie"]) == null ? void 0 : _c.find((cookie2) => cookie2.includes(this.cookieName))) == null ? void 0 : _d.match(new RegExp(`^${this.cookieName}=(.+?);`))) == null ? void 0 : _e[1];
    if (!cookie) {
      throw new import_types.AdapterError(
        `Unable to login: Could not find login token '${this.cookieName}' - Response: '${response.data}'`
      );
    }
    return { token: cookie };
  }
  async logoutAsync() {
    var _a, _b;
    const logoutUrl = `${this.cgiUrl}logout`;
    const response = await this.requestAsync(logoutUrl);
    const result = (_b = (_a = String(response.data).matchAll(WaterkotteCgi.LOGIN_REQUEST_REG_EXP).next()) == null ? void 0 : _a.value) == null ? void 0 : _b.groups;
    switch (Number(result == null ? void 0 : result.status)) {
      case 1:
        this.log.debug("Successfully logged out");
        break;
      default:
        if (result) {
          throw new import_types.WaterkotteError(Number(result.status), result.message);
        } else {
          throw new import_types.AdapterError(`Unhandled response from heat pump: ${response.data}`);
        }
    }
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
      const response = await this.requestAsync(tagUrl, login);
      for (const match of String(response.data).matchAll(WaterkotteCgi.TAG_RESPONSE_REG_EXP)) {
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
  async requestAsync(url, login) {
    try {
      const response = await import_axios.default.get(url, {
        headers: { Cookie: login ? `${this.cookieName}=${login.token}` : "" }
      });
      return response;
    } catch (e) {
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
//# sourceMappingURL=waterkotte.js.map
