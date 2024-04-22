import React from "react";
import {Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Home from './components/Home';
import Signup from './components/Signup';
import About from "./components/About";

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/">
            <Route index element={<Home/> } />
            <Route exact path="login" element={<Login/> } />
            <Route exact path="signup" element={<Signup />} />
            <Route exact path="about" element={<About/>} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
