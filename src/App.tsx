import React from 'react';
import './App.scss';
import "./pages/main/main.scss"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from './components/navbar/navbar';
import { CreatePost } from './pages/create-post/create-post';
import { Login } from './pages/login/login';
import { Main } from "./pages/main/main";



function App()
{
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
