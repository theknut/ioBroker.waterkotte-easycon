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
var waterkotteheatpump_exports = {};
__export(waterkotteheatpump_exports, {
  WaterkotteHeatPump: () => WaterkotteHeatPump
});
module.exports = __toCommonJS(waterkotteheatpump_exports);
var import_states = require("./states");
var import_types = require("./types");
var import_waterkottecgi = require("./waterkottecgi");
class WaterkotteHeatPump {
  constructor(ipAddress, username, password, log) {
    this.username = username;
    this.password = password;
    this.log = log;
    this.api = new import_waterkottecgi.WaterkotteCgi(ipAddress, log);
  }
  api;
  login;
  tags = [];
  async connectAsync() {
    try {
      this.login = await this.api.loginAsync(this.username, this.password);
      return true;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      return false;
    }
  }
  async disconnectAsync() {
    try {
      await this.api.logoutAsync();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      return false;
    }
  }
  async requestTagsAsync() {
    try {
      if (!this.login) {
        const loginResult = await this.connectAsync();
        if (typeof loginResult == "boolean") {
          if (loginResult) {
            this.log.debug("Successfully (re-)logged in");
            return await this.requestTagsAsync();
          } else {
            this.log.error("Unhandled result when logging in");
            return [];
          }
        } else {
          throw loginResult;
        }
      }
      if (this.tags.length == 0) {
        this.tags = await this.getTagsToRequest();
      }
      const tagResponses = await this.api.getTagsAsync(this.tags, this.login);
      return tagResponses;
    } catch (e) {
      if (e instanceof import_types.WaterkotteError) {
        switch (e.code) {
          case import_types.WaterkotteError.LOGIN_REQUIRED:
            this.login = void 0;
            return await this.requestTagsAsync();
          case import_types.WaterkotteError.TOO_MANY_USERS:
            this.login = void 0;
            this.log.warn(`Too many users, skip this request`);
            return [];
        }
      }
      throw e;
    }
  }
  async getTagsToRequest() {
    if (!this.login) {
      throw new import_types.AdapterError("getTagsToRequest: Not logged in");
    }
    const response = await this.api.getTagsAsync((0, import_states.getServicesStates)(), this.login);
    const activeServices = response.filter(
      (x) => x instanceof import_types.TagResponse && x.state instanceof import_types.IndicatorState && x.state.normalizeValue(x.response.value) === true
    ).map((x) => {
      this.log.debug(`Active service: ${JSON.stringify(x.state.Text)}`);
      return x.state.Id;
    });
    const states = (0, import_states.getStates)(activeServices);
    return states;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WaterkotteHeatPump
});
//# sourceMappingURL=waterkotteheatpump.js.map
