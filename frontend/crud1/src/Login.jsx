import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
  e.preventDefault();
  setErrorMessage(''); 

  try {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(errorData || 'Something went wrong!');
    }

    const data = await res.json();
    localStorage.setItem('token', data.token);
    navigate('/users');
  } catch (err) {
    console.error('Error during login:', err);
    setErrorMessage(err.message); 
  }
};


    return (
        <div className="login-container" >
            <h1 className="welcome">Login</h1>
            <form onSubmit={handleLogin} className='login-form'>
              <div className='inputs'>
                <label htmlFor="email" className='label' >Enter your Email</label>
                <input
                    type="email"
                    
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>
                <div className='inputs'>
                  <label htmlFor="password" className='label'>Enter your Password</label>
                <input
                    type="password"
                   
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging In...' : 'Login'}
                </button>
            </form>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <p>Not Registered? <Link to='/'>Signup</Link></p>
        </div>
    );
}

export default Login;
