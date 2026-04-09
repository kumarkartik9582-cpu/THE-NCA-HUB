'use client'
/**
 * ChatWidget — floating bubble + expanding chat panel.
 * Uses the existing /api/chat endpoint (Claude Haiku).
 */
import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null!)
  const inputRef = useRef<HTMLInputElement>(null!)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      if (data.text) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I couldn\'t process that. Please try again.' }])
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }, [input, loading, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close chat' : 'Open NCA assistant'}
        data-cur="Chat"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--g1)',
          color: 'var(--void)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9030,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 4px 20px rgba(201,168,76,0.4), 0 0 40px rgba(201,168,76,0.1)',
          transition: 'all 0.3s cubic-bezier(.16,1,.3,1)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {open ? '+' : '?'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 92,
            right: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 480,
            maxHeight: 'calc(100vh - 140px)',
            background: 'rgba(5,5,8,0.97)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(201,168,76,0.12)',
            borderRadius: 16,
            zIndex: 9029,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatSlideUp 0.3s cubic-bezier(.16,1,.3,1)',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(201,168,76,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 8px rgba(74,222,128,0.5)',
            }} />
            <div>
              <div style={{
                fontSize: 'var(--sm)', fontWeight: 600, color: 'var(--cream)',
              }}>
                NCA Assistant
              </div>
              <div style={{
                fontSize: 'var(--nano)', color: 'var(--dim)',
                letterSpacing: '.1em',
              }}>
                Ask about NCA exams, subjects, or strategy
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center', padding: '40px 20px',
                color: 'var(--dim)', fontSize: 'var(--sm)',
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 12, opacity: 0.3 }}>?</div>
                Ask me anything about NCA exams, study strategy, or prep materials.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: msg.role === 'user'
                    ? 'rgba(201,168,76,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  fontSize: 'var(--sm)',
                  color: 'var(--cream)',
                  lineHeight: 1.6,
                }}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 14px',
                borderRadius: '12px 12px 12px 2px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: 'var(--sm)',
                color: 'var(--dim)',
              }}>
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid rgba(201,168,76,0.08)',
            display: 'flex',
            gap: 8,
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about NCA exams..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(201,168,76,0.1)',
                borderRadius: 8,
                padding: '10px 14px',
                color: 'var(--cream)',
                fontSize: 'var(--sm)',
                fontFamily: 'var(--fb)',
                outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                background: 'var(--g1)',
                color: 'var(--void)',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                fontSize: 'var(--sm)',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading || !input.trim() ? 0.5 : 1,
                transition: 'opacity 0.2s',
                fontFamily: 'var(--fb)',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
