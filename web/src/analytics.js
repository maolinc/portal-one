// 百度统计（FR-11）：配置 VITE_BAIDU_TONGJI_ID 后自动注入；mock 阶段无 ID 不加载
export function initAnalytics() {
  const id = import.meta.env.VITE_BAIDU_TONGJI_ID
  if (!id) return
  window._hmt = window._hmt || []
  const hm = document.createElement('script')
  hm.src = `https://hm.baidu.com/hm.js?${id}`
  hm.async = true
  document.head.appendChild(hm)
}

// SPA 路由切换时上报 PV
export function trackPageview(path) {
  if (window._hmt) window._hmt.push(['_trackPageview', path])
}
