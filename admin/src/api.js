// 后台 API 封装：同源 cookie 会话，401 统一跳登录
async function request(path, { method = 'GET', body } = {}) {
  const res = await fetch(`/api/admin${path}`, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401 && !path.startsWith('/login')) {
    window.location.assign('/admin/login')
    throw new Error('未登录')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `请求失败（${res.status}）`)
  return data
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  signUpload: ({ filename, contentType, size }) =>
    request('/upload/sign', { method: 'POST', body: { filename, contentType, size } }),
}
