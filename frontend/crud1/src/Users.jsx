import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Users() {
  const [user, setUser] = useState(null); 
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', image: null });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/api/verify', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      axios.get('http://localhost:5000/api/user', { 
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone,
          image: res.data.image,
        });
      })
      .catch(err => console.error(err));
    })
    .catch(() => {
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/user/${user._id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setUser(response.data); 
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className='update-form-page'>
      <h1>Welcome, {user.name}</h1>
      <button onClick={() => setEditMode(!editMode)} className='update-button'>
        {editMode ? 'Cancel Edit' : 'Edit Profile'}
      </button>

      {editMode ? (
        <form onSubmit={handleSubmit} className='update-form'>
          <div className='inputs'>
            <label htmlFor="name">Edit your name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
          </div>
          <div className='inputs'>
            <label htmlFor="email">Edit your email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
          </div>
          <div className='inputs'>
            <label htmlFor="phone">Edit your phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone Number"
            />
          </div>
          <div >
            <label htmlFor="image">Change your profile pic</label>
            <input
              type="file"
              name="image"
              onChange={handleInputChange}
              accept="image/*"
            />
            {formData.image && <p>Selected Image: {formData.image.name}</p>}
          </div>
          <button type="submit">Update</button>
        </form>
      ) : (
        <div className='profile'>
          <h2>Your Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          {user.image && (
            <img src={`http://localhost:5000/uploads/${user.image}`} alt={user.name} width="100" />
          )}
        </div>
      )}
    </div>
  );
}

export default Users;
