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

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden">
            {/* Sidebar — fixed height, sticky */}
            <Sidebar role={user?.role} />

            {/* Right panel — scrollable */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <Topbar title={title} />
                <main className="flex-1 p-6 space-y-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
