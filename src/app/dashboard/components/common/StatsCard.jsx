export default function StatsCard({ title, value, icon }) {
    return (
    <div className="bg-base-100 p-6 rounded-xl shadow-sm border border-base-200 text-base-content">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-base-content mb-1">{title}</p>
                    <p className="text-2xl font-bold text-base-content">{value}</p>
                </div>
                {icon && (
                    <span className="p-3 bg-base-200 rounded-lg text-2xl text-base-content">
                        {icon}
                    </span>
                )}
            </div>
        </div>
    );
}
