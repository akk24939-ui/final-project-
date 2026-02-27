/**
 * Appointments.jsx
 * Placeholder — no backend endpoint yet.
 */
export default function Appointments() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">📅 Appointments</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage patient appointments</p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Appointments Module</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                    Appointment scheduling will be available once the backend endpoint is configured.
                </p>
                <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 text-amber-700 dark:text-amber-300 text-sm font-medium">
                    🔧 Coming Soon
                </div>
            </div>
        </div>
    );
}
