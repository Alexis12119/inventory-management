import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm'; 
import CreateAccountForm from './components/auth/CreateAccountForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import Layout from './components/Layout';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Equipments from './components/Equipments';
import Maintenance from './components/Maintenance';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/create-account" element={<CreateAccountForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/equipments" element={<PrivateRoute element={<Equipments />} />} />
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} />
        <Route path="/sales" element={<PrivateRoute element={<Sales />} />} />
        <Route path="/maintenance" element={<PrivateRoute element={<Maintenance />} />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
