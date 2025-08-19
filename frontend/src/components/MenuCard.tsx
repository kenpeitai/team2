import Link from 'next/link';

interface MenuCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function MenuCard({ href, title, description, icon, color }: MenuCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center mb-4">
          <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl`}>
            {icon}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-600 group-hover:text-blue-800 font-medium">
            詳細を見る
          </span>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
