import { useState } from 'react';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isRegistering ? '/api/register' : '/api/login';
        const body = isRegistering
            ? { name, email, password }
            : { email, password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (data.success) {
                // If registering, we might auto-login or ask them to login
                // Here we'll treat it as auto-login for better UX, if backend returns user
                if (isRegistering) {
                    // If backend returns user/token on register, use it. 
                    // Based on auth-service, it returns { user: ... } but maybe not token.
                    // Let's check auth-service code memory...
                    // Auth service /register returns { success: true, user: ... } but NO token.
                    // So we should switch to login mode or auto-login.
                    // Let's switch to login mode with a success message
                    setIsRegistering(false);
                    setError('Registration successful! Please login.');
                    // clear sensitive fields but keep email
                    setPassword('');
                } else {
                    // Login success
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    onLogin(data.user);
                }
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Could not connect to the server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setName('');
        setPassword('');
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <h1>{isRegistering ? 'Create Account' : 'Login to Your Account'}</h1>
                    <p>{isRegistering ? 'Join looking for vehicle services' : 'Access your bookings and services'}</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {error && <div className={`login-error-message ${error.includes('successful') ? 'success' : ''}`}>{error}</div>}

                    {isRegistering && (
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input-wrapper">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "👁️" : "👁️‍🗨️"}
                            </button>
                        </div>
                    </div>

                    {!isRegistering && (
                        <div className="form-options">
                            <a href="#" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                        </div>
                    )}

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isRegistering ? 'Register' : 'Login')}
                    </button>

                    <div className="login-footer">
                        {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                        <button type="button" className="link-button" onClick={toggleMode}>
                            {isRegistering ? 'Login' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
