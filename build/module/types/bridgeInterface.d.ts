import { HANDLER } from '../lib/constants';
import { EmitterEventPayload, EventEmitterCallback } from './eventEmitter';
export type BridgeSendClientEventParams = {
    readonly method: string;
    readonly params: object | undefined;
    readonly timeout?: number;
};
export type BridgeSendBotEventParams = BridgeSendClientEventParams & {
    readonly files?: any;
    readonly guaranteed_delivery_required?: boolean | undefined;
};
export type BridgeSendEventParams = BridgeSendClientEventParams & BridgeSendBotEventParams & {
    readonly handler: HANDLER;
};
export type Bridge = {
    readonly onReceive: (callback: EventEmitterCallback) => void;
    readonly sendBotEvent: (event: BridgeSendBotEventParams) => Promise<EmitterEventPayload>;
    readonly sendClientEvent: (event: BridgeSendClientEventParams) => Promise<EmitterEventPayload>;
    /**
     * @deprecated since version 2.0
     */
    readonly disableRenameParams: () => void;
    /**
     * @deprecated since version 2.0
     */
    readonly enableRenameParams: () => void;
    readonly enableLogs: () => void;
    readonly disableLogs: () => void;
    readonly log?: (data: string | object) => void;
};
