import { useState } from 'react';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setMessage('If an account exists with this email, a reset link has been sent.');
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '1rem' }}>
                <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Forgot Password</h2>

                {message && (
                    <div style={{ background: '#dcfce7', color: '#166534', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                        {message}
                    </div>
                )}

                {error && (
                    <div style={{ background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link to="/login">Back to Login</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
