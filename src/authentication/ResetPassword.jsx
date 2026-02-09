import { useState } from 'react';
import { authService } from '../../services/authService';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!token) {
            setError('Invalid or missing token');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await authService.resetPassword(token, newPassword);
            setMessage('Password reset successful. Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError('Failed to reset password. Token may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background-color)' }}>
            <div className="card" style={{ maxWidth: '400px', width: '100%', margin: '1rem' }}>
                <h2 className="text-center" style={{ marginBottom: '1.5rem' }}>Reset Password</h2>

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
                        <label className="form-label">New Password</label>
                        <input
                            className="form-input"
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className="form-input"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
