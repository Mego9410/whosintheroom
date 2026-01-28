'use client';

interface EnrichmentBadgeProps {
  industry?: string | null;
  companySize?: string | null;
  seniorityLevel?: string | null;
  showAll?: boolean;
  className?: string;
}

export function EnrichmentBadge({
  industry,
  companySize,
  seniorityLevel,
  showAll = false,
  className = '',
}: EnrichmentBadgeProps) {
  const badges = [];

  if (industry) {
    badges.push(
      <span
        key="industry"
        className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 border border-blue-200"
      >
        {industry}
      </span>
    );
  }

  if (companySize) {
    badges.push(
      <span
        key="companySize"
        className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 border border-purple-200"
      >
        {companySize} employees
      </span>
    );
  }

  if (seniorityLevel) {
    const seniorityColors: Record<string, string> = {
      'C-Level': 'bg-red-50 text-red-700 border-red-200',
      'VP': 'bg-orange-50 text-orange-700 border-orange-200',
      'Director': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Manager': 'bg-green-50 text-green-700 border-green-200',
      'Individual Contributor': 'bg-gray-50 text-gray-700 border-gray-200',
    };

    const colorClass = seniorityColors[seniorityLevel] || 'bg-gray-50 text-gray-700 border-gray-200';

    badges.push(
      <span
        key="seniority"
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${colorClass}`}
      >
        {seniorityLevel}
      </span>
    );
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {showAll ? badges : badges.slice(0, 2)}
    </div>
  );
}
