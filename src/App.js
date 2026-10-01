import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PrivateRoute, AdminRoute } from './components/RouteGuards';

import Home from './pages/Home';
import Books from './pages/Books';
import BookDetails from './pages/BookDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

import Dashboard from './admin/Dashboard';
import AddBook from './admin/AddBook';
import EditBook from './admin/EditBook';
import ViewBooks from './admin/ViewBook';
import AdminOrders from './admin/Orders';
import Users from './admin/Users';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />

      <main className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private routes (logged-in users) */}
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books"
            element={
              <AdminRoute>
                <ViewBooks />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/add"
            element={
              <AdminRoute>
                <AddBook />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/books/edit/:id"
            element={
              <AdminRoute>
                <EditBook />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <Users />
              </AdminRoute>
            }
          />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div className="container text-center py-5">
                <h1 className="display-4">404</h1>
                <p className="text-muted">Page not found</p>
              </div>
            }
          />
        </Routes>
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
}

export default App;
