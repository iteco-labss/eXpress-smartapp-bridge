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
            const event = { ref, type, payload: payload, files };
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
        const eventParams = { ref, type: constants_1.WEB_COMMAND_TYPE_RPC, method, handler, payload: params };
        const event = JSON.stringify(files ? Object.assign(Object.assign({}, eventParams), { files: files === null || files === void 0 ? void 0 : files.map((file) => file) }) : eventParams);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5kcm9pZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvcGxhdGZvcm1zL2FuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUFpQztBQVNqQyw0Q0FBMEY7QUFDMUYsbUVBQWtEO0FBQ2xELHVEQUEyQjtBQUUzQixNQUFNLGFBQWE7SUFJakI7UUFDRSxJQUFJLENBQUMsc0JBQXNCLEdBQUcsT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFdBQVcsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQTtRQUMzRyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksc0JBQW9CLEVBQUUsQ0FBQTtRQUU5QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLGdCQUFHLENBQUMseUVBQXlFLENBQUMsQ0FBQTtZQUM5RSxPQUFNO1NBQ1A7UUFFRCw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLGtCQUFrQixHQUFHLENBQUMsRUFDM0IsR0FBRyxFQUNILElBQUksRUFDSixLQUFLLEdBT04sRUFBUSxFQUFFO1lBQ1QsTUFBTSxFQUFFLElBQUksS0FBaUIsSUFBSSxFQUFoQixPQUFPLFVBQUssSUFBSSxFQUEzQixRQUFvQixDQUFPLENBQUE7WUFFakMsTUFBTSxXQUFXLEdBQUcsR0FBRyxJQUFJLHNCQUFVLENBQUMsT0FBTyxDQUFBO1lBQzdDLE1BQU0sS0FBSyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFBO1lBRXBELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxTQUFTLENBQUMsUUFBOEI7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsc0JBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDcEQsQ0FBQztJQUVTLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEdBQUcsNEJBQWdCLEVBQXlCO1FBQ3ZHLElBQUksQ0FBQyxJQUFJLENBQUMsc0JBQXNCO1lBQUUsT0FBTyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUE7UUFFekQsTUFBTSxHQUFHLEdBQUcsU0FBSSxFQUFFLENBQUEsQ0FBQyxtQ0FBbUM7UUFDdEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGdDQUFvQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFBO1FBQ3pGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQzFCLEtBQUssQ0FBQyxDQUFDLGlDQUFNLFdBQVcsS0FBRSxLQUFLLEVBQUUsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FBSyxDQUFFLEdBQUcsQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FDakYsQ0FBQTtRQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFekMsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F3Qkc7SUFDSCxZQUFZLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQTRCO1FBQ3ZFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxtQkFBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQ2xGLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1Qkc7SUFDSCxlQUFlLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBK0I7UUFDdEUsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLG1CQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUM5RSxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxhQUFhLENBQUEifQ==