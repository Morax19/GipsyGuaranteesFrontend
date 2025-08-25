import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Welcome from './components/base/Welcome';
import ProtectedRoute from './components/base/ProtectedRoute';

import Home from './components/user/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Warranty from './components/user/Warranty';
import EditProfile from './components/user/EditProfile';
import ChangePassword from './components/user/ChangePassword';
import ForgotPassword from './components/user/ForgotPassword';
import WarrantyHistory from './components/user/WarrantyHistory';
import UserTechnicalService from './components/test/TechnicalServiceLogged';

import TechnicalService from './components/technical_service/TechnicalService';
import HomeTechnicalService from './components/technical_service/HomeTechnicalService';
import LoginTechnicalService from './components/technical_service/LoginTechnicalService';
import ForgotPasswordTechnicalService from './components/technical_service/ForgotPasswordTechnicalService';
import WarrantiesListTechnicalService from './components/technical_service/WarrantiesListTechnicalService';

import HomeAdmin from './components/admin/HomeAdmin';
import UsersTable from './components/admin/UsersTable';
import LoginAdmin from './components/admin/LoginAdmin';
import BranchesTable from './components/admin/BranchesTable';
import ForgotPasswordAdmin from './components/admin/ForgotPasswordAdmin';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Path from the Welcome */}
      <Route path="/"              element={<Welcome />} />
      <Route path="/technical-service" element={<TechnicalService />} />

      {/* Path from User's Logic */}
      {/* Public paths from User's Logic */}
      <Route path="/user/login" element={<Login />} />
      <Route path="/user/register" element={<Register />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected paths from User's Logic */}
      <Route path="/user/home" element={
        <ProtectedRoute requiredRole='Cliente'>
          <Home />
        </ProtectedRoute>
      }/>
      <Route path="/user/warranty" element={
        <ProtectedRoute requiredRole='Cliente'>
          <Warranty />
        </ProtectedRoute>
      }/>
      <Route path="/user/edit-profile" element={
        <ProtectedRoute requiredRole='Cliente'>
          <EditProfile />
        </ProtectedRoute>
      }/>
      <Route path="/user/change-password" element={
        <ProtectedRoute requiredRole='Cliente'>
          <ChangePassword />
        </ProtectedRoute>
      }/>
      <Route path="/user/user-technical-service" element={
        <ProtectedRoute requiredRole='Cliente'>
          <UserTechnicalService />
        </ProtectedRoute>
      }/>
      <Route path="/user/warranties-history" element={
        <ProtectedRoute requiredRole='Cliente'>
          <WarrantyHistory />
        </ProtectedRoute>
      }/>

      {/* Path from Technical Service's Logic */}
      {/* Public paths from Technical Service's Logic */}
      <Route path="/technical-service/login" element={<LoginTechnicalService />} />
      <Route path="/technical-service/forgot-password" element={<ForgotPasswordTechnicalService />} />

      {/* Protected paths from Technical Service's Logic */}
      <Route path="/technical-service/home" element={
        <ProtectedRoute requiredRole='Servicio Técnico'>
          <HomeTechnicalService />
        </ ProtectedRoute>
      }/>
      <Route path="/technical-service/history-warranties" element={
        <ProtectedRoute requiredRole='Servicio Técnico'>
          <WarrantiesListTechnicalService />
        </ProtectedRoute>
      }/>

      {/* Path from Admin's Logic */}
      {/* Public paths from Admin's Logic */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/forgot-password" element={<ForgotPasswordAdmin />} />

      {/* Protected paths from Admin's Logic */}
      <Route path="/admin/home" element={
        <ProtectedRoute requiredRole='Administrador'>
          <HomeAdmin />
        </ProtectedRoute>
      }/>
      <Route path="/admin/users-table" element={
        <ProtectedRoute requiredRole='Administrador'>
          <UsersTable />
        </ProtectedRoute>
      }/>
      <Route path="/admin/branches-table" element={
        <ProtectedRoute requiredRole='Administrador'>
          <BranchesTable />
        </ProtectedRoute>
      }/>
    </Routes>
  );
}