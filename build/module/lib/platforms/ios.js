import { v4 as uuid } from 'uuid';
import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '../case';
import { EVENT_TYPE, HANDLER, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE_RPC } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
import log from '../logger';
class IosBridge {
    constructor() {
        this.hasCommunicationObject =
            window.webkit &&
                window.webkit.messageHandlers &&
                window.webkit.messageHandlers.express &&
                !!window.webkit.messageHandlers.express.postMessage;
        this.eventEmitter = new ExtendedEventEmitter();
        if (!this.hasCommunicationObject) {
            log('No method "express.postMessage", cannot send message to iOS');
            return;
        }
        // Expect json data as string
        window.handleIosEvent = ({ ref, data, files, }) => {
            const { type, ...payload } = data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
            const event = { ref, type, payload: snakeCaseToCamelCase(payload), files };
            this.eventEmitter.emit(emitterType, event);
        };
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
    onReceive(callback) {
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
    }
    sendEvent({ handler, method, params, files, timeout = RESPONSE_TIMEOUT }) {
        if (!this.hasCommunicationObject)
            return Promise.reject();
        const ref = uuid(); // UUID to detect express response.
        const eventProps = { ref, type: WEB_COMMAND_TYPE_RPC, method, handler, payload: camelCaseToSnakeCase(params) };
        const event = files ? { ...eventProps, files: files?.map((file) => camelCaseToSnakeCase(file)) } : eventProps;
        window.webkit.messageHandlers.express.postMessage(event);
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
     */
    sendBotEvent({ method, params, files, timeout = RESPONSE_TIMEOUT }) {
        return this.sendEvent({ handler: HANDLER.BOTX, method, params, files, timeout });
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
     */
    sendClientEvent({ method, params, timeout = RESPONSE_TIMEOUT }) {
        return this.sendEvent({ handler: HANDLER.EXPRESS, method, params, timeout });
    }
}
export default IosBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvaW9zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBU2pDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLFNBQVMsQ0FBQTtBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGNBQWMsQ0FBQTtBQUMxRixPQUFPLG9CQUFvQixNQUFNLGlCQUFpQixDQUFBO0FBQ2xELE9BQU8sR0FBRyxNQUFNLFdBQVcsQ0FBQTtBQUUzQixNQUFNLFNBQVM7SUFJYjtRQUNFLElBQUksQ0FBQyxzQkFBc0I7WUFDekIsTUFBTSxDQUFDLE1BQU07Z0JBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlO2dCQUM3QixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxPQUFPO2dCQUNyQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQTtRQUNyRCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQTtRQUU5QyxJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQ2hDLEdBQUcsQ0FBQyw2REFBNkQsQ0FBQyxDQUFBO1lBQ2xFLE9BQU07U0FDUDtRQUVELDZCQUE2QjtRQUM3QixNQUFNLENBQUMsY0FBYyxHQUFHLENBQUMsRUFDdkIsR0FBRyxFQUNILElBQUksRUFDSixLQUFLLEdBT04sRUFBUSxFQUFFO1lBQ1QsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQTtZQUVqQyxNQUFNLFdBQVcsR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQTtZQUM3QyxNQUFNLEtBQUssR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssRUFBRSxDQUFBO1lBRTFFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUE7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7O09BV0c7SUFDSCxTQUFTLENBQUMsUUFBOEI7UUFDdEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBRVMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sR0FBRyxnQkFBZ0IsRUFBeUI7UUFDdkcsSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0I7WUFBRSxPQUFPLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQTtRQUV6RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQSxDQUFDLG1DQUFtQztRQUN0RCxNQUFNLFVBQVUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsb0JBQW9CLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQTtRQUU5RyxNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFBO1FBRWxILE1BQU0sQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFeEQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXVCRztJQUNILFlBQVksQ0FBQyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sR0FBRyxnQkFBZ0IsRUFBNEI7UUFDMUYsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUNsRixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FzQkc7SUFDSCxlQUFlLENBQUMsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sR0FBRyxnQkFBZ0IsRUFBK0I7UUFDekYsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQzlFLENBQUM7Q0FDRjtBQUVELGVBQWUsU0FBUyxDQUFBIn0=