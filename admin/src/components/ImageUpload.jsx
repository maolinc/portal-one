import { useEffect, useState } from 'react'
import { Button, Upload, App } from 'antd'
import { UploadOutlined, DeleteOutlined, PictureOutlined } from '@ant-design/icons'
import { api } from '../api.js'
import { useUpload } from '../hooks/useUpload.js'

// 图片上传：后端发预签名 URL -> 前端 PUT 直传 COS -> 回写 publicUrl
export default function ImageUpload({ value, onChange, variant = 'default', alt = '当前上传的内容图片' }) {
  const { message } = App.useApp()
  const { uploading, progress, upload } = useUpload()
  const [signing, setSigning] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const busy = uploading || signing
  const isLogo = variant === 'logo'

  useEffect(() => {
    setLoadFailed(false)
  }, [value])

  const uploadFile = async ({ file, onSuccess, onError }) => {
    try {
      setSigning(true)
      const { uploadUrl, publicUrl } = await api.signUpload({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      })
      setSigning(false)
      await upload(file, { uploadUrl, contentType: file.type })
      onChange(publicUrl)
      onSuccess(publicUrl)
    } catch (e) {
      setSigning(false)
      message.error(e.message)
      onError(e)
    }
  }

  const uploadProps = {
    accept: 'image/*',
    showUploadList: false,
    disabled: busy,
    customRequest: uploadFile,
  }

  return (
    <div className={`media-uploader media-uploader--${variant}`}>
      {value && !loadFailed ? (
        <div className="media-preview">
          <img src={value} alt={alt} onError={() => setLoadFailed(true)} />
        </div>
      ) : (
        <Upload {...uploadProps}>
          <div className="media-empty">
            <PictureOutlined />
            <strong>{loadFailed ? '图片暂时无法加载' : isLogo ? '上传品牌 Logo' : '选择一张清晰图片'}</strong>
            <span>
              {loadFailed
                ? '原地址可能已失效，可直接上传新图片替换'
                : isLogo
                  ? '建议使用透明背景的正方形 SVG、PNG 或 WebP 文件'
                  : '建议使用与前台展示比例一致的 JPG、PNG 或 WebP 文件'}
            </span>
          </div>
        </Upload>
      )}
      <div className="media-actions">
        {value ? (
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} loading={busy}>
              {busy ? (signing ? '正在准备' : `上传中 ${progress}%`) : isLogo ? '替换 Logo' : '替换图片'}
            </Button>
          </Upload>
        ) : null}
        {value && !busy ? (
          <Button danger type="text" icon={<DeleteOutlined />} onClick={() => onChange(null)}>
            移除
          </Button>
        ) : null}
      </div>
    </div>
  )
}
