import { useAuth } from '../contexts/AuthContext';

export default function Topbar({ title, forceDark = false }) {
    const { user } = useAuth();
    const initial = (user?.full_name || user?.username || 'V')[0].toUpperCase();

    const bg = forceDark
        ? 'bg-slate-900/70 border-white/10 backdrop-blur-md'
        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700';
    const titleColor = forceDark ? 'text-white' : 'text-slate-800 dark:text-slate-100';
    const inputBg = forceDark ? 'bg-white/10 border-white/10 text-white placeholder-white/30' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 placeholder-slate-400';
    const iconColor = forceDark ? 'text-white/40 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800';

    return (
        <header className={`h-16 border-b flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10 ${bg}`}>
            {/* Page Title */}
            <h1 className={`text-xl font-semibold ${titleColor}`}>{title}</h1>

            {/* Right side */}
            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative hidden md:block">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-56 ${inputBg}`}
                    />
                </div>

                {/* Notification bell */}
                <button className={`relative p-2 rounded-lg transition-colors ${iconColor}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                    {initial}
                </div>
            </div>
        </header>
    );
}
