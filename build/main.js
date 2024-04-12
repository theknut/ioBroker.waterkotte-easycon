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
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
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
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Is called when databases are connected and adapter received configuration.
   */
  async onReady() {
    this.setStateAsync("info.connection", false, true);
    this.knownObjects = {};
    if (this.updateParametersInterval) {
      this.clearInterval(this.updateParametersInterval);
    }
    if (!await this.updateAndHandleConfigAsync()) {
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
      const limitedUpdateInterval = Math.min(86400, Math.max(20, this.config.updateInterval));
      const interval = this.setInterval(
        async () => await this.updateParametersAsync(),
        limitedUpdateInterval * 1e3
      );
      if (interval) {
        this.updateParametersInterval = interval;
      }
      if (this.config.updateInterval != limitedUpdateInterval) {
        this.log.warn(`Limited update interval to ${limitedUpdateInterval} seconds`);
      } else {
        this.log.info("Interval " + limitedUpdateInterval);
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
  async updateAndHandleConfigAsync() {
    if (!await this.checkConfig()) {
      return false;
    }
    const info = await this.getObjectAsync("info");
    const lastConfig = info == null ? void 0 : info.native;
    if (lastConfig) {
      if (lastConfig.pathFlavor != this.config.pathFlavor || lastConfig.removeWhitespace != this.config.removeWhitespace) {
        this.log.debug("Config changed, delete all states");
        await this.deleteAllObjectsAsync();
      }
    }
    await this.extendObjectAsync("info", {
      native: {
        pathFlavor: this.config.pathFlavor,
        removeWhitespace: this.config.removeWhitespace
      }
    });
    return true;
  }
  async deleteAllObjectsAsync() {
    const objects = await this.getObjectListAsync({
      startkey: this.namespace
    });
    if (objects.rows) {
      const idRoot = this.namespace + ".";
      const rootObjects = Array.from(
        new Set(
          objects.rows.filter((x) => x.id.includes(idRoot)).map((x) => x.id.replace(idRoot, "").split(".")[0])
        )
      ).filter((x) => !x.startsWith("info"));
      for (const obj of rootObjects) {
        this.log.debug("delete " + obj);
        await this.delObjectAsync(obj, { recursive: true });
      }
    }
    return true;
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
        const path = await this.createObjectIfNotExists(
          tagResponse.state.Id,
          () => {
            var _a;
            let path2 = tagResponse.state.getPath(
              this.config.pathFlavor,
              this.FORBIDDEN_CHARS,
              (_a = this.language) != null ? _a : "en"
            );
            if (this.config.removeWhitespace) {
              path2 = path2.replaceAll(/\s/g, "_");
            }
            return path2;
          },
          () => ({
            type: "state",
            common: tagResponse.state.getCommonObject(),
            native: {
              id: tagResponse.state.Id
            }
          }),
          tagResponse.state
        );
        await this.setStateAsync(path, tagResponse.state.normalizeValue(tagResponse.response.value), true);
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
      () => "info.message",
      () => ({
        type: "state",
        common: {
          write: false,
          type: "string"
        },
        native: {}
      }),
      message
    );
    await this.setStateAsync("info.message", message, true);
  }
  async createObjectIfNotExists(id, getPath, getObjPart, item) {
    const cachedItem = this.knownObjects[id];
    const cachedItemPath = cachedItem == null ? void 0 : cachedItem["path"];
    if (!cachedItemPath) {
      const path = getPath();
      await this.extendObjectAsync(path, getObjPart());
      this.knownObjects[id] = { path, item };
      this.log.silly(`${path} added to cache`);
      return path;
    } else {
      this.log.silly(`${cachedItemPath} found in cache`);
      return cachedItemPath;
    }
  }
  /**
   * Is called when adapter shuts down - callback has to be called under any circumstances!
   */
  onUnload(callback) {
    var _a;
    try {
      this.clearInterval(this.updateParametersInterval);
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
}
if (require.main !== module) {
  module.exports = (options) => new WaterkotteEasycon(options);
} else {
  (() => new WaterkotteEasycon())();
}
//# sourceMappingURL=main.js.map
