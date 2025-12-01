class PerfUtils {
  static debounce(fn, wait = 150) {
    let t
    return function(...args) {
      clearTimeout(t)
      t = setTimeout(() => fn.apply(this, args), wait)
    }
  }
  static #fetchCache = new Map()
  static async cachedFetch(url, options = {}, ttlMs = 30000) {
    const key = `${url}|${JSON.stringify(options)}`
    const now = Date.now()
    const cached = PerfUtils.#fetchCache.get(key)
    if (cached && (now - cached.time) < ttlMs) {
      return structuredClone(cached.data)
    }
    const resp = await fetch(url, options)
    const data = await resp.json()
    PerfUtils.#fetchCache.set(key, { time: now, data })
    return structuredClone(data)
  }
}
export default PerfUtils
if (typeof window !== 'undefined') {
  window.PerfUtils = PerfUtils
  window.debounce = PerfUtils.debounce
  window.cachedFetch = PerfUtils.cachedFetch
}
