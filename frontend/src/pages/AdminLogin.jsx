import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getApiUrl } from '../utils/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(''); // '', 'loading', 'error'
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(getApiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setStatus('error');
        setErrorMsg(data.message || 'Invalid credentials.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMsg('Connection error. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Animated Mesh Background */}
      <div className="login-mesh-bg" />

      <motion.div 
        className="login-container"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Back Link */}
        <Link to="/" className="login-back-link">
          <span>←</span> Back to Portfolio
        </Link>

        <form className={`login-card glass-morphism ${status === 'error' ? 'shake-anim' : ''}`} onSubmit={handleLogin}>
          <div className="login-header">
            <div className="login-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Admin Portal</h2>
            <p>Sign in to manage your portfolio</p>
          </div>

          {status === 'error' && (
            <motion.div 
              className="login-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <span>⚠️</span> {errorMsg}
            </motion.div>
          )}

          <div className="login-form-body">
            {/* Username */}
            <div className="login-input-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input 
                  type="text" 
                  id="username"
                  placeholder="Enter admin username" 
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (status === 'error') setStatus('');
                  }}
                  required 
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-input-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔑</span>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  placeholder="Enter admin password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (status === 'error') setStatus('');
                  }}
                  required 
                />
                <button 
                  type="button" 
                  className="pwd-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full login-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <><span className="btn-spinner" /> Authenticating...</>
              ) : 'Access Dashboard'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
