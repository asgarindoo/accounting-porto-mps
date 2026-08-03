import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../lib/auth-client.js';
import { Eye, EyeOff } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let finalEmail = form.email.trim();
    if (finalEmail && !finalEmail.includes('@')) {
      finalEmail += '@gmail.com';
      setForm(prev => ({ ...prev, email: finalEmail })); // Update visually on submit
    }

    try {
      const result = await signIn.email({
        email: finalEmail,
        password: form.password,
      });

      if (result?.error) {
        setError('Invalid email or password.');
      } else {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError('Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* Override Chrome autocomplete blue background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px var(--bg) inset !important;
            -webkit-text-fill-color: var(--text-primary) !important;
            transition: background-color 5000s ease-in-out 0s;
            border-radius: 12px !important;
        }
      `}</style>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        color: 'var(--text-primary)',
        padding: '24px 16px',
        fontFamily: 'inherit'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: 320,
          display: 'flex',
          flexDirection: 'column',
          gap: 40
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: 24, 
              fontWeight: 500, 
              margin: '0 0 8px',
              letterSpacing: '-0.02em'
            }}>
              Welcome Back
            </h1>
            <p style={{ 
              fontSize: 14, 
              color: 'var(--text-secondary)', 
              margin: 0,
              fontWeight: 400
            }}>
              Sign in to your CMS portfolio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {error && (
              <div style={{
                padding: '12px 16px',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.1)',
                fontSize: 13,
                borderRadius: 12,
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Email
              </label>
              <input
                name="email"
                type="text"
                required
                autoComplete="off"
                value={form.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                  fontSize: 15,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s',
                  borderRadius: 12
                }}
                onFocus={e => {
                  e.target.style.borderColor = 'var(--text-primary)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '14px 44px 14px 16px', // Extra right padding for the icon
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    fontSize: 15,
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s',
                    borderRadius: 12
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--text-primary)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'var(--text-primary)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 500,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: 8,
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={e => !loading && (e.target.style.opacity = 0.9)}
              onMouseLeave={e => !loading && (e.target.style.opacity = 1)}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
