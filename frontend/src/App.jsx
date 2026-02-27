import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import DashboardLayout from './components/DashboardLayout';

// Static imports (small/public pages)
import Landing from './pages/Landing';
import Login from './pages/Login';
import PatientLogin from './pages/PatientLogin';

// Lazy-loaded pages — split by portal role for performance
const PatientDashboard = lazy(() => import('./pages/PatientDashboard'));

// Doctor portal pages
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const Adherence = lazy(() => import('./pages/Adherence'));
const Patients = lazy(() => import('./pages/Patients'));
const Labs = lazy(() => import('./pages/Labs'));
const Appointments = lazy(() => import('./pages/Appointments'));

// Admin portal pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Settings = lazy(() => import('./pages/Settings'));

// Staff portal pages
const StaffDashboard = lazy(() => import('./pages/StaffDashboard'));

// Loading fallback
function PageSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-600 border-t-transparent" />
    </div>
  );
}

function RoleRedirect() {
  const role = JSON.parse(localStorage.getItem('vs_user') || 'null')?.role;
  const routes = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', staff: '/staff/dashboard' };
  return <Navigate to={routes[role] || '/'} replace />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Global theme toggle — fixed bottom-left, visible on ALL pages */}
          <ThemeToggle />

          <Suspense fallback={<PageSpinner />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/hospital-login" element={<Login />} />
              <Route path="/patient-login" element={<PatientLogin />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />

              {/* ── Admin Portal ── */}
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="prescriptions" element={<Patients />} />
                <Route path="labs" element={<Labs />} />
                <Route path="adherence" element={<Adherence />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="settings" element={<Settings />} />
              </Route>

              {/* ── Doctor Portal ── */}
              <Route path="/doctor" element={
                <ProtectedRoute allowedRoles={['doctor', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="prescriptions" element={<Patients />} />
                <Route path="labs" element={<Labs />} />
                <Route path="adherence" element={<Adherence />} />
                <Route path="appointments" element={<Appointments />} />
              </Route>

              {/* ── Staff Portal ── */}
              <Route path="/staff" element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="inventory" element={<Inventory />} />
              </Route>

              {/* Fallback */}
              <Route path="/dashboard" element={<RoleRedirect />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
