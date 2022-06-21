import { EVENT_TYPE, HANDLER } from '../lib/constants';
export declare type EmitterEventPayload = {
    readonly ref: string | undefined;
    readonly type: string;
    readonly handler: HANDLER;
    readonly payload: object | undefined;
    readonly files?: object;
};
export declare type EmitterEventType = EVENT_TYPE | string;
export declare type EventEmitterCallback = (event: EmitterEventPayload) => void;
