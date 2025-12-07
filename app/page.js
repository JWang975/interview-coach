'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: '🎯',
      title: '智能识别问答',
      desc: 'AI 自动区分面试官问题与你的回答，无需手动标注'
    },
    {
      icon: '📊',
      title: '逐题深度诊断',
      desc: '每道题独立评分，精准定位亮点与改进空间'
    },
    {
      icon: '💡',
      title: '可落地的建议',
      desc: '不是泛泛而谈，而是告诉你具体该怎么改'
    },
    {
      icon: '🔒',
      title: '隐私安全',
      desc: '数据仅在本地处理，使用你自己的 API Key'
    }
  ]

  const steps = [
    { num: '01', title: '上传面试记录', desc: '支持 txt、docx 文件，或直接粘贴文本' },
    { num: '02', title: 'AI 深度分析', desc: '智能识别对话结构，逐题评估表现' },
    { num: '03', title: '获取诊断报告', desc: '查看评分、亮点、改进建议' }
  ]

  const faqs = [
    {
      q: '支持哪些文件格式？',
      a: '目前支持 .txt 和 .docx 格式。如果你有录音文件，可以先用讯飞听见、飞书妙记等工具转成文字再上传。'
    },
    {
      q: '我的面试内容会被泄露吗？',
      a: '不会。所有分析都通过你自己的 API Key 直接调用 AI 服务，数据不经过我们的服务器，完全在你的浏览器本地处理。'
    },
    {
      q: 'API Key 从哪里获取？',
      a: '支持 DeepSeek 和通义千问两个平台。DeepSeek 可在 platform.deepseek.com 注册获取，通义千问在阿里云 dashscope 控制台获取。'
    },
    {
      q: '分析一次大概多少钱？',
      a: '取决于面试记录长度，通常一次分析消耗几百到几千 tokens，成本约 ¥0.01-0.1 元。'
    }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0B',
      fontFamily: '"Noto Sans SC", "SF Pro Display", -apple-system, sans-serif',
      color: '#E4E4E7',
      overflow: 'hidden'
    }}>
      {/* 导航栏 */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 24px',
        background: scrolled ? 'rgba(10,10,11,0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.1)' : 'none',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>🎯</span>
            <span style={{
              fontSize: '20px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              面试复盘 AI
            </span>
          </div>
          
          <Link
            href="/analyzer"
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)'
            }}
          >
            开始使用
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '120px 24px 80px'
      }}>
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)'
        }} />

        <div style={{
          maxWidth: '900px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99,102,241,0.15)',
            padding: '8px 16px',
            borderRadius: '50px',
            marginBottom: '32px',
            border: '1px solid rgba(99,102,241,0.3)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: '#22C55E',
              borderRadius: '50%',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '13px', color: '#A5B4FC' }}>
              支持 DeepSeek / 通义千问
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: '800',
            lineHeight: 1.1,
            margin: '0 0 24px 0',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A1A1AA 50%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            面试结束后
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 50%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              AI 帮你复盘每一个回答
            </span>
          </h1>

          <p style={{
            fontSize: '18px',
            color: '#71717A',
            lineHeight: 1.7,
            margin: '0 0 40px 0',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            上传面试记录，AI 自动识别问答、逐题诊断表现、给出改进建议。
            <br />
            让每次面试都成为下一次的垫脚石。
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link
              href="/analyzer"
              style={{
                padding: '16px 36px',
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 4px 24px rgba(99,102,241,0.5)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>✨</span> 免费试用
            </Link>
            <a
              href="#demo"
              style={{
                padding: '16px 36px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '12px',
                color: '#E4E4E7',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>👀</span> 查看 Demo
            </a>
          </div>
        </div>
      </section>

      {/* 功能特点 */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.03) 100%)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
              为什么选择我们
            </h2>
            <p style={{ fontSize: '16px', color: '#71717A', margin: 0 }}>
              专为面试复盘设计的 AI 分析工具
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {features.map((f, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '20px',
                  padding: '32px 28px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.2) 100%)',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '20px'
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 10px 0', color: '#FAFAFA' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '14px', color: '#71717A', margin: 0, lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使用步骤 */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
              三步完成面试复盘
            </h2>
            <p style={{ fontSize: '16px', color: '#71717A', margin: 0 }}>
              简单、快速、高效
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '28px',
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: '20px',
                  padding: '28px 32px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.8
                }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 6px 0', color: '#FAFAFA' }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#71717A', margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo 展示 */}
      <section id="demo" style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.05) 50%, transparent 100%)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
              效果预览
            </h2>
            <p style={{ fontSize: '16px', color: '#71717A', margin: 0 }}>
              这是一份真实面试记录的分析示例
            </p>
          </div>

          <div style={{
            background: 'rgba(30,30,35,0.8)',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '28px'
            }}>
              <div style={{
                background: 'rgba(99,102,241,0.15)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>73</div>
                <div style={{ fontSize: '13px', color: '#A1A1AA' }}>综合评分</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#FAFAFA' }}>5</div>
                <div style={{ fontSize: '13px', color: '#A1A1AA' }}>问答轮次</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#FAFAFA' }}>32分</div>
                <div style={{ fontSize: '13px', color: '#A1A1AA' }}>面试时长</div>
              </div>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '24px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <span style={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: 'white'
                }}>Q2</span>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: '600', color: '#FAFAFA', margin: '0 0 8px 0' }}>
                    介绍一个你主导过的最有挑战的项目
                  </p>
                  <p style={{ fontSize: '13px', color: '#71717A', margin: 0, fontStyle: 'italic' }}>
                    "去年我负责了公司的会员体系重构项目，当时面临的主要问题是老会员体系ROI很低..."
                  </p>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr 1fr',
                gap: '12px'
              }}>
                <div style={{
                  background: 'rgba(234,179,8,0.2)',
                  borderRadius: '10px',
                  padding: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#FBBF24' }}>65</div>
                  <div style={{ fontSize: '10px', color: '#A1A1AA' }}>得分</div>
                </div>
                <div style={{
                  background: 'rgba(34,197,94,0.1)',
                  borderRadius: '10px',
                  padding: '12px',
                  borderLeft: '3px solid #22C55E'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#4ADE80', marginBottom: '6px' }}>✓ 亮点</div>
                  <p style={{ fontSize: '12px', color: '#A1A1AA', margin: 0, lineHeight: 1.5 }}>
                    • 案例具有挑战性<br/>• 体现数据驱动思维
                  </p>
                </div>
                <div style={{
                  background: 'rgba(234,179,8,0.1)',
                  borderRadius: '10px',
                  padding: '12px',
                  borderLeft: '3px solid #EAB308'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#FBBF24', marginBottom: '6px' }}>↑ 可改进</div>
                  <p style={{ fontSize: '12px', color: '#A1A1AA', margin: 0, lineHeight: 1.5 }}>
                    • 缺少困难描述<br/>• 个人贡献不突出
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
              常见问题
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#FAFAFA', margin: '0 0 10px 0' }}>
                  {faq.q}
                </h3>
                <p style={{ fontSize: '14px', color: '#71717A', margin: 0, lineHeight: 1.7 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(99,102,241,0.08) 100%)'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', margin: '0 0 16px 0' }}>
            开始你的面试复盘
          </h2>
          <p style={{ fontSize: '16px', color: '#71717A', margin: '0 0 32px 0' }}>
            上传面试记录，获取专业诊断报告
          </p>
          <Link
            href="/analyzer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '18px 40px',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: '14px',
              color: 'white',
              fontSize: '17px',
              fontWeight: '700',
              boxShadow: '0 4px 24px rgba(99,102,241,0.5)'
            }}
          >
            <span>🚀</span> 立即使用分析工具
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🎯</span>
            <span style={{ fontSize: '14px', color: '#71717A' }}>面试复盘 AI</span>
          </div>
          <p style={{ fontSize: '13px', color: '#52525B', margin: 0 }}>
            © 2024 Interview Coach AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
