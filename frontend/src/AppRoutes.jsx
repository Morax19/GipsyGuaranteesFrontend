import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Welcome from './components/base/Welcome';

import Login from './components/user/Login';
import Home from './components/user/Home';
import Register from './components/user/Register';
import Warranty from './components/user/Warranty';
import EditProfile from './components/user/EditProfile';
import ForgotPassword from './components/user/ForgotPassword';
import UserTechnicalService from './components/user/TechnicalServiceLogged';
import WarrantyHistory from './components/user/WarrantyHistory';

import TechnicalService from './components/technical_service/TechnicalService';
import HomeTechnicalService from './components/technical_service/HomeTechnicalService';
import LoginTechnicalService from './components/technical_service/LoginTechnicalService';
import ForgotPasswordTechnicalService from './components/technical_service/ForgotPasswordTechnicalService';
import GuaranteesListTechnicalService from './components/technical_service/GuaranteesListTechnicalService';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"              element={<Welcome />} />
      <Route path="/home"          element={<Home />} />
      <Route path="/login"         element={<Login />} />
      <Route path="/register"      element={<Register />} />
      <Route path="/warranty"      element={<Warranty />} />
      <Route path="/edit-profile"  element={<EditProfile />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/user-technical-service" element={<UserTechnicalService />} />
      <Route path="/warranties-history" element={<WarrantyHistory />} />
      <Route path="/technical-service" element={<TechnicalService />} />
      <Route path="/technical-service/home" element={<HomeTechnicalService />} />
      <Route path="/technical-service/login" element={<LoginTechnicalService />} />
      <Route path="/technical-service/forgot-password" element={<ForgotPasswordTechnicalService />} />
      <Route path="/technical-service/history-guarantees" element={<GuaranteesListTechnicalService />} />
    </Routes>
  );
}