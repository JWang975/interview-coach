import './globals.css'

export const metadata = {
  title: '面试复盘 AI - 让每次面试都成为成长',
  description: '上传面试记录，AI 自动识别问答、逐题诊断表现、给出改进建议。支持 DeepSeek 和通义千问。',
  keywords: '面试复盘,AI面试,面试分析,面试诊断,求职辅助',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎯</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  )
}
