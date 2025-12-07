'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import * as mammoth from 'mammoth'

export default function Analyzer() {
  const [apiProvider, setApiProvider] = useState('deepseek')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [file, setFile] = useState(null)
  const [fileContent, setFileContent] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStage, setAnalysisStage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [isDemo, setIsDemo] = useState(false)
  const fileInputRef = useRef(null)

  const API_CONFIG = {
    deepseek: {
      name: 'DeepSeek',
      endpoint: 'https://api.deepseek.com/v1/chat/completions',
      model: 'deepseek-chat',
      icon: '🔮',
      color: '#6366F1'
    },
    qwen: {
      name: '通义千问',
      endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      model: 'qwen-plus',
      icon: '🌐',
      color: '#FF6A00'
    }
  }

  const currentApi = API_CONFIG[apiProvider]

  const DEMO_RESULT = {
    totalQuestions: 5,
    overallScore: 73,
    summary: '整体表现中上，技术问题回答较为扎实，展现了数据驱动的思维方式。但在行为面试题上STAR结构不够完整，建议加强案例的具体性描述，尤其是困难和个人贡献部分。',
    conversations: [
      {
        id: 1,
        question: '请做一个简单的自我介绍',
        answer: '我叫张三，毕业于XX大学计算机专业，有3年产品经理经验，主要负责过用户增长和商业化两个方向...',
        score: 78,
        strengths: ['时间控制得当，2分钟内完成', '突出了核心经验领域', '逻辑清晰有条理'],
        improvements: ['可以加入一个亮眼的数据成果', '结尾可以表达对目标岗位的契合度']
      },
      {
        id: 2,
        question: '介绍一个你主导过的最有挑战的项目',
        answer: '去年我负责了公司的会员体系重构项目，当时面临的主要问题是老会员体系ROI很低...',
        score: 65,
        strengths: ['选择的案例具有挑战性', '体现了数据驱动的决策方式'],
        improvements: ['缺少具体遇到的困难描述', '没有突出你个人的独特贡献', '结果数据可以更具体']
      },
      {
        id: 3,
        question: '你如何处理与开发团队的意见分歧？',
        answer: '我一般会先听取开发的意见，理解他们的技术顾虑，然后一起看数据来做决定...',
        score: 68,
        strengths: ['体现了协作意识和尊重技术团队', '提到了数据驱动决策的方法论'],
        improvements: ['回答偏抽象，缺少一个具体的冲突案例', '没有展示最终如何达成共识的完整过程']
      },
      {
        id: 4,
        question: '你对我们公司和这个岗位有什么了解？',
        answer: '我了解到贵司是做企业服务SaaS的，最近刚完成B轮融资，这个岗位主要负责核心产品的增长...',
        score: 82,
        strengths: ['做了基础的公司调研', '了解了融资阶段和业务方向'],
        improvements: ['可以更深入分析公司产品的竞争优势', '可以结合自身经验说明匹配度']
      },
      {
        id: 5,
        question: '你有什么问题想问我们的？',
        answer: '我想了解一下这个岗位未来半年的核心目标是什么，以及团队目前的组成情况...',
        score: 75,
        strengths: ['问题聚焦在工作本身', '体现了对实际工作的关注'],
        improvements: ['可以追问更有深度的业务问题', '可以问一些体现你思考的问题']
      }
    ]
  }

  const handleDemo = async () => {
    setIsDemo(true)
    setIsAnalyzing(true)
    setError('')
    
    const stages = ['正在加载示例...', '识别对话内容...', '分析回答质量...', '生成诊断报告...']
    for (let stage of stages) {
      setAnalysisStage(stage)
      await new Promise(r => setTimeout(r, 500))
    }
    
    setResult(DEMO_RESULT)
    setIsAnalyzing(false)
    setAnalysisStage('')
  }

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0])
  }

  const handleFileSelect = (e) => {
    if (e.target.files[0]) validateAndSetFile(e.target.files[0])
  }

  const validateAndSetFile = async (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    
    if (!['txt', 'md', 'docx'].includes(ext)) {
      setError('仅支持 .txt、.md、.docx 文件')
      return
    }
    
    setError('')
    setFile(f)
    setResult(null)
    setIsDemo(false)
    
    try {
      let text = ''
      
      if (ext === 'docx') {
        const arrayBuffer = await f.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer })
        text = result.value
      } else {
        text = await f.text()
      }
      
      setFileContent(text)
    } catch (err) {
      setError('文件解析失败，请检查文件格式')
      setFile(null)
    }
  }

  const ANALYSIS_PROMPT = `你是一位资深面试教练。请分析以下面试记录，识别面试官问题和候选人回答，然后逐题评分并给出改进建议。

请严格按照以下JSON格式输出（不要输出其他内容）：
{
  "totalQuestions": 数字,
  "overallScore": 0-100的数字,
  "summary": "整体评价100字内",
  "conversations": [
    {
      "id": 序号,
      "question": "面试官问题",
      "answer": "候选人回答摘要100字内",
      "score": 0-100,
      "strengths": ["亮点1", "亮点2"],
      "improvements": ["改进点1", "改进点2"]
    }
  ]
}

评分标准：90-100优秀，70-89良好，60-69一般，60以下需改进。

面试记录：
`

  const handleAnalyze = async () => {
    if (!file || !apiKey.trim()) {
      setError('请先上传文件并填写 API Key')
      return
    }
    
    if (fileContent.length < 50) {
      setError('文件内容太短，请上传完整的面试记录')
      return
    }
    
    setIsAnalyzing(true)
    setIsDemo(false)
    setError('')
    setAnalysisStage('连接 ' + currentApi.name + '...')
    
    try {
      const response = await fetch(currentApi.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.trim()}`
        },
        body: JSON.stringify({
          model: currentApi.model,
          messages: [{ role: 'user', content: ANALYSIS_PROMPT + fileContent }],
          temperature: 0.3,
          max_tokens: 4000
        })
      })

      setAnalysisStage('分析面试内容...')

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error?.message || `请求失败 (${response.status})`)
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content
      if (!content) throw new Error('返回内容为空')

      setAnalysisStage('解析结果...')
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      setResult(JSON.parse(jsonStr))
      
    } catch (err) {
      setError(err.message || '分析失败')
    } finally {
      setIsAnalyzing(false)
      setAnalysisStage('')
    }
  }

  const handleReset = () => {
    setFile(null)
    setFileContent('')
    setResult(null)
    setError('')
    setIsDemo(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getFileIcon = (name) => {
    const ext = name?.split('.').pop().toLowerCase()
    if (ext === 'docx') return '📘'
    return '📄'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0B',
      fontFamily: '"Noto Sans SC", "SF Pro Display", -apple-system, sans-serif'
    }}>
      {/* 顶部导航 */}
      <nav style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <span style={{ fontSize: '18px', fontWeight: '700', color: '#FAFAFA' }}>
            面试复盘 AI
          </span>
        </Link>
        
        {!result && !isAnalyzing && (
          <button
            onClick={handleDemo}
            style={{
              padding: '10px 20px',
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.4)',
              borderRadius: '8px',
              color: '#FCD34D',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            👀 查看 Demo
          </button>
        )}
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#FAFAFA', margin: '0 0 10px 0' }}>
            上传面试记录
          </h1>
          <p style={{ fontSize: '15px', color: '#71717A', margin: 0 }}>
            支持 txt、docx 格式，AI 自动识别问答并诊断
          </p>
        </div>

        {/* 分析中 */}
        {isAnalyzing && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 20px',
              border: `3px solid ${currentApi.color}33`,
              borderTopColor: currentApi.color,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontSize: '17px', fontWeight: '600', color: '#FAFAFA', margin: '0 0 6px 0' }}>
              {analysisStage}
            </p>
            <p style={{ fontSize: '14px', color: '#71717A', margin: 0 }}>
              {isDemo ? '加载示例数据...' : '请稍候'}
            </p>
          </div>
        )}

        {/* 主界面 */}
        {!result && !isAnalyzing && (
          <>
            {/* API 设置 */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#A1A1AA', margin: '0 0 14px 0' }}>
                ⚙️ 选择 AI 模型
              </h3>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                {Object.entries(API_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setApiProvider(key)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: apiProvider === key ? `${config.color}18` : 'rgba(255,255,255,0.03)',
                      border: apiProvider === key ? `2px solid ${config.color}` : '2px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>{config.icon}</span>
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: apiProvider === key ? config.color : '#71717A'
                    }}>
                      {config.name}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`输入 ${currentApi.name} API Key`}
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 16px',
                    fontSize: '14px',
                    background: 'rgba(0,0,0,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#FAFAFA',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    opacity: 0.5
                  }}
                >
                  {showApiKey ? '🙈' : '👁️'}
                </button>
              </div>
              <p style={{ fontSize: '12px', color: '#52525B', margin: '8px 0 0 0' }}>
                🔒 API Key 仅在本地使用，不会上传服务器
              </p>
            </div>

            {/* 上传区域 */}
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragging ? currentApi.color : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '14px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: isDragging ? `${currentApi.color}10` : 'transparent',
                  transition: 'all 0.2s',
                  marginBottom: file ? '16px' : 0
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.docx"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${currentApi.color}30 0%, ${currentApi.color}15 100%)`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  fontSize: '28px'
                }}>
                  📎
                </div>
                
                <p style={{ fontSize: '16px', fontWeight: '600', color: '#FAFAFA', margin: '0 0 8px 0' }}>
                  点击或拖拽上传文件
                </p>
                <p style={{ fontSize: '14px', color: '#71717A', margin: 0 }}>
                  支持 .txt / .md / .docx 格式
                </p>
                <p style={{ fontSize: '12px', color: '#52525B', margin: '8px 0 0 0' }}>
                  💡 录音可用讯飞听见、飞书妙记转文字后上传
                </p>
              </div>

              {file && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: `${currentApi.color}12`,
                  borderRadius: '12px',
                  padding: '14px 18px',
                  border: `1px solid ${currentApi.color}30`,
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '26px' }}>{getFileIcon(file.name)}</span>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#FAFAFA', margin: 0 }}>
                        {file.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#71717A', margin: '2px 0 0 0' }}>
                        {fileContent.length.toLocaleString()} 字符
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReset() }}
                    style={{
                      background: 'rgba(239,68,68,0.2)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      color: '#FCA5A5',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    移除
                  </button>
                </div>
              )}

              {error && (
                <div style={{
                  background: 'rgba(239,68,68,0.12)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  border: '1px solid rgba(239,68,68,0.25)'
                }}>
                  <p style={{ fontSize: '14px', color: '#FCA5A5', margin: 0 }}>
                    ⚠️ {error}
                  </p>
                </div>
              )}

              {file && (
                <button
                  onClick={handleAnalyze}
                  disabled={!apiKey.trim()}
                  style={{
                    width: '100%',
                    padding: '18px',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: 'white',
                    background: !apiKey.trim()
                      ? 'rgba(113,113,122,0.4)'
                      : `linear-gradient(135deg, ${currentApi.color} 0%, ${currentApi.color}BB 100%)`,
                    border: 'none',
                    borderRadius: '12px',
                    cursor: !apiKey.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: !apiKey.trim() ? 'none' : `0 4px 20px ${currentApi.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s'
                  }}
                >
                  {!apiKey.trim() ? '请先填写 API Key' : <>✨ 开始分析</>}
                </button>
              )}
            </div>
          </>
        )}

        {/* 结果展示 */}
        {result && !isAnalyzing && (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>
            {isDemo && (
              <div style={{
                background: 'rgba(251,191,36,0.12)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginBottom: '16px',
                border: '1px solid rgba(251,191,36,0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '18px' }}>💡</span>
                <p style={{ fontSize: '14px', color: '#FCD34D', margin: 0 }}>
                  这是 Demo 示例，上传你的面试记录可获得真实分析
                </p>
              </div>
            )}

            <div style={{
              background: `linear-gradient(135deg, ${currentApi.color}18 0%, ${currentApi.color}08 100%)`,
              borderRadius: '20px',
              padding: '28px',
              border: `1px solid ${currentApi.color}25`,
              marginBottom: '16px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '52px',
                    fontWeight: '800',
                    background: `linear-gradient(135deg, ${currentApi.color} 0%, #A78BFA 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {result.overallScore}
                  </div>
                  <div style={{ fontSize: '13px', color: '#A1A1AA' }}>综合评分</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '52px', fontWeight: '800', color: '#FAFAFA' }}>
                    {result.totalQuestions}
                  </div>
                  <div style={{ fontSize: '13px', color: '#A1A1AA' }}>问答轮次</div>
                </div>
              </div>
              
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <p style={{ fontSize: '14px', color: '#D4D4D8', margin: 0, lineHeight: 1.8 }}>
                  <strong style={{ color: currentApi.color }}>总体评价：</strong>
                  {result.summary}
                </p>
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              marginBottom: '16px'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#FAFAFA',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                📋 逐题诊断
              </h2>

              {result.conversations?.map((conv, idx) => (
                <div
                  key={conv.id}
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '14px',
                    padding: '20px',
                    marginBottom: idx < result.conversations.length - 1 ? '12px' : 0,
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                    <span style={{
                      flexShrink: 0,
                      background: `linear-gradient(135deg, ${currentApi.color} 0%, ${currentApi.color}AA 100%)`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'white'
                    }}>Q{conv.id}</span>
                    <p style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#FAFAFA',
                      margin: 0,
                      lineHeight: 1.5
                    }}>
                      {conv.question}
                    </p>
                  </div>

                  <div style={{ marginBottom: '16px', paddingLeft: '40px' }}>
                    <p style={{
                      fontSize: '13px',
                      color: '#A1A1AA',
                      margin: 0,
                      lineHeight: 1.7,
                      fontStyle: 'italic'
                    }}>
                      "{conv.answer}"
                    </p>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '65px 1fr 1fr',
                    gap: '10px',
                    paddingLeft: '40px'
                  }}>
                    <div style={{
                      background: conv.score >= 80 ? 'rgba(34,197,94,0.2)' : 
                                 conv.score >= 60 ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                      borderRadius: '10px',
                      padding: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: conv.score >= 80 ? '#4ADE80' : conv.score >= 60 ? '#FBBF24' : '#F87171'
                      }}>
                        {conv.score}
                      </div>
                      <div style={{ fontSize: '10px', color: '#71717A' }}>得分</div>
                    </div>

                    <div style={{
                      background: 'rgba(34,197,94,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                      borderLeft: '3px solid #22C55E'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#4ADE80', marginBottom: '6px' }}>
                        ✓ 亮点
                      </div>
                      {conv.strengths?.map((s, i) => (
                        <p key={i} style={{ fontSize: '12px', color: '#D4D4D8', margin: '0 0 3px 0', lineHeight: 1.5 }}>
                          • {s}
                        </p>
                      ))}
                    </div>

                    <div style={{
                      background: 'rgba(234,179,8,0.1)',
                      borderRadius: '10px',
                      padding: '12px',
                      borderLeft: '3px solid #EAB308'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#FBBF24', marginBottom: '6px' }}>
                        ↑ 可改进
                      </div>
                      {conv.improvements?.map((s, i) => (
                        <p key={i} style={{ fontSize: '12px', color: '#D4D4D8', margin: '0 0 3px 0', lineHeight: 1.5 }}>
                          • {s}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '15px',
                fontWeight: '600',
                color: '#A1A1AA',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              {isDemo ? '📤 上传我的面试记录' : '📤 上传新文件'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
