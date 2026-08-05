import { useCallback, useRef, useState } from 'react'

// 前端直传 COS：XMLHttpRequest 支持上传进度，fetch 不支持
// upload(file, { uploadUrl, contentType }) 成功 resolve，失败抛错
export function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const xhrRef = useRef(null)

  const upload = useCallback((file, { uploadUrl, contentType }) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhrRef.current = xhr
      setUploading(true)
      setProgress(0)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        setUploading(false)
        if (xhr.status >= 200 && xhr.status < 300) {
          setProgress(100)
          resolve()
        } else {
          reject(new Error(`上传失败（${xhr.status}）`))
        }
      }
      xhr.onerror = () => {
        setUploading(false)
        reject(new Error('网络错误，可能是 COS CORS 未配置或网络中断'))
      }
      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', contentType || 'application/octet-stream')
      xhr.send(file)
    })
  }, [])

  const abort = useCallback(() => {
    xhrRef.current?.abort()
    setUploading(false)
  }, [])

  return { uploading, progress, upload, abort }
}
