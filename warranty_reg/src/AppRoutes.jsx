import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Warranty from './components/Warranty';
import EditProfile from './components/EditProfile';
import ForgotPassword from './components/ForgotPassword';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<Home />} />
      <Route path="/home"          element={<Home />} />
      <Route path="/login"         element={<Login />} />
      <Route path="/register"      element={<Register />} />
      <Route path="/warranty"      element={<Warranty />} />
      <Route path="/edit-profile"  element={<EditProfile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}