interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  bgColor: string;
  textColor: string;
}

export default function StatCard({ title, value, icon, bgColor, textColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
            <span className={`${textColor} text-sm font-medium`}>{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
