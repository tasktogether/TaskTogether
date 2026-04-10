import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function SetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthFromUrl = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get('code')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            setMessage(error.message)
            return
          }
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          setMessage(error.message)
          return
        }

        if (!session) {
          setMessage('This password link is invalid or expired.')
        }
      } catch (err: any) {
        setMessage(err.message || 'Could not verify password link.')
      }
    }

    handleAuthFromUrl()
  }, [])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 8) {
      setMessage('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setMessage(error.message)
      return
    }

    setMessage('Password saved! Redirecting...')
navigate('/volunteer-dashboard')
  }

  return (
    <div style={{ maxWidth: 420, margin: '80px auto' }}>
      <h1>Set Your Password</h1>

      <form onSubmit={handleSetPassword}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: 12 }}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Password'}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  )
}
