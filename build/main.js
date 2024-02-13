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
var import_types = require("./types");
var import_waterkotteheatpump = require("./waterkotteheatpump");
class WaterkotteEasycon extends utils.Adapter {
  api;
  updateParametersInterval;
  knownObjects = {};
  constructor(options = {}) {
    super({
      ...options,
      name: "waterkotte-easycon"
    });
    this.on("ready", this.onReady.bind(this));
  }
  async onReady() {
    this.setStateAsync("info.connection", false, true);
    if (!await this.checkConfig()) {
      return;
    }
    this.api = new import_waterkotteheatpump.WaterkotteHeatPump(this.config.ipAddress, this.config.username, this.config.password, this.log);
    try {
      const response = await this.updateParametersAsync();
      if (response instanceof Error) {
        let message = void 0;
        if (response instanceof import_types.WaterkotteError) {
          message = `${response.code} - ${response.message}`;
        }
        this.log.error(`Unhandled error on adapter startup: ${message != null ? message : message = String(response)}`);
        this.log.error(`Callstack: ${response.stack}`);
        await this.setMessageStateAsync(message);
        return;
      }
      this.log.info("Successfully logged in");
      await this.setStateAsync("info.connection", true, true);
      await this.setMessageStateAsync("");
      const interval = this.setInterval(
        async () => await this.updateParametersAsync(),
        this.config.pollingInterval
      );
      if (interval) {
        this.updateParametersInterval = interval;
      }
    } catch (e) {
      this.log.error(`Unhandled error on adapter startup: ${e}`);
      if (e instanceof Error) {
        this.log.error(`Callstack: ${e.stack}`);
      }
      await this.setMessageStateAsync(`Unhandled error on adapter startup: ${String(e)}`);
      return;
    }
  }
  async checkConfig() {
    let configName = "";
    if (!this.config.ipAddress) {
      configName = "ip address";
    } else if (!this.config.username) {
      configName = "username";
    } else if (!this.config.password) {
      configName = "password";
    }
    if (!configName) {
      return true;
    }
    const message = `Unable to connect to heat pump: missing ${configName}`;
    this.log.warn(message);
    await this.setMessageStateAsync(message);
    return false;
  }
  async updateParametersAsync() {
    if (!this.api) {
      throw new import_types.AdapterError("Unable to update parameters because api has not been initialized");
    }
    try {
      const tagResponses = await this.api.requestTagsAsync();
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
        await this.createObjectIfNotExists(
          id,
          {
            type: "state",
            common: tagResponse.state.getCommonObject(),
            native: {
              id: tagResponse.state.Id
            }
          },
          tagResponse.state
        );
        await this.setStateAsync(id, tagResponse.state.normalizeValue(tagResponse.response.value), true);
      }
      await this.setMessageStateAsync("");
    } catch (e) {
      let returnError;
      if (e instanceof Error) {
        if (e instanceof import_types.WaterkotteError) {
          returnError = e;
        } else {
          returnError = new import_types.RethrowError(e);
        }
      } else {
        returnError = new import_types.AdapterError(`Error during update: '${e}'`);
      }
      this.log.warn(returnError.message);
      await this.setMessageStateAsync(returnError.message);
      return returnError;
    }
  }
  async setMessageStateAsync(message) {
    await this.createObjectIfNotExists(
      "info.message",
      {
        type: "state",
        common: {
          write: false,
          type: "string"
        },
        native: {}
      },
      message
    );
    await this.setStateAsync("info.message", message, true);
  }
  async createObjectIfNotExists(id, objPart, item) {
    if (!this.knownObjects[id]) {
      await this.extendObjectAsync(id, objPart);
      this.knownObjects[id] = item;
    }
  }
  onUnload(callback) {
    var _a;
    try {
      clearInterval(this.updateParametersInterval);
      try {
        (_a = this.api) == null ? void 0 : _a.disconnectAsync().then(() => {
          this.log.info("Successfully logged out");
        }).finally();
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
