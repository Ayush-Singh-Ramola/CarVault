import { Routes, Route } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';
import AdminLayout from '@layouts/AdminLayout';
import { ProtectedRoute, GuestOnlyRoute, AdminRoute } from '@routes/RouteGuards';

import Home from '@pages/Home';
import Login from '@pages/Login';
import Register from '@pages/Register';
import Profile from '@pages/Profile';
import CarsListing from '@pages/CarsListing';
import CarDetail from '@pages/CarDetail';
import Compare from '@pages/Compare';
import Favorites from '@pages/Favorites';
import NotFound from '@pages/NotFound';

import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminCars from '@pages/admin/AdminCars';
import AdminCarForm from '@pages/admin/AdminCarForm';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<CarsListing />} />
        <Route path="/cars/:slug" element={<CarDetail />} />
        <Route path="/compare" element={<Compare />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route element={<GuestOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/cars/new" element={<AdminCarForm />} />
          <Route path="/admin/cars/:id/edit" element={<AdminCarForm />} />
        </Route>
      </Route>
    </Routes>
  );
}