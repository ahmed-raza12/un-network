// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ element, allowedRoles }) => {
    const userRole = useSelector(state => state.auth.user.role); // Get user role from Redux store

    // Check if the user's role is allowed
    const isAllowed = allowedRoles.includes(userRole);

    return isAllowed ? element : <Navigate to="/not-authorized" />; // Redirect if not allowed
};

export default ProtectedRoute;