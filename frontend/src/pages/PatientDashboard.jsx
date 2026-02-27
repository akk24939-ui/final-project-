import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import DrAIButton from '../components/DrAIButton';

const API = axios.create({ baseURL: 'http://localhost:8000' });

const TIPS = [
    'Drink at least 8 glasses of water daily.',
    'Walk 30 minutes every day to keep your heart healthy.',
    'Sleep 7–8 hours every night for optimal recovery.',
    'Eat fruits and vegetables — aim for 5 servings daily.',
    'Monitor your blood pressure regularly if you are above 40.',
    'Avoid processed food — cook at home more often.',
    'Regular check-ups can catch diseases early.',
];

// Mobile nav tabs
const TABS = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'meds', label: 'Medicines', icon: '💊' },
    { id: 'records', label: 'Records', icon: '📋' },
    { id: 'labs', label: 'Labs', icon: '🧪' },
    { id: 'rx', label: 'Rx', icon: '📄' },
    { id: 'profile', label: 'Profile', icon: '👤' },
];

// ── Vital color helpers ──────────────────────────────────────
const bpColor = bp => {
    if (!bp) return 'text-slate-400';
    const sys = parseInt(bp.split('/')[0]);
    if (sys > 140) return 'text-red-600';
    if (sys > 120) return 'text-amber-600';
    return 'text-emerald-600';
};
const sugarColor = s => {
    if (!s) return 'text-slate-400';
    const val = parseInt(s);
    if (val > 200) return 'text-red-600';
    if (val > 140) return 'text-amber-600';
    return 'text-emerald-600';
};

// ── Spinner ──────────────────────────────────────────────────
function CardSpinner({ label = 'Loading...' }) {
    return (
        <div className="flex items-center justify-center py-12 gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-sky-600 border-t-transparent" />
            <span className="text-slate-400 text-sm">{label}</span>
        </div>
    );
}

function Empty({ icon, title, subtitle }) {
    return (
        <div className="text-center py-10">
            <div className="text-5xl mb-3">{icon}</div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">{title}</p>
            {subtitle && <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 max-w-xs mx-auto">{subtitle}</p>}
        </div>
    );
}

// ── Section wrapper ──────────────────────────────────────────
function Card({ title, badge, count, children, className = '' }) {
    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}>
            {title && (
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm sm:text-base">
                        {title}
                        {badge && (
                            <span className="text-xs font-normal text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700">
                                {badge}
                            </span>
                        )}
                    </h3>
                    {count !== undefined && <span className="text-xs text-slate-400">{count}</span>}
                </div>
            )}
            <div className="p-4 sm:p-6">{children}</div>
        </div>
    );
}

// ── Health Tip banner ────────────────────────────────────────
function HealthTip() {
    const tip = TIPS[new Date().getDay() % TIPS.length];
    return (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/50 rounded-2xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
                <p className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wide mb-0.5">Today's Health Tip</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{tip}</p>
            </div>
        </div>
    );
}

// ── Profile section ──────────────────────────────────────────
function ProfileSection({ patient }) {
    const fields = [
        { label: 'ABHA ID', value: patient.abha_id, icon: '🪪' },
        { label: 'Blood Group', value: patient.blood_group || '—', icon: '🩸' },
        { label: 'Phone', value: patient.phone || '—', icon: '📞' },
        { label: 'Emergency Contact', value: patient.emergency_contact || '—', icon: '🚨' },
    ];
    return (
        <div className="space-y-4">
            {/* Identity card */}
            <Card>
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-sky-600 flex items-center justify-center text-white text-2xl font-black shadow-sm flex-shrink-0">
                        {patient.name?.[0] || 'P'}
                    </div>
                    <div>
                        <h2 className="text-slate-800 dark:text-slate-100 text-xl font-bold">{patient.name}</h2>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                            🟢 Active Patient
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {fields.map(f => (
                        <div key={f.label} className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3 border border-slate-200 dark:border-slate-600">
                            <p className="text-xs text-slate-400 mb-0.5">{f.icon} {f.label}</p>
                            <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm break-all">{f.value}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Medical info */}
            <Card title="📋 Medical Information">
                <div className="space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4">
                        <p className="text-xs text-amber-600 dark:text-amber-400 mb-1 font-medium">⚠️ Known Allergies</p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{patient.allergies || 'None reported'}</p>
                    </div>
                    <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/50 rounded-xl p-4">
                        <p className="text-xs text-sky-600 dark:text-sky-400 mb-1 font-medium">📝 Medical Notes</p>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{patient.medical_notes || 'No notes on file'}</p>
                    </div>
                </div>
            </Card>

            {/* ABHA Card */}
            <Card title="🆔 ABHA Digital Health Card">
                <div className="bg-gradient-to-br from-sky-600 to-blue-700 rounded-xl p-5 text-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sky-200 text-xs">Ayushman Bharat Health Account</p>
                            <p className="text-white font-extrabold text-lg tracking-widest mt-0.5 break-all">{patient.abha_id}</p>
                        </div>
                        <div className="text-3xl">🇮🇳</div>
                    </div>
                    <div className="border-t border-white/20 pt-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold flex-shrink-0">
                            {patient.name?.[0]}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{patient.name}</p>
                            <p className="text-sky-200 text-xs">Blood: {patient.blood_group || '—'}</p>
                        </div>
                    </div>
                </div>
                <a href="https://abha.abdm.gov.in/abha/v3/register" target="_blank" rel="noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-sky-600 hover:border-sky-300 text-sm transition-all">
                    🔗 Manage on ABDM Portal ↗
                </a>
            </Card>

            {/* Quick Links */}
            <Card title="🔗 Quick Links">
                <div className="space-y-2">
                    {[
                        { icon: '📋', label: 'ABHA Registration', href: 'https://abha.abdm.gov.in/abha/v3/register' },
                        { icon: '🏥', label: 'Find ABDM Hospitals', href: 'https://facility.ndhm.gov.in/' },
                        { icon: '💊', label: 'Health Locker', href: 'https://healthlocker.abdm.gov.in/' },
                        { icon: '📞', label: 'Health Helpline: 104', href: 'tel:104' },
                    ].map(l => (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                            className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/40 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-600 hover:border-sky-200 transition-all group">
                            <span className="text-lg">{l.icon}</span>
                            <span className="text-slate-600 dark:text-slate-400 group-hover:text-sky-700 dark:group-hover:text-sky-300 text-sm transition-colors">{l.label}</span>
                            <span className="ml-auto text-slate-400 text-xs">↗</span>
                        </a>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// ── Medication Reminders section ─────────────────────────────
function MedsSection({ patientId, token }) {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editTime, setEditTime] = useState({});
    const [alerted, setAlerted] = useState({});

    const load = useCallback(() => {
        API.get(`/meds/reminders/registered/${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setReminders(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [patientId, token]);

    useEffect(() => {
        load();
        const interval = setInterval(() => {
            const now = new Date();
            const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            setReminders(prev => {
                prev.forEach(r => {
                    if (r.reminder_time && r.reminder_time === hhmm && !alerted[r.id]) {
                        toast(`⏰ Time to take ${r.medicine_name}!`, { icon: '💊', duration: 10000 });
                        if (Notification.permission === 'granted') {
                            new Notification('💊 VitaSage AI Reminder', { body: `Time to take ${r.medicine_name}`, icon: '/favicon.ico' });
                        } else if (Notification.permission !== 'denied') {
                            Notification.requestPermission().then(p => {
                                if (p === 'granted') new Notification('💊 VitaSage AI', { body: `Time to take ${r.medicine_name}` });
                            });
                        }
                        setAlerted(a => ({ ...a, [r.id]: hhmm }));
                    }
                });
                return prev;
            });
        }, 30000);
        return () => clearInterval(interval);
    }, [patientId, token, alerted, load]);

    const updateTime = async (id) => {
        const t = editTime[id];
        if (!t) return;
        try {
            await API.put(`/meds/reminder/${id}/time`, { reminder_time: t }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Alarm time updated 🔔');
            load();
        } catch { toast.error('Could not update time'); }
    };

    const markTaken = async (r) => {
        try {
            const res = await API.post(`/meds/taken/${r.id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            toast.success(res.data.message, { icon: '✅', duration: 5000 });
            if (res.data.remaining_stock === 0) {
                toast.error('🚨 Out of Stock! Consult your doctor or pharmacy.', { duration: 8000 });
            } else if (res.data.remaining_stock <= 2) {
                toast(`⚠️ Low Stock: Only ${res.data.remaining_stock} left — refill soon!`, { icon: '⚠️', duration: 8000 });
            }
            load();
        } catch { toast.error('Could not mark as taken'); }
    };

    const stockColor = (rem, total) => {
        if (!total) return 'bg-slate-200';
        const p = rem / total;
        if (p <= 0) return 'bg-red-500';
        if (p <= 0.25) return 'bg-orange-500';
        if (p <= 0.5) return 'bg-amber-400';
        return 'bg-emerald-500';
    };

    if (loading) return <CardSpinner label="Loading medicines..." />;

    if (reminders.length === 0) return (
        <Empty icon="⏰" title="No reminders set." subtitle="Your doctor will set reminders from your prescriptions." />
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reminders.map(r => {
                const stockPct = r.total_stock ? Math.max(0, (r.remaining_stock / r.total_stock) * 100) : 0;
                const isOut = r.remaining_stock === 0;
                const isLow = r.remaining_stock > 0 && r.remaining_stock <= 2;
                const takenToday = r.today_status === 'taken';
                const totalDoses = (r.taken_count || 0) + (r.missed_count || 0);
                const adh = totalDoses > 0 ? Math.round((r.taken_count / totalDoses) * 100) : 0;

                return (
                    <div key={r.id} className={`rounded-2xl p-4 border ${isOut ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/50' :
                        isLow ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/50' :
                            'bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600'
                        }`}>
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 text-base truncate">{r.medicine_name}</p>
                                <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                    {takenToday
                                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">✅ Taken Today</span>
                                        : <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">⏳ Pending</span>}
                                    {isOut && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">🚨 Out</span>}
                                    {isLow && <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">⚠️ Low</span>}
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-3">
                                <p className="text-xs text-slate-400">Adherence</p>
                                <p className={`text-lg font-black ${adh >= 80 ? 'text-emerald-600' : adh >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                    {totalDoses > 0 ? `${adh}%` : '—'}
                                </p>
                            </div>
                        </div>

                        {/* Stock bar */}
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                                <span>Stock Remaining</span>
                                <span className="font-medium">{r.remaining_stock} / {r.total_stock} tablets</span>
                            </div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500 ${stockColor(r.remaining_stock, r.total_stock)}`}
                                    style={{ width: `${stockPct}%` }} />
                            </div>
                        </div>

                        {/* Alarm setter — touch-friendly */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm">🔔</span>
                            <input type="time" defaultValue={r.reminder_time || ''}
                                onChange={e => setEditTime(t => ({ ...t, [r.id]: e.target.value }))}
                                className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                            <button onClick={() => updateTime(r.id)}
                                className="px-4 py-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 hover:bg-sky-200 border border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300 text-sm font-semibold transition-all">
                                Set
                            </button>
                        </div>

                        {/* Mark Taken — large touch target */}
                        <button onClick={() => markTaken(r)} disabled={takenToday || isOut}
                            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${takenToday ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 text-emerald-600 cursor-default' :
                                isOut ? 'bg-slate-100 dark:bg-slate-700 border border-slate-200 text-slate-400 cursor-not-allowed' :
                                    'bg-sky-600 hover:bg-sky-700 text-white shadow-sm shadow-sky-200'
                                }`}>
                            {takenToday ? '✅ Already Taken Today' : isOut ? '🚨 Out of Stock' : '✅ Mark as Taken'}
                        </button>

                        <div className="flex gap-4 mt-2 justify-center text-xs text-slate-400">
                            <span>✅ {r.taken_count || 0} taken</span>
                            <span>❌ {r.missed_count || 0} missed</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ── Medical History Timeline ─────────────────────────────────
function RecordsSection({ patientId, token }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/medical-records/patient-records/registered/${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setRecords(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [patientId, token]);

    const downloadFile = (id, fname) => {
        const a = document.createElement('a');
        a.href = `http://localhost:8000/medical-records/download/${id}`;
        a.download = fname; a.click();
        toast.success(`Downloading ${fname}`);
    };

    if (loading) return <CardSpinner label="Loading records..." />;
    if (records.length === 0) return <Empty icon="🩺" title="No medical records yet." subtitle="Your doctor will upload records after your visit." />;

    return (
        <div className="space-y-5">
            {records.map((r, i) => (
                <div key={r.id} className={`relative pl-6 ${i < records.length - 1 ? 'pb-5 border-l-2 border-slate-200 dark:border-slate-700' : ''}`}>
                    <div className={`absolute left-0 top-2 w-3 h-3 rounded-full -translate-x-[7px] border-2 ${r.uploaded_by_role === 'doctor' ? 'bg-sky-500 border-sky-400' : 'bg-emerald-500 border-emerald-400'
                        }`} />
                    <div className={`rounded-xl p-4 border ${r.uploaded_by_role === 'doctor'
                        ? 'bg-sky-50 dark:bg-sky-900/10 border-sky-100 dark:border-sky-800/50'
                        : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50'
                        }`}>
                        <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.uploaded_by_role === 'doctor'
                                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                    }`}>
                                    {r.uploaded_by_role === 'doctor' ? '🩺 Doctor' : '👩‍⚕️ Staff'}
                                </span>
                                {r.uploader_name && <span className="text-slate-500 text-xs">{r.uploader_name}</span>}
                                {r.file_category && <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">{r.file_category}</span>}
                            </div>
                            <span className="text-slate-400 text-xs flex-shrink-0">
                                {new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        {(r.sugar_level || r.blood_pressure) && (
                            <div className="flex items-center gap-4 mb-3 bg-white dark:bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700">
                                {r.sugar_level && <div className="flex items-center gap-1.5"><span className="text-slate-400 text-xs">🩸 Sugar</span><span className={`text-xs font-bold ${sugarColor(r.sugar_level)}`}>{r.sugar_level} mg/dL</span></div>}
                                {r.blood_pressure && <div className="flex items-center gap-1.5"><span className="text-slate-400 text-xs">💓 BP</span><span className={`text-xs font-bold ${bpColor(r.blood_pressure)}`}>{r.blood_pressure}</span></div>}
                            </div>
                        )}
                        {r.diagnosis && <div className="mb-2"><p className="text-xs text-slate-400 mb-0.5">Diagnosis</p><p className="text-slate-800 dark:text-slate-100 text-sm leading-relaxed">{r.diagnosis}</p></div>}
                        {r.suggestion && <div className="mb-2"><p className="text-xs text-slate-400 mb-0.5">Doctor's Suggestion</p><p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{r.suggestion}</p></div>}
                        {r.file_name && (
                            <button onClick={() => downloadFile(r.id, r.file_name)}
                                className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 border border-slate-200 dark:border-slate-600 transition-all group w-full sm:w-auto">
                                <span>{r.file_name.endsWith('.pdf') ? '📄' : '🖼️'}</span>
                                <span className="text-slate-600 dark:text-slate-300 text-sm truncate">{r.file_name}</span>
                                <span className="ml-auto text-slate-400 text-xs">⬇ Download</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Lab Reports Section (Patient View) ──────────────────────
function LabSection({ patientId, token }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/lab/patient/registered/${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setReports(Array.isArray(res.data) ? res.data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [patientId, token]);

    if (loading) return <CardSpinner label="Loading lab reports..." />;
    if (reports.length === 0) return <Empty icon="🧪" title="No lab reports yet." subtitle="Lab reports uploaded by staff/doctors will appear here." />;

    return (
        <div className="space-y-4">
            {reports.map(r => (
                <div key={r.id} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{r.test_name}</p>
                            <p className="text-xs text-slate-400 mt-0.5">
                                🧑‍⚕️ {r.staff_name || 'Hospital Staff'} · {r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                            </p>
                        </div>
                        {r.file_name && (
                            <a href={`http://localhost:8000/lab/download/${r.id}`}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 text-xs font-medium border border-sky-200 dark:border-sky-700 transition-colors">
                                ⬇ {r.file_name.length > 20 ? r.file_name.slice(0, 20) + '...' : r.file_name}
                            </a>
                        )}
                    </div>
                    {r.test_results && Object.keys(r.test_results).length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {Object.entries(r.test_results).map(([k, v]) => (
                                <div key={k} className="bg-slate-50 dark:bg-slate-700/40 rounded-lg px-3 py-2">
                                    <p className="text-xs text-slate-400">{k}</p>
                                    <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm">{v}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    {r.remarks && <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 italic border-t border-slate-100 dark:border-slate-700 pt-2">💬 {r.remarks}</p>}
                </div>
            ))}
        </div>
    );
}
function RxSection({ patientId, token }) {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        API.get(`/rx/patient/registered/${patientId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setPrescriptions(res.data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [patientId, token]);

    const printRx = (rx) => {
        const win = window.open('', '_blank');
        const meds = Array.isArray(rx.medicines) ? rx.medicines : [];
        win.document.write(`<html><head><title>Prescription ${rx.rx_number}</title>
            <style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:auto}h1{color:#1a1a2e;font-size:22px;border-bottom:2px solid #0284c7;padding-bottom:10px}.badge{background:#0284c7;color:#fff;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#f0f9ff;padding:8px;text-align:left;font-size:12px;color:#475569}td{padding:8px;border-bottom:1px solid #e2e8f0;font-size:13px}.section{margin-top:18px}.label{font-size:11px;color:#64748b;font-weight:bold;text-transform:uppercase}.sig{margin-top:40px;border-top:1px solid #e2e8f0;padding-top:16px;font-size:12px;color:#64748b}@media print{.no-print{display:none}}</style>
            </head><body>
            <h1>🏥 VitaSage AI — Prescription</h1>
            <p><span class='badge'>${rx.rx_number || 'N/A'}</span> &nbsp;<strong>Doctor:</strong> ${rx.digital_signature || rx.doctor_name || 'Doctor'} &nbsp;<strong>Date:</strong> ${new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <div class='section'><p class='label'>Diagnosis</p><p>${rx.diagnosis}</p></div>
            <table><tr><th>Medicine</th><th>Dosage</th><th>Frequency</th><th>Duration</th><th>Instructions</th></tr>
            ${meds.map(m => `<tr><td><b>${m.medicine_name}</b></td><td>${m.dosage}</td><td>${m.frequency}</td><td>${m.duration}</td><td>${m.instructions || '—'}</td></tr>`).join('')}</table>
            ${rx.advice ? `<div class='section'><p class='label'>Advice</p><p>${rx.advice}</p></div>` : ''}
            ${rx.follow_up_date ? `<div class='section'><p class='label'>Follow-up</p><p>${rx.follow_up_date}</p></div>` : ''}
            <div class='sig'>Digitally signed · ${rx.digital_signature || ''} · VitaSage AI EMR</div>
            <script>window.onload=()=>window.print()<\/script></body></html>`);
        win.document.close();
    };

    if (loading) return <CardSpinner label="Loading prescriptions..." />;
    if (prescriptions.length === 0) return <Empty icon="💊" title="No prescriptions yet." subtitle="Prescriptions written by your doctor will appear here." />;

    return (
        <div className="space-y-3">
            {prescriptions.map((rx) => {
                const meds = Array.isArray(rx.medicines) ? rx.medicines : [];
                const isOpen = expanded === rx.id;
                return (
                    <div key={rx.id} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
                        <button onClick={() => setExpanded(isOpen ? null : rx.id)}
                            className="w-full flex items-center justify-between px-4 sm:px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors text-left">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-mono flex-shrink-0">
                                    {rx.rx_number || 'RX'}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm truncate">{rx.diagnosis}</p>
                                    <p className="text-slate-400 text-xs mt-0.5 truncate">{rx.digital_signature || rx.doctor_name} · {new Date(rx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                <span className="text-xs text-slate-400 hidden sm:block">{meds.length} med{meds.length !== 1 ? 's' : ''}</span>
                                <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {isOpen && (
                            <div className="px-4 sm:px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4 space-y-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                                        🩺 {rx.digital_signature || rx.doctor_name}
                                    </span>
                                    <span className="text-slate-400 text-xs">{new Date(rx.created_at).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-700/30 rounded-xl px-4 py-3">
                                    <p className="text-xs text-slate-400 mb-0.5">📋 Diagnosis</p>
                                    <p className="text-slate-800 dark:text-slate-100 font-medium leading-relaxed">{rx.diagnosis}</p>
                                </div>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">💊 Medicines Prescribed</p>
                                <div className="space-y-2">
                                    {meds.map((m, idx) => (
                                        <div key={idx} className="bg-slate-50 dark:bg-slate-700/30 rounded-xl px-4 py-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                                                <span className="text-slate-800 dark:text-slate-100 font-semibold">{m.medicine_name}</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                                <div><p className="text-xs text-slate-400">Dosage</p><p className="text-slate-700 dark:text-slate-300 font-medium">{m.dosage}</p></div>
                                                <div><p className="text-xs text-slate-400">Frequency</p><p className="text-slate-700 dark:text-slate-300 font-medium">{m.frequency}</p></div>
                                                <div><p className="text-xs text-slate-400">Duration</p><p className="text-slate-700 dark:text-slate-300 font-medium">{m.duration}</p></div>
                                                {m.instructions && <div><p className="text-xs text-slate-400">Instructions</p><p className="text-emerald-600 dark:text-emerald-400 font-medium">{m.instructions}</p></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {rx.advice && (
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl px-4 py-3">
                                        <p className="text-xs text-amber-600 mb-0.5">🗒️ Doctor's Advice</p>
                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{rx.advice}</p>
                                    </div>
                                )}
                                {rx.follow_up_date && (
                                    <div className="flex items-center gap-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/50 rounded-xl px-4 py-3">
                                        <span className="text-sky-600 text-lg">📅</span>
                                        <div><p className="text-xs text-sky-500">Follow-up Date</p><p className="text-slate-800 dark:text-slate-100 font-semibold">{rx.follow_up_date}</p></div>
                                    </div>
                                )}
                                <button onClick={() => printRx(rx)}
                                    className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm">
                                    📄 Download / Print PDF
                                </button>
                                <p className="text-center text-slate-400 text-xs">🔒 Immutable · Digitally signed</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ── Main Patient Dashboard ────────────────────────────────────
export default function PatientDashboard() {
    const navigate = useNavigate();
    const [fullProfile, setFullProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);

    const [patient] = useState(() => {
        try { return JSON.parse(localStorage.getItem('pt_user') || 'null'); } catch { return null; }
    });
    const [token] = useState(() => localStorage.getItem('pt_token'));
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    useEffect(() => {
        if (!token || !patient) navigate('/patient-login');
    }, [token, patient, navigate]);

    useEffect(() => {
        if (!token || !patient) return;
        API.get(`/patient/profile/${patient.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setFullProfile(res.data)).catch(() => { });
    }, [token, patient?.id]);

    const logout = () => {
        localStorage.removeItem('pt_token');
        localStorage.removeItem('pt_user');
        navigate('/');
        toast.success('Logged out');
    };

    if (!patient || !token) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-sky-600 border-t-transparent" />
        </div>
    );

    const displayData = fullProfile || patient;

    // What to show in the main area
    const renderContent = () => {
        switch (activeTab) {
            case 'meds':
                return (
                    <Card title="⏰ Medication Reminders" badge="Smart Alarm">
                        <MedsSection patientId={patient.id} token={token} />
                    </Card>
                );
            case 'records':
                return (
                    <Card title="📅 Medical History">
                        <RecordsSection patientId={patient.id} token={token} />
                    </Card>
                );
            case 'labs':
                return (
                    <Card title="🧪 Lab Reports" badge="View Only">
                        <LabSection patientId={patient.id} token={token} />
                    </Card>
                );
            case 'rx':
                return (
                    <Card title="💊 My Prescriptions" badge="View Only">
                        <RxSection patientId={patient.id} token={token} />
                    </Card>
                );
            case 'profile':
                return <ProfileSection patient={displayData} />;
            default: // home
                return (
                    <div className="space-y-4">
                        {/* Welcome */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-sm">
                                {patient.name?.[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                    Welcome, {patient.name?.split(' ')[0]}! 👋
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5 truncate">
                                    ABHA: <span className="font-mono text-sky-600 dark:text-sky-400">{patient.abha_id}</span>
                                </p>
                            </div>
                        </div>

                        {/* Health Tip */}
                        <HealthTip />

                        {/* Quick Action Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { tab: 'meds', icon: '💊', label: 'Medicines', color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300' },
                                { tab: 'records', icon: '📋', label: 'Records', color: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300' },
                                { tab: 'rx', icon: '📄', label: 'Rx', color: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300' },
                                { tab: 'profile', icon: '👤', label: 'Profile', color: 'bg-slate-50 dark:bg-slate-700/40 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300' },
                            ].map(q => (
                                <button key={q.tab} onClick={() => setActiveTab(q.tab)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${q.color} transition-all hover:scale-105 active:scale-95`}>
                                    <span className="text-2xl">{q.icon}</span>
                                    <span className="text-sm font-semibold">{q.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Date */}
                        <p className="text-center text-slate-400 text-xs">{today}</p>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
            <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', fontSize: '14px' } }} />

            {/* ───────── DESKTOP LAYOUT (md+) ───────── */}
            <div className="hidden md:flex min-h-screen">
                {/* Left sidebar */}
                <aside className="w-64 flex-shrink-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen sticky top-0">
                    {/* Logo */}
                    <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shadow-sm flex-shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-bold text-sm text-slate-800 dark:text-slate-100">VitaSage AI</p>
                            <p className="text-xs text-slate-400">Patient Portal</p>
                        </div>
                    </div>

                    {/* User chip */}
                    <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700 rounded-xl px-3 py-2.5">
                            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                {patient.name?.[0]}
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm truncate">{patient.name}</p>
                                <p className="text-sky-600 dark:text-sky-400 font-mono text-xs truncate">{patient.abha_id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 py-4 px-3 space-y-0.5">
                        {[
                            { id: 'home', icon: '🏠', label: 'Home' },
                            { id: 'meds', icon: '💊', label: 'Medication Reminders' },
                            { id: 'records', icon: '📋', label: 'Medical Records' },
                            { id: 'labs', icon: '🧪', label: 'Lab Reports' },
                            { id: 'rx', icon: '📄', label: 'Prescriptions' },
                            { id: 'profile', icon: '👤', label: 'My Profile' },
                        ].map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${activeTab === item.id
                                    ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                                    }`}>
                                <span className="text-base">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    {/* Logout */}
                    <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                        <button onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {/* Desktop topbar */}
                    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
                        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100 capitalize">
                            {TABS.find(t => t.id === activeTab)?.label || 'Home'}
                        </h1>
                        <p className="text-slate-400 text-sm hidden lg:block">{today}</p>
                    </header>

                    <main className="flex-1 p-6">
                        <div className="max-w-4xl mx-auto">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>

            {/* ───────── MOBILE LAYOUT (< md) ───────── */}
            <div className="md:hidden flex flex-col min-h-screen pb-20">
                {/* Mobile topbar */}
                <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 h-14 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                            {patient.name?.[0]}
                        </div>
                        <div>
                            <p className="text-slate-800 dark:text-slate-100 font-semibold text-sm leading-tight">{patient.name}</p>
                            <p className="text-sky-600 dark:text-sky-400 font-mono text-xs">{patient.abha_id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">🟢 Active</span>
                        <button onClick={logout}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Mobile content */}
                <main className="flex-1 px-4 py-4 space-y-4">
                    {renderContent()}
                </main>

                {/* Mobile bottom navigation bar */}
                <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
                    <div className="flex items-stretch h-16">
                        {TABS.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${activeTab === tab.id
                                    ? 'text-sky-600 dark:text-sky-400'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
                                    }`}>
                                <span className="text-xl leading-none">{tab.icon}</span>
                                <span className={`text-[10px] font-semibold leading-tight ${activeTab === tab.id ? 'text-sky-600 dark:text-sky-400' : ''}`}>
                                    {tab.label}
                                </span>
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 w-8 h-0.5 rounded-full bg-sky-600 dark:bg-sky-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </nav>
            </div>

            <DrAIButton />
        </div>
    );
}
