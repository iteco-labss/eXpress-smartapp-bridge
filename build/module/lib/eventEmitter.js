import EventEmitter from 'eventemitter3';
/**
 * Extended Event Emitted class
 *
 * ```typescript
 * const emitter = new EmitterEventPayload();
 *
 * // promise will be rejected in 20 secs
 * // if no one event has been received with type 'ref-uuid-value'
 * // otherwise promise will be fulfilled with payload object
 * const promise = emitter.onceWithTimeout('ref-uuid-value', 20000)
 * ```
 */
class ExtendedEventEmitter extends EventEmitter {
    constructor() {
        super();
    }
    /**
     * Wait when event with `type` will be emitted for `timeout` ms.
     *
     * ```js
     * emitter.onceWithTimeout('d6910a9d-ea24-5fc6-a654-28781ef21f8f', 20000)
     * // => Promise
     * ```
     * @param type - Event type, uuid or EVENT_TYPE.RECV for standalone events from client
     * @param timeout - Timeout in ms
     * @returns Promise.
     */
    onceWithTimeout(type, timeout) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(reject, timeout);
            this.once(type, (event) => {
                clearTimeout(timer);
                resolve(event);
            });
        });
    }
}
export default ExtendedEventEmitter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRFbWl0dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9ldmVudEVtaXR0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxZQUFZLE1BQU0sZUFBZSxDQUFBO0FBSXhDOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsTUFBTSxvQkFBcUIsU0FBUSxZQUFZO0lBQzdDO1FBQ0UsS0FBSyxFQUFFLENBQUE7SUFDVCxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILGVBQWUsQ0FBQyxJQUFzQixFQUFFLE9BQWU7UUFDckQsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO1lBRXpDLElBQUksQ0FBQyxJQUFJLENBQVMsSUFBSSxFQUFFLENBQUMsS0FBMEIsRUFBRSxFQUFFO2dCQUNyRCxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtZQUNoQixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztDQUNGO0FBRUQsZUFBZSxvQkFBb0IsQ0FBQSJ9