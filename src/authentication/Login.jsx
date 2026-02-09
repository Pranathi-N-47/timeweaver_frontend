import { useState } from 'react';
import { authService } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [role, setRole] = useState('student'); // Default role
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const data = await authService.login(credentials);
            localStorage.setItem('token', data.access_token);
            // In a real app, you might validate if the returned user role matches the selected role
            navigate('/profile');
        } catch (err) {
            console.error(err);
            setError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const roles = [
        { id: 'student', label: 'Student' },
        { id: 'faculty', label: 'Teacher' },
        { id: 'admin', label: 'Admin' },
        { id: 'auditor', label: 'Auditor' }
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
            <div className="card" style={{ maxWidth: '440px', width: '100%', margin: '1rem' }}>
                <div className="text-center" style={{ marginBottom: '2rem' }}>
                    <h1 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>TimeWeaver</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                        {roles.find(r => r.id === role)?.label} Login
                    </p>
                </div>

                <div className="tabs">
                    {roles.map((r) => (
                        <div
                            key={r.id}
                            className={`tab ${role === r.id ? 'active' : ''}`}
                            onClick={() => setRole(r.id)}
                        >
                            {r.label}
                        </div>
                    ))}
                </div>

                {error && (
                    <div style={{
                        background: '#fee2e2',
                        color: '#ef4444',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius)',
                        marginBottom: '1.5rem',
                        fontSize: '0.875rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder={`Enter ${role} ID / Username`}
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.875rem' }}>Forgot password?</Link>
                        </div>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="Enter your password"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : `Sign In as ${roles.find(r => r.id === role)?.label}`}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
