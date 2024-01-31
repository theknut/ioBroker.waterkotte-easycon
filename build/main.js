"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var utils = __toESM(require("@iobroker/adapter-core"));
var import_states = require("./states");
var import_types = require("./types");
var import_waterkotte = require("./waterkotte");
class WaterkotteEasycon extends utils.Adapter {
  states = [];
  api;
  updateParametersInterval;
  login = {};
  constructor(options = {}) {
    super({
      ...options,
      name: "waterkotte-easycon"
    });
    this.on("ready", this.onReady.bind(this));
  }
  async onReady() {
    var _a;
    this.setStateAsync("info.connection", false, true);
    this.api = new import_waterkotte.WaterkotteCgi(this.config.ipAddress, this.log);
    try {
      this.login = await this.api.loginAsync(this.config.username, this.config.password);
      await this.setStateAsync("info.connection", true, true);
      await this.setErrorAsync("");
    } catch (e) {
      let message = String(e);
      if (e instanceof import_types.WaterkotteError) {
        message = `${e.code} - ${e.message}`;
      }
      this.log.error(message);
      await this.setErrorAsync(message);
      return;
    }
    this.states = (0, import_states.getStates)(
      (_a = this.config.pollStatesOf) != null ? _a : ["Heizen", "K\xFChlen", "Wasser", "Energiebilanz", "Messwerte", "Status"]
    );
    await this.updateParametersAsync(this.states);
    const interval = this.setInterval(
      async (states) => await this.updateParametersAsync(states),
      this.config.pollingInterval,
      this.states
    );
    if (interval) {
      this.updateParametersInterval = interval;
    }
  }
  async updateParametersAsync(states) {
    if (!this.api) {
      throw new Error("Unable to update parameters because api has not been initialized");
    }
    try {
      const tagResponses = await this.api.getTagsAsync(states, this.login);
      for (const tagResponse of tagResponses) {
        if (tagResponse.response.status != import_types.TagResponse.STATUS_OK) {
          this.log.warn(
            `Unable to get parameter '${tagResponse.response.name}'. Received '${tagResponse.response.status}' instead.`
          );
          continue;
        }
        if (!tagResponse.state) {
          continue;
        }
        const id = tagResponse.state.getStateId();
        await this.extendObjectAsync(id, {
          type: "state",
          common: tagResponse.state.getCommonObject(),
          native: {}
        });
        await this.setStateAsync(id, tagResponse.state.normalizeValue(tagResponse.response.value), true);
      }
    } catch (e) {
      let message = "unknown";
      if (e instanceof import_types.WaterkotteError) {
        message = `Received unknown error from heat pump: ${e.code} - ${e.message}`;
      } else if (typeof e === "string") {
        message = e;
      } else if (e instanceof Error) {
        message = e.message;
      }
      this.log.warn(`Error during update: '${message}'`);
      await this.setErrorAsync(message);
    }
  }
  async setErrorAsync(message) {
    await this.extendObjectAsync("info.lastError", {
      type: "state",
      common: {
        write: false,
        type: "string"
      },
      native: {}
    });
    await this.setStateAsync("info.lastError", "", true);
  }
  onUnload(callback) {
    var _a;
    try {
      clearInterval(this.updateParametersInterval);
      try {
        (_a = this.api) == null ? void 0 : _a.logoutAsync().then().finally();
      } catch {
      }
      callback();
    } catch (e) {
      callback();
    }
  }
  onStateChange(id, state) {
    if (state) {
      this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
    } else {
      this.log.info(`state ${id} deleted`);
    }
  }
}
if (require.main !== module) {
  module.exports = (options) => new WaterkotteEasycon(options);
} else {
  (() => new WaterkotteEasycon())();
}
//# sourceMappingURL=main.js.map
