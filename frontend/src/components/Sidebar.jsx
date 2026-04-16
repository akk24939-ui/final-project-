import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Nav config per role
const NAV_ALL = [
    { path: 'dashboard', label: 'Dashboard', icon: '📊' },
    { path: 'patients', label: 'Patients', icon: '🩺' },
    { path: 'prescriptions', label: 'Prescriptions', icon: '💊' },
    { path: 'labs', label: 'Lab Reports', icon: '🧪' },
    { path: 'adherence', label: 'Adherence', icon: '📋' },
    { path: 'appointments', label: 'Appointments', icon: '📅' },
    { path: 'inventory', label: 'Inventory', icon: '📦' },
    { path: 'settings', label: 'Settings', icon: '⚙️' },
];

const NAV_BY_ROLE = {
    admin: ['dashboard', 'patients', 'prescriptions', 'labs', 'adherence', 'appointments', 'inventory', 'settings'],
    doctor: ['dashboard', 'patients', 'prescriptions', 'labs', 'adherence', 'appointments'],
    staff: ['dashboard', 'patients', 'appointments', 'inventory'],
};

const ROLE_STYLE = {
    admin: { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    doctor: { badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
    staff: { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
};

// Role-specific base path
const BASE = { admin: '/admin', doctor: '/doctor', staff: '/staff' };

export default function Sidebar({ role, forceDark = false }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const allowed = NAV_BY_ROLE[role] || [];
    const navItems = NAV_ALL.filter(n => allowed.includes(n.path));
    const base = BASE[role] || '/admin';
    const roleStyle = ROLE_STYLE[role] || ROLE_STYLE.staff;

    const handleLogout = () => { logout(); navigate('/login'); };

    const sidebarBg = forceDark
        ? 'bg-slate-900/80 border-white/10 backdrop-blur-md'
        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    const logoText = forceDark ? 'text-white' : 'text-slate-800 dark:text-slate-100';
    const logoSub = forceDark ? 'text-white/40' : 'text-slate-400 dark:text-slate-500';
    const navActive = forceDark
        ? 'bg-sky-500/20 text-sky-300'
        : 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300';
    const navInactive = forceDark
        ? 'text-white/50 hover:bg-white/10 hover:text-white'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100';
    const dividerColor = forceDark ? 'border-white/10' : 'border-slate-200 dark:border-slate-700';
    const logoutColor = forceDark
        ? 'text-red-400 hover:bg-red-500/10'
        : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20';

    return (
        <aside className={`w-64 flex-shrink-0 border-r flex flex-col h-screen sticky top-0 ${sidebarBg}`}>
            {/* Logo */}
            <div className={`h-16 flex items-center gap-3 px-5 border-b flex-shrink-0 ${dividerColor}`}>
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div>
                    <p className={`font-bold text-sm leading-tight ${logoText}`}>VitaSage AI</p>
                    <p className={`text-xs ${logoSub}`}>Medical System</p>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={`${base}/${item.path}`}
                        end={item.path === 'dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150
                            ${isActive ? navActive : navInactive}`
                        }
                    >
                        <span className="text-base leading-none">{item.icon}</span>
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className={`px-3 py-4 border-t space-y-2 flex-shrink-0 ${dividerColor}`}>
                {/* User chip */}
                <div className={`px-3 py-2 rounded-lg ${forceDark ? 'bg-white/10 text-white' : roleStyle.badge}`}>
                    <p className="font-semibold text-sm truncate">{user?.full_name || user?.username}</p>
                    <p className={`text-xs opacity-70 capitalize ${forceDark ? '' : ''}`}>{user?.role} · {user?.hospital_id}</p>
                </div>
                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${logoutColor}`}
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );
}
