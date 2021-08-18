export * from './eventEmitter.d'
export * from './bridgeInterface.d'


declare global {
  /* eslint-disable functional/prefer-type-literal */
  /* eslint-disable functional/prefer-readonly-type */
  interface Window {
    // Android interface
    handleAndroidEvent: Function
    express: {
      handleSmartAppEvent: (json: string) => void
    }

    // iOS interface
    handleIosEvent: Function
    webkit: {
      messageHandlers: {
        express: {
          postMessage: (data: object) => void
        }
      },
    },
  }
  /* eslint-enable functional/prefer-type-literal */
  /* eslint-enable functional/prefer-readonly-type */
}