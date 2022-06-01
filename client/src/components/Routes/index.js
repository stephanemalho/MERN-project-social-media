import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Trending from "../../pages/Trending";
import Home from "../../pages/Home";
import Profil from "../../pages/Profil";

const index = () => {
  return (
   
    <Router>
      <Routes>
        
        <Route path='/' element={<Home/>} />
        <Route path='/trending' element={<Trending/>} />
        <Route path='/profil' element={<Profil/>} />
        <Route path='*' element={<Navigate to='/' />} />
      
      </Routes>
    </Router>
  );
};

export default index;
