import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';
import usePasswordToggle from '../../hooks/usePasswordToggle';
import './Signup.css';

function Signup() {
  const {login} = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfirmPasswordInputType, ConfirmIconToggle] = usePasswordToggle();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (name.length < 3 || name.length > 40) {
      alert('Name must be between 3 and 40 characters.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com)$/;
    if (!emailRegex.test(email)) {
      alert('Enter a valid email address from allowed domains (gmail, yahoo, outlook, hotmail).');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }

    const user = { name, email, password };

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (data.success) {
        alert('Signup successful!');
        login(data.token);
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Something went wrong. Try again later.');
    }
  };

  return (
    <div className="body">
      <div className='wrapper'>
        <form onSubmit={handleSignup}>
          <h1>Sign Up</h1>

          <div className='input-box'>
            <input
              type="text"
              placeholder='Enter Your Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              minLength={3}
              maxLength={40}
              required
            />
          </div>

          <div className='input-box'>
            <input
              type="email"
              placeholder='Enter email address'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='input-box'>
            <input
              type={PasswordInputType}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className='password-toggle-icon'>{ToggleIcon}</span>
          </div>

          <div className='input-box'>
            <input
              type={ConfirmPasswordInputType}
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className='password-toggle-icon'>{ConfirmIconToggle}</span>
          </div>

          <button type='submit' className='button'>Sign Up</button>

          <div className='register-link'>
            <p>Have an Account? <Link to="/login" className='nav_link'>Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;