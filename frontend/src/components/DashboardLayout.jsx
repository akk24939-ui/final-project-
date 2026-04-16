import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAuth } from '../contexts/AuthContext';

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

    // Admin uses dark glass theme, doctor/staff use light
    const isAdmin = user?.role === 'admin';
    const bg = isAdmin
        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950'
        : 'bg-slate-50 dark:bg-slate-900';
    const sidebarBg = isAdmin
        ? 'bg-slate-900/80 border-white/10'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';

    return (
        <div className={`flex h-screen overflow-hidden ${bg}`}>
            {/* Sidebar — fixed height, sticky */}
            <Sidebar role={user?.role} forceDark={isAdmin} />

            {/* Right panel — scrollable */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Topbar title={title} forceDark={isAdmin} />
                <main className="flex-1 p-6 space-y-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
