import { useState } from 'react';
import './Signup.css';
import usePasswordToggle from '../hooks/usePasswordToggle';

function Signup() {
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

    const user = { name, email, password };

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      if (data.success) {
        alert('Signup successful! Check your email for the OTP.');
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
        </form>
      </div>
    </div>
  );
}

export default Signup;
