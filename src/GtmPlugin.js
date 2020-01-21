import { logDebug, loadScript, hasScript } from './utils'
import pluginConfig from './config'
/**
 * Plugin main class
 */
var inBrowser = typeof window !== 'undefined'

export default class AnalyticsPlugin {
  enabled() {
    return pluginConfig.enabled
  }

  enable(val) {
    pluginConfig.enabled = val

    if (inBrowser && !!val && !hasScript() && pluginConfig.loadScript) {
      loadScript(pluginConfig.id)
    }
  }

  debugEnabled() {
    return pluginConfig.debug
  }

  debug(val) {
    pluginConfig.debug = val
  }

  dataLayer() {
    if (inBrowser && pluginConfig.enabled) {
      return (window.dataLayer = window.dataLayer || []);
    }
    return false;
  }

  trackView(screenName, path) {
    if (inBrowser && pluginConfig.enabled) {
      logDebug('Dispatching TrackView', { screenName, path })

      let dataLayer = (window.dataLayer = window.dataLayer || [])
      dataLayer.push({
        event: 'content-view',
        'content-name': path,
        'content-view-name': screenName
      })
    }
  }

  trackEvent({
    event = null,
    ...rest
  } = {}) {
    if (inBrowser && pluginConfig.enabled) {
      logDebug('Dispatching event', {
        event,
        ...rest
      })

      let dataLayer = (window.dataLayer = window.dataLayer || [])
      dataLayer.push({
        event: event || 'interaction',
        ...rest
      })
    }
  }
}
