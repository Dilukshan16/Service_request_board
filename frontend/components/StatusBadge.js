export const STATUS_STYLES = {
  Open: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  'In Progress': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  Closed: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
};

export const STATUS_DOT = {
  Open: 'bg-emerald-500',
  'In Progress': 'bg-amber-500',
  Closed: 'bg-slate-400',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[status] || STATUS_STYLES.Open}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] || 'bg-slate-400'}`} />
      {status}
    </span>
  );
}
