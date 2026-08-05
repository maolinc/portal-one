import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider, App as AntApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'antd/dist/reset.css'

dayjs.locale('zh-cn')
import App from './App.jsx'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      token: {
        colorPrimary: '#e8590c',
        colorInfo: '#2461a3',
        colorSuccess: '#3f7652',
        colorWarning: '#b66a1b',
        colorError: '#b7443e',
        colorText: '#182432',
        colorTextSecondary: '#687582',
        colorBorder: '#dfe5e9',
        colorBgLayout: '#f3f5f6',
        colorBgContainer: '#ffffff',
        borderRadius: 8,
        borderRadiusLG: 12,
        controlHeight: 40,
        fontSize: 14,
        fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif',
        boxShadow: '0 12px 36px rgba(10, 29, 51, 0.08)',
        boxShadowSecondary: '0 4px 16px rgba(10, 29, 51, 0.06)',
      },
      components: {
        Button: {
          primaryShadow: 'none',
          defaultShadow: 'none',
          fontWeight: 600,
        },
        Input: {
          activeShadow: '0 0 0 3px rgba(232, 89, 12, 0.12)',
        },
        InputNumber: {
          activeShadow: '0 0 0 3px rgba(232, 89, 12, 0.12)',
        },
        Menu: {
          itemBorderRadius: 8,
          itemHeight: 42,
        },
        Table: {
          headerBg: '#f6f8f9',
          headerColor: '#53606d',
          rowHoverBg: '#fafbfc',
          cellPaddingBlock: 14,
          cellPaddingInline: 16,
        },
        Tabs: {
          titleFontSize: 15,
          horizontalItemPadding: '12px 4px',
          horizontalItemGutter: 28,
        },
      },
    }}
  >
    <AntApp>
      <App />
    </AntApp>
  </ConfigProvider>,
)
