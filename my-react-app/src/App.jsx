import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import HomePage from './pages/HomePage.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import NumberAndDetails from './pages/NumberAndDetails.jsx';

function App() {
  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="numberanddetails" element={<NumberAndDetails/>} />
      </Routes>
    </>
  );
};

export default App;
