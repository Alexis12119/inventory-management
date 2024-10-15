import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm'; 
import SignUpForm from './components/auth/SignUpForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import Layout from './components/Layout';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Equipments from './components/Equipments';
import Maintenance from './components/Maintenance';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/equipments" element={<PrivateRoute element={<Equipments />} />} />
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} />} />
        <Route path="/sales" element={<PrivateRoute element={<Sales />} />} />
        <Route path="/maintenance" element={<PrivateRoute element={<Maintenance />} />} />
      </Routes>
    </Layout>
  </Router>
);

export default App;
