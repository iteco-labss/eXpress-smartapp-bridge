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
        if (!this.hasCommunicationObject) {
            logger_1.default('No method "express.handleSmartAppEvent", cannot send message to Android');
            return;
        }
        // Expect json data as string
        window.handleAndroidEvent = ({ ref, data, files, }) => {
            const { type } = data, payload = __rest(data, ["type"]);
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            const event = { ref, type, payload: case_1.snakeCaseToCamelCase(payload), files };
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
    sendEvent({ handler, method, params, files, timeout = constants_1.RESPONSE_TIMEOUT }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = uuid_1.v4(); // UUID to detect express response.
        const eventParams = { ref, type: constants_1.WEB_COMMAND_TYPE_RPC, method, handler, payload: case_1.camelCaseToSnakeCase(params) };
        const event = JSON.stringify(files ? Object.assign(Object.assign({}, eventParams), { files: files === null || files === void 0 ? void 0 : files.map((file) => case_1.camelCaseToSnakeCase(file)) }) : eventParams);
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
     * @returns Promise.
     */
    sendBotEvent({ method, params, files, timeout }) {
        return this.sendEvent({ handler: constants_1.HANDLER.BOTX, method, params, files, timeout });
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
}
exports.default = AndroidBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1zL2FuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQVNqQyxrQ0FBb0U7QUFDcEUsNENBQTBGO0FBQzFGLG1FQUFrRDtBQUNsRCx1REFBMkI7QUFFM0IsTUFBTSxhQUFhO0lBSWpCO1FBQ0UsSUFBSSxDQUFDLHNCQUFzQixHQUFHLE9BQU8sTUFBTSxDQUFDLE9BQU8sS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUE7UUFDM0csSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLHNCQUFvQixFQUFFLENBQUE7UUFFOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRTtZQUNoQyxnQkFBRyxDQUFDLHlFQUF5RSxDQUFDLENBQUE7WUFDOUUsT0FBTTtTQUNQO1FBRUQsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxDQUFDLEVBQzNCLEdBQUcsRUFDSCxJQUFJLEVBQ0osS0FBSyxHQU9OLEVBQVEsRUFBRTtZQUNULE1BQU0sRUFBRSxJQUFJLEtBQWlCLElBQUksRUFBaEIsT0FBTyxVQUFLLElBQUksRUFBM0IsUUFBb0IsQ0FBTyxDQUFBO1lBRWpDLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxzQkFBVSxDQUFDLE9BQU8sQ0FBQTtZQUM3QyxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLDJCQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFBO1lBRTFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxTQUFTLENBQUMsUUFBOEI7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsc0JBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDcEQsQ0FBQztJQUVTLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsNEJBQWdCLEVBQXlCO1FBQ3ZHLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCO1lBQUUsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7UUFFekQsTUFBTSxHQUFHLEdBQUcsU0FBSSxFQUFFLENBQUEsQ0FBQyxtQ0FBbUM7UUFDdEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGdDQUFvQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLDJCQUFvQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUE7UUFDL0csTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FDMUIsS0FBSyxDQUFDLENBQUMsaUNBQU0sV0FBVyxLQUFFLEtBQUssRUFBRSxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsR0FBRyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUUsQ0FBQywyQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFHLENBQUMsQ0FBQyxXQUFXLENBQ3ZHLENBQUE7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRXpDLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3hELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBQ0gsWUFBWSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUE0QjtRQUN2RSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUNsRixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BdUJHO0lBQ0gsZUFBZSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQStCO1FBQ3RFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQkFBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7SUFDOUUsQ0FBQztDQUNGO0FBRUQsa0JBQWUsYUFBYSxDQUFBIn0=