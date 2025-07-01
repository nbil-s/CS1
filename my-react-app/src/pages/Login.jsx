import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import './Login.css';

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
    
      const credentials = { email, password };
      console.log('Sending credentials:', credentials);
    
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
    
        const data = await response.json();
    
        if (data.success) {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('role', data.user.role);
          login(data.token, data.user.role);
    
          console.log("Saved token:", data.token); // ✅ Corrected line
    
          if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else if (data.user.role === 'staff') {
            navigate('/staff/dashboard');
          } else {
            navigate('/'); // Patient homepage
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Something went wrong. Try again later.');
      }
    };
    

  return (
    <div className="body">
      <div className='wrapper'>
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <div className='input-box'>
            <input
              type="email"
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <i className='bx bx-user'></i>
          </div>
          <div className='input-box'>
            <input
              type="password"
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i className='bx bx-lock'></i>
          </div>
          <div className='remember-forgot'>
            <label><input type='checkbox' /> Remember Me</label>
            <Link to='/pass-reset' className='nav-link'>Forgot password?</Link>
          </div>
          <button type='submit' className='button'>Login</button>
          <div className='register-link'>
            <p>Don't have an account? <Link to="/signup" className='nav_link'>Sign Up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;