export default function StatsCard({ title, value, icon, trend }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p
                            className={`text-sm ${
                                trend.startsWith('+')
                                    ? 'text-green-600'
                                    : 'text-red-600'
                            }`}
                        >
                            {trend}
                        </p>
                    )}
                </div>
                {icon && (
                    <span className="p-3 bg-blue-100 rounded-lg text-2xl">
                        {icon}
                    </span>
                )}
            </div>
        </div>
    );
}
