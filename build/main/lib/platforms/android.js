"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const case_1 = require("../case");
const constants_1 = require("../constants");
const eventEmitter_1 = __importDefault(require("../eventEmitter"));
const logger_1 = __importDefault(require("../logger"));
class AndroidBridge {
    constructor() {
        this.hasCommunicationObject = typeof window.express !== 'undefined' && !!window.express.handleSmartAppEvent;
        this.eventEmitter = new eventEmitter_1.default();
        this.logsEnabled = false;
        this.isRenameParamsEnabled = true;
        if (!this.hasCommunicationObject) {
            (0, logger_1.default)('No method "express.handleSmartAppEvent", cannot send message to Android');
            return;
        }
        // Expect json data as string
        window.handleAndroidEvent = ({ ref, data, files, }) => {
            if (this.logsEnabled)
                console.log('Bridge ~ Incoming event', JSON.stringify({
                    ref,
                    data,
                    files,
                }, null, 2));
            const { type } = data, payload = __rest(data, ["type"]);
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            const eventFiles = this.isRenameParamsEnabled ?
                files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.snakeCaseToCamelCase)(file)) : files;
            const event = {
                ref,
                type,
                payload: this.isRenameParamsEnabled ? (0, case_1.snakeCaseToCamelCase)(payload) : payload,
                files: eventFiles,
            };
            this.eventEmitter.emit(emitterType, event);
        };
    }
    /**
     * Set callback function to handle events without **ref**
     * (notifications for example).
     *
     * ```js
     * bridge.onReceive(({ type, handler, payload }) => {
     *   // Handle event data
     *   console.log('event', type, handler, payload)
     * })
     * ```
     * @param callback - Callback function.
     */
    onReceive(callback) {
        this.eventEmitter.on(constants_1.EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT, guaranteed_delivery_required = false, }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = (0, uuid_1.v4)(); // UUID to detect express response.
        const eventParams = {
            ref,
            type: constants_1.WEB_COMMAND_TYPE_RPC,
            method,
            handler,
            payload: this.isRenameParamsEnabled ? (0, case_1.camelCaseToSnakeCase)(params) : params,
            guaranteed_delivery_required,
        };
        const eventFiles = this.isRenameParamsEnabled ?
            files === null || files === void 0 ? void 0 : files.map((file) => (0, case_1.camelCaseToSnakeCase)(file)) : files;
        const event = JSON.stringify(files ? Object.assign(Object.assign({}, eventParams), { files: eventFiles }) : eventParams);
        if (this.logsEnabled)
            console.log('Bridge ~ Outgoing event', JSON.stringify(event, null, '  '));
        window.express.handleSmartAppEvent(event);
        return this.eventEmitter.onceWithTimeout(ref, timeout);
    }
    /**
     * Send event and wait response from express client.
     *
     * ```js
     * bridge
     *   .sendBotEvent(
     *     {
     *       method: 'get_weather',
     *       params: {
     *         city: 'Moscow',
     *       },
     *       files: []
     *     }
     *   )
     *   .then(data => {
     *     // Handle response
     *     console.log('response', data)
     *   })
     * ```
     * @param method - Event type.
     * @param params
     * @param files
     * @param timeout - Timeout in ms.
     * @param guaranteed_delivery_required - boolean.
     * @returns Promise.
     */
    sendBotEvent({ method, params, files, timeout, guaranteed_delivery_required }) {
        return this.sendEvent({ handler: constants_1.HANDLER.BOTX, method, params, files, timeout, guaranteed_delivery_required });
    }
    /**
     * Send event and wait response from express client.
     *
     * ```js
     * bridge
     *   .sendClientEvent(
     *     {
     *       type: 'get_weather',
     *       handler: 'express',
     *       payload: {
     *         city: 'Moscow',
     *       },
     *     }
     *   )
     *   .then(data => {
     *     // Handle response
     *     console.log('response', data)
     *   })
     * ```
     * @param method - Event type.
     * @param params
     * @param timeout - Timeout in ms.
     * @returns Promise.
     */
    sendClientEvent({ method, params, timeout }) {
        return this.sendEvent({ handler: constants_1.HANDLER.EXPRESS, method, params, timeout });
    }
    /**
     * Enabling logs.
     *
     * ```js
     * bridge
     *   .enableLogs()
     * ```
     */
    enableLogs() {
        this.logsEnabled = true;
    }
    /**
     * Disabling logs.
     *
     * ```js
     * bridge
     *   .disableLogs()
     * ```
     */
    disableLogs() {
        this.logsEnabled = false;
    }
    /**
     * Enabling renaming event params from camelCase to snake_case and vice versa
     * ```js
     * bridge
     *    .enableRenameParams()
     * ```
     */
    enableRenameParams() {
        this.isRenameParamsEnabled = true;
        console.log('Bridge ~ Enabled renaming event params from camelCase to snake_case and vice versa');
    }
    /**
     * Enabling renaming event params from camelCase to snake_case and vice versa
     * ```js
     * bridge
     *    .disableRenameParams()
     * ```
     */
    disableRenameParams() {
        this.isRenameParamsEnabled = false;
        console.log('Bridge ~ Disabled renaming event params from camelCase to snake_case and vice versa');
    }
}
exports.default = AndroidBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1zL2FuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQVNqQyxrQ0FBb0U7QUFDcEUsNENBQTBGO0FBQzFGLG1FQUFrRDtBQUNsRCx1REFBMkI7QUFFM0IsTUFBTSxhQUFhO0lBTWpCO1FBQ0UsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sTUFBTSxDQUFDLE9BQU8sS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUE7UUFDM0csSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHNCQUFvQixFQUFFLENBQUE7UUFDOUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUE7UUFDeEIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQTtRQUVqQyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLElBQUEsZ0JBQUcsRUFBQyx5RUFBeUUsQ0FBQyxDQUFBO1lBQzlFLE9BQU07U0FDUDtRQUVELDZCQUE2QjtRQUM3QixNQUFNLENBQUMsa0JBQWtCLEdBQUcsQ0FBQyxFQUNFLEdBQUcsRUFDSCxJQUFJLEVBQ0osS0FBSyxHQU9uQyxFQUFRLEVBQUU7WUFDVCxJQUFJLElBQUksQ0FBQyxXQUFXO2dCQUNsQixPQUFPLENBQUMsR0FBRyxDQUNULHlCQUF5QixFQUN6QixJQUFJLENBQUMsU0FBUyxDQUNaO29CQUNFLEdBQUc7b0JBQ0gsSUFBSTtvQkFDSixLQUFLO2lCQUNOLEVBQ0QsSUFBSSxFQUNKLENBQUMsQ0FDRixDQUNGLENBQUE7WUFFSCxNQUFNLEVBQUUsSUFBSSxLQUFpQixJQUFJLEVBQWhCLE9BQU8sVUFBSyxJQUFJLEVBQTNCLFFBQW9CLENBQU8sQ0FBQTtZQUVqQyxNQUFNLFdBQVcsR0FBRyxHQUFHLElB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