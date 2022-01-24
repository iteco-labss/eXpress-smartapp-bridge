import { PLATFORM } from './lib/constants'
import getPlatform from './lib/platformDetector'
import AndroidBridge from './lib/platforms/android'
import IosBridge from './lib/platforms/ios'
import WebBridge from './lib/platforms/web'
import { Bridge } from './types'

const getBridge = (): Bridge | null => {
  const platform = getPlatform()

  switch (platform) {
    case PLATFORM.ANDROID:
      return new AndroidBridge()
    case PLATFORM.IOS:
      return new IosBridge()
    case PLATFORM.WEB:
      return new WebBridge()
    default:
      console.error('Wrong platform')
      break
  }

  return null
}

export default getBridge()
