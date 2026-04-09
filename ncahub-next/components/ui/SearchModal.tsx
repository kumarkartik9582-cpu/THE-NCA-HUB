'use client'
/**
 * SearchModal — Cmd+K / Ctrl+K search overlay.
 * Uses the existing /api/search endpoint for instant results.
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  title: string
  url: string
}

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selected, setSelected] = useState(0)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null!)
  const router = useRouter()

  // Keyboard shortcut: Cmd+K / Ctrl+K to open, Escape to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === '/' && !open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setOpen(true)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setResults([])
      setSelected(0)
    }
  }, [open])

  // Search on query change (debounced)
  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    setLoading(true)
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
        setSelected(0)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 200)
    return () => clearTimeout(timeout)
  }, [query])

  const navigate = useCallback((url: string) => {
    setOpen(false)
    router.push(url)
  }, [router])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selected]) {
      navigate(results[selected].url)
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2,2,4,0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 9060,
          animation: 'fadeIn 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 560,
          maxWidth: 'calc(100vw - 48px)',
          background: 'rgba(8,8,16,0.98)',
          border: '1px solid rgba(201,168,76,0.12)',
          borderRadius: 16,
          zIndex: 9061,
          overflow: 'hidden',
          animation: 'searchSlideDown 0.2s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '16px 20px',
          borderBottom: '1px solid rgba(201,168,76,0.08)',
        }}>
          <span style={{ color: 'var(--g2)', fontSize: '1.1rem' }}>&#8981;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search notes, articles, subjects..."
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: 'var(--cream)',
              fontSize: '1rem',
              fontFamily: 'var(--fb)',
              outline: 'none',
            }}
          />
          <kbd style={{
            fontSize: 'var(--nano)',
            color: 'var(--dim)',
            background: 'rgba(201,168,76,0.06)',
            border: '1px solid rgba(201,168,76,0.1)',
            borderRadius: 4,
            padding: '2px 6px',
            fontFamily: 'var(--fb)',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div style={{
          maxHeight: 320,
          overflowY: 'auto',
          padding: results.length > 0 ? '8px' : '24px 20px',
        }}>
          {query.length < 2 && (
            <div style={{
              textAlign: 'center',
              color: 'var(--dim)',
              fontSize: 'var(--sm)',
            }}>
              Type to search across notes, articles, and subjects
            </div>
          )}
          {query.length >= 2 && results.length === 0 && !loading && (
            <div style={{
              textAlign: 'center',
              color: 'var(--dim)',
              fontSize: 'var(--sm)',
            }}>
              No results for "{query}"
            </div>
          )}
          {loading && query.length >= 2 && (
            <div style={{
              textAlign: 'center',
              color: 'var(--dim)',
              fontSize: 'var(--sm)',
            }}>
              Searching...
            </div>
          )}
          {results.map((result, i) => (
            <button
              key={result.url}
              onClick={() => navigate(result.url)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
                padding: '12px 16px',
                background: i === selected ? 'rgba(201,168,76,0.08)' : 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                textAlign: 'left',
                color: 'var(--cream)',
                fontSize: 'var(--sm)',
                fontFamily: 'var(--fb)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={() => setSelected(i)}
            >
              <span style={{ color: 'var(--g1)', flexShrink: 0 }}>&#8594;</span>
              <span>{result.title}</span>
            </button>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{
          padding: '10px 20px',
          borderTop: '1px solid rgba(201,168,76,0.06)',
          display: 'flex',
          gap: 16,
          fontSize: 'var(--nano)',
          color: 'var(--dim)',
          letterSpacing: '.1em',
        }}>
          <span>↑↓ Navigate</span>
          <span>↵ Open</span>
          <span>ESC Close</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes searchSlideDown {
          from { opacity: 0; transform: translateX(-50%) translateY(-12px) scale(0.98); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
      `}</style>
    </>
  )
}
