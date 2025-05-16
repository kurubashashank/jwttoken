import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import Users from './Users';
import UpdateUsers from './UpdateUsers';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/updateUsers/:id" element={<UpdateUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
