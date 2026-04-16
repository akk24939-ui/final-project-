import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Map route paths to human-readable page titles
const PAGE_TITLES = {
    'dashboard': 'Dashboard',
    'patients': 'Patients',
    'prescriptions': 'Prescriptions',
    'labs': 'Lab Reports',
    'adherence': 'Medication Adherence',
    'appointments': 'Appointments',
    'inventory': 'Inventory',
    'settings': 'Settings',
    'users': 'User Management',
};

function getTitle(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    return PAGE_TITLES[last] || 'Dashboard';
}

export default function DashboardLayout() {
    const { user } = useAuth();
    const location = useLocation();
    const title = getTitle(location.pathname);

    // Admin and Doctor use dark glass theme, staff uses light
    const isAdmin = user?.role === 'admin';
    const isDoctor = user?.role === 'doctor';
    const forceDark = isAdmin || isDoctor;
    const bg = forceDark
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        : 'bg-slate-50 dark:bg-slate-900';
    const sidebarBg = isAdmin
        ? 'bg-slate-900/80 border-white/10'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';

    return (
        <div className={`flex h-screen overflow-hidden ${bg}`}>
            <Toaster position="top-right" toastOptions={{ style: forceDark ? { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } : {} }} />
            {/* Sidebar — fixed height, sticky */}
            <Sidebar role={user?.role} forceDark={forceDark} />

            {/* Right panel — scrollable */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Topbar title={title} forceDark={forceDark} />
                <main className="flex-1 p-6 space-y-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
