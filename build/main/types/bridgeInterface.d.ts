import { HANDLER } from '../lib/constants';
import { EmitterEventPayload, EventEmitterCallback } from './eventEmitter';
export declare type BridgeSendClientEventParams = {
    readonly method: string;
    readonly params: object | undefined;
    readonly timeout?: number;
};
export declare type BridgeSendBotEventParams = BridgeSendClientEventParams & {
    readonly files?: any;
    readonly guaranteed_delivery_required?: boolean | undefined;
};
export declare type BridgeSendEventParams = BridgeSendClientEventParams & BridgeSendBotEventParams & {
    readonly handler: HANDLER;
};
export declare type Bridge = {
    readonly onReceive: (callback: EventEmitterCallback) => void;
    readonly sendBotEvent: (event: BridgeSendBotEventParams) => Promise<EmitterEventPayload>;
    readonly sendClientEvent: (event: BridgeSendClientEventParams) => Promise<EmitterEventPayload>;
    readonly disableRenameParams: () => void;
    readonly enableRenameParams: () => void;
};
