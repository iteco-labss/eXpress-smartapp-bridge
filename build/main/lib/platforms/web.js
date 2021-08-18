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
class WebBridge {
    /** @ignore */
    constructor() {
        this.eventEmitter = new eventEmitter_1.default();
        this.addGlobalListener();
    }
    /** @ignore */
    addGlobalListener() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('message', (event) => {
            if (typeof event.data !== 'object' ||
                typeof event.data.data !== 'object' ||
                typeof event.data.data.type !== 'string')
                return;
            const _a = event.data, { ref } = _a, _b = _a.data, { type } = _b, payload = __rest(_b, ["type"]);
            const emitterType = ref || constants_1.EVENT_TYPE.RECEIVE;
            this.eventEmitter.emit(emitterType, { ref, type, payload });
        });
    }
    /**
     * Set callback function to handle events without **ref**
     * (notifications for example).
     *
     * ```js
     * bridge.onRecieve(({ type, handler, payload }) => {
     *   // Handle event data
     *   console.log('event', type, handler, payload)
     * })
     * ```
     * @param callback - Callback function.
     */
    onRecieve(callback) {
        this.eventEmitter.on(constants_1.EVENT_TYPE.RECEIVE, callback);
    }
    /**
     * Send event and wait response from express client.
     *
     * ```js
     * bridge
     *   .send(
     *     {
     *       type: 'get_weather',
     *       handler: 'botx',
     *       payload: {
     *         city: 'Moscow',
     *       },
     *     }
     *   )
     *   .then(data => {
     *     // Handle response
     *     console.log('respose', data)
     *   })
     * ```
     * @param ref - UUID to detect express response.
     * @param type - Event type.
     * @param handler - Set client/server side which is handle this event.
     * @param timeout - Timeout in ms.
     * @returns Promise.
     */
    send({ type, handler, payload, timeout = constants_1.RESPONSE_TIMEOUT }) {
        const ref = uuid_1.v4();
        window.parent.postMessage({
            type: constants_1.WEB_COMMAND_TYPE,
            payload: { ref, type, handler, payload },
        }, '*');
        return this.eventEmitter.onceWithTimeout(ref, timeout);
    }
}
exports.default = WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwrQkFBaUM7QUFHakMsNENBQTZFO0FBQzdFLG1FQUFrRDtBQUVsRCxNQUFNLFNBQVM7SUFJYixjQUFjO0lBQ2Q7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksc0JBQW9CLEVBQUUsQ0FBQTtRQUM5QyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUMxQixDQUFDO0lBRUQsY0FBYztJQUNkLGlCQUFpQjtRQUNmLDhEQUE4RDtRQUM5RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBd0IsRUFBUSxFQUFFO1lBQ3BFLElBQ0UsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBQzlCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDbkMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFFeEMsT0FBTTtZQUVSLE1BQU0sS0FHRixLQUFLLENBQUMsSUFBSSxFQUhSLEVBQ0osR0FBRyxPQUVTLEVBRFosWUFBMEIsRUFBMUIsRUFBUSxJQUFJLE9BQWMsRUFBVCxPQUFPLGNBQWxCLFFBQW9CLENBQ2QsQ0FBQTtZQUNkLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxzQkFBVSxDQUFDLE9BQU8sQ0FBQTtZQUU3QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDN0QsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxTQUFTLENBQUMsUUFBOEI7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsc0JBQVUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDcEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F3Qkc7SUFDSCxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEdBQUcsNEJBQWdCLEVBQXNCO1FBQzdFLE1BQU0sR0FBRyxHQUFHLFNBQUksRUFBRSxDQUFBO1FBRWxCLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUN2QjtZQUNFLElBQUksRUFBRSw0QkFBZ0I7WUFDdEIsT0FBTyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO1NBQ3pDLEVBQ0QsR0FBRyxDQUNKLENBQUE7UUFFRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQTtJQUN4RCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxTQUFTLENBQUEifQ==