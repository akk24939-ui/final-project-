/**
 * Adherence.jsx — Doctor / Admin View
 *
 * Backend endpoints (verified from medication_reminders.py):
 *   GET /meds/reminders/{source}/{patient_id}   → reminders + stock per patient
 *   GET /meds/adherence/{source}/{patient_id}   → per-reminder adherence summary
 *
 * Patient list from patient_records.py / staff_records.py:
 *   GET /patient-records/list   → registered patients seen by this doctor
 *                                 Falls back to /staff-records/list for staff
 */
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

// ── Helpers ──────────────────────────────────────────────────
function calcPct(taken, total) {
    if (!total || total === 0) return 0;
    return Math.round((taken / total) * 100);
}
function pctColor(p) {
    if (p >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (p >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
}
function pctBarColor(p) {
    if (p >= 80) return 'bg-emerald-500';
    if (p >= 50) return 'bg-amber-400';
    return 'bg-red-500';
}
function stockBarColor(rem, total) {
    if (!total) return 'bg-slate-300';
    const r = rem / total;
    if (r <= 0) return 'bg-red-500';
    if (r <= 0.25) return 'bg-orange-500';
    if (r <= 0.5) return 'bg-amber-400';
    return 'bg-emerald-500';
}

// ── Spinner ──────────────────────────────────────────────────
function Spinner({ label = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center py-12 gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-600 border-t-transparent" />
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
    );
}

// ── Status badge ─────────────────────────────────────────────
function StatusBadge({ status }) {
    if (status === 'taken') return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">✅ Taken</span>
    );
    if (status === 'missed') return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">❌ Missed</span>
    );
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">⏳ Pending</span>
    );
}

