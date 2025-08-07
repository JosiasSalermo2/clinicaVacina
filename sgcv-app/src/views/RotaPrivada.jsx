import React from 'react';
import { Navigate } from 'react-router-dom';

function RotaPrivada({ element }) {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/Login" />;
}

export default RotaPrivada;
