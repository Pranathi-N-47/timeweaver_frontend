import { useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const data = await authService.getCurrentUser();
            setUser(data);
        } catch (err) {
            console.error('Failed to load user', err);
            // Optional: Auto-redirect after short delay or immediately
            // navigate('/login'); 
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card text-center" style={{ maxWidth: '400px', width: '100%' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        You must be logged in to view this profile.
                    </p>
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => navigate('/login')}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2rem' }}>
                    <h1>My Profile</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Manage your account settings</p>
                </div>

                <div className="form-group">
                    <label className="form-label">Username</label>
                    <div className="form-input" style={{ background: '#f1f5f9' }}>{user.username}</div>
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <div className="form-input" style={{ background: '#f1f5f9' }}>{user.email}</div>
                </div>

                <div className="form-group">
                    <label className="form-label">Role</label>
                    <div className="form-input" style={{ background: '#f1f5f9' }}>{user.role}</div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '2rem' }}>
                    <button
                        className="btn"
                        style={{ background: '#ef4444', color: 'white' }}
                        onClick={() => { authService.logout(); navigate('/login'); }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
