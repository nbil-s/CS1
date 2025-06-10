import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/HomePage" element={<HomePage />} />
      </Routes>
    </>
  );
};

export default App;
