import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Welcome from './components/base/Welcome';

import Home from './components/user/Home';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Warranty from './components/user/Warranty';
import EditProfile from './components/user/EditProfile';
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
      <Route path="/"              element={<Welcome />} />

      {/* Path from User's Logic */}
      <Route path="/user/home"          element={<Home />} />
      <Route path="/user/login"         element={<Login />} />
      <Route path="/user/register"      element={<Register />} />
      <Route path="/user/warranty"      element={<Warranty />} />
      <Route path="/user/edit-profile"  element={<EditProfile />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/user-technical-service" element={<UserTechnicalService />} />
      <Route path="/user/warranties-history" element={<WarrantyHistory />} />

      {/* Path from Technical Service's Logic */}
      <Route path="/technical-service" element={<TechnicalService />} />
      <Route path="/technical-service/home" element={<HomeTechnicalService />} />
      <Route path="/technical-service/login" element={<LoginTechnicalService />} />
      <Route path="/technical-service/forgot-password" element={<ForgotPasswordTechnicalService />} />
      <Route path="/technical-service/history-warranties" element={<WarrantiesListTechnicalService />} />

      {/* Path from Admin's Logic */}
      <Route path="/admin/login" element={<LoginAdmin />} />
      <Route path="/admin/forgot-password" element={<ForgotPasswordAdmin />} />
      <Route path="/admin/home" element={<HomeAdmin />} />
      <Route path="/admin/users-table" element={<UsersTable />} />
      <Route path="/admin/branches-table" element={<BranchesTable />} />
    </Routes>
  );
}