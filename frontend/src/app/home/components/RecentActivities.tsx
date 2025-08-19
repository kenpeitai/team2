interface Activity {
  message: string;
  time: string;
  color: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export default function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">最近の活動</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
            <div className={`w-2 h-2 ${activity.color} rounded-full mr-3`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.message}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
