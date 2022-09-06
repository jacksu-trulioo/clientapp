import { CookieStore } from "@auth0/nextjs-auth0/dist/auth0-session"
import { ConfigParameters, getConfig } from "@auth0/nextjs-auth0/dist/config"
import { SessionCache as Auth0SessionCache } from "@auth0/nextjs-auth0/dist/session"

export class SessionCache {
  private static instance: SessionCache

  public cache: Auth0SessionCache

  private constructor(params?: ConfigParameters) {
    const { baseConfig } = getConfig(params)
    const cookieStore = new CookieStore(baseConfig)
    const sessionCache = new Auth0SessionCache(baseConfig, cookieStore)

    this.cache = sessionCache
  }

  public static getInstance(): SessionCache {
    if (!SessionCache.instance) {
      SessionCache.instance = new SessionCache()
    }

    return SessionCache.instance
  }
}
