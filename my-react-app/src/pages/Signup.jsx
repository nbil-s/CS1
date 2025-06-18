import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePasswordToggle from '../hooks/usePasswordToggle';
import api from '../services/api';
import './Signup.css';

function Signup() {
    const [PasswordInputType, ToggleIcon] = usePasswordToggle();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: 'patient' // Default role
            });

            if (response.data.success) {
                navigate('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            if (err.response) {
                setError(err.response.data.message || 'Registration failed');
            } else if (err.request) {
                setError('Network error. Please check your connection.');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="body">
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <div className='input-box'>
                        <input 
                            type="text" 
                            name="username"
                            placeholder='Enter Your Name' 
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='input-box'>
                        <input 
                            type="email" 
                            name="email"
                            placeholder='Enter email address' 
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className='input-box'>
                        <input
                            type={PasswordInputType}
                            name="password"
                            placeholder='Password'
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <span className='password-toggle-icon'>
                            {ToggleIcon}
                        </span>
                    </div>

                    <div className='input-box'>
                        <input
                            type={PasswordInputType}
                            name="confirmPassword"
                            placeholder='Confirm Password'
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <span className='password-toggle-icon'>
                            {ToggleIcon}
                        </span>
                    </div>

                    <button 
                        type='submit' 
                        className='button'
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Signup;