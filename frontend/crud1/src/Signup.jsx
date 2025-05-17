import React, { useState } from 'react';
import axios from 'axios';
import { Link,useNavigate } from 'react-router-dom';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        if (image) formData.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/api/register', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

            console.log(res.data);
            navigate('/login');
        } catch (err) {
            console.error('Signup failed:', err.message);
            alert('Signup failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='signup-container'>
              <h1 className="welcome">SignUp</h1>
            <form onSubmit={handleSignup} className='signup-form'>
              <div className="inputs">
                  <label htmlFor="name">Enter your name</label>
                <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
              </div>
                <div className="inputs">
                    <label htmlFor="email">Enter your Email</label>
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                </div>
               <div className="inputs">
                 <label htmlFor="phone">Enter your phone number</label>
                <input type="text" placeholder="Phone" onChange={(e) => setPhone(e.target.value)} required />
               </div>
                <div className="inputs">
                    <label htmlFor="password">Create your password</label>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
               
                    <label htmlFor="file">Set your profile pic</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />
               
                <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
                <p>Already signup? <Link to='./login'>Login</Link></p>
            </form>
        </div>
    );
}

export default Signup;