// ── Patient Adherence Slide Panel ────────────────────────────
function AdherencePanel({ patient, onClose }) {
    const [adherence, setAdherence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newReminder, setNewReminder] = useState({ medicine_name: '', total_stock: '30', reminder_time: '' });

    const source = patient.source || 'registered';

    const loadAdherence = () => {
        setLoading(true);
        api.get(`/meds/adherence/${source}/${patient.id}`)
            .then(res => setAdherence(Array.isArray(res.data) ? res.data : []))
            .catch(() => setAdherence([]))
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadAdherence(); }, [patient.id, source]);

    const createReminder = async (e) => {
        e.preventDefault();
        if (!newReminder.medicine_name.trim()) return;
        setSaving(true);
        try {
            await api.post('/meds/reminder', {
                patient_id: patient.id,
                patient_source: source,
                medicine_name: newReminder.medicine_name.trim(),
                total_stock: parseInt(newReminder.total_stock) || 30,
                remaining_stock: parseInt(newReminder.total_stock) || 30,
                reminder_time: newReminder.reminder_time || null,
            });
            // Dynamic import to avoid circular dependency
            const { default: toast } = await import('react-hot-toast');
            toast.success(`✅ Reminder created for ${newReminder.medicine_name}!`);
            setNewReminder({ medicine_name: '', total_stock: '30', reminder_time: '' });
            setShowAddForm(false);
            loadAdherence();
        } catch (err) {
            const { default: toast } = await import('react-hot-toast');
            toast.error(err.response?.data?.detail || 'Failed to create reminder');
        } finally {
            setSaving(false);
        }
    };

    // Hospital-wide totals across all reminders for this patient
    const totalTaken = adherence.reduce((s, r) => s + (r.taken_count || 0), 0);
    const totalMissed = adherence.reduce((s, r) => s + (r.missed_count || 0), 0);
    const totalLogs = totalTaken + totalMissed;
    const overallPct = calcPct(totalTaken, totalLogs);

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-end" onClick={onClose}>
            <div className="h-full w-full max-w-xl bg-white dark:bg-slate-800 shadow-2xl flex flex-col overflow-y-auto"
                onClick={e => e.stopPropagation()}>

                {/* Panel header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{patient.name}</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {source === 'registered' ? '🧑 Portal Patient' : '🩺 Manual Patient'} · ABHA: {patient.abha_id || '—'}
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 space-y-5 flex-1">
                    {loading ? <Spinner label="Fetching adherence data..." /> : (
                        <>
                            {/* Overall score card */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-slate-700 dark:text-slate-300 text-sm">Overall Medication Adherence</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{totalLogs} total logged doses · {adherence.length} medicine{adherence.length !== 1 ? 's' : ''}</p>
                                    </div>
                                    <span className={`text-4xl font-black ${pctColor(overallPct)}`}>{overallPct}%</span>
                                </div>
                                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                                    <div className={`h-full rounded-full transition-all duration-700 ${pctBarColor(overallPct)}`}
                                        style={{ width: `${overallPct}%` }} />
                                </div>
                                <div className="flex gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>Taken: {totalTaken}</span>
                                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span>Missed: {totalMissed}</span>
                                </div>
                                {totalLogs > 0 && (
                                    <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${overallPct >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50' :
                                        overallPct >= 50 ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700/50' :
                                            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50'
                                        }`}>
                                        {overallPct >= 80 ? '✅ Good compliance — patient is taking medicines regularly.' :
                                            overallPct >= 50 ? '⚠️ Moderate — patient missing some doses. Consider follow-up.' :
                                                '🚨 Poor compliance — frequent missed doses. Needs immediate attention.'}
                                    </div>
                                )}
                            </div>

                            {/* ── Add Reminder Form ── */}
                            {showAddForm && (
                                <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/50 rounded-xl p-4">
                                    <p className="font-semibold text-sky-800 dark:text-sky-200 text-sm mb-3">➕ Add Medication Reminder</p>
                                    <form onSubmit={createReminder} className="space-y-3">
                                        <div>
                                            <label className="text-xs text-slate-500 mb-1 block">Medicine Name *</label>
                                            <input required value={newReminder.medicine_name}
                                                onChange={e => setNewReminder(r => ({ ...r, medicine_name: e.target.value }))}
                                                placeholder="e.g. Metformin 500mg"
                                                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-slate-500 mb-1 block">Total Stock (tablets)</label>
                                                <input type="number" min="1" max="999" value={newReminder.total_stock}
                                                    onChange={e => setNewReminder(r => ({ ...r, total_stock: e.target.value }))}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 mb-1 block">Default Alarm Time</label>
                                                <input type="time" value={newReminder.reminder_time}
                                                    onChange={e => setNewReminder(r => ({ ...r, reminder_time: e.target.value }))}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button type="submit" disabled={saving}
                                                className="flex-1 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors">
                                                {saving ? 'Saving...' : '✅ Create Reminder'}
                                            </button>
                                            <button type="button" onClick={() => setShowAddForm(false)}
                                                className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm transition-colors">
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* Per-medicine accordion */}
                            {adherence.length === 0 ? (
                                <div className="text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
                                    <div className="text-4xl mb-3">💊</div>
                                    <p className="text-slate-600 dark:text-slate-300 font-semibold">No medication reminders yet</p>
                                    <p className="text-slate-400 text-sm mt-1 mb-4">Create the first reminder below — patient will set their alarm time</p>
                                    <button onClick={() => setShowAddForm(true)}
                                        className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm transition-colors shadow-sm">
                                        ➕ Add First Reminder
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">💊 Per-Medicine Adherence</p>
                                        <button onClick={() => setShowAddForm(!showAddForm)}
                                            className="text-xs px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-700 hover:bg-sky-100 transition-colors font-semibold">
                                            ➕ Add Reminder
                                        </button>
                                    </div>
                                    {adherence.map(r => {
                                        const medPct = calcPct(r.taken_count, r.total_logs);
                                        const stockPct = r.total_stock
                                            ? Math.max(0, (r.remaining_stock / r.total_stock) * 100)
                                            : 0;
                                        const isOpen = expanded === r.reminder_id;
                                        const logs = Array.isArray(r.log_history) ? r.log_history : [];

                                        return (
                                            <div key={r.reminder_id}
                                                className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                                {/* Header row */}
                                                <button
                                                    onClick={() => setExpanded(isOpen ? null : r.reminder_id)}
                                                    className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center flex-shrink-0">
                                                            <span className="text-sm">💊</span>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{r.medicine_name}</p>
                                                            <p className="text-xs text-slate-400">Alarm: {r.reminder_time || 'Not set'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                                        <div className="text-right">
                                                            <p className={`font-black text-lg ${pctColor(medPct)}`}>{r.total_logs > 0 ? `${medPct}%` : '—'}</p>
                                                            <p className="text-xs text-slate-400">{r.taken_count || 0}✅ {r.missed_count || 0}❌</p>
                                                        </div>
                                                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </button>

                                                {isOpen && (
                                                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-700 space-y-3">
                                                        {/* Stock bar */}
                                                        <div>
                                                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                                <span>Stock Remaining</span>
                                                                <span className="font-medium">{r.remaining_stock} / {r.total_stock} tablets</span>
                                                            </div>
                                                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                                <div className={`h-full rounded-full ${stockBarColor(r.remaining_stock, r.total_stock)}`}
                                                                    style={{ width: `${stockPct}%` }} />
                                                            </div>
                                                            {r.remaining_stock === 0 && (
                                                                <p className="text-red-600 text-xs mt-1">🚨 Out of stock — patient cannot take this medicine</p>
                                                            )}
                                                            {r.remaining_stock > 0 && r.remaining_stock <= 2 && (
                                                                <p className="text-orange-600 text-xs mt-1">⚠️ Low stock — advise patient to refill soon</p>
                                                            )}
                                                        </div>

                                                        {/* Dose log */}
                                                        {logs.length === 0 ? (
                                                            <p className="text-slate-400 text-xs text-center py-3">No dose logs recorded yet</p>
                                                        ) : (
                                                            <div>
                                                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide mb-2">📅 Dose Log</p>
                                                                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                                                    {logs.map((log, i) => (
                                                                        <div key={i} className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-700/30 rounded-lg px-3 py-2">
                                                                            <span className="text-slate-600 dark:text-slate-400 font-medium">
                                                                                {log.date ? new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                                                            </span>
                                                                            <StatusBadge status={log.status} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Main Adherence Page ──────────────────────────────────────
export default function Adherence() {
    const [patients, setPatients] = useState([]);
    const [summary, setSummary] = useState({}); // { patientId: { adh%, taken, missed } }
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all | good | moderate | poor
    const [selected, setSelected] = useState(null);

    // Load patient list — try registered patients endpoint
    const load = useCallback(async () => {
        setLoading(true);
        try {
            // /meds/patients/all returns all patients with medication reminders
            const res = await api.get('/meds/patients/all');
            const pts = Array.isArray(res.data) ? res.data : [];
            setPatients(pts);

            // For each patient, fetch their adherence summary
            const sumMap = {};
            await Promise.allSettled(
                pts.map(async p => {
                    const src = p.source || 'registered';
                    try {
                        const r = await api.get(`/meds/adherence/${src}/${p.id}`);
                        const data = Array.isArray(r.data) ? r.data : [];
                        const taken = data.reduce((s, x) => s + (x.taken_count || 0), 0);
                        const missed = data.reduce((s, x) => s + (x.missed_count || 0), 0);
                        const total = taken + missed;
                        sumMap[p.id] = {
                            taken,
                            missed,
                            total,
                            pct: calcPct(taken, total),
                            meds: data.length,
                        };
                    } catch {
                        sumMap[p.id] = { taken: 0, missed: 0, total: 0, pct: 0, meds: 0 };
                    }
                })
            );
            setSummary(sumMap);
        } catch {
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    // Stats
    const withData = patients.filter(p => (summary[p.id]?.total || 0) > 0);
    const avgPct = withData.length ? Math.round(withData.reduce((s, p) => s + (summary[p.id]?.pct || 0), 0) / withData.length) : 0;
    const goodCount = withData.filter(p => (summary[p.id]?.pct || 0) >= 80).length;
    const poorCount = withData.filter(p => (summary[p.id]?.pct || 0) < 50).length;

    // Filter + search
    const displayed = patients.filter(p => {
        const name = (p.name || '').toLowerCase();
        if (search && !name.includes(search.toLowerCase())) return false;
        const pct = summary[p.id]?.pct ?? 0;
        const hasData = (summary[p.id]?.total || 0) > 0;
        if (filter === 'good') return pct >= 80;
        if (filter === 'moderate') return pct >= 50 && pct < 80;
        if (filter === 'poor') return pct < 50 && hasData;
        return true;
    });

    return (
        <div className="space-y-6">

            {/* ── Summary Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Patients', value: patients.length, sub: 'Under monitoring', color: 'text-slate-800 dark:text-slate-100' },
                    { label: 'Avg. Adherence', value: `${avgPct}%`, sub: 'Across all patients', color: pctColor(avgPct) },
                    { label: 'Good Compliance', value: goodCount, sub: '≥ 80% adherence', color: 'text-emerald-600 dark:text-emerald-400' },
                    { label: 'Poor Compliance', value: poorCount, sub: '< 50% — needs attention', color: 'text-red-600 dark:text-red-400' },
                ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-0.5">{s.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* ── Overall bar ── */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Overall Adherence Rate</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Based on {withData.length} patients with recorded doses</p>
                    </div>
                    <span className={`text-3xl font-black ${pctColor(avgPct)}`}>{avgPct}%</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${pctBarColor(avgPct)}`} style={{ width: `${avgPct}%` }} />
                </div>
                <div className="flex gap-6 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Good (≥80%): {goodCount}</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>Moderate (50-79%): {withData.length - goodCount - poorCount}</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>Poor (&lt;50%): {poorCount}</span>
                </div>
            </div>

            {/* ── Patient table ── */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">Patient Compliance Monitor</h2>
                    <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input value={search} onChange={e => setSearch(e.target.value)}
                                placeholder="Search patient..."
                                className="pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 w-44" />
                        </div>
                        <div className="flex gap-1.5">
                            {[
                                { key: 'all', label: 'All' },
                                { key: 'good', label: '✅ Good' },
                                { key: 'moderate', label: '⚠️ Moderate' },
                                { key: 'poor', label: '🚨 Poor' },
                            ].map(f => (
                                <button key={f.key} onClick={() => setFilter(f.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.key ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? <Spinner label="Loading patients..." /> : displayed.length === 0 ? (
                    <div className="text-center py-14">
                        <div className="text-5xl mb-4">🩺</div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No patients found</p>
                        <p className="text-slate-400 text-sm mt-1">
                            {patients.length === 0
                                ? 'No patients have been seen by this doctor yet. Use the Doctor Dashboard to search and view a patient first.'
                                : 'Try changing the filter or search term.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-700">
                                    {['Patient', 'Type', 'Medicines', 'Taken', 'Missed', 'Adherence', 'Compliance', ''].map(h => (
                                        <th key={h} className="text-left text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide px-4 py-3 first:pl-5 last:pr-5">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {displayed.map(p => {
                                    const s = summary[p.id] || {};
                                    const pct = s.pct || 0;
                                    return (
                                        <tr key={p.id}
                                            onClick={() => setSelected(p)}
                                            className="cursor-pointer hover:bg-sky-50 dark:hover:bg-sky-900/10 transition-colors">
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/40 flex items-center justify-center text-sky-700 dark:text-sky-300 font-bold text-sm flex-shrink-0">
                                                        {(p.name?.[0] || '?').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{p.name}</p>
                                                        <p className="text-xs text-slate-400">{p.abha_id || `ID: ${p.id}`}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${(p.source || 'registered') === 'registered'
                                                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                                                    }`}>
                                                    {(p.source || 'registered') === 'registered' ? '🧑 Portal' : '🩺 Manual'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{s.meds || 0}</td>
                                            <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">{s.taken || 0}</td>
                                            <td className="px-4 py-3 font-semibold text-red-600 dark:text-red-400">{s.missed || 0}</td>
                                            <td className="px-4 py-3">
                                                {s.total > 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <div className={`h-full rounded-full ${pctBarColor(pct)}`} style={{ width: `${pct}%` }} />
                                                        </div>
                                                        <span className={`text-sm font-bold ${pctColor(pct)}`}>{pct}%</span>
                                                    </div>
                                                ) : <span className="text-slate-300 dark:text-slate-600 text-xs">No data</span>}
                                            </td>
                                            <td className="px-4 py-3">
                                                {s.total > 0 ? (
                                                    pct >= 80 ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Good</span> :
                                                        pct >= 50 ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Moderate</span> :
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Poor</span>
                                                ) : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">No Data</span>}
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={e => { e.stopPropagation(); setSelected(p); }}
                                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-700 transition-colors">
                                                    View →
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slide panel */}
            {selected && <AdherencePanel patient={selected} onClose={() => setSelected(null)} />}
        </div>
    );
}
