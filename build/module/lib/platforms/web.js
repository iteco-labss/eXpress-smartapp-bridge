import { v4 as uuid } from 'uuid';
import { EVENT_TYPE, RESPONSE_TIMEOUT, WEB_COMMAND_TYPE } from '../constants';
import ExtendedEventEmitter from '../eventEmitter';
class WebBridge {
    /** @ignore */
    constructor() {
        this.eventEmitter = new ExtendedEventEmitter();
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
            const { ref, data: { type, ...payload }, } = event.data;
            const emitterType = ref || EVENT_TYPE.RECEIVE;
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
        this.eventEmitter.on(EVENT_TYPE.RECEIVE, callback);
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
    send({ type, handler, payload, timeout = RESPONSE_TIMEOUT }) {
        const ref = uuid();
        window.parent.postMessage({
            type: WEB_COMMAND_TYPE,
            payload: { ref, type, handler, payload },
        }, '*');
        return this.eventEmitter.onceWithTimeout(ref, timeout);
    }
}
export default WebBridge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9wbGF0Zm9ybXMvd2ViLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxFQUFFLElBQUksSUFBSSxFQUFFLE1BQU0sTUFBTSxDQUFBO0FBR2pDLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxjQUFjLENBQUE7QUFDN0UsT0FBTyxvQkFBb0IsTUFBTSxpQkFBaUIsQ0FBQTtBQUVsRCxNQUFNLFNBQVM7SUFJYixjQUFjO0lBQ2Q7UUFDRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksb0JBQW9CLEVBQUUsQ0FBQTtRQUM5QyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUMxQixDQUFDO0lBRUQsY0FBYztJQUNkLGlCQUFpQjtRQUNmLDhEQUE4RDtRQUM5RCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLENBQUMsS0FBd0IsRUFBUSxFQUFFO1lBQ3BFLElBQ0UsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFFBQVE7Z0JBQzlCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFDbkMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssUUFBUTtnQkFFeEMsT0FBTTtZQUVSLE1BQU0sRUFDSixHQUFHLEVBQ0gsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxFQUFFLEdBQzNCLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQTtZQUNkLE1BQU0sV0FBVyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFBO1lBRTdDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUM3RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7T0FXRztJQUNILFNBQVMsQ0FBQyxRQUE4QjtRQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3BELENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09Bd0JHO0lBQ0gsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxHQUFHLGdCQUFnQixFQUFzQjtRQUM3RSxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQTtRQUVsQixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FDdkI7WUFDRSxJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLE9BQU8sRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtTQUN6QyxFQUNELEdBQUcsQ0FDSixDQUFBO1FBRUQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDeEQsQ0FBQztDQUNGO0FBRUQsZUFBZSxTQUFTLENBQUEifQ==