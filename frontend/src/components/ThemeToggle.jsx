import { useTheme } from '../contexts/ThemeContext';

/**
 * Global dark/light toggle button
 * Fixed at bottom-left — visible on ALL pages
 */
export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            id="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="fixed bottom-6 left-6 z-[9999] p-3 rounded-full shadow-lg
                       bg-white dark:bg-slate-800
                       border border-slate-200 dark:border-slate-700
                       text-slate-700 dark:text-slate-200
                       hover:bg-slate-50 dark:hover:bg-slate-700
                       transition-all duration-200 hover:scale-110"
        >
            {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            )}
        </button>
    );
}
