import EventEmitter from 'eventemitter3';
import { EmitterEventPayload, EmitterEventType } from '../types';
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
declare class ExtendedEventEmitter extends EventEmitter {
    constructor();
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
    onceWithTimeout(type: EmitterEventType, timeout: number): Promise<EmitterEventPayload>;
}
export default ExtendedEventEmitter;
