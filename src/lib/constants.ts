export enum PLATFORM {
  WEB = 'web',
  IOS = 'ios',
  ANDROID = 'android',
  UNKNOWN = 'unknown',
}

/** @ignore */
export enum EVENT_TYPE {
  RECEIVE = 'recv',
  SEND = 'send',
}

export enum HANDLER {
  BOTX = 'botx',
  EXPRESS = 'express',
}

export const RESPONSE_TIMEOUT = 30000 as const

export const WEB_COMMAND_TYPE = 'smartapp' as const