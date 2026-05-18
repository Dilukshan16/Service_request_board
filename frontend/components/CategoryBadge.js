const CATEGORY_ICONS = {
  Plumbing: '🔧',
  Electrical: '⚡',
  Painting: '🎨',
  Joinery: '🪵',
  General: '🏠',
  Other: '📋',
};

const CATEGORY_COLORS = {
  Plumbing: 'bg-blue-50 text-blue-700',
  Electrical: 'bg-yellow-50 text-yellow-700',
  Painting: 'bg-purple-50 text-purple-700',
  Joinery: 'bg-orange-50 text-orange-700',
  General: 'bg-teal-50 text-teal-700',
  Other: 'bg-slate-100 text-slate-600',
};

export const CATEGORIES = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'General', 'Other'];

export default function CategoryBadge({ category }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${CATEGORY_COLORS[category] || CATEGORY_COLORS.Other}`}
    >
      <span>{CATEGORY_ICONS[category] || '📋'}</span>
      {category}
    </span>
  );
}
